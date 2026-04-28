import { Routes, Route, useLocation } from "react-router-dom";
import ContactPage from "./Pages/contact"; 
import Service from "./Pages/Service";    
import Navbar from "./Pages/Navbar";      
import Resources from "./Pages/Resources"; 
import AboutPage from "./Pages/About"; 
import Home from "./Pages/Home"; 
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";          
import DoctorPage from "./Pages/DoctorPage.jsx";
import PatientPage from "./Pages/PatientPage.jsx";
import PersonalRoute from "./Pages/PersonalRoute.jsx";
import AppointmentPage from "./Pages/AppointmentPage.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import EmergencyMode from "./Pages/EmergencyMode";
import MedicineComparator from "./Pages/MedicineComparator.jsx";
import "./App.css";

function App() {
  const location = useLocation();

  const hideGlobalNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="App">
      {/* Global common Navbar */}
      {!hideGlobalNavbar && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={["DOCTOR", "PATIENT"]} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/personal" element={<PersonalRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
            <Route path="/appointments" element={<AppointmentPage />} />
          </Route>

          <Route path="/emergency" element={<EmergencyMode />}/>

          <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
            <Route path="/doctor" element={<DoctorPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
            <Route path="/patient" element={<PatientPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["DOCTOR", "PATIENT"]} />}>
            <Route path="/services" element={<Service />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/medicine-comparator" element={<MedicineComparator />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;