import React from 'react';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .contact-page { 
          font-family: 'Urbanist', sans-serif; 
          background-color: #f8fafc; 
          color: #1e293b; 
          overflow-x: hidden; 
        }
        
        /* HERO SECTION */
        .hero { 
          background: linear-gradient(135deg, #0f172a 0%, #1e3c72 100%); 
          padding: 80px 8% 140px; 
          color: #fff; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
        }
        .hero-text { max-width: 600px; }
        .hero-text h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 15px; }
        .hero-text p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; }

        /* IMAGE ON RIGHT - Will hide on small screens */
        .hero-icon-wrap { 
          background: rgba(255, 255, 255, 0.05); 
          padding: 30px; 
          border-radius: 50%; 
          border: 1px solid rgba(255, 255, 255, 0.1); 
        }

        /* MAIN CONTAINER */
        .main-container { max-width: 1100px; margin: -80px auto 60px; padding: 0 20px; position: relative; z-index: 10; }
        .contact-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; }
        
        .form-card { 
          background: #fff; 
          padding: clamp(20px, 5%, 40px); 
          border-radius: 24px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.05); 
          border: 1px solid rgba(0,0,0,0.05); 
        }
        .form-card h2 { font-size: 1.8rem; margin-bottom: 25px; color: #0f172a; font-weight: 800; }
        
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 0.9rem; font-weight: 700; margin-bottom: 8px; color: #64748b; }
        input, textarea { 
          width: 100%; 
          padding: 14px; 
          background: #f1f5f9; 
          border: 1px solid transparent; 
          border-radius: 12px; 
          font-size: 1rem; 
          transition: 0.3s; 
        }
        input:focus, textarea:focus { background: #fff; border-color: #3b82f6; outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }

        .submit-btn { 
          width: 100%; 
          background: #3b82f6; 
          color: #fff; 
          padding: 16px; 
          border: none; 
          border-radius: 12px; 
          font-weight: 700; 
          font-size: 1rem; 
          cursor: pointer; 
          transition: 0.3s; 
        }
        .submit-btn:hover { background: #0f172a; transform: translateY(-2px); }

        /* CONTACT DETAILS PANEL - Will hide on tablets/mobiles as requested */
        .info-panel { display: flex; flex-direction: column; gap: 20px; }
        .info-card { 
          background: #fff; 
          padding: 25px; 
          border-radius: 20px; 
          box-shadow: 0 10px 15px rgba(0,0,0,0.03); 
          border: 1px solid rgba(0,0,0,0.05); 
        }
        .info-card h4 { color: #3b82f6; margin-bottom: 5px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .info-card p { font-weight: 600; color: #0f172a; font-size: 1.1rem; }

        /* FOOTER */
        footer { background: #0f172a; color: #94a3b8; padding: 60px 6% 30px; margin-top: 40px; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; max-width: 1200px; margin: auto; }
        .footer-col h4 { color: #fff; margin-bottom: 20px; font-size: 1rem; text-transform: uppercase; }
        .footer-bottom { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #1e293b; font-size: 0.8rem; }

        /* RESPONSIVE ADJUSTMENTS */
        @media (max-width: 992px) {
          /* Hide the hero icon/image and the contact details panel on right for tablets and below */
          .hero-icon-wrap, .info-panel { display: none; }
          
          /* Make the form full width */
          .contact-grid { grid-template-columns: 1fr; }
          .hero { padding: 60px 5% 100px; text-align: center; justify-content: center; }
          .hero-text { max-width: 100%; }
        }

        @media (max-width: 768px) {
          .input-row { grid-template-columns: 1fr; }
          .main-container { margin-top: -40px; }
        }
      `}</style>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-text">
          <h1>Get in Touch</h1>
          <p>Have questions about our wellness programs or medical resources? Our specialized team is here to support your journey.</p>
        </div>
        <div className="hero-icon-wrap">
           <img src="https://www.maxhealthcare.in/img/icon-envelop-white.svg" alt="Mail" style={{width:'80px'}} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-container">
        <div className="contact-grid">
          {/* FORM CARD */}
          <div className="form-card">
            <h2>Send a Message</h2>
            <form action="https://formspree.io/f/xlddernn" method="POST">
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="username" placeholder="Your name" required />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="email@example.com" required />
                </div>
              </div>
              <div className="input-group">
                <label>Subject</label>
                <input type="text" name="subject" placeholder="How can we help?" required />
              </div>
              <div className="input-group">
                <label>Your Message</label>
                <textarea name="message" rows="6" placeholder="Describe your inquiry..."></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>

          {/* SIDE INFO PANEL - Hides on Tablet/Mobile */}
          <div className="info-panel">
            <div className="info-card">
              <h4>Email Us</h4>
              <p>support@vritra.health</p>
            </div>
            <div className="info-card">
              <h4>Call Support</h4>
              <p>+91 78924 74925</p>
            </div>
            <div className="info-card">
              <h4>Main Office</h4>
              <p>New Delhi, India</p>
            </div>
            <img 
              src="https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg" 
              alt="Support" 
              style={{width:'100%', borderRadius:'20px', marginTop:'10px'}} 
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Solutions</h4>
            <p>Corporate Wellness</p><p>Personal Health</p><p>Diagnostic Tools</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <p>Home</p><p>About Vritra</p><p>Resource Center</p>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <p>LinkedIn</p><p>Twitter</p><p>Instagram</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 Vritra Healthcare Systems • Smart Tools for Global Wellness
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;