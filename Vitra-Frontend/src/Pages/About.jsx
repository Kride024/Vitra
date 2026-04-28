import React, { useRef } from 'react';
import { 
  Target, 
  Eye, 
  Users, 
  ArrowRight, 
  Linkedin, 
  Twitter, 
  Instagram 
} from 'lucide-react'; // Added missing social icons
import VideoDoctor from '../assets/VideoDoctor.mp4';

const AboutPage = () => {
  const visionMissionRef = useRef(null);

  const handleScrollToVisionMission = () => {
    visionMissionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="about-page min-h-screen bg-[#020617] text-white">
      {/* 1. STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;800;900&display=swap');
        
        .about-page { font-family: 'Urbanist', sans-serif; overflow-x: hidden; }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite; animation-delay: 2s; }

        .text-glow { text-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }

      `}</style>

      {/* 3. HERO SECTION */}
      <div className="pt-24 pb-16 px-6 md:px-12 lg:px-24 relative">
        <section className="relative rounded-[5rem] overflow-hidden min-h-[550px] border border-white/10 bg-[#050a18] flex items-center shadow-2xl">
          <div className="absolute inset-0 z-0 flex justify-end">
            <div className="w-full lg:w-3/4 h-full relative">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80"  
                className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] hover:scale-110" 
                alt="Advanced Healthcare Lab"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050a18] via-[#050a18]/70 to-transparent"></div>
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
            </div>
          </div>

          <div className="relative z-10 py-20 px-10 md:px-24 w-full lg:w-1/2">
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              About <span className="text-blue-500 text-glow">Us</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-lg">
              We are a dedicated team committed to revolutionizing healthcare by providing 
              innovative solutions and resources to improve patient care and wellness. 
            </p>
            <button
              onClick={handleScrollToVisionMission}
              className="group bg-[#2563eb] hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              Know about Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>
      </div>

      <div className="px-6 md:px-12 lg:px-24">
        {/* 4. VISION & MISSION CARDS */}
        <div ref={visionMissionRef} className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-12 rounded-[3.5rem] hover:border-blue-500/30 transition-all">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              To create a world where healthcare is accessible, efficient, and effective for everyone.
            </p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-12 rounded-[3.5rem] hover:border-emerald-500/30 transition-all">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              To develop comprehensive healthcare solutions that empower patients and professionals.
            </p>
          </div>
        </div>

        {/* 5. FEEDBACK SECTION */}
        <section className="bg-slate-900/20 border border-white/5 rounded-[4rem] p-12 md:p-20 mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <h2 className="text-5xl font-black">Expert Feedback</h2>
              <div className="h-2 w-24 bg-blue-500 rounded-full"></div>
              <p className="text-xl text-slate-400 leading-relaxed">
                "We are honored to share valuable feedback from the (CMO) Chief Medical Officer of MMMUT, Gorakhpur, highlighting the critical role our platform plays in improving healthcare access for underserved communities. This message reflects our commitment to making a difference."
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Users className="text-white w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-xl">Dr. AK Pandey</p>
                  <p className="text-blue-400">Chief Medical Officer</p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-black rounded-[2rem] overflow-hidden border border-white/10 aspect-video shadow-2xl">
                <video className="w-full h-full object-cover" controls>
                  <source src={VideoDoctor} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 6. EXTRA BACKGROUND GLOWS (Inside parent div) */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>

      {/* 7. FOOTER (Inside parent div) */}
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

export default AboutPage;