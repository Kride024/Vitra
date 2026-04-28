import React, { useState, useEffect, useRef } from "react";

const EmergencyMode = () => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [symptom, setSymptom] = useState("");
  const [emergencyLevel, setEmergencyLevel] = useState("");
  const watchRef = useRef(null);

  // ------------------ AI SYMPTOM DETECTION ------------------

  const analyzeSymptom = (text) => {
    const value = text.toLowerCase();

    if (value.includes("chest pain") || value.includes("heart")) {
      return "HIGH RISK: Possible Heart Emergency 🚨";
    }
    if (value.includes("breathing") || value.includes("asthma")) {
      return "HIGH RISK: Breathing Emergency 🚨";
    }
    if (value.includes("unconscious") || value.includes("fainted")) {
      return "CRITICAL: Immediate Help Required 🚑";
    }
    if (value.includes("fever") || value.includes("vomiting")) {
      return "Moderate Condition ⚠ Monitor Closely";
    }

    return "Condition unclear. Seek medical advice.";
  };

  const handleSymptomCheck = () => {
    const result = analyzeSymptom(symptom);
    setEmergencyLevel(result);
  };

  // ------------------ REAL TIME LOCATION ------------------

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setTracking(true);

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = () => {
    if (watchRef.current) {
      navigator.geolocation.clearWatch(watchRef.current);
      setTracking(false);
    }
  };

  // ------------------ SOS SOUND ------------------

  const playSOS = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );
    audio.loop = true;
    audio.play();
  };

  // ------------------ CALL AMBULANCE ------------------

  const callAmbulance = () => {
    window.location.href = "tel:108";
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>🚨 Advanced Emergency Mode</h2>

      {/* SOS BUTTON */}
      <button style={styles.sosButton} onClick={playSOS}>
        🔊 Activate SOS Alarm
      </button>

      {/* LOCATION TRACKING */}
      <div style={styles.card}>
        <h3>📡 Live Location Tracking</h3>

        {!tracking ? (
          <button style={styles.actionBtn} onClick={startTracking}>
            Start Tracking
          </button>
        ) : (
          <button style={styles.stopBtn} onClick={stopTracking}>
            Stop Tracking
          </button>
        )}

        {location && (
          <div style={{ marginTop: "20px" }}>
            <iframe
              title="map"
              width="100%"
              height="300"
              style={{ borderRadius: "15px" }}
              src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            ></iframe>
          </div>
        )}
      </div>

      {/* AI SYMPTOM CHECKER */}
      <div style={styles.card}>
        <h3>🧠 AI Symptom Emergency Check</h3>

        <input
          type="text"
          placeholder="Describe symptoms (e.g. chest pain, breathing issue)"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          style={styles.input}
        />

        <button style={styles.actionBtn} onClick={handleSymptomCheck}>
          Analyze Condition
        </button>

        {emergencyLevel && (
          <div style={styles.resultBox}>{emergencyLevel}</div>
        )}
      </div>

      {/* CALL BUTTON */}
      <button style={styles.callButton} onClick={callAmbulance}>
        📞 Call Ambulance (108)
      </button>
    </div>
  );
};

// ------------------ THEME STYLES ------------------

const styles = {
  section: {
    backgroundColor: "#0b1a2f",
    minHeight: "100vh",
    padding: "60px 10%",
    color: "white",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#4da6ff",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#132b4f",
    padding: "25px",
    borderRadius: "18px",
    marginTop: "30px",
    boxShadow: "0 0 20px rgba(77,166,255,0.3)",
  },

  sosButton: {
    backgroundColor: "#ff3b3b",
    padding: "16px",
    width: "100%",
    fontWeight: "bold",
    borderRadius: "12px",
    border: "none",
    color: "white",
    fontSize: "16px",
    boxShadow: "0 0 25px rgba(255,0,0,0.7)",
    cursor: "pointer",
  },

  actionBtn: {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #4da6ff",
    backgroundColor: "transparent",
    color: "#4da6ff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  stopBtn: {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid red",
    backgroundColor: "transparent",
    color: "red",
    fontWeight: "bold",
    cursor: "pointer",
  },

  callButton: {
    marginTop: "40px",
    width: "100%",
    padding: "18px",
    backgroundColor: "#ff3b3b",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#0d2445",
    color: "white",
  },

  resultBox: {
    marginTop: "15px",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#0d2445",
    color: "#4da6ff",
    fontWeight: "bold",
  },
};

export default EmergencyMode;