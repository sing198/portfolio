import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

// Project screenshots
const screenshots = {
  dgkeys: {
    homepage: 'https://raw.githubusercontent.com/sing198/OMS/main/screenshots/homepage.png',
    cart: 'https://raw.githubusercontent.com/sing198/OMS/main/screenshots/cart.png',
    admin: 'https://raw.githubusercontent.com/sing198/OMS/main/screenshots/AdminProducts.png',
  },
  kanban: {
    board: 'https://raw.githubusercontent.com/sing198/Kanban-Board/main/screenshot/KanbanBoard.png',
    dashboard: 'https://raw.githubusercontent.com/sing198/Kanban-Board/main/screenshot/KanbanDashboard.png',
  },
  land: {
    admin: '/screenshots/land/Admin_Home_Right.png',
    landOfficer: '/screenshots/land/Land Reform Officer_Home_Right.png',
    legalOfficer: '/screenshots/land/Legal Officer Home_Right.png',
  },
}

// Skills data for 3D Sphere & filter
const SKILLS_DATA = [
  { id: 'react', name: 'React', category: 'frontend', icon: '⚛️', color: '#61dafb', desc: 'Component architecture, hooks, state management, SPA routing' },
  { id: 'golang', name: 'Golang', category: 'backend', icon: '🔷', color: '#00add8', desc: 'High-performance Gin framework, concurrency, GORM, REST APIs' },
  { id: 'vue', name: 'Vue 3', category: 'frontend', icon: '💚', color: '#42b883', desc: 'Vue 3 Composition API, Pinia, Vue Router, Leaflet integration' },
  { id: 'ts', name: 'TypeScript', category: 'frontend', icon: '📘', color: '#3178c6', desc: 'Type-safe frontend development, interfaces, strict mode' },
  { id: 'postgres', name: 'PostgreSQL', category: 'database', icon: '🐘', color: '#336791', desc: 'Relational database, transactions, query optimization, ACID' },
  { id: 'redis', name: 'Redis', category: 'database', icon: '🔴', color: '#dc382d', desc: 'Pub/Sub broadcasting, in-memory caching, message queues' },
  { id: 'nodejs', name: 'Node.js', category: 'backend', icon: '🟢', color: '#68a063', desc: 'Express RESTful APIs, Joi validation, MariaDB pooling, JWT security' },
  { id: 'docker', name: 'Docker', category: 'tools', icon: '🐳', color: '#2496ed', desc: 'Containerization, Docker Compose, multi-stage builds' },
  { id: 'ws', name: 'WebSockets', category: 'backend', icon: '⚡', color: '#eab308', desc: 'Real-time bi-directional messaging, heartbeat, client presence' },
  { id: 'tailwind', name: 'Tailwind', category: 'frontend', icon: '🎨', color: '#38bdf8', desc: 'Modern responsive utility-first styling, animations, dark mode' },
  { id: 'git', name: 'Git', category: 'tools', icon: '🐙', color: '#f05032', desc: 'Version control, branch management, collaborative workflows' },
  { id: 'leaflet', name: 'Leaflet GIS', category: 'frontend', icon: '🗺️', color: '#10b981', desc: 'Interactive geographic information system, polygon coordinate mapping' },
]

function App() {
  const [activeNav, setActiveNav] = useState('home')
  const [activeAboutTab, setActiveAboutTab] = useState('passion')
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all')
  const [activeSkill, setActiveSkill] = useState(SKILLS_DATA[0])
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('portfolio-theme') : null
    if (saved) return saved === 'dark'
    return typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true
  })

  // Synchronize body class and localStorage on theme toggle
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.remove('light-theme')
      localStorage.setItem('portfolio-theme', 'dark')
    } else {
      document.body.classList.add('light-theme')
      localStorage.setItem('portfolio-theme', 'light')
    }
  }, [isDarkTheme])

  // Scroll spy to highlight active navbar item
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      const sections = ['home', 'about', 'projects', 'skills', 'other']

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveNav(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredSkills = selectedSkillCategory === 'all'
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === selectedSkillCategory)

  return (
    <>
      <Analytics />
      {/* ============ FLOATING HEADER ============ */}
      <header className="header-wrapper">
        {/* Theme Toggle Button */}
        <button
          className="btn-circle"
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {isDarkTheme ? '🌙' : '☀️'}
        </button>

        {/* Floating Capsule Navbar */}
        <nav className="nav-capsule">
          <a
            href="#home"
            className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => setActiveNav('home')}
          >
            Home
          </a>
          <a
            href="#about"
            className={`nav-item ${activeNav === 'about' ? 'active' : ''}`}
            onClick={() => setActiveNav('about')}
          >
            About
          </a>
          <a
            href="#projects"
            className={`nav-item ${activeNav === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveNav('projects')}
          >
            Projects
          </a>
          <a
            href="#skills"
            className={`nav-item ${activeNav === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveNav('skills')}
          >
            Skills
          </a>
          <a
            href="#other"
            className={`nav-item ${activeNav === 'other' ? 'active' : ''}`}
            onClick={() => setActiveNav('other')}
          >
            Other
          </a>
        </nav>

        {/* Right Spacer to keep capsule perfectly centered */}
        <div style={{ width: 44, height: 44 }} />
      </header>

      {/* ============ 1. HERO SECTION ============ */}
      <section className="hero-section main-container" id="home">
        {/* Avatar Profile Photo */}
        <div className="avatar-wrapper">
          <div
            className="avatar-3d-head"
            style={{
              padding: '4px',
              background: 'linear-gradient(135deg, #ffc371, #ff5f6d)',
              boxShadow: '0 20px 40px rgba(255, 95, 109, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src="/profile.jpg"
              alt="Thanaphat Khunphet"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="hero-heading">
          Hi, I'm <span className="gradient-text">Thanaphat Khunphet</span>
        </h1>

        {/* Subtitle & Tagline */}
        <p
          style={{
            maxWidth: '620px',
            margin: '0 auto 2.2rem auto',
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          Full-Stack Developer who builds clean, scalable web applications with modern technologies. Passionate about turning complex problems into elegant digital products.
        </p>

        {/* Call to Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#projects" className="btn-project-primary" style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem' }}>
            View Projects ↓
          </a>
          <a
            href="https://github.com/sing198"
            target="_blank"
            rel="noreferrer"
            className="btn-project-outline"
            style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem' }}
          >
            GitHub Profile 🐙
          </a>
        </div>

        {/* Scroll Indicator */}
        <a href="#about" className="scroll-explore-indicator" style={{ marginTop: '4rem' }}>
          <span>Scroll to explore</span>
          <span>↓</span>
        </a>
      </section>

      {/* ============ 2. ABOUT BENTO GRID (Image 2) ============ */}
      <section className="section-spacing main-container" id="about">
        <div className="bento-grid">
          {/* Box 1: Name Badge */}
          <div className="bento-card bento-name-badge">
            <h3 className="name-badge-title">THANAPHAT KHUNPHET</h3>
            <div className="name-badge-divider" />
            <p className="name-badge-sub">FULLSTACK DEVELOPER</p>
          </div>

          {/* Box 2: Hover to Read More Tabs */}
          <div className="bento-card bento-hover-tabs">
            <div className="hover-header-label">HOVER TO READ MORE</div>
            <div className="hover-tabs-grid">
              <div
                className={`hover-tab-item ${activeAboutTab === 'passion' ? 'active' : ''}`}
                onMouseEnter={() => setActiveAboutTab('passion')}
              >
                <div className="tab-category-label">TECH PASSION</div>
                <div className="tab-snippet-text">
                  Passionate about high-concurrency Go services & modern reactive React interfaces.
                </div>
              </div>
              <div
                className={`hover-tab-item ${activeAboutTab === 'engineering' ? 'active' : ''}`}
                onMouseEnter={() => setActiveAboutTab('engineering')}
              >
                <div className="tab-category-label">ENGINEERING</div>
                <div className="tab-snippet-text">
                  Architecting robust REST & WebSocket APIs backed by PostgreSQL and Redis pub/sub.
                </div>
              </div>
              <div
                className={`hover-tab-item ${activeAboutTab === 'focus' ? 'active' : ''}`}
                onMouseEnter={() => setActiveAboutTab('focus')}
              >
                <div className="tab-category-label">FOCUS</div>
                <div className="tab-snippet-text">
                  Writing clean, scalable code with end-to-end security, RBAC, and reliable deployments.
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Mindset */}
          <div className="bento-card bento-mindset">
            <div>
              <h3 className="card-heading-clean">Mindset</h3>
              <p className="mindset-lead">
                <strong>Building more than software.</strong> My passions provide the <strong>discipline and focus</strong> I need to grow.
              </p>
            </div>

            {/* Polaroid style graphic */}
            <div className="polaroid-badge">
              <div
                className="polaroid-img"
                style={{
                  background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '2.5rem',
                }}
              >
                🏄‍♂️ 💻
              </div>
              <div className="polaroid-tag">FOCUS & FLOW</div>
            </div>

            <p className="mindset-footer">
              Mastering body and mind is my path to <strong>excellence</strong>.
            </p>
          </div>

          {/* Box 4: Portrait Photo */}
          <div className="bento-card bento-portrait">
            <div
              className="portrait-full-img"
              style={{
                background: 'linear-gradient(145deg, #1a162b, #282343)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '128px',
                  height: '128px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  boxShadow: '0 8px 25px rgba(236, 72, 153, 0.35)',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/profile.jpg"
                  alt="Thanaphat Khunphet"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                  }}
                />
              </div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                Thanaphat
              </h4>
              <p style={{ color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 600 }}>
                Full-Stack Developer
              </p>
            </div>
          </div>

          {/* Box 5: Craft */}
          <div className="bento-card bento-craft">
            <div>
              <h3 className="card-heading-clean">Craft</h3>
              <p className="craft-desc">
                Building scalable <strong>apps, websites, and automations</strong>.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                I understand what advantages modern tech can provide, helping me advise on the solutions a business actually needs.
              </p>
            </div>

            {/* Tech strip */}
            <div className="tech-icon-strip">
              <span className="tech-strip-item">🎨 TAILWIND</span>
              <span className="tech-strip-item">🐳 DOCKER</span>
              <span className="tech-strip-item">🐙 GIT</span>
              <span className="tech-strip-item">⚛️ REACT</span>
              <span className="tech-strip-item">🔷 GOLANG</span>
              <span className="tech-strip-item">🐘 POSTGRES</span>
            </div>

            <div>
              <p className="craft-subtext">
                Active Full-Stack Developer & Problem Solver. Available for Contract & Full-time opportunities. Feel free to reach out.
              </p>
              <div className="status-badge-open">
                <span className="status-dot-pulse" />
                Contract Or Full-time
              </div>
            </div>
          </div>

          {/* Box 6: Location Card */}
          <div className="bento-card bento-location">
            <h4 className="location-name">BANGKOK, THAILAND</h4>
            <div className="location-coords">
              13.7563° N, 100.5018° E <span>- GMT+7</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. FEATURED PROJECTS (Images 3 & 4) ============ */}
      <section className="section-spacing main-container" id="projects">
        <div className="section-header-centered">
          <p className="section-pill-tag">PORTFOLIO</p>
          <h2 className="section-title-large">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle-muted">
            A curated selection of projects that made me confident in building software.
          </p>
        </div>

        {/* 2-Column Responsive Project Grid */}
        <div className="projects-two-column-grid">
          {/* Project 1: DGKeys */}
          <div className="project-column-item">
            <div className="project-meta-header">
              <span className="project-index-num">01</span>
              <span className="project-category-line">—— FULL-STACK E-COMMERCE</span>
            </div>
            <h3 className="project-item-title">DGKeys</h3>

            {/* Vibrant Orange Box */}
            <div className="project-vibrant-box box-theme-orange">
              <p className="project-box-desc">
                Production-grade full-stack e-commerce platform for digital game keys with PostgreSQL transaction locking to prevent race conditions during checkout.
              </p>

              {/* Mac Window Mockup */}
              <div className="mac-window-mockup">
                <div className="mac-title-bar">
                  <span className="traffic-dot traffic-red" />
                  <span className="traffic-dot traffic-yellow" />
                  <span className="traffic-dot traffic-green" />
                  <span className="mac-url-bar">https://oms-lemon.vercel.app/</span>
                </div>
                <img
                  src={screenshots.dgkeys.homepage}
                  alt="DGKeys Preview"
                  className="mac-content-img"
                />
              </div>
            </div>

            {/* Details & Actions Below */}
            <div className="project-footer-details">
              <div className="project-pill-tags">
                <span className="project-pill-tag">REACT</span>
                <span className="project-pill-tag">GOLANG</span>
                <span className="project-pill-tag">GIN</span>
                <span className="project-pill-tag">POSTGRESQL</span>
                <span className="project-pill-tag">GORM</span>
                <span className="project-pill-tag">JWT</span>
              </div>
              <div className="project-action-links">
                <a
                  href="https://oms-lemon.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-project-primary"
                >
                  Live Demo ↗
                </a>
                <a
                  href="https://github.com/sing198/OMS"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-project-outline"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>

          {/* Project 2: Kanban Board */}
          <div className="project-column-item">
            <div className="project-meta-header">
              <span className="project-index-num">02</span>
              <span className="project-category-line">—— REAL-TIME COLLABORATION</span>
            </div>
            <h3 className="project-item-title">Kanban Board</h3>

            {/* Vibrant Green Box */}
            <div className="project-vibrant-box box-theme-green">
              <p className="project-box-desc">
                Real-time collaborative kanban board workspace syncing cards and swimlanes over WebSockets with Redis Pub/Sub cross-instance scalability.
              </p>

              {/* Mac Window Mockup */}
              <div className="mac-window-mockup">
                <div className="mac-title-bar">
                  <span className="traffic-dot traffic-red" />
                  <span className="traffic-dot traffic-yellow" />
                  <span className="traffic-dot traffic-green" />
                  <span className="mac-url-bar">https://kanban-board-eta-five.vercel.app/</span>
                </div>
                <img
                  src={screenshots.kanban.board}
                  alt="Kanban Board Preview"
                  className="mac-content-img"
                />
              </div>
            </div>

            {/* Details & Actions Below */}
            <div className="project-footer-details">
              <div className="project-pill-tags">
                <span className="project-pill-tag">REACT 19</span>
                <span className="project-pill-tag">TYPESCRIPT</span>
                <span className="project-pill-tag">GOLANG</span>
                <span className="project-pill-tag">WEBSOCKETS</span>
                <span className="project-pill-tag">REDIS</span>
                <span className="project-pill-tag">DOCKER</span>
              </div>
              <div className="project-action-links">
                <a
                  href="https://kanban-board-eta-five.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-project-primary"
                >
                  Live Demo ↗
                </a>
                <a
                  href="https://github.com/sing198/Kanban-Board"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-project-outline"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>

          {/* Project 3: ALRO Land */}
          <div className="project-column-item">
            <div className="project-meta-header">
              <span className="project-index-num">03</span>
              <span className="project-category-line">—— GIS & ENTERPRISE WEB APP</span>
            </div>
            <h3 className="project-item-title">ALRO Land</h3>

            {/* Vibrant Yellow Box */}
            <div className="project-vibrant-box box-theme-yellow">
              <p className="project-box-desc">
                Enterprise GIS mapping & citizen land rights management system for ALRO (ส.ป.ก.). Features interactive Leaflet polygon plots, real-time analytics dashboard, 4-tier RBAC, and PDPA privacy masking.
              </p>

              {/* Mac Window Mockup */}
              <div className="mac-window-mockup">
                <div className="mac-title-bar">
                  <span className="traffic-dot traffic-red" />
                  <span className="traffic-dot traffic-yellow" />
                  <span className="traffic-dot traffic-green" />
                  <span className="mac-url-bar">https://alro-land.vercel.app/</span>
                </div>
                <img
                  src={screenshots.land.admin}
                  alt="ALRO Land Dashboard Preview"
                  className="mac-content-img"
                />
              </div>
            </div>

            {/* Details & Actions Below */}
            <div className="project-footer-details">
              <div className="project-pill-tags">
                <span className="project-pill-tag">VUE 3</span>
                <span className="project-pill-tag">TAILWIND CSS</span>
                <span className="project-pill-tag">LEAFLET GIS</span>
                <span className="project-pill-tag">NODE.JS</span>
                <span className="project-pill-tag">EXPRESS</span>
                <span className="project-pill-tag">MARIADB</span>
                <span className="project-pill-tag">CHART.JS</span>
                <span className="project-pill-tag">DOCKER</span>
              </div>
              <div className="project-action-links">
                <a
                  href="https://alro-land.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-project-primary"
                >
                  Live Demo ↗
                </a>
                <a
                  href="https://github.com/sing198/land"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-project-outline"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. TECH STACK & SKILLS (Image 5) ============ */}
      <section className="section-spacing main-container" id="skills">
        <div className="section-header-centered">
          <p className="section-pill-tag">TECH STACK</p>
          <h2 className="section-title-large">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="section-subtitle-muted">
            Hover or click on technologies to explore my toolkit and expertise.
          </p>
        </div>

        {/* 3D Orbit Sphere Visual */}
        <div className="skills-sphere-wrapper">
          <div className="skills-wireframe-globe" />

          {/* Center Active Node */}
          <div
            className="skill-core-center"
            style={{
              borderColor: activeSkill.color,
              boxShadow: `0 0 45px ${activeSkill.color}55`,
            }}
          >
            <span className="skill-core-icon">{activeSkill.icon}</span>
            <span className="skill-core-name">{activeSkill.name}</span>
          </div>

          {/* Orbiting Satellite Nodes */}
          {filteredSkills.map((skill, index) => {
            if (skill.id === activeSkill.id) return null
            const total = filteredSkills.length - 1 || 1
            const angle = (index * (360 / total) * Math.PI) / 180
            const radius = 175
            const posX = Math.cos(angle) * radius
            const posY = Math.sin(angle) * (radius * 0.7)

            return (
              <div
                key={skill.id}
                className="skill-orbit-node"
                style={{
                  transform: `translate(${posX}px, ${posY}px)`,
                  borderColor: `${skill.color}40`,
                }}
                onMouseEnter={() => setActiveSkill(skill)}
                onClick={() => setActiveSkill(skill)}
              >
                <span className="skill-node-icon">{skill.icon}</span>
                <span className="skill-node-label">{skill.name}</span>
              </div>
            )
          })}
        </div>

        {/* Active Skill Description Card */}
        <div
          style={{
            maxWidth: '520px',
            margin: '1.5rem auto 0 auto',
            background: 'rgba(15, 14, 26, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '1.25rem 1.75rem',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{activeSkill.icon}</span>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{activeSkill.name}</h4>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
              }}
            >
              {activeSkill.category}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {activeSkill.desc}
          </p>
        </div>

        {/* Category Filters */}
        <div className="skills-filter-container">
          {['all', 'frontend', 'backend', 'database', 'tools'].map((cat) => (
            <button
              key={cat}
              className={`skills-filter-pill ${selectedSkillCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedSkillCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* ============ 5. OTHER / CONTACT SECTION ============ */}
      <section className="section-spacing main-container" id="other">
        <div className="section-header-centered">
          <p className="section-pill-tag">CONNECT</p>
          <h2 className="section-title-large">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="section-subtitle-muted">
            I'm currently available for full-time software engineering roles, contract work, and innovative collaborations.
          </p>
        </div>

        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <div className="contact-options-grid">
            <a href="mailto:sing2019083@gmail.com" className="contact-direct-card">
              <span className="contact-card-icon">✉️</span>
              <div className="contact-card-info">
                <h4>Email Directly</h4>
                <p>thanaphat3254@gmail.com</p>
              </div>
            </a>
            <a href="https://github.com/sing198" target="_blank" rel="noreferrer" className="contact-direct-card">
              <span className="contact-card-icon">🐙</span>
              <div className="contact-card-info">
                <h4>GitHub Profile</h4>
                <p>github.com/sing198</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <p>© 2026 Thanaphat Khunphet. Designed with modern aesthetics.</p>
      </footer>
    </>
  )
}

export default App
