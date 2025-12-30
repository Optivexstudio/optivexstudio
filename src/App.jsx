import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import './style.css';
import { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from './firebase'; 
import { signInWithPopup } from 'firebase/auth';
import emailjs from '@emailjs/browser'; // დამატებულია EmailJS

function App() {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('home'); 
  
  // --- Auth States ---
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // --- OTP States ---
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");

  // --- ჩატის მართვის ფუნქცია (Tawk.to) ---
  const manageChat = (currentView) => {
    if (window.Tawk_API && window.Tawk_API.onLoad) {
      if (currentView === 'auth' || currentView === 'verify') {
        window.Tawk_API.hideWidget();
      } else {
        window.Tawk_API.showWidget();
      }
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setView('home'); 
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  // --- OTP გაგზავნის ლოგიკა ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      // ვაგენერებთ 6-ციფრიან კოდს
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);

      // ვაგზავნით EmailJS-ით (ჩაანაცვლე შენი ID-ებით)
      const templateParams = {
        to_email: email,
        otp_code: otpCode
      };

      emailjs.send(
        'K1LysGke1TQn2vFYq', // EmailJS Service ID
        'YOUR_TEMPLATE_ID', // EmailJS Template ID
        templateParams, 
        'YOUR_PUBLIC_KEY' // EmailJS Public Key
      )
      .then(() => {
        alert("Verification code sent to " + email);
        setView('verify'); // გადავდივართ კოდის შეყვანის გვერდზე
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        alert("Failed to send code. Please try again.");
      });

    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setView('home');
      } catch (err) {
        alert("Invalid credentials.");
      }
    }
  };

  // --- OTP შემოწმება და რეგისტრაცია ---
  const verifyAndRegister = async () => {
    if (userOtp === generatedOtp) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account verified and created successfully!");
        setView('home');
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("Invalid 6-digit code! Please check your email.");
    }
  };

  const openSupportChat = (e) => {
    e.preventDefault();
    if (window.Tawk_API && typeof window.Tawk_API.showWidget === 'function') {
      window.Tawk_API.showWidget(); 
      window.Tawk_API.maximize();   
    } else {
      alert("The chat is loading, please try again in 2 seconds.");
    }
  };

  useEffect(() => {
    if (!document.getElementById('tawk-script')) {
      var s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];
      s1.id = 'tawk-script';
      s1.async = true;
      s1.src = 'https://embed.tawk.to/69349bbb07cc551984368bf6/1jbqo0lgf'; 
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function() {
      window.Tawk_API.hideWidget();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.revealer').forEach(el => observer.observe(el));
  }, []);

  // --- 1. VERIFICATION VIEW (NEW) ---
  if (view === 'verify') {
    return (
      <div className="site-wrapper">
        <Navbar onLoginClick={() => setView('auth')} onHomeClick={() => setView('home')} />
        <section className="auth-page-section container" style={{paddingTop: '150px', minHeight: '80vh'}}>
          <div className="cta-wrap">
            <h2 className="section-title">Verify Your Email</h2>
            <p className="cta-message">Enter the 6-digit code sent to <strong>{email}</strong></p>
            <div className="form-container">
                <input 
                  type="text" 
                  className="otp-input"
                  maxLength="6"
                  placeholder="0 0 0 0 0 0"
                  onChange={(e) => setUserOtp(e.target.value)}
                />
                <button className="btn primary full-width-btn" onClick={verifyAndRegister}>
                  Verify & Register
                </button>
                <p className="auth-toggle-text" onClick={() => setView('auth')}>
                  Wrong email? <span>Go back</span>
                </p>
            </div>
          </div>
        </section>
        <footer>© 2025 Optivex Studio</footer>
      </div>
    );
  }

  // --- 2. AUTH VIEW (LOGIN/REGISTER) ---
  if (view === 'auth') {
    return (
      <div className="site-wrapper">
        <Navbar onLoginClick={() => setView('auth')} onHomeClick={() => setView('home')} />
        <section className="auth-page-section container" style={{paddingTop: '150px', minHeight: '80vh'}}>
          <div className="cta-wrap">
            <h2 className="section-title">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="cta-message">
              {isRegistering ? "Join our elite network of innovators." : "Join our elite network of digital innovators."}
            </p>
            <div className="form-container">
                <button className="btn primary google-btn" style={{width: '100%', marginBottom: '20px'}} onClick={handleGoogleLogin}>
                    Continue with Google
                </button>
                <div className="separator"><span>OR</span></div>
                
                <form onSubmit={handleEmailAuth} style={{width: '100%'}}>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    className="auth-input"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    className="auth-input"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  
                  {isRegistering && (
                    <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      required
                      className="auth-input"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  )}

                  <button type="submit" className="btn primary full-width-btn" style={{width: '100%'}}>
                    {isRegistering ? "Send Verification Code" : "Login"}
                  </button>
                </form>

                <p className="auth-toggle-text" onClick={() => setIsRegistering(!isRegistering)}>
                  {isRegistering ? "Already have an account? Login" : "Don't have an account? Register here"}
                </p>

                <button className="btn ghost" style={{marginTop: '20px', width: '100%'}} onClick={() => setView('home')}>← Back to Home</button>
            </div>
          </div>
        </section>
        <footer>© 2025 Optivex Studio</footer>
      </div>
    );
  }

  // --- 3. HOME VIEW ---
  return (
    <div className="site-wrapper">
      <Navbar onLoginClick={() => setView('auth')} onHomeClick={() => setView('home')} />

      {/* --- HERO --- */}
      <header className="hero" id="hero">
        <div className="inner container" role="banner">
          <h1>Tiflisbyte Studio</h1>
          <p><strong>We build custom, fast and maintainable websites using HTML • CSS • JavaScript.</strong><br className="hide-sm" /> Focused on performance, accessibility and real business results.</p>
          <div className="cta">
            <a className="btn primary" href="#projects">See Projects</a>
            <a className="btn" href="#contact">Request Quote</a>
          </div>
        </div>
      </header>

      {/* --- ABOUT US --- */}
      <section id="about" className="about-us container revealer">
        <div className="about-content">
          <h2 className="section-title">Tiflisbyte Studio — Engineering Digital Excellence</h2>
          <div className="about-grid">
            <div className="about-text">
              <p className="lead-text">
                Tiflisbyte Studio is a Georgia-based collective of seasoned software engineers and designers dedicated to transforming ambitious visions into high-performance digital realities. We operate with a global perspective, delivering bespoke web and mobile applications that set new industry standards for speed, security, and scalability.
              </p>
              <p>
                We move beyond traditional development by embracing a modern, API-first approach. Our expertise lies in leveraging technologies like Headless CMS architecture, Serverless computing (AWS/Firebase), and cutting-edge JavaScript frameworks (React/Vue). This strategy ensures every product we build is future-proof, easily maintainable, and highly optimized for performance metrics.
              </p>
              <p>
                Whether it's a complex enterprise platform or a high-traffic e-commerce solution, our focus remains on providing clear communication and transparent milestones. We don't just write code; we engineer solutions that generate tangible business value.
              </p>
            </div>
            <div className="tech-focus">
              <h3>🛠️ Our Core Engineering Pillars</h3>
              <ul>
                <li>Performance First: Commitment to sub-second load times and 90+ PageSpeed scores.</li>
                <li>Scalability & Security: Utilizing microservices and cloud infrastructure for robust growth.</li>
                <li>Transparent Process: Agile methodology with client involvement at every iteration.</li>
                <li>Maintenance-Ready Code: Delivering clean, semantic, and well-documented codebase.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className="service-focus-section">
        <div className="container">
          <h2 className="section-title">Our Core Service Offerings</h2>
          <p className="section-subtitle">We translate complex engineering challenges into market-ready digital products that perform.</p>
          <div className="focus-grid revealer">
            <div className="focus-card">
              <span className="focus-icon">💻</span>
              <h3>High-Performance Web Platforms</h3>
              <p>We build scalable, secure, and fast websites from scratch, focusing on SEO, accessibility (a11y), and Lighthouse scores (90+). Perfect for corporate sites, e-commerce, and SaaS platforms.</p>
              <ul>
                <li>React & Vue Frontends</li>
                <li>Headless CMS Architecture</li>
                <li>API Integration & Optimization</li>
              </ul>
            </div>
            <div className="focus-card">
              <span className="focus-icon">📱</span>
              <h3>Native Mobile App Development</h3>
              <p>Delivering exceptional UX and performance for both iOS and Android. Our native approach ensures maximum speed and reliability, integrating complex features like payments and location services.</p>
              <ul>
                <li>Swift (iOS) & Kotlin (Android)</li>
                <li>Cross-Platform (Flutter)</li>
                <li>App Store/Play Store Deployment</li>
              </ul>
            </div>
            <div className="focus-card">
              <span className="focus-icon">☁️</span>
              <h3>Cloud, Serverless, & Backend APIs</h3>
              <p>Robust and maintainable backend systems built for long-term growth. We use serverless technologies to reduce costs and increase scalability, ensuring your application can handle millions of users.</p>
              <ul>
                <li>Firebase / Google Cloud</li>
                <li>Custom NodeJS REST APIs</li>
                <li>Database Design & Security</li>
              </ul>
            </div>
          </div>

          <div className="service-card ai-automation-service revealer" style={{marginTop: '50px'}}>
            <div className="icon-container"><span className="service-icon">🤖</span></div>
            <h3 className="card-title">AI Automation & CI/CD Optimization</h3>
            <p className="card-description">
              We integrate cutting-edge AI and CI/CD pipelines directly into your existing development workflow. This service dramatically boosts project efficiency, guaranteeing faster time-to-market and predictable, high-quality releases.
            </p>
            <ul className="key-offerings">
              <li>Automated Code Review & Testing</li>
              <li>CI/CD Pipeline Setup (GitHub Actions, GitLab, etc.)</li>
              <li>Zero-Downtime Deployment Configuration</li>
              <li>AI-Driven Security Vulnerability Scanning</li>
              <li>Resource Allocation Optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- AI DEEP DIVE --- */}
      <section id="why-optivex" className="comparison-section">
        <div className="container">
          <hr className="section-divider" />
          <div className="ai-deep-dive revealer">
            <h2>🔬 Our Core Differentiator: AI Automation Explained</h2>
            <p className="subtitle">At Tiflisbyte Studio, AI isn't just a buzzword—it's the backbone of our operational efficiency. We integrate custom, intelligent automation tools into every phase of the development lifecycle.</p>
            <div className="ai-benefits-grid">
              <div className="ai-benefit-card">
                <h4>1. Automated Code Quality & Testing</h4>
                <p>AI tools automatically review code for bugs and security vulnerabilities, executing comprehensive tests faster and more accurately than human teams. This guarantees Zero-Defect Deployment.</p>
              </div>
              <div className="ai-benefit-card">
                <h4>2. Continuous Integration & Delivery (CI/CD)</h4>
                <p>We leverage automation for seamless deployment. From code writing to server launch, the entire process is handled by automated pipelines, eliminating manual errors.</p>
              </div>
              <div className="ai-benefit-card">
                <h4>3. Resource Optimization & Cost Control</h4>
                <p>By automating repetitive and time-consuming tasks (e.g., environment setup, documentation), we drastically reduce the required human hours. This efficiency is directly translated into lower costs.</p>
              </div>
            </div>
            <p className="cta-statement">In essence, our AI automation isn't just technology; it's a promise of faster delivery, higher quality, and predictable budgeting.</p>
          </div>
        </div>
      </section>

      {/* --- WORKFLOW --- */}
      <section id="workflow" className="revealer">
        <div className="container">
          <h2 className="section-title">How We Work</h2>
          <div className="workflow">
            <div className="workflow-step"><h4>1. Quick Discovery</h4><p>We collect goals and success metrics. 20-minute intake to assess scope and timeline.</p></div>
            <div className="workflow-step"><h4>2. Proposal & Milestones</h4><p>We deliver a clear scope with milestones and a fixed price. No surprises.</p></div>
            <div className="workflow-step"><h4>3. Build & Review</h4><p>Iterative delivery — review checkpoints, QA and accessibility checks.</p></div>
            <div className="workflow-step"><h4>4. Launch & Monitor</h4><p>Deployment, performance checks, and optional monitoring/maintenance.</p></div>
            <div className="workflow-step"><h4>5. Support</h4><p>Monthly maintenance and small updates — optional retainer plans available.</p></div>
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO --- */}
      <section id="projects" className="portfolio-showcase revealer">
        <div className="container">
          <header className="portfolio-header">
            <h1>Our Digital Assets</h1>
            <p>Explore how we combine AI automation with premium development to solve real business challenges.</p>
          </header>
          <div className="portfolio-filter">
            {['all', 'web', 'ai', 'software'].map(cat => (
              <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="portfolio-grid">
            <div className="project-card">
              <div className="project-image">
                <img src="/images/project1.jpg" alt="E-commerce Project" />
                <div className="project-overlay"><a href="#" className="case-study-link">View Case Study</a></div>
              </div>
              <div className="project-info">
                <span className="category-tag">Web Dev + AI</span>
                <h3>E-commerce Automation Hub</h3>
                <p>Reduced manual order processing time by 60% through custom AI pipelines.</p>
                <div className="tech-stack"><span>React</span> <span>Node.js</span> <span>Python AI</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PARTNERS --- */}
      <section id="partners" className="partners-section revealer">
        <div className="container">
          <h2 className="section-title">Our Trusted Partners</h2>
          <div className="partners-grid">
            <div className="partner-card">
              <div className="partner-logo-container"><span className="partner-name-text">MIKA Translations</span></div>
              <h3>MIKA Translations</h3>
              <p>Providing high-quality, certified localization and translation services, ensuring global reach for our web and mobile applications.</p>
              <a href="#" target="_blank" className="partner-link">Visit Website →</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE CONTRAST --- */}
      <section id="why-optivex-contrast" className="comparison-section revealer">
        <div className="container">
          <h2>The Tiflisbyte Studio Contrast: Efficiency Meets Innovation</h2>
          <p className="subtitle">Tired of slow delivery and unpredictable costs? See how our AI-driven automation delivers superior results.</p>
          <div className="contrast-grid">
            <div className="compare-card traditional-method">
              <h3 className="negative-h3">Other Agencies: Manual & Costly</h3>
              <ul className="comparison-list">
                <li>❌ Slow Time-to-Market: Reliance on manual processes leads to extended cycles.</li>
                <li>❌ Unpredictable Budgeting: High overhead costs due to extensive human hours.</li>
                <li>❌ Inconsistent Quality: Susceptibility to human error in coding and testing.</li>
                <li>❌ Scalability Roadblocks: Expanding requires costly, dedicated engineering time.</li>
              </ul>
            </div>
            <div className="compare-card optivex-innovation featured-card">
              <h3 className="positive-h3">Tiflisbyte Studio: AI-Driven & Optimized</h3>
              <ul className="comparison-list">
                <li>✅ Accelerated Delivery: 40% Faster Time-to-Market through automated pipelines.</li>
                <li>✅ Cost Optimization: AI processes reduce human dependency and overall costs.</li>
                <li>✅ Zero-Defect Reliability: Automated QA ensure consistent, high-quality output.</li>
                <li>✅ Effortless Scaling: Cloud-native architecture supports seamless scaling.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ & GUARANTEE --- */}
      <section id="faq" className="faq-section container revealer">
        <h2 className="section-title">Common Questions & Our Guarantee</h2>
        <div className="faq-content">
          <div className="faq-list">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-item">
              <h4>1. What is your primary tech stack?</h4>
              <p>We primarily use Vanilla JavaScript (ES6+), React, and modern CSS/HTML5 for frontend development. For mobile, we focus on Swift (iOS), Kotlin (Android), and Flutter (Dart). Our backend services often rely on Firebase, AWS, or custom NodeJS/Express APIs.</p>
            </div>
            <div className="faq-item">
              <h4>2. How do you handle project pricing?</h4>
              <p>We work almost exclusively with fixed-price contracts based on an agreed-upon scope of work and milestones. This eliminates surprise costs and guarantees transparency. We provide a detailed quote after the discovery call.</p>
            </div>
            <div className="faq-item">
              <h4>3. What about post-launch maintenance?</h4>
              <p>Every project includes a 30-day bug-fix warranty after launch. For ongoing support, security monitoring, and content updates, we offer flexible monthly retainer packages.</p>
            </div>
          </div>
          <div className="guarantee-block">
            <h3>Our Core Project Guarantee</h3>
            <div className="guarantee-card">
              <h4>Zero-Risk Development</h4>
              <p>We guarantee to deliver a 100% responsive, well-documented, and clean codebase tailored specifically to your business needs. If the delivered project does not match the final agreed-upon scope, we will revise it at no extra cost.</p>
              <ul>
                <li><span className="icon">✅</span> Fixed Pricing & Clear Milestones</li>
                <li><span className="icon">✅</span> Dedicated 24/7 Support Channel</li>
                <li><span className="icon">✅</span> Lifetime Bug Fix Warranty</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="collaboration-cta revealer">
        <div className="container">
          <h2 className="section-title">Ready to Launch Your Next Project?</h2>
          <div className="cta-wrap">
            <p className="cta-message">Whether you need immediate technical support or are ready to discuss your next breakthrough application, our team is here to help.</p>
           <div className="cta-actions">
  <a href="mailto:info@optivexstudio.com" className="btn primary large-btn">
    Start a Project Now
  </a>
  
  <button 
    className="btn ghost large-btn" 
    onClick={openSupportChat}
  >
    Connect with Support
  </button>
</div>
          </div>
          <p className="email-note">Or send us a direct inquiry: <a href="mailto:gulbianinodo2008@gmail.com">gulbianinodo2008@gmail.com</a></p>
        </div>
      </section>

      <footer>
        © <span id="year">2025</span> Tiflisbyte Studio — Crafted with clean code
      </footer>
    </div>
  );
}

export default App;