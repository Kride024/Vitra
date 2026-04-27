import React from "react";

const resourceData = [
  { id: 1, title: "BMI Calculator", link: "https://jayawd456.github.io/BMI-Calculator/", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80", label: "CHECK BMI" },
  { id: 2, title: "Calorie Counter", link: "https://jayawd456.github.io/Calorie-Calculator/", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80", label: "CHECK CALORIE" },
  { id: 3, title: "Hydration Tracker", link: "https://jayawd456.github.io/Water-Intake/", img: "https://picsum.photos/id/249/500/350", label: "CHECK WATER" },
  { id: 4, title: "BP Calculator", link: "https://jayawd456.github.io/BP-Calculator/", img: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?auto=format&fit=crop&w=500&q=80", label: "CHECK BP" },
  { id: 5, title: "Cycle Predictor", link: "https://jayawd456.github.io/Mensuration-Cycle-Predictor/", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80", label: "CHECK CYCLE" },
  { id: 6, title: "Heart Rate", link: "https://jayawd456.github.io/Heart-Rate-Checker/", img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=500&q=80", label: "CHECK PULSE" },
  { id: 7, title: "Infant Scheduler", link: "https://jayawd456.github.io/Immunization-Scheduler/", img: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=500&q=80", label: "CHECK VACCINES" },
  { id: 8, title: "Nutrition Label", link: "https://jayawd456.github.io/Nutrition-Checker/", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80", label: "CHECK NUTRITION" },
];

export default function Resources() {
  return (
    <div className="resources-page">
      <style>{`
        .resources-page { font-family: 'Urbanist', sans-serif; background: #f8fafc; color: #1e293b; margin: 0; overflow-x: hidden; }

        /* HERO RESPONSIVENESS */
        .hero { 
          background: #0f172a;
          padding: 60px 5% 120px; 
          color: #fff; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 40px;
          min-height: 400px;
        }
        .hero-text { flex: 1; max-width: 600px; text-align: left; }
        .hero-text h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 15px; line-height: 1.1; }
        .hero-text h2 { color: #2dd4bf; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .hero-text p { color: #cbd5e1; font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.5; }

        .hero-right-img { 
          flex: 1; 
          max-width: 450px; 
          width: 100%;
          border-radius: 20px; 
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
          animation: float 4s ease-in-out infinite;
          object-fit: cover;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        /* GRID & CONTAINER */
        .container { 
          max-width: 1200px; 
          margin: -60px auto 60px; 
          padding: 0 5%; 
        }
        .grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 25px; 
        }
        
        .card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); transition: 0.4s ease; border: 1px solid rgba(0,0,0,0.05); height: 100%; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
        .card-img-wrap { height: 180px; width: 100%; overflow: hidden; background: #f1f5f9; }
        .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

        .card-body { padding: 20px; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .card-body h3 { font-size: 1.15rem; margin-bottom: 15px; font-weight: 700; color: #0f172a; }
        
        .action-btn { display: block; width: 100%; padding: 12px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 0.85rem; transition: 0.3s; }

        /* FOOTER RESPONSIVENESS */
        footer { background: #0f172a; color: #94a3b8; padding: 60px 5% 30px; }
        .footer-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 40px; 
          max-width: 1200px; 
          margin: auto; 
        }
        .footer-col h4 { color: #fff; margin-bottom: 15px; font-size: 1.1rem; }
        .footer-bottom { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; font-size: 0.8rem; }

        /* MEDIA QUERIES FOR SMALLER SCREENS */
        @media (max-width: 1024px) {
          .hero { gap: 20px; padding-bottom: 100px; }
          .hero-right-img { max-width: 380px; }
        }

        @media (max-width: 768px) {
          .hero { flex-direction: column; text-align: center; padding: 40px 5% 80px; }
          .hero-text { text-align: center; }
          .hero-text h1 { margin-bottom: 20px; }
          .hero-right-img { max-width: 320px; margin: 0 auto; }
          .container { margin-top: -40px; }
          .grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        }

        @media (max-width: 480px) {
          .hero-text h1 { font-size: 1.8rem; }
          .container { margin-top: -30px; }
          .grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; text-align: center; }
        }
      `}</style>

      <header className="hero">
        <div className="hero-text">
          <h2>Clinical Resources</h2>
          <h1>Smart Diagnostic Tools</h1>
          <p>Explore a library of precision calculators to monitor your BMI, nutritional intake, and hydration levels instantly.</p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" 
          alt="Healthcare Illustration" 
          className="hero-right-img" 
        />
      </header>

      <main className="container">
        <div className="grid">
          {resourceData.map((item) => (
            <div key={item.id} className="card">
              <div className="card-img-wrap">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="card-body">
                <h3>{item.title}</h3>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="action-btn">
                  {item.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Organization</h4>
            <p>Our Vision</p><p>Equity in Health</p>
          </div>
          <div className="footer-col">
            <h4>Patient Tools</h4>
            <p>Resource Index</p><p>Data Security</p>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <p>📍 New Delhi, India</p>
            <p>📧 support@vritra.health</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 Vritra Healthcare Systems • Bridging Wellness Gaps
        </div>
      </footer>
    </div>
  );
}