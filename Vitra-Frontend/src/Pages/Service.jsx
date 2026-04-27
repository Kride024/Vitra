import React from "react";

const services = [
  { title: "Body Checkup", desc: "Dynamic interactive health checkup experiences.", color: "#14b8a6", img: "https://hclhealthcare.in/wp-content/uploads/2023/11/primary-care.jpg" },
  { title: "Track Hospitals", desc: "Maps and hospital discovery using modern integrations.", color: "#6366f1", img: "https://hclhealthcare.in/wp-content/uploads/2023/11/preventive-care-1.jpg" },
  { title: "Report Analysis", desc: "Automated analysis for faster medical insights.", color: "#3b82f6", img: "https://hclhealthcare.in/wp-content/uploads/2023/11/specialty-care.jpg" },
  { title: "Emergency Care", desc: "Remote consultations & emergency support.", color: "#ef4444", img: "https://hclhealthcare.in/wp-content/uploads/2023/11/emergency-care.jpg" },
];

export default function Service() {
  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper{margin:0;font-family:"Urbanist",sans-serif;background:#f8fafc;color:#1e293b}
        .hero-section{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);height:160px}
        .wellness-container{max-width:1100px;margin:-90px auto 0;padding:0 20px;position:relative;z-index:10}
        .wellness-container img{width:100%;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.2);border:3px solid #fff}
        .content{padding:50px 4%;max-width:1400px;margin:auto;text-align:center}
        .content h1{font-size:2.4rem;color:#0f172a;margin-bottom:10px;font-weight:800}
        .content p{max-width:650px;margin:0 auto 40px;color:#64748b;line-height:1.6}
        
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px}
        .card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.04);transition:0.3s}
        .card:hover{transform:translateY(-8px);box-shadow:0 15px 30px rgba(0,0,0,0.1)}
        .card img{width:100%;height:160px;object-fit:cover}
        
        /* UPDATED FOOTER TEXT COLORS */
        .card-footer{padding:18px;text-align:left;min-height:100px}
        .card-footer h3{margin:0 0 6px 0;font-size:1.1rem;font-weight:800;color:#000000} /* Pure Black Title */
        .card-footer p{margin:0;font-size:0.88rem;font-weight:600;line-height:1.4;color:#1e293b} /* Slate Black Para */

        footer{background:#0f172a;color:#f1f5f9;padding:60px 6% 30px;margin-top:40px}
        .footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px;max-width:1100px;margin:auto}
        .footer-col h3{font-size:0.9rem;text-transform:uppercase;margin-bottom:15px;color:#2dd4bf}
        .footer-col p{font-size:0.85rem;margin:8px 0;color:#94a3b8}
        .footer-bottom{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #1e293b;font-size:0.8rem;color:#64748b}

        @media (max-width: 1024px) { .grid{grid-template-columns:repeat(2,1fr)} }
        @media (max-width: 600px) {
          .grid{grid-template-columns:1fr}
          .wellness-container{margin:-50px auto 0}
        }
      `}</style>

      <div className="hero-section" />
      <section className="wellness-container">
        <img src="https://hclhealthcare.in/wp-content/uploads/2023/11/wellness.jpeg" alt="Wellness" />
      </section>

      <main className="content">
        <h1>Health Care Redefined</h1>
        <p>Premium medical resources and innovative technology to bridge the gap in underserved communities.</p>

        <div className="grid">
          {services.map((item, i) => (
            <div className="card" key={i}>
              <img src={item.img} alt={item.title} />
              <div className="card-footer" style={{ backgroundColor: item.color }}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-col"><h3>Solutions</h3><p>Corporate Wellness</p><p>Personal Health</p></div>
          <div className="footer-col"><h3>Support</h3><p>Help Center</p><p>Medical FAQ</p></div>
          <div className="footer-col"><h3>Connect</h3><p>📞 +91 78924 74925</p><p>📧 contact@vritra.health</p></div>
        </div>
        <div className="footer-bottom">© 2026 Vritra Health Systems</div>
      </footer>
    </div>
  );
}