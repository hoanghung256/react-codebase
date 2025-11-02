import { useParams } from "react-router-dom";
import { BE_BASE_URL } from "../../../../common/constants/env";
import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import useUser from "../../../../common/hooks/useUser";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

function InterviewRoomPage() {
    const user = useUser();
    const { roomId } = useParams();
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const pcRef = useRef(null);
    const connRef = useRef(null);
    const [myId, setMyId] = useState(null);
    const [peers, setPeers] = useState([]);

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
            .withUrl(`${BE_BASE_URL}/hubs/interviewroom?userId=${user?.id || 1}`)
            .withAutomaticReconnect()
            .build();

        conn.start()
            .then(() => {
                console.log("SignalR connected");
                conn.invoke("JoinRoom", roomId).then(() => {
                    console.log("Joined room", roomId);
                    // Use connectionId exposed by SignalR client after start
                    const id = conn.connectionId;
                    setMyId(id ?? null);
                    console.log("My connection id:", id);
                });
            })
            .catch(console.error);

        // Update myId if the connection re-establishes (connectionId can change)
        conn.onreconnected?.((newId) => {
            setMyId(newId ?? null);
            console.log("Reconnected with id:", newId);
        });


        conn.on("UserJoined", (connectionId) => {
            console.log("UserJoined", connectionId);
            setPeers((p) => {
                // Avoid adding myself; compare to current connectionId from the active connection
                const selfId = conn.connectionId;
                if (!p.includes(connectionId) && connectionId !== selfId) return [...p, connectionId];
                return p;
            });
        });

        conn.on("UserLeft", (connectionId) => {
            setPeers((p) => p.filter((x) => x !== connectionId));
        });

        // Receive Offer
        conn.on("ReceiveOffer", async (fromId, sdp) => {
            console.log("ReceiveOffer from", fromId);
            await createPeerConnection(fromId, false);
            await pcRef.current.setRemoteDescription({ type: "offer", sdp });
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            conn.invoke("SendAnswer", fromId, answer.sdp);
        });

        // Receive Answer
        conn.on("ReceiveAnswer", async (fromId, sdp) => {
            console.log("ReceiveAnswer from", fromId);
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription({ type: "answer", sdp });
        });

        // ICE candidate
        conn.on("ReceiveIceCandidate", async (fromId, candidate) => {
            try {
                if (pcRef.current && candidate) {
                    await pcRef.current.addIceCandidate(JSON.parse(candidate));
                }
            } catch (e) {
                console.error("addIceCandidate error", e);
            }
        });

        connRef.current = conn;

        return () => {
            if (connRef.current) {
                connRef.current.invoke("LeaveRoom", roomId).catch(() => {});
                connRef.current.stop();
            }
            if (pcRef.current) pcRef.current.close();
        };
    }, [roomId]);

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

        // send ICE candidates to remote
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

    // Khi click Call -> gọi target
    const call = async (targetId) => {
        await createPeerConnection(targetId, true);
    };

    const resizerStyle = {
        width: 6,
        cursor: "col-resize",
        background: "#e5e7eb",
        userSelect: "none",
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Header */}
            <header
                style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#fafafa",
                }}
            >
                <strong>Interview Room:</strong> {roomId}
            </header>

            {/* 3 vertical resizable sections */}
            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {/* Left section */}
                <div
                    style={{
                        width: `${cols[0]}%`,
                        minWidth: 0,
                        overflow: "auto",
                        padding: 12,
                        borderRight: "1px solid #eee",
                    }}
                >
                    White board for question paper(plain text)
                </div>

                {/* Resizer between left and middle */}
                <div style={resizerStyle} onMouseDown={(e) => startDrag(e, 0)} />

                {/* Middle section */}
                <div
                    style={{
                        width: `${cols[1]}%`,
                        minWidth: 0,
                        overflow: "auto",
                        padding: 12,
                        borderRight: "1px solid #eee",
                    }}
                >
                    Code editor with syntax highlight (read-only for interviewee)
                </div>

                {/* Resizer between middle and right */}
                <div style={resizerStyle} onMouseDown={(e) => startDrag(e, 1)} />

                {/* Right section (videos) */}
                <div
                    style={{
                        width: `${cols[2]}%`,
                        minWidth: 0,
                        overflow: "auto",
                        padding: 12,
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
                </div>
            </div>
        </div>
    );
}

export default InterviewRoomPage;
