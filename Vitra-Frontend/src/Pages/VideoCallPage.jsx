import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../auth/AuthContext.jsx";
import { getChatThread } from "../api/chat.api";
import { extendCallDuration } from "../api/appointment.api";

function VideoCallPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [thread, setThread] = useState(null);
  const [connected, setConnected] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [videoJoined, setVideoJoined] = useState(false);
  const [videoParticipants, setVideoParticipants] = useState(0);
  const [startingVideo, setStartingVideo] = useState(false);
  const [extendingDuration, setExtendingDuration] = useState(false);
  const [callWindow, setCallWindow] = useState(null);
  const [nowMs, setNowMs] = useState(Date.now());

  const isDoctor = user?.role === "DOCTOR";

  const formatRemaining = (msRemaining) => {
    const totalSeconds = Math.max(0, Math.floor(Number(msRemaining || 0) / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const createCallWindow = (appointment, existingWindow = null) => {
    const startAt = existingWindow?.startAt || appointment?.scheduledAt || null;
    if (!startAt) {
      return null;
    }

    const startMs = new Date(startAt).getTime();
    if (Number.isNaN(startMs)) {
      return null;
    }

    const totalDurationMinutes =
      Number(appointment?.callDurationMinutes || 60) + Number(appointment?.callExtendedMinutes || 0);
    const endMs = startMs + totalDurationMinutes * 60 * 1000;
    const active = nowMs >= startMs && nowMs <= endMs;

    return {
      startAt: new Date(startMs).toISOString(),
      endAt: new Date(endMs).toISOString(),
      totalDurationMinutes,
      isActive: active,
      msRemaining: Math.max(0, endMs - nowMs),
      minutesRemaining: Math.max(0, Math.ceil((endMs - nowMs) / 60000)),
    };
  };

  const roomTitle = useMemo(() => {
    if (!thread) {
      return `Appointment Video #${appointmentId}`;
    }

    return user?.role === "DOCTOR"
      ? `Video Call with ${thread.patientName}`
      : `Video Call with Dr. ${thread.doctorName}`;
  }, [appointmentId, thread, user?.role]);

  const closeVideoSession = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setVideoJoined(false);
    setVideoParticipants(0);
  };

  const leaveVideoCall = () => {
    socketRef.current?.emit("video:leave", { appointmentId });
    closeVideoSession();
  };

  const ensurePeerConnection = () => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("video:ice-candidate", {
          appointmentId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => peer.addTrack(track, localStreamRef.current));
    }

    peerConnectionRef.current = peer;
    return peer;
  };

  const startVideoCall = async () => {
    try {
      setStartingVideo(true);
      setVideoError("");

      if (!callWindow?.isActive) {
        throw new Error("Video call can only be joined during the scheduled appointment window");
      }

      if (!localStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }

      ensurePeerConnection();
      socketRef.current?.emit("video:join", { appointmentId });
    } catch (videoStartError) {
      setVideoError(videoStartError.message || "Unable to start video call");
    } finally {
      setStartingVideo(false);
    }
  };

  const onExtendDuration = async () => {
    try {
      setExtendingDuration(true);
      const response = await extendCallDuration(appointmentId, 15);
      const updatedAppointment = response.data?.appointment;
      if (updatedAppointment) {
        setThread(updatedAppointment);
        setCallWindow(createCallWindow(updatedAppointment));
      }
    } catch (extendError) {
      setVideoError(extendError.response?.data?.message || "Failed to extend call duration");
    } finally {
      setExtendingDuration(false);
    }
  };

  useEffect(() => {
    const loadThread = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getChatThread(appointmentId);
        const appointmentData = response.data?.appointment || null;
        setThread(appointmentData);
        setCallWindow(response.data?.callWindow || createCallWindow(appointmentData));
      } catch (loadError) {
        const serverMessage = loadError.response?.data?.message;
        const statusCode = loadError.response?.status;
        setError(serverMessage || `Unable to load video room${statusCode ? ` (HTTP ${statusCode})` : ""}`);
      } finally {
        setLoading(false);
      }
    };

    loadThread();
  }, [appointmentId]);

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (thread) {
      setCallWindow((prev) => createCallWindow(thread, prev));
    }
  }, [nowMs, thread]);

  useEffect(() => {
    if (!callWindow?.isActive && videoJoined) {
      setVideoError("Appointment video window has ended.");
      leaveVideoCall();
    }
  }, [callWindow?.isActive, videoJoined]);

  useEffect(() => {
    if (!token) return undefined;

    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const socketBase = apiBase.replace(/\/api\/?$/, "");
    const socket = io(socketBase, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("connect_error", (socketError) => {
      setVideoError(socketError?.message || "Socket connection error");
    });

    socket.on("video:joined", (payload) => {
      setVideoJoined(true);
      setVideoParticipants(payload?.participantCount || 1);
      if (payload?.callWindow) {
        setCallWindow(payload.callWindow);
      }
    });

    socket.on("video:peer-ready", async () => {
      try {
        const peer = ensurePeerConnection();
        if (peer.signalingState !== "stable") return;
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("video:offer", { appointmentId, offer });
      } catch (offerError) {
        setVideoError(offerError.message || "Failed to create video offer");
      }
    });

    socket.on("video:offer", async ({ offer }) => {
      try {
        if (!localStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }

        const peer = ensurePeerConnection();
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("video:answer", { appointmentId, answer });
      } catch (answerError) {
        setVideoError(answerError.message || "Failed to accept video offer");
      }
    });

    socket.on("video:answer", async ({ answer }) => {
      try {
        if (!peerConnectionRef.current) return;
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (remoteError) {
        setVideoError(remoteError.message || "Failed to set remote answer");
      }
    });

    socket.on("video:ice-candidate", async ({ candidate }) => {
      try {
        if (!peerConnectionRef.current || !candidate) return;
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (iceError) {
        setVideoError(iceError.message || "Failed to add ICE candidate");
      }
    });

    socket.on("video:peer-left", () => {
      setVideoParticipants(1);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socket.on("video:error", (payload) => {
      setVideoError(payload?.message || "Video call error");
    });

    return () => {
      closeVideoSession();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [appointmentId, token]);

  return (
    <div style={{ maxWidth: "920px", margin: "24px auto", padding: "20px" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ padding: "10px 14px", border: "none", borderRadius: "8px", background: "#6b7280", color: "#fff", cursor: "pointer" }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate(`/chat/${appointmentId}`)}
          style={{ padding: "10px 14px", border: "none", borderRadius: "8px", background: "#059669", color: "#fff", cursor: "pointer" }}
        >
          Open Chat Page
        </button>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
        <div style={{ padding: "18px 20px", background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#fff" }}>
          <h1 style={{ margin: 0 }}>{roomTitle}</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.85 }}>
            {thread ? `Appointment #${thread.id} • ${thread.status}` : "Loading appointment details..."}
          </p>
          <p style={{ margin: "6px 0 0 0", fontSize: "14px", opacity: 0.8 }}>
            {connected ? "Connected" : "Disconnected"}
          </p>
        </div>

        <div style={{ padding: "18px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
          {loading ? (
            <p style={{ margin: 0 }}>Loading video room...</p>
          ) : error ? (
            <div style={{ color: "#b91c1c" }}>
              <p style={{ margin: 0, fontWeight: 700 }}>Unable to load video room</p>
              <p style={{ margin: "6px 0 0 0" }}>{error}</p>
            </div>
          ) : (
            <>
              <p style={{ margin: "0 0 6px 0" }}><strong>Doctor:</strong> {thread?.doctorName}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Patient:</strong> {thread?.patientName}</p>
              <p style={{ margin: "0 0 6px 0" }}>
                <strong>Scheduled:</strong> {thread?.scheduledAt ? new Date(thread.scheduledAt).toLocaleString() : "Not set"}
              </p>
              <p style={{ margin: "0 0 6px 0" }}>
                <strong>Video Window:</strong> {callWindow?.startAt ? `${new Date(callWindow.startAt).toLocaleTimeString()} - ${new Date(callWindow.endAt).toLocaleTimeString()}` : "Unavailable"}
              </p>
              <p style={{ margin: "0 0 6px 0", color: callWindow?.isActive ? "#059669" : "#b45309" }}>
                <strong>Video Status:</strong> {callWindow?.isActive ? `Active (${callWindow.minutesRemaining} min left)` : "Not active yet / expired"}
              </p>
              <p style={{ margin: "0 0 6px 0", color: callWindow?.isActive ? "#0f766e" : "#475569", fontWeight: 600 }}>
                <strong>Countdown:</strong> {formatRemaining(callWindow?.msRemaining)}
              </p>
              <p style={{ margin: 0 }}><strong>Issue:</strong> {thread?.healthDescription}</p>
            </>
          )}
        </div>

        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", background: "#f8fafc" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            <button
              type="button"
              onClick={startVideoCall}
              disabled={!callWindow?.isActive || startingVideo || !connected}
              style={{
                padding: "10px 14px",
                border: "none",
                borderRadius: "8px",
                background: !callWindow?.isActive || !connected ? "#94a3b8" : "#2563eb",
                color: "#fff",
                cursor: !callWindow?.isActive || !connected ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {startingVideo ? "Joining..." : "Join Video Call"}
            </button>

            <button
              type="button"
              onClick={leaveVideoCall}
              disabled={!videoJoined}
              style={{
                padding: "10px 14px",
                border: "none",
                borderRadius: "8px",
                background: videoJoined ? "#dc2626" : "#94a3b8",
                color: "#fff",
                cursor: videoJoined ? "pointer" : "not-allowed",
                fontWeight: 600,
              }}
            >
              Leave Video
            </button>

            {isDoctor && (
              <button
                type="button"
                onClick={onExtendDuration}
                disabled={extendingDuration}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#059669",
                  color: "#fff",
                  cursor: extendingDuration ? "not-allowed" : "pointer",
                  opacity: extendingDuration ? 0.7 : 1,
                  fontWeight: 600,
                }}
              >
                {extendingDuration ? "Extending..." : "Extend +15 min"}
              </button>
            )}
          </div>

          <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#475569" }}>
            Participants in video room: {videoParticipants}
          </p>

          {videoError ? <p style={{ margin: "0 0 10px 0", color: "#b91c1c" }}>{videoError}</p> : null}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
            <div>
              <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>You</p>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", background: "#0f172a", borderRadius: "10px", minHeight: "180px" }}
              />
            </div>
            <div>
              <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>Other Participant</p>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: "100%", background: "#0f172a", borderRadius: "10px", minHeight: "180px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCallPage;
