import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { 
  ScanEye, 
  HeartPulse, 
  Map as MapIcon, 
  ArrowRight, 
  Video, 
  Plus, 
  Linkedin, 
  Twitter, 
  Instagram
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookAppointment = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "PATIENT") {
      alert("Only patient accounts can book appointments.");
      return;
    }

    navigate("/appointments");
  };

  return (
    <div className="home-page min-h-screen bg-[#020617] text-[#f8fafc] font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Add this style tag at the very top of your component or in your CSS file */}
<style>{`
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`}</style>

{/* 2. HERO SECTION - Navy Background & Moving Wide Banner */}
<header className="relative min-h-[90vh] flex items-center bg-[#0f172a] px-6 md:px-12 lg:px-24 overflow-hidden">
  
  {/* Background Decoration */}
  <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
    <div className="absolute inset-0" 
         style={{ 
           backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`, 
           backgroundSize: '40px 40px' 
         }}>
    </div>
  </div>

  <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
    
    {/* Left Side: Text Content */}
    <div className="w-full lg:w-2/5 text-center lg:text-left space-y-8">
      <div className="inline-block">
        <h2 className="text-blue-400 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs border-b border-blue-400/30 pb-2">
          Clinical Excellence
        </h2>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
        Your Wellness <br/>
        <span className="text-blue-400">Our Commitment</span>
      </h1>
      
      <p className="text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
        Empowering healthcare through precision diagnostics and AI-driven insights. Every life matters, and every moment counts.
      </p>
      
      <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
        <button className="bg-blue-500 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-400 transition-all hover:-translate-y-1 active:scale-95">
          Get Started
        </button>
        <button
          type="button"
          onClick={handleBookAppointment}
          className="border border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all"
        >
          Book Appointment
        </button>
      </div>
    </div>

    {/* Right Side: Moving Wide Banner */}
    <div className="w-full lg:w-3/5 relative flex justify-center lg:justify-end animate-float">
      
      {/* The Framed Banner Box with Shadow */}
      <div className="relative w-full max-w-3xl aspect-[16/9] bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden p-2">
        
        <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden">
          {/* Main Visual */}
          <img 
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200" 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Modern Medical Center"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/40 to-transparent"></div>

          {/* Banner Text */}
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 z-20">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">Vritra Smart Care</span>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Advanced <br/> 
              <span className="text-blue-100">Patient Monitoring</span>
            </h3>
            <div className="w-16 h-1.5 bg-blue-500 rounded-full mb-6"></div>
            <p className="text-xs md:text-sm font-medium text-slate-200 max-w-[280px] leading-relaxed">
              Integrated diagnostic tools for real-time health tracking and professional consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Glow behind the moving banner */}
      <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>
    </div>
  </div>
</header>

      {/* 3. AI FEATURES */}
      <section className="py-20 px-6 md:px-10">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Explore Our <span className="text-blue-400">AI Platform</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#1e293b]/70 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-blue-500 transition group cursor-default">
            <ScanEye className="text-blue-400 mb-4 w-12 h-12 group-hover:scale-110 transition" />
            <h3 className="text-2xl font-bold mb-4">AI Detects Diseases</h3>
            <p className="text-gray-400">Fast, accurate diagnoses by analyzing medical images and genetics to identify diseases early.</p>
          </div>
          <div className="bg-[#1e293b]/70 backdrop-blur-md border-b-4 border-teal-500 p-8 rounded-2xl">
            <HeartPulse className="text-teal-400 mb-4 w-12 h-12" />
            <h3 className="text-2xl font-bold mb-4">AI Health Guidance</h3>
            <p className="text-gray-400">AI-powered recommendations and symptom analysis using vast medical databases.</p>
          </div>
          <div className="bg-[#1e293b]/70 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-blue-500 transition group cursor-default">
            <MapIcon className="text-blue-400 mb-4 w-12 h-12 group-hover:scale-110 transition" />
            <h3 className="text-2xl font-bold mb-4">AI Resource Mapping</h3>
            <p className="text-gray-400">Optimizing resource allocation and decision-making for healthcare logistics.</p>
          </div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="py-10 px-6 md:px-10 grid md:grid-cols-2 gap-8">
        <div className="bg-blue-900/20 border border-blue-500/30 p-10 rounded-[2rem] text-center">
          <h2 className="text-5xl font-black text-blue-400 mb-2">9 Million Cases</h2>
          <p className="text-gray-300">Of tuberculosis reported annually.</p>
          <button className="mt-6 text-blue-400 font-bold flex items-center justify-center gap-2 mx-auto hover:underline">
            Know Why <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-teal-900/20 border border-teal-500/30 p-10 rounded-[2rem] text-center">
          <h2 className="text-5xl font-black text-teal-400 mb-2">500,000 Deaths</h2>
          <p className="text-gray-300">Occur annually from malaria worldwide.</p>
          <button className="mt-6 text-teal-400 font-bold flex items-center justify-center gap-2 mx-auto hover:underline">
            Know Why <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. TELEMEDICINE & VIDEO */}
      <section className="py-20 px-6 md:px-10 bg-slate-900/30">
        <h2 className="text-4xl font-bold mb-4 text-white">Integrated Telemedicine</h2>
        <p className="text-gray-400 max-w-2xl mb-12">24x7 Clinical assistance ideal for a diverse workforce and Hybrid Workplace scenarios.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-emerald-600/10 border border-emerald-500/50">
            <h3 className="text-xl font-bold mb-2 text-white">Primary Care Service</h3>
            <p className="text-sm text-gray-400">Consultations, E-Prescription, Ambulance support.</p>
          </div>
          <div className="p-8 rounded-2xl bg-purple-600/10 border border-purple-500/50">
            <h3 className="text-xl font-bold mb-2 text-white">Specialty Services</h3>
            <p className="text-sm text-gray-400">Gynecology, Pediatrics, Physiotherapy.</p>
          </div>
          <div className="p-8 rounded-2xl bg-blue-600/10 border border-blue-500/50">
            <h3 className="text-xl font-bold mb-2 text-white">Mental Health</h3>
            <p className="text-sm text-gray-400">One on One Counselling, Wellness Sessions.</p>
          </div>
        </div>
        
        {/* TELEMEDICINE SECTION - Professional Style */}
<div className="mt-20 flex flex-col md:flex-row items-center gap-16 bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden group">
  
  {/* Subtle Background Glow for the Section */}
  <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>

  <div className="flex-1 text-center md:text-left z-10">
    <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
      </span>
      <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Live Now</span>
    </div>
    
    <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
      Professional <br/>
      <span className="text-blue-400">Video Consultations</span>
    </h2>
    
    <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-md">
      Connect with world-class specialists instantly. Our encrypted HD video platform brings clinical expertise directly to your screen, anytime, anywhere.
    </p>

    <div className="flex flex-wrap justify-center md:justify-start gap-4">
      <button className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 text-white">
        <Video className="w-5 h-5" /> Start New Meeting
      </button>
      <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold transition-all text-white">
        View Schedule
      </button>
    </div>
  </div>

  {/* NEW RELEVANT IMAGE: Professional Telehealth UI Look */}
  <div className="flex-1 relative flex justify-center items-center z-10">
    <div className="relative group">
      {/* Decorative Frame */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
      
      <div className="relative bg-[#0f172a] p-3 rounded-[2rem] border border-white/10 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
          className="w-full max-w-md rounded-[1.5rem] object-cover h-[300px] md:h-[350px]" 
          alt="Online Doctor Consultation" 
        />
        
        {/* Floating UI Elements on top of image to make it look like a video call */}
        <div className="absolute top-8 right-8 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
          HD 1080P
        </div>
        <div className="absolute bottom-8 left-8 flex gap-2">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div className="w-24 h-8 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center px-3">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-blue-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      </section>

      {/* 6. FAQ */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            "How can I access affordable healthcare in underserved areas?",
            "Are there telehealth services available for remote areas?",
            "How does the AI disease detection work?"
          ].map((q, i) => (
            <div key={i} className="bg-[#1e293b]/70 p-6 rounded-xl flex justify-between items-center cursor-pointer hover:bg-white/5 transition border border-white/5 text-white">
              <span className="font-medium">{q}</span>
              <Plus className="text-blue-400 w-5 h-5" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#020617] pt-20 pb-10 px-6 md:px-10 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-6 italic text-white">Vritra</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Accelerating healthcare through AI and innovation.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-blue-400 uppercase tracking-widest text-xs">Solutions</h4>
            <ul className="space-y-4 text-gray-400 text-sm list-none p-0">
              <li>Corporate Wellness</li>
              <li>Personal Health</li>
              <li>Diagnostic Tools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-blue-400 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm list-none p-0">
              <li>Home</li>
              <li>About Vritra</li>
              <li>Resource Center</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-blue-400 uppercase tracking-widest text-xs">Follow Us</h4>
            <div className="flex gap-4">
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
            </div>
          </div>
        </div>
        <div className="text-center text-gray-600 text-xs border-t border-white/5 pt-8">
          &copy; {new Date().getFullYear()} Vritra Healthcare. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;