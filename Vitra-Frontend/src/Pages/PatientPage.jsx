import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getMyProfile } from "../api/auth.api";

function PatientPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data?.user || user);
        setAppointmentHistory(response.data?.appointmentHistory || []);
        setMedicalHistory(response.data?.medicalHistory || []);
      } catch (error) {
        console.error("Failed to fetch patient profile:", error);
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
        <h3>Appointment History</h3>
        {appointmentHistory.length ? (
          <ul>
            {appointmentHistory.map((item, index) => (
              <li key={item.id || index}>{item.summary || "Appointment record"}</li>
            ))}
          </ul>
        ) : (
          <p>No appointment history yet. This section will be connected next.</p>
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

export default PatientPage;
