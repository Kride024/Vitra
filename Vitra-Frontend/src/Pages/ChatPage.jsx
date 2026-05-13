import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../auth/AuthContext.jsx";
import { getChatThread } from "../api/chat.api";

function ChatPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinStatus, setJoinStatus] = useState("idle");
  const [thread, setThread] = useState(null);
  const [callWindow, setCallWindow] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

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
      return `Appointment Chat #${appointmentId}`;
    }

    return user?.role === "DOCTOR"
      ? `Chat with ${thread.patientName}`
      : `Chat with Dr. ${thread.doctorName}`;
  }, [appointmentId, thread, user?.role]);

  useEffect(() => {
    const loadThread = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getChatThread(appointmentId);
        const appointmentData = response.data?.appointment || null;
        setThread(appointmentData);
        setCallWindow(response.data?.callWindow || createCallWindow(appointmentData));
        setMessages(response.data?.messages || []);
      } catch (loadError) {
        const serverMessage = loadError.response?.data?.message;
        const statusCode = loadError.response?.status;
        setError(serverMessage || `Unable to load chat${statusCode ? ` (HTTP ${statusCode})` : ""}`);
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
      setJoinStatus("joining");
      socket.emit("chat:join", { appointmentId });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:message", (message) => {
      if (String(message.appointmentId) === String(appointmentId)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("chat:joined", () => {
      setJoinStatus("joined");
    });

    socket.on("chat:error", (payload) => {
      setJoinStatus("error");
      setError(payload?.message || "Chat error");
    });

    socket.on("connect_error", (socketError) => {
      setJoinStatus("error");
      setError(socketError?.message || "Socket connection error");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [appointmentId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();

    const trimmedDraft = draft.trim();
    if (!trimmedDraft || !socketRef.current) {
      return;
    }

    socketRef.current.emit("chat:message", {
      appointmentId,
      message: trimmedDraft,
    });
    setDraft("");
  };

  return (
    <div style={{ maxWidth: "920px", margin: "24px auto", padding: "20px" }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "16px", padding: "10px 14px", border: "none", borderRadius: "8px", background: "#6b7280", color: "#fff", cursor: "pointer" }}
      >
        Back
      </button>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
        <div style={{ padding: "18px 20px", background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#fff" }}>
          <h1 style={{ margin: 0 }}>{roomTitle}</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.85 }}>
            {thread ? `Appointment #${thread.id} • ${thread.status}` : "Loading appointment details..."}
          </p>
          <p style={{ margin: "6px 0 0 0", fontSize: "14px", opacity: 0.8 }}>
            {connected ? "Connected" : "Disconnected"}
          </p>
          <p style={{ margin: "6px 0 0 0", fontSize: "13px", opacity: 0.8 }}>
            {joinStatus === "joined" ? "Room joined" : joinStatus === "joining" ? "Joining room..." : joinStatus === "error" ? "Room join failed" : "Room not joined yet"}
          </p>
        </div>

        <div style={{ padding: "18px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
          {thread ? (
            <>
              <p style={{ margin: "0 0 6px 0" }}><strong>Doctor:</strong> {thread.doctorName}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Patient:</strong> {thread.patientName}</p>
              <p style={{ margin: "0 0 6px 0" }}>
                <strong>Scheduled:</strong> {thread.scheduledAt ? new Date(thread.scheduledAt).toLocaleString() : "Not set"}
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
              <button
                type="button"
                onClick={() => navigate(`/video-call/${appointmentId}`)}
                style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Open Video Call Page
              </button>
              <p style={{ margin: 0 }}><strong>Issue:</strong> {thread.healthDescription}</p>
            </>
          ) : (
            <p style={{ margin: 0 }}>Loading appointment info...</p>
          )}
        </div>

        <div style={{ height: "55vh", overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {loading ? (
            <p>Loading chat...</p>
          ) : error ? (
            <div style={{ color: "#b91c1c" }}>
              <p style={{ margin: 0, fontWeight: 700 }}>Unable to load chat room</p>
              <p style={{ margin: "6px 0 0 0" }}>{error}</p>
            </div>
          ) : messages.length ? (
            messages.map((message) => {
              const isMine = String(message.senderUserId) === String(user?.id);
              return (
                <div
                  key={message.id}
                  style={{
                    alignSelf: isMine ? "flex-end" : "flex-start",
                    maxWidth: "78%",
                    padding: "12px 14px",
                    borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: isMine ? "#2563eb" : "#e2e8f0",
                    color: isMine ? "#fff" : "#0f172a",
                    boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>
                    {message.senderName} • {message.senderRole}
                  </div>
                  <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.message}</div>
                  <div style={{ fontSize: "11px", opacity: 0.72, marginTop: "6px" }}>
                    {message.createdAt ? new Date(message.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#64748b" }}>No messages yet. Start the conversation safely inside this appointment room.</p>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} style={{ display: "flex", gap: "10px", padding: "16px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: "10px",
              background: draft.trim() ? "#059669" : "#94a3b8",
              color: "#fff",
              cursor: draft.trim() ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;