import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getMyProfile } from "../api/auth.api";
import { getPatientAppointments } from "../api/appointment.api";

function PatientPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileResponse, appointmentResponse] = await Promise.all([
        getMyProfile(),
        getPatientAppointments(),
      ]);

      setProfile(profileResponse.data?.user || user);
      setAppointmentHistory(appointmentResponse.data?.appointments || []);
      setMedicalHistory(profileResponse.data?.medicalHistory || []);
    } catch (error) {
      console.error("Failed to fetch patient profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return { color: "#059669", background: "#d1fae5", icon: "✓" };
      case "REJECTED":
        return { color: "#dc2626", background: "#fee2e2", icon: "✗" };
      case "PENDING":
        return { color: "#d97706", background: "#fef3c7", icon: "⏳" };
      default:
        return { color: "#6b7280", background: "#f3f4f6", icon: "○" };
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "APPROVED":
        return "Your appointment has been approved! The doctor will contact you soon.";
      case "REJECTED":
        return "Your appointment request was rejected. Please check the notes below.";
      case "PENDING":
        return "Your appointment is awaiting doctor's approval...";
      default:
        return "Appointment status unknown";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openChat = (appointmentId) => {
    navigate(`/chat/${appointmentId}`);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      <h1>Patient Personal Page</h1>
      <p>Hello, {profile?.firstName} {profile?.lastName}</p>

      {loading && <p>Loading profile...</p>}

      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
        <h3>Profile Details</h3>
        <p><strong>Name:</strong> {profile?.firstName} {profile?.lastName}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Phone:</strong> {profile?.phone || "Not provided"}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
        <h3>My Appointments</h3>
        {appointmentHistory.length ? (
          <div style={{ display: "grid", gap: "15px" }}>
            {appointmentHistory.map((item) => {
              const statusInfo = getStatusColor(item.status);
              return (
                <div key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "15px", background: "#f9fafb" }}>
                  {/* Status Header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    borderBottom: "2px solid #e5e7eb",
                  }}>
                    <div>
                      <h4 style={{ margin: "0 0 5px 0" }}>Dr. {item.doctorName}</h4>
                      <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        background: statusInfo.background,
                        color: statusInfo.color,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "24px", marginBottom: "5px" }}>{statusInfo.icon}</div>
                      <div>{item.status}</div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div style={{
                    background: statusInfo.background,
                    color: statusInfo.color,
                    padding: "12px",
                    borderRadius: "6px",
                    marginBottom: "15px",
                    fontSize: "14px",
                  }}>
                    {getStatusMessage(item.status)}
                  </div>

                  {/* Appointment Details */}
                  <div style={{ background: "#fff", padding: "12px", borderRadius: "6px", marginBottom: "15px", border: "1px solid #e5e7eb" }}>
                    <p><strong>Doctor Email:</strong> {item.doctorEmail}</p>
                    <p><strong>Doctor Phone:</strong> {item.doctorPhone}</p>
                    <p style={{ marginTop: "10px" }}>
                      <strong>Your Description:</strong>
                    </p>
                    <p style={{ background: "#f3f4f6", padding: "10px", borderRadius: "4px", marginTop: "5px" }}>
                      {item.healthDescription}
                    </p>
                  </div>

                  {/* Rejection Reason (if rejected) */}
                  {item.status === "REJECTED" && item.reportNotes && (
                    <div style={{
                      background: "#fee2e2",
                      border: "1px solid #fecaca",
                      color: "#991b1b",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "15px",
                    }}>
                      <strong>Reason for Rejection:</strong>
                      <p style={{ margin: "8px 0 0 0" }}>{item.reportNotes}</p>
                    </div>
                  )}

                  {/* Attachments */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {item.imageAttachment ? (
                      <a href={item.imageAttachment} target="_blank" rel="noreferrer"
                        style={{
                          display: "inline-block",
                          padding: "8px 12px",
                          background: "#2563eb",
                          color: "#fff",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      >
                        📷 View Medical Image
                      </a>
                    ) : null}
                    {item.reportAttachment ? (
                      <a href={item.reportAttachment} target="_blank" rel="noreferrer"
                        style={{
                          display: "inline-block",
                          padding: "8px 12px",
                          background: "#2563eb",
                          color: "#fff",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      >
                        📄 View Report
                      </a>
                    ) : null}
                  </div>

                  {/* Action Buttons */}
                  {item.status === "APPROVED" && (
                    <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #e5e7eb" }}>
                      <button
                        onClick={() => openChat(item.id)}
                        style={{
                          padding: "10px 16px",
                          background: "#059669",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          marginRight: "10px",
                        }}
                      >
                        💬 Start Chat
                      </button>
                      <button
                        onClick={() => alert("Video call will be added next.")}
                        style={{
                          padding: "10px 16px",
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        📹 Video Call Soon
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
            No appointments yet. <strong onClick={() => navigate("/appointment")} style={{ cursor: "pointer", color: "#2563eb" }}>Book your first appointment</strong>
          </p>
        )}
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
        <h3>Medical Records from Doctors</h3>
        {medicalHistory.length ? (
          <ul>
            {medicalHistory.map((item, index) => (
              <li key={item.id || index}>{item.summary || "Medical history record"}</li>
            ))}
          </ul>
        ) : (
          <p>No medical records shared yet.</p>
        )}
      </section>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={() => navigate("/appointment")}
          style={{ padding: "10px 16px", border: "none", borderRadius: "6px", cursor: "pointer", background: "#2563eb", color: "#fff", fontWeight: "600" }}
        >
          Book New Appointment
        </button>

        <button
          type="button"
          onClick={() => navigate("/home")}
          style={{ padding: "10px 16px", border: "none", borderRadius: "6px", cursor: "pointer", background: "#6b7280", color: "#fff", fontWeight: "600" }}
        >
          Back To Home
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{ padding: "10px 16px", border: "none", borderRadius: "6px", cursor: "pointer", background: "#dc2626", color: "#fff", fontWeight: "600" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default PatientPage;
