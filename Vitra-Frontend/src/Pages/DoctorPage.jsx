import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getMyProfile } from "../api/auth.api";
import { getDoctorAppointments } from "../api/appointment.api";

function DoctorPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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

    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
        <h3>Appointment History</h3>
        {appointmentHistory.length ? (
          <div style={{ display: "grid", gap: "10px" }}>
            {appointmentHistory.map((item) => (
              <div key={item.id} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "10px" }}>
                <p><strong>Patient:</strong> {item.patientName}</p>
                <p><strong>Email:</strong> {item.patientEmail}</p>
                <p><strong>Phone:</strong> {item.patientPhone}</p>
                <p><strong>Description:</strong> {item.healthDescription}</p>
                {item.reportNotes ? <p><strong>Report Notes:</strong> {item.reportNotes}</p> : null}
                <p><strong>Status:</strong> {item.status}</p>
                {item.imageAttachment ? (
                  <p>
                    <a href={item.imageAttachment} target="_blank" rel="noreferrer">View Uploaded Image</a>
                  </p>
                ) : null}
                {item.reportAttachment ? (
                  <p>
                    <a href={item.reportAttachment} target="_blank" rel="noreferrer">View Uploaded Report</a>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p>No appointment booked for you yet.</p>
        )}
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
        <h3>Medical History Sent By Doctor</h3>
        {medicalHistory.length ? (
          <ul>
            {medicalHistory.map((item, index) => (
              <li key={item.id || index}>{item.summary || "Medical history record"}</li>
            ))}
          </ul>
        ) : (
          <p>No medical history updates yet. This section will be built further.</p>
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
