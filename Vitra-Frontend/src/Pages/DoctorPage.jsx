import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getMyProfile } from "../api/auth.api";
import { getDoctorAppointments, approveAppointment, rejectAppointment } from "../api/appointment.api";

function DoctorPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalLoading, setApprovalLoading] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectForm, setShowRejectForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileResponse, appointmentResponse] = await Promise.all([
        getMyProfile(),
        getDoctorAppointments(),
      ]);

      setProfile(profileResponse.data?.user || user);
      setAppointmentHistory(appointmentResponse.data?.appointments || []);
      setMedicalHistory(profileResponse.data?.medicalHistory || []);
    } catch (error) {
      console.error("Failed to fetch doctor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId) => {
    try {
      setApprovalLoading((prev) => ({ ...prev, [appointmentId]: true }));
      const response = await approveAppointment(appointmentId);
      alert("Appointment approved successfully!");
      
      // Update the appointment in the list
      setAppointmentHistory((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "APPROVED" } : apt
        )
      );
    } catch (error) {
      console.error("Failed to approve appointment:", error);
      alert("Failed to approve appointment: " + (error.response?.data?.message || error.message));
    } finally {
      setApprovalLoading((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const handleRejectToggle = (appointmentId) => {
    setShowRejectForm((prev) => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));
  };

  const handleReject = async (appointmentId) => {
    try {
      setApprovalLoading((prev) => ({ ...prev, [appointmentId]: true }));
      const reason = rejectReason[appointmentId] || "";
      const response = await rejectAppointment(appointmentId, reason);
      alert("Appointment rejected successfully!");
      
      // Update the appointment in the list
      setAppointmentHistory((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "REJECTED", reportNotes: reason } : apt
        )
      );
      
      // Reset form
      setShowRejectForm((prev) => ({ ...prev, [appointmentId]: false }));
      setRejectReason((prev) => ({ ...prev, [appointmentId]: "" }));
    } catch (error) {
      console.error("Failed to reject appointment:", error);
      alert("Failed to reject appointment: " + (error.response?.data?.message || error.message));
    } finally {
      setApprovalLoading((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return { color: "#059669", background: "#d1fae5" };
      case "REJECTED":
        return { color: "#dc2626", background: "#fee2e2" };
      case "PENDING":
        return { color: "#d97706", background: "#fef3c7" };
      default:
        return { color: "#6b7280", background: "#f3f4f6" };
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openChat = (appointmentId) => {
    navigate(`/chat/${appointmentId}`);
  };

  const openVideoCall = (appointmentId) => {
    navigate(`/video-call/${appointmentId}`);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      <h1>Doctor Personal Page</h1>
      <p>Welcome, Dr. {profile?.firstName} {profile?.lastName}</p>

      {loading && <p>Loading profile...</p>}

      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
        <h3>Profile Details</h3>
        <p><strong>Name:</strong> {profile?.firstName} {profile?.lastName}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Phone:</strong> {profile?.phone || "Not provided"}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
        <h3>Appointment Requests</h3>
        {appointmentHistory.length ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {appointmentHistory.map((item) => (
              <div key={item.id} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px", background: "#f9fafb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                  <div>
                    <p><strong>Patient:</strong> {item.patientName}</p>
                    <p><strong>Email:</strong> {item.patientEmail}</p>
                    <p><strong>Phone:</strong> {item.patientPhone}</p>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      ...getStatusColor(item.status),
                    }}
                  >
                    {item.status}
                  </div>
                </div>

                <p><strong>Description:</strong> {item.healthDescription}</p>
                <p>
                  <strong>Scheduled Time:</strong>{" "}
                  {item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : "Not set"}
                </p>
                <p>
                  <strong>Call Duration:</strong>{" "}
                  {(item.callDurationMinutes || 60) + (item.callExtendedMinutes || 0)} min
                </p>
                
                {item.reportNotes ? <p><strong>Report Notes:</strong> {item.reportNotes}</p> : null}
                
                {item.imageAttachment ? (
                  <p>
                    <a href={item.imageAttachment} target="_blank" rel="noreferrer">📷 View Uploaded Image</a>
                  </p>
                ) : null}
                {item.reportAttachment ? (
                  <p>
                    <a href={item.reportAttachment} target="_blank" rel="noreferrer">📄 View Uploaded Report</a>
                  </p>
                ) : null}

                {/* Action Buttons */}
                {item.status === "PENDING" && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "15px", borderTop: "1px solid #e5e7eb", paddingTop: "15px" }}>
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={approvalLoading[item.id]}
                      style={{
                        padding: "8px 16px",
                        background: "#059669",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: approvalLoading[item.id] ? "not-allowed" : "pointer",
                        opacity: approvalLoading[item.id] ? 0.6 : 1,
                        fontWeight: "600",
                      }}
                    >
                      {approvalLoading[item.id] ? "Approving..." : "✓ Approve"}
                    </button>

                    {!showRejectForm[item.id] ? (
                      <button
                        onClick={() => handleRejectToggle(item.id)}
                        style={{
                          padding: "8px 16px",
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        ✗ Reject
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                        <input
                          type="text"
                          placeholder="Reason for rejection..."
                          value={rejectReason[item.id] || ""}
                          onChange={(e) =>
                            setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            flex: 1,
                          }}
                        />
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={approvalLoading[item.id]}
                          style={{
                            padding: "8px 16px",
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: approvalLoading[item.id] ? "not-allowed" : "pointer",
                            opacity: approvalLoading[item.id] ? 0.6 : 1,
                            fontWeight: "600",
                          }}
                        >
                          {approvalLoading[item.id] ? "Rejecting..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => handleRejectToggle(item.id)}
                          style={{
                            padding: "8px 16px",
                            background: "#6b7280",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {item.status === "APPROVED" && (
                  <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e5e7eb", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => openChat(item.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#059669",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      💬 Open Chat
                    </button>
                    <button
                      onClick={() => openVideoCall(item.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      📹 Open Video Call
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No appointment booked for you yet.</p>
        )}
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
        <h3>Medical History</h3>
        {medicalHistory.length ? (
          <ul>
            {medicalHistory.map((item, index) => (
              <li key={item.id || index}>{item.summary || "Medical history record"}</li>
            ))}
          </ul>
        ) : (
          <p>No medical history updates yet.</p>
        )}
      </section>

      <button
        type="button"
        onClick={() => navigate("/home")}
        style={{ marginTop: "16px", marginRight: "12px", padding: "10px 14px", border: "none", borderRadius: "6px", cursor: "pointer", background: "#2563eb", color: "#fff" }}
      >
        Back To Home
      </button>

      <button
        type="button"
        onClick={handleLogout}
        style={{ marginTop: "16px", padding: "10px 14px", border: "none", borderRadius: "6px", cursor: "pointer", background: "#dc2626", color: "#fff" }}
      >
        Logout
      </button>
    </div>
  );
}

export default DoctorPage;
