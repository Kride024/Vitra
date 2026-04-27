import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api.js";

const SPECIALTY_OPTIONS = [
  "Cardiologist",
  "Neurologist",
  "Pediatrics",
  "Orthopedic",
  "Dermatologist",
  "General Physician",
];

const AVAILABILITY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const navigator = useNavigate();

  const toggleAvailabilityDay = (day) => {
    setAvailabilityDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        firstName,
        lastName,
        phone,
        email,
        password,
        role,
        specialty: role === "DOCTOR" ? specialty : null,
        experienceYears: role === "DOCTOR" ? experienceYears : null,
        consultationFee: role === "DOCTOR" ? consultationFee : null,
        availability: role === "DOCTOR" ? availabilityDays.join(", ") : null,
        profileImageUrl: role === "DOCTOR" ? profileImageUrl : null,
      });
      alert("Registration successful");
      navigator("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Register
        </h2>

        <form onSubmit={handleRegister}>
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>

          {role === "DOCTOR" && (
            <>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  background: "#fff",
                }}
              >
                <option value="">Select Specialty</option>
                {SPECIALTY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                placeholder="Experience (Years)"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Consultation Fee"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              <div
                style={{
                  width: "100%",
                  marginBottom: "15px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>
                  Availability (select days)
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: "8px",
                  }}
                >
                  {AVAILABILITY_OPTIONS.map((day) => (
                    <label key={day} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                      <input
                        type="checkbox"
                        checked={availabilityDays.includes(day)}
                        onChange={() => toggleAvailabilityDay(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
                {availabilityDays.length === 0 && (
                  <p style={{ color: "#b91c1c", fontSize: "12px", margin: "8px 0 0 0" }}>Select at least one day.</p>
                )}
              </div>

              <input
                type="url"
                placeholder="Profile Image URL (optional)"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </>
          )}

          <button
            type="submit"
            disabled={role === "DOCTOR" && availabilityDays.length === 0}
            style={{
              width: "100%",
              padding: "10px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: role === "DOCTOR" && availabilityDays.length === 0 ? "not-allowed" : "pointer",
              opacity: role === "DOCTOR" && availabilityDays.length === 0 ? 0.7 : 1,
              fontWeight: "bold",
            }}
          >
            Register
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
