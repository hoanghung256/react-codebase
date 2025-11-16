import { useParams, useNavigate } from "react-router-dom";
import { BE_BASE_URL } from "../../../../common/constants/env";
import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import useUser from "../../../../common/hooks/useUser";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/lua/lua";
import { Box, Select, MenuItem, Typography } from "@mui/material";
import QuestionPanel from "./QuestionPanel";
import VideoPanel from "./VideoPanel";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

const languages = {
    python: {
        mode: "python",
        example: 'print("Hello, World!")',
    },
    javascript: {
        mode: "javascript",
        example: 'console.log("Hello, World!");',
    },
    java: {
        mode: "text/x-java",
        example:
            'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n      System.out.println("Hello, World!");\n  }\n}',
    },
    csharp: {
        mode: "text/x-csharp",
        example:
            'using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text.RegularExpressions;\n\nnamespace HelloWorld\n{\n\tpublic class Program\n\t{\n\t\tpublic static void Main(string[] args)\n\t\t{\n\t\t\tConsole.WriteLine("Hello, World!");\n\t\t}\n\t}\n}',
    },
    c: {
        mode: "text/x-csrc",
        example: '#include <stdio.h>\nint main()\n{\n    printf("Hello, World!");\n}',
    },
    "c++": {
        mode: "text/x-c++src",
        example:
            '#include <iostream>\nusing namespace std;\n\nint main() \n{\n    cout << "Hello, World!";\n    return 0;\n}',
    },
    lua: {
        mode: "lua",
        example: 'print ("Hello, World!")',
    },
};

function InterviewRoomPage() {
    const user = useUser();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const pcRef = useRef(null);
    const connRef = useRef(null);
    const editorRef = useRef(null);
    const [myId, setMyId] = useState(null);
    const [peers, setPeers] = useState([]);
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(languages.javascript.example);

    // Media and signaling related state/refs (missing earlier)
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isRemoteAudioOn, setIsRemoteAudioOn] = useState(false);
    const localStreamRef = useRef(null);
    const remotePeerIdRef = useRef(null);
    const iceCandidatesQueue = useRef([]);

    // --- Resizable layout state ---
    const containerRef = useRef(null);
    const [cols, setCols] = useState([25, 35, 40]); // left, middle, right in %
    const [dragging, setDragging] = useState(null); // { index, startX, startCols, containerWidth }

    const startDrag = (e, index) => {
        e.preventDefault();
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setDragging({
            index,
            startX: e.clientX,
            startCols: [...cols],
            containerWidth: rect.width,
        });
    };

    useEffect(() => {
        if (!dragging) return;

        const MIN_COL = 10; // percent
        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        const onMove = (e) => {
            const dx = e.clientX - dragging.startX;
            const deltaPct = (dx / dragging.containerWidth) * 100;

            if (dragging.index === 0) {
                // between left and middle
                const [l0, m0, r0] = dragging.startCols;
                const minDelta = -(l0 - MIN_COL);
                const maxDelta = m0 - MIN_COL;
                const d = clamp(deltaPct, minDelta, maxDelta);
                const left = l0 + d;
                const middle = m0 - d;
                const right = r0; // unchanged
                setCols([left, middle, right]);
            } else if (dragging.index === 1) {
                // between middle and right
                const [l0, m0, r0] = dragging.startCols;
                const minDelta = -(m0 - MIN_COL);
                const maxDelta = r0 - MIN_COL;
                const d = clamp(deltaPct, minDelta, maxDelta);
                const middle = m0 + d;
                const right = r0 - d;
                const left = l0; // unchanged
                setCols([left, middle, right]);
            }
        };

        const onUp = () => setDragging(null);

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        return () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        };
    }, [dragging]);

    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(`${BE_BASE_URL}/hubs/interviewroom?userId=${user?.id || 1}&role=${user?.role}`)
            .withAutomaticReconnect()
            .build();

        connRef.current = conn;

        conn.start()
            .then(() => {
                console.log("SignalR connected");
                conn.invoke("JoinRoom", roomId).then(() => {
                    console.log("Joined room", roomId);
                    const id = conn.connectionId;
                    setMyId(id ?? null);
                    console.log("My connection id:", id);
                });
            })
            .catch(console.error);

        conn.onreconnected?.((newId) => {
            setMyId(newId ?? null);
            console.log("Reconnected with id:", newId);
        });

        conn.on("UserJoined", (connectionId) => {
            console.log("UserJoined", connectionId);
            setPeers((p) => {
                const selfId = conn.connectionId;
                if (!p.includes(connectionId) && connectionId !== selfId) return [...p, connectionId];
                return p;
            });
            // Initiate call as existing participant if we already have media
            if (!pcRef.current && (isCameraOn || isMicOn)) {
                remotePeerIdRef.current = connectionId;
                call(connectionId);
            }
        });

        conn.on("UserLeft", (connectionId) => {
            setPeers((p) => p.filter((x) => x !== connectionId));
        });

        // Receive list of existing peers when we join
        conn.on("ExistingPeers", (existing) => {
            console.log("ExistingPeers", existing);
            setPeers(existing.filter((id) => id !== conn.connectionId));
        });

        conn.on("ReceiveOffer", async (fromId, sdp) => {
            console.log("ReceiveOffer from", fromId);
            remotePeerIdRef.current = fromId;

            // Create PC if missing (answerer path)
            if (!pcRef.current) {
                await createPeerConnection(fromId, false);
            }

            // Set remote description
            await pcRef.current.setRemoteDescription({ type: "offer", sdp });

            // Acquire local media if user already toggled cam/mic but stream not initialized yet
            if ((isCameraOn || isMicOn) && !localStreamRef.current) {
                try {
                    const constraints = { video: isCameraOn, audio: isMicOn };
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    localStreamRef.current = stream;
                    localVideoRef.current.srcObject = stream;
                    stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));
                    console.log(
                        "Added local tracks during answer path:",
                        stream.getTracks().map((t) => t.kind),
                    );
                } catch (err) {
                    console.warn("Failed to get local media for answer path", err);
                }
            }

            // Ensure existing local tracks are attached (replace if needed)
            if (localStreamRef.current) {
                const tracks = localStreamRef.current.getTracks();
                const senders = pcRef.current.getSenders();
                tracks.forEach((track) => {
                    const senderSameKind = senders.find((s) => s.track?.kind === track.kind);
                    if (!senderSameKind) {
                        console.log("Attaching missing", track.kind, "track before answering");
                        pcRef.current.addTrack(track, localStreamRef.current);
                    }
                });
            }

            // Flush queued ICE candidates (if any)
            while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                try {
                    await pcRef.current.addIceCandidate(candidate);
                    console.log("Added queued ICE candidate");
                } catch (e) {
                    console.error("Error adding queued ICE candidate", e);
                }
            }

            // Create answer
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            conn.invoke("SendAnswer", fromId, answer.sdp);
            console.log(
                "Sent answer to",
                fromId,
                "with",
                localStreamRef.current?.getTracks().length || 0,
                "local tracks",
            );
        });

        conn.on("ReceiveAnswer", async (fromId, sdp) => {
            console.log("ReceiveAnswer from", fromId);
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription({ type: "answer", sdp });
            // Flush any queued ICE now that remote description is set
            while (iceCandidatesQueue.current.length > 0) {
                const cand = iceCandidatesQueue.current.shift();
                try {
                    await pcRef.current.addIceCandidate(cand);
                    console.log("Added queued ICE after answer");
                } catch (e) {
                    console.error("Error adding queued ICE after answer", e);
                }
            }
        });

        conn.on("ReceiveIceCandidate", async (fromId, candidate) => {
            try {
                if (pcRef.current && candidate) {
                    const ice = JSON.parse(candidate);
                    if (!pcRef.current.remoteDescription) {
                        // Queue until remote description is set
                        iceCandidatesQueue.current.push(ice);
                        console.log("Queued ICE candidate (no remoteDescription yet)");
                    } else {
                        await pcRef.current.addIceCandidate(ice);
                    }
                }
            } catch (e) {
                console.error("addIceCandidate error", e);
            }
        });

        conn.on("ReceiveCode", (newCode) => {
            if (editorRef.current && editorRef.current.getValue() !== newCode) {
                const cursor = editorRef.current.getCursor();
                editorRef.current.setValue(newCode);
                editorRef.current.setCursor(cursor);
            }
        });

        conn.on("ReceiveLanguage", (lang, initialCode) => {
            setLanguage(lang);
            if (editorRef.current) {
                editorRef.current.setValue(initialCode);
            }
        });

        return () => {
            if (connRef.current) {
                connRef.current.invoke("LeaveRoom", roomId).catch(() => {});
                connRef.current.stop();
            }
            if (pcRef.current) pcRef.current.close();
        };
    }, [roomId, user?.id, user?.role]);

    async function startLocalStream({ video = true, audio = true } = {}) {
        if (localStreamRef.current) return localStreamRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
        return stream;
    }

    async function toggleCamera() {
        try {
            if (isCameraOn) {
                // Turn off camera
                if (localStreamRef.current) {
                    const videoTrack = localStreamRef.current.getVideoTracks()[0];
                    if (videoTrack) {
                        videoTrack.stop();
                        localStreamRef.current.removeTrack(videoTrack);
                    }
                }

                // Remove from peer connection
                if (pcRef.current) {
                    const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
                    if (sender) {
                        pcRef.current.removeTrack(sender);
                    }
                }

                setIsCameraOn(false);
            } else {
                // Turn on camera
                // Acquire / add video track
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const videoTrack = videoStream.getVideoTracks()[0];
                if (!localStreamRef.current) localStreamRef.current = new MediaStream();
                localStreamRef.current.addTrack(videoTrack);
                localVideoRef.current.srcObject = localStreamRef.current;

                // Add to peer connection if exists and renegotiate
                if (pcRef.current && connRef.current) {
                    const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
                    if (sender) {
                        await sender.replaceTrack(videoTrack);
                    } else {
                        pcRef.current.addTrack(videoTrack, localStreamRef.current);
                    }

                    // Check signaling state before renegotiation
                    if (pcRef.current.signalingState === "stable") {
                        // Renegotiate: create new offer
                        const offer = await pcRef.current.createOffer();
                        await pcRef.current.setLocalDescription(offer);

                        // Send to the connected peer
                        const targetPeer = remotePeerIdRef.current || peers[0];
                        if (targetPeer) {
                            await connRef.current.invoke("SendOffer", targetPeer, offer.sdp);
                            console.log("Sent renegotiation offer to", targetPeer, "after camera toggle");
                        } else {
                            console.warn("No peer to send renegotiation offer");
                        }
                    } else {
                        console.warn("Cannot renegotiate, signaling state is:", pcRef.current.signalingState);
                    }
                } else if (!pcRef.current && connRef.current) {
                    // Not connected yet: if we already have peers, initiate the call
                    const targetPeer = peers[0];
                    if (targetPeer) {
                        remotePeerIdRef.current = targetPeer;
                        await call(targetPeer);
                        console.log("Initiated call to", targetPeer, "after camera turned on");
                    } else {
                        console.log("Camera on but no peer available to call yet");
                    }
                }

                setIsCameraOn(true);
            }
        } catch (err) {
            console.error("Error toggling camera:", err);
        }
    }

    async function toggleMic() {
        try {
            if (isMicOn) {
                // Turn off mic: stop and remove track
                if (localStreamRef.current) {
                    const audioTrack = localStreamRef.current.getAudioTracks()[0];
                    if (audioTrack) {
                        audioTrack.stop();
                        localStreamRef.current.removeTrack(audioTrack);
                    }
                }

                if (pcRef.current) {
                    const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "audio");
                    if (sender) {
                        pcRef.current.removeTrack(sender);
                    }
                }

                setIsMicOn(false);
            } else {
                // Turn on mic: get track, add, and renegotiate
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioTrack = audioStream.getAudioTracks()[0];
                if (!localStreamRef.current) localStreamRef.current = new MediaStream();
                if (audioTrack) {
                    localStreamRef.current.addTrack(audioTrack);
                    localVideoRef.current.srcObject = localStreamRef.current;

                    if (pcRef.current && connRef.current) {
                        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "audio");
                        if (sender) {
                            await sender.replaceTrack(audioTrack);
                        } else {
                            pcRef.current.addTrack(audioTrack, localStreamRef.current);
                        }

                        // Check signaling state before renegotiation
                        if (pcRef.current.signalingState === "stable") {
                            const offer = await pcRef.current.createOffer();
                            await pcRef.current.setLocalDescription(offer);
                            const targetPeer = remotePeerIdRef.current || peers[0];
                            if (targetPeer) {
                                await connRef.current.invoke("SendOffer", targetPeer, offer.sdp);
                                console.log("Sent renegotiation offer to", targetPeer, "after mic toggle");
                            }
                        } else {
                            console.warn("Cannot renegotiate, signaling state is:", pcRef.current.signalingState);
                        }
                    }
                }

                setIsMicOn(true);
            }
        } catch (err) {
            console.error("Error toggling mic:", err);
        }
    }

    function toggleRemoteAudio() {
        try {
            if (!remoteVideoRef.current) return;
            const next = !isRemoteAudioOn;
            remoteVideoRef.current.muted = !next;
            if (next) {
                // user gesture may be required; ensure play is called
                remoteVideoRef.current.play().catch((e) => console.warn("Remote audio play blocked:", e));
            }
            setIsRemoteAudioOn(next);
        } catch (e) {
            console.warn("toggleRemoteAudio error:", e);
        }
    }

    async function createPeerConnection(targetId, isOfferer) {
        if (pcRef.current) {
            console.warn("PeerConnection already exists (demo supports single peer).");
            return;
        }

        pcRef.current = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        pcRef.current.onicecandidate = (e) => {
            if (e.candidate) {
                connRef.current.invoke("SendIceCandidate", targetId, JSON.stringify(e.candidate));
            }
        };

        pcRef.current.ontrack = (e) => {
            console.log("✅ Received remote track:", e.track.kind, "enabled:", e.track.enabled);
            if (remoteVideoRef.current && e.streams[0]) {
                remoteVideoRef.current.srcObject = e.streams[0];
                console.log("Set remote video srcObject");
            }
        };

        pcRef.current.onnegotiationneeded = async () => {
            console.log("⚠️ Negotiation needed");
        };

        pcRef.current.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", pcRef.current.iceConnectionState);
        };

        pcRef.current.onconnectionstatechange = () => {
            console.log("Connection state:", pcRef.current.connectionState);
        };

        // Add existing local stream tracks if any
        if (localStreamRef.current) {
            const tracks = localStreamRef.current.getTracks();
            console.log(`Adding ${tracks.length} local tracks to peer connection`);
            tracks.forEach((track) => {
                console.log("  - Adding local track:", track.kind, "enabled:", track.enabled);
                pcRef.current.addTrack(track, localStreamRef.current);
            });
        } else {
            console.log("No local stream to add to peer connection");
        }

        if (isOfferer) {
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            connRef.current.invoke("SendOffer", targetId, offer.sdp);
        }
    }

    const call = async (targetId) => {
        await createPeerConnection(targetId, true);
    };

    const leaveRoom = () => {
        if (connRef.current) {
            connRef.current
                .invoke("LeaveRoom", roomId)
                .then(() => {
                    navigate("/interview");
                })
                .catch(console.error);
        }
    };

    const handleCodeChange = (editor, data, value) => {
        if (data.origin !== "setValue" && user?.role !== 1) {
            setCode(value);
            if (connRef.current) {
                connRef.current.invoke("SendCode", roomId, value);
            }
        }
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        const newLangConfig = languages[newLang];
        if (newLangConfig) {
            setLanguage(newLang);
            const newCode = newLangConfig.example;
            setCode(newCode);
            if (editorRef.current) {
                editorRef.current.setValue(newCode);
            }

            if (connRef.current) {
                connRef.current.invoke("SendLanguage", roomId, newLang, newCode);
            }
        }
    };

    const resizerStyle = {
        width: 6,
        cursor: "col-resize",
        background: "#e5e7eb",
        userSelect: "none",
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Header */}
            {/* <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Interview Room: <strong>{roomId}</strong>
                    </Typography>
                    
                </Toolbar>
            </AppBar> */}

            {/* Resizable 3-column layout */}
            <Box
                ref={containerRef}
                style={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        width: `${cols[0]}%`,
                        minWidth: 0,
                        overflow: "auto",
                        padding: 1.5,
                        borderRight: "1px solid #eee",
                    }}
                >
                    <QuestionPanel conn={connRef.current} roomId={roomId} />
                </Box>

                <div style={resizerStyle} onMouseDown={(e) => startDrag(e, 0)} />

                <Box
                    sx={{
                        width: `${cols[1]}%`,
                        minWidth: 0,
                        overflow: "auto",
                        padding: 1.5,
                        borderRight: "1px solid #eee",
                    }}
                >
                    {user?.role === 0 && (
                        <Select value={language} onChange={handleLanguageChange} sx={{ mb: 1, minWidth: 120 }}>
                            {Object.keys(languages).map((lang) => (
                                <MenuItem key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                    {user?.role === 1 && (
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Language: <strong>{language.charAt(0).toUpperCase() + language.slice(1)}</strong>
                        </Typography>
                        // <div>
                        //     <select value={language} style={{ marginLeft: 16 }} disabled>
                        //         <option>{language.charAt(0).toUpperCase() + language.slice(1)}</option>
                        //     </select>
                        //     <span style={{ marginLeft: 16, fontWeight: "bold" }}>
                        //     Language: {language.charAt(0).toUpperCase() + language.slice(1)}
                        // </span>
                        // </div>
                    )}
                    <Box sx={{ border: "1px solid black" }}>
                        <CodeMirror
                            value={code}
                            editorDidMount={(editor) => {
                                editorRef.current = editor;
                            }}
                            options={{
                                mode: languages[language].mode,
                                lineNumbers: true,
                                readOnly: user?.role === 1,
                            }}
                            onChange={handleCodeChange}
                        />
                    </Box>
                </Box>

                <div style={resizerStyle} onMouseDown={(e) => startDrag(e, 1)} />

                <Box
                    sx={{
                        width: `${cols[2]}%`,
                        minWidth: 0,
                        overflow: "auto",
                        padding: 1.5,
                    }}
                >
                    <VideoPanel
                        myId={myId}
                        peers={peers}
                        onCall={call}
                        localVideoRef={localVideoRef}
                        remoteVideoRef={remoteVideoRef}
                        isCameraOn={isCameraOn}
                        isMicOn={isMicOn}
                        onToggleCamera={toggleCamera}
                        onToggleMic={toggleMic}
                        onLeaveRoom={leaveRoom}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default InterviewRoomPage;
