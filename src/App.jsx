import { useEffect, useRef } from 'react'
import './index.css'

// Screenshots from OMS project
const screenshots = {
  homepage: 'https://raw.githubusercontent.com/sing198/OMS/main/screenshots/homepage.png',
  cart: 'https://raw.githubusercontent.com/sing198/OMS/main/screenshots/cart.png',
  admin: 'https://raw.githubusercontent.com/sing198/OMS/main/screenshots/AdminProducts.png',
}

function App() {
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current.observe(el)
    })

    // Navbar scroll effect
    const handleScroll = () => {
      const nav = document.querySelector('.navbar')
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <>
      {/* ========== NAVBAR ========== */}
      <nav className="navbar">
        <div className="nav-logo">TK.</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ========== HERO ========== */}
      <section className="hero" id="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot" />
            Open to opportunities
          </div>
          <h1 className="hero-title">
            Hi, I'm <span className="gradient">Thanaphat</span>
          </h1>
          <p className="hero-subtitle">
            Full-Stack Developer who builds clean, scalable web applications with modern technologies. Passionate about turning ideas into production-ready products.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">
              View My Work ↓
            </a>
            <a href="https://github.com/sing198" target="_blank" rel="noreferrer" className="btn-outline">
              GitHub Profile
            </a>
          </div>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section className="section" id="about">
        <div className="animate-on-scroll">
          <p className="section-label">About Me</p>
          <h2 className="section-title">Building things that matter.</h2>
        </div>
        <div className="about-grid animate-on-scroll">
          <div className="about-text">
            <p>
              I'm Thanaphat Khunphet, a Full-Stack Developer based in Thailand. I specialize in building end-to-end web applications — from designing responsive user interfaces to architecting secure backend APIs.
            </p>
            <p>
              My core stack revolves around <strong>React</strong> for the frontend and <strong>Golang</strong> for high-performance backend services, backed by <strong>PostgreSQL</strong>. I focus on writing clean, maintainable code and care deeply about user experience.
            </p>
            <p>
              I'm currently looking for opportunities where I can contribute to meaningful projects and grow alongside a talented engineering team.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat-card">
              <div className="stat-number">3+</div>
              <div className="stat-label">Technologies</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1</div>
              <div className="stat-label">Major Project</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">950+</div>
              <div className="stat-label">Lines of Go</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">14</div>
              <div className="stat-label">React Pages</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SKILLS ========== */}
      <section className="section" id="skills">
        <div className="animate-on-scroll">
          <p className="section-label">Skills</p>
          <h2 className="section-title">My toolkit.</h2>
          <p className="section-desc">Technologies and tools I use to bring products to life.</p>
        </div>
        <div className="skills-grid animate-on-scroll">
          <div className="skill-category">
            <div className="skill-category-icon">⚛️</div>
            <h3 className="skill-category-title">Frontend</h3>
            <div className="skill-tags">
              <span className="skill-tag">React</span>
              <span className="skill-tag">Vite</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">Tailwind CSS</span>
              <span className="skill-tag">HTML / CSS</span>
              <span className="skill-tag">React Router</span>
              <span className="skill-tag">Axios</span>
              <span className="skill-tag">i18next</span>
            </div>
          </div>
          <div className="skill-category">
            <div className="skill-category-icon">🔧</div>
            <h3 className="skill-category-title">Backend</h3>
            <div className="skill-tags">
              <span className="skill-tag">Golang</span>
              <span className="skill-tag">Gin Framework</span>
              <span className="skill-tag">GORM</span>
              <span className="skill-tag">REST API</span>
              <span className="skill-tag">JWT Auth</span>
              <span className="skill-tag">Middleware</span>
            </div>
          </div>
          <div className="skill-category">
            <div className="skill-category-icon">🗄️</div>
            <h3 className="skill-category-title">Database & Tools</h3>
            <div className="skill-tags">
              <span className="skill-tag">PostgreSQL</span>
              <span className="skill-tag">Supabase</span>
              <span className="skill-tag">Git / GitHub</span>
              <span className="skill-tag">VS Code</span>
              <span className="skill-tag">Postman</span>
              <span className="skill-tag">Vercel</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROJECTS ========== */}
      <section className="section" id="projects">
        <div className="animate-on-scroll">
          <p className="section-label">Projects</p>
          <h2 className="section-title">What I've built.</h2>
          <p className="section-desc">A showcase of my development work and problem-solving skills.</p>
        </div>

        <div className="project-card animate-on-scroll">
          <div className="project-image-grid">
            <img className="main-img" src={screenshots.homepage} alt="DGKeys Homepage" />
            <div className="side-imgs">
              <img src={screenshots.cart} alt="DGKeys Cart" />
              <img src={screenshots.admin} alt="DGKeys Admin" />
            </div>
          </div>
          <div className="project-body">
            <p className="project-overline">Featured Project</p>
            <h3 className="project-name">🎮 DGKeys — Game Key E-Commerce</h3>
            <p className="project-desc">
              A production-grade full-stack e-commerce platform for digital game keys. Features include JWT authentication, role-based admin dashboard, real-time search with pagination, coupon system, and PostgreSQL transaction locking to prevent race conditions during checkout.
            </p>
            <div className="features-list">
              <div className="feature-item"><span className="check">✓</span> JWT Auth & RBAC</div>
              <div className="feature-item"><span className="check">✓</span> Full CRUD Admin Panel</div>
              <div className="feature-item"><span className="check">✓</span> Concurrency-Safe Checkout</div>
              <div className="feature-item"><span className="check">✓</span> Search, Filter & Pagination</div>
              <div className="feature-item"><span className="check">✓</span> Coupon / Discount System</div>
              <div className="feature-item"><span className="check">✓</span> Image Upload</div>
              <div className="feature-item"><span className="check">✓</span> Admin Audit Logs</div>
              <div className="feature-item"><span className="check">✓</span> Multi-language (EN/TH)</div>
            </div>
            <div className="project-tech">
              <span>React</span>
              <span>Vite</span>
              <span>Tailwind CSS</span>
              <span>Golang</span>
              <span>Gin</span>
              <span>GORM</span>
              <span>PostgreSQL</span>
              <span>JWT</span>
            </div>
            <div className="project-links">
              <a href="https://github.com/sing198/OMS" target="_blank" rel="noreferrer" className="link-primary">
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTACT ========== */}
      <section className="contact-section" id="contact">
        <div className="animate-on-scroll">
          <p className="section-label">Contact</p>
          <h2 className="section-title">Let's work together.</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            I'm currently open to full-time opportunities. Feel free to reach out — I'd love to hear from you.
          </p>
          <div className="contact-links">
            <a href="https://github.com/sing198" target="_blank" rel="noreferrer" className="contact-card">
              <span className="icon">🐙</span> GitHub
            </a>
            <a href="mailto:sing2019083@gmail.com" className="contact-card">
              <span className="icon">✉️</span> sing2019083@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <p>© 2026 Thanaphat Khunphet. Built with React + Vite.</p>
      </footer>
    </>
  )
}

export default App
