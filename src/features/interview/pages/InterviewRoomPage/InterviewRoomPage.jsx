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

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

const languages = {
    python: {
        mode: "python",
        example: "print(\"Hello, World!\")",
    },
    javascript: {
        mode: "javascript",
        example: "console.log(\"Hello, World!\");",
    },
    java: {
        mode: "text/x-java",
        example: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n      System.out.println(\"Hello, World!\");\n  }\n}",
    },
    csharp: {
        mode: "text/x-csharp",
        example: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text.RegularExpressions;\n\nnamespace HelloWorld\n{\n\tpublic class Program\n\t{\n\t\tpublic static void Main(string[] args)\n\t\t{\n\t\t\tConsole.WriteLine(\"Hello, World!\");\n\t\t}\n\t}\n}",
    },
    c: {
        mode: "text/x-csrc",
        example: "#include <stdio.h>\nint main()\n{\n    printf(\"Hello, World!\");\n}",
    },
    "c++": {
        mode: "text/x-c++src",
        example: "#include <iostream>\nusing namespace std;\n\nint main() \n{\n    cout << \"Hello, World!\";\n    return 0;\n}",
    },
    lua: {
        mode: "lua",
        example: "print (\"Hello, World!\")",
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
        });

        conn.on("UserLeft", (connectionId) => {
            setPeers((p) => p.filter((x) => x !== connectionId));
        });

        conn.on("ReceiveOffer", async (fromId, sdp) => {
            console.log("ReceiveOffer from", fromId);
            await createPeerConnection(fromId, false);
            await pcRef.current.setRemoteDescription({ type: "offer", sdp });
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            conn.invoke("SendAnswer", fromId, answer.sdp);
        });

        conn.on("ReceiveAnswer", async (fromId, sdp) => {
            console.log("ReceiveAnswer from", fromId);
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription({ type: "answer", sdp });
        });

        conn.on("ReceiveIceCandidate", async (fromId, candidate) => {
            try {
                if (pcRef.current && candidate) {
                    await pcRef.current.addIceCandidate(JSON.parse(candidate));
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

    async function startLocalStream() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        return stream;
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
            remoteVideoRef.current.srcObject = e.streams[0];
        };

        const localStream = await startLocalStream();
        localStream.getTracks().forEach((t) => pcRef.current.addTrack(t, localStream));

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
            connRef.current.invoke("LeaveRoom", roomId).then(() => {
                navigate("/interview");
            }).catch(console.error);
        }
    };

    const handleCodeChange = (editor, data, value) => {
        if (data.origin !== 'setValue' && user?.role !== 1) {
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
        <Box style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <header
                style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#fafafa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <strong>Interview Room:</strong> {roomId}
                </div>
                <button onClick={leaveRoom}>Leave Room</button>
            </header>

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
                    White board for question paper(plain text)
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
                        <Select
                            value={language}
                            onChange={handleLanguageChange}
                            sx={{ mb: 1, minWidth: 120 }}
                        >
                            {Object.keys(languages).map(lang => (
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
                            editorDidMount={editor => {
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
                    <h3 style={{ marginTop: 0 }}>Info</h3>
                    <p>My id: {myId}</p>
                    <p>Peers: {peers.length}</p>

                    <h3 style={{ marginTop: 0 }}>Peers</h3>
                    <ul style={{ paddingLeft: 18 }}>
                        {peers.map((p) => (
                            <li key={p} style={{ marginBottom: 8 }}>
                                <code>{p}</code>
                                <button onClick={() => call(p)} style={{ marginLeft: 8 }}>
                                    Call
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h3 style={{ marginTop: 0 }}>Video</h3>
                    <div>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: "100%", borderRadius: 8, background: "#000" }}
                        />
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            style={{ width: "100%", borderRadius: 8, background: "#000" }}
                        />
                    </div>
                </Box>
            </Box>
        </Box>
    );
}

export default InterviewRoomPage;
