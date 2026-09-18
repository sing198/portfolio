import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

const EMAIL = 'thanaphat3254@gmail.com'
const GITHUB = 'https://github.com/sing198'
const navigation = [['home', 'Home'], ['projects', 'Work'], ['about', 'Experience'], ['skills', 'Skills'], ['contact', 'Contact']]
const projects = [
  { name: 'DGKeys', type: 'E-commerce platform', number: '01', theme: 'peach', image: 'https://raw.githubusercontent.com/sing198/OMS/main/screenshots/homepage.png', description: 'A digital storefront built around a reliable checkout.', detail: 'A full-stack game key store with PostgreSQL transaction locking to prevent race conditions during checkout.', tags: ['React', 'Go / Gin', 'PostgreSQL', 'JWT'], demo: 'https://oms-lemon.vercel.app/', repo: 'OMS' },
  { name: 'Kanban Board', type: 'Real-time collaboration', number: '02', theme: 'mint', image: '/screenshots/KanbanBoard.png', description: 'One workspace. Everyone on the same page.', detail: 'A collaborative board that syncs cards and swimlanes over WebSockets, with Redis Pub/Sub for communication across instances.', tags: ['React', 'TypeScript', 'Go', 'Redis'], demo: 'https://kanban-board-eta-five.vercel.app/', repo: 'Kanban-Board' },
  { name: 'ALRO Land', type: 'GIS & land management', number: '03', theme: 'lilac', image: '/screenshots/land/Admin_Home_Right.png', description: 'Making complex land information easier to navigate.', detail: 'A land management application with interactive polygon mapping, analytics dashboards, role-based access, and privacy masking.', tags: ['Vue 3', 'Node.js', 'MariaDB', 'Leaflet'], demo: 'https://alro-land.vercel.app/', repo: 'land' },
]
const skills = [
  { category: 'Frontend', title: 'Interfaces that make sense.', stack: ['React', 'Vue 3', 'TypeScript', 'Tailwind CSS'], detail: 'Responsive interfaces, reusable components, and API integration.', mark: '01' },
  { category: 'Backend', title: 'The logic behind the experience.', stack: ['Go / Gin', 'Node.js', 'Express', 'WebSockets'], detail: 'REST APIs, authentication, and real-time communication.', mark: '02' },
  { category: 'Data & tools', title: 'A solid foundation.', stack: ['PostgreSQL', 'MariaDB', 'Redis', 'Docker', 'Git', 'Figma'], aiTools: ['Codex', 'Antigravity'], aiNote: 'Using AI coding agents to explore code, assist with implementation, and investigate bugs.', detail: 'Relational data, caching, development workflows, and interface design.', mark: '03' },
]

function Arrow({ diagonal = false }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} /></svg>
}

function App() {
  const [activeNav, setActiveNav] = useState('home')
  const [filter, setFilter] = useState('All')
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') === 'dark' } catch { return false }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDark)
    document.body.classList.remove('dark-theme', 'light-theme')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#17191c' : '#faf9f6')
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light') } catch { /* The theme still works when storage is unavailable. */ }
  }, [isDark])
  useEffect(() => {
    const onScroll = () => {
      let current = 'home'
      for (const [id] of navigation) {
        if (document.getElementById(id)?.getBoundingClientRect().top <= 160) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) current = 'contact'
      setActiveNav(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!('IntersectionObserver' in window)) return

    let observer
    const setupReveals = () => {
      observer?.disconnect()
      if (motionPreference.matches) return
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        }
      }, { threshold: 0.08 })
      document.querySelectorAll('.section-heading, .project, .experience-intro, .experience, .contact-panel').forEach(element => {
        if (!element.classList.contains('reveal-in')) observer.observe(element)
      })
    }
    setupReveals()
    motionPreference.addEventListener('change', setupReveals)
    return () => {
      observer?.disconnect()
      motionPreference.removeEventListener('change', setupReveals)
    }
  }, [])

  return <>
    <Analytics />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#home" aria-label="Thanaphat home">tk<span>.</span></a>
        <nav aria-label="Main navigation">{navigation.map(([id, label]) => <a key={id} href={`#${id}`} className={activeNav === id ? 'active' : ''} aria-current={activeNav === id ? 'location' : undefined}>{label}</a>)}</nav>
        <button className="theme-toggle" onClick={() => setIsDark(!isDark)} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
          <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{isDark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" />}</svg>
        </button>
      </div>
    </header>
    <main id="main">
      <section className="hero container" id="home">
        <div className="hero-copy">
          <div className="availability"><span /> Open to opportunities</div>
          <p className="eyebrow hero-intro">HELLO, I'M THANAPHAT KHUNPHET</p>
          <h1>Full-Stack Developer.<br /><span>From design to code.</span></h1>
          <p className="hero-description">A full-stack developer connecting design and engineering. I build web applications with React, Go, and Node.js, with internship experience in ERP and healthcare.</p>
          <div className="hero-actions"><a className="button primary" href="#projects">Explore my work <Arrow /></a><a className="button secondary" href="/Resume_Thanaphat_Khunphet.pdf" download="Resume_Thanaphat_Khunphet.pdf">Download Resume <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" /></svg></a></div>
          <div className="hero-meta"><span>Based in Bangkok, Thailand</span><span className="meta-dot">·</span><a href={GITHUB} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a></div>
        </div>
        <div className="portrait-composition">
          <div className="portrait-frame"><img src="/profile.jpg" alt="Thanaphat Khunphet" fetchPriority="high" /><div className="portrait-caption"><span>Thanaphat Khunphet</span><small>Full-Stack Developer</small></div></div>
        </div>
      </section>
      <div className="expertise-strip"><div className="container"><span>DESIGN → DEVELOPMENT</span><p>React <i>/</i> Go <i>/</i> Node.js <i>/</i> PostgreSQL <i>/</i> Figma</p><a href="#projects" aria-label="Scroll to selected work">↓</a></div></div>
      <section className="section container" id="projects">
        <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Ideas, made tangible<span>.</span></h2></div><p>A few projects that show<br />how I approach building software.</p></div>
        <div className="project-list">{projects.map(project => <article className="project" key={project.name}>
          <a className={`project-visual ${project.theme}`} href={project.demo} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live demo`}><div className="visual-label"><span>{project.type}</span><Arrow diagonal /></div><div className="browser-frame"><div className="browser-chrome"><span /><span /><span /><small>{project.name}</small></div><img src={project.image} alt={`${project.name} application screenshot`} loading="lazy" /></div></a>
          <div className="project-copy"><span className="project-number">PROJECT / {project.number}</span><h3>{project.name}</h3><p className="project-lead">{project.description}</p><p className="project-detail">{project.detail}</p><ul className="tags" aria-label="Tech stack">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><div className="project-links"><a href={project.demo} target="_blank" rel="noreferrer">Live demo <Arrow diagonal /></a><a href={`${GITHUB}/${project.repo}`} target="_blank" rel="noreferrer">Source code <Arrow /></a></div></div>
        </article>)}</div>
      </section>
      <section className="experience-section" id="about"><div className="container experience-layout"><div className="experience-intro"><p className="eyebrow">02 / EXPERIENCE & BACKGROUND</p><h2>Learning by<br /><span>building.</span></h2><p>From enterprise workflows to healthcare interfaces, my internships gave me experience turning requirements into working software.</p><div className="education"><span className="education-icon" aria-hidden="true">↗</span><div><strong>Walailak University</strong><p>IT & Digital Innovation<br />2021–2025 · GPA 3.18</p></div></div></div><div className="timeline">
        <article className="experience"><div className="experience-date">AUG — NOV 2025 <span>INTERNSHIP</span></div><h3>Front-End Developer</h3><p className="company">GIS GROUP Co., Ltd.</p><ul><li>Designed UI/UX and wireframes in Figma for a sports medicine clinic system.</li><li>Gathered requirements and refined designs based on client feedback.</li><li>Worked with React, Tailwind CSS, and shadcn/ui for clinic interfaces.</li></ul></article>
        <article className="experience"><div className="experience-date">APR — AUG 2025 <span>INTERNSHIP</span></div><h3>Software Developer</h3><p className="company">Proalpha Solutions Thailand Co., Ltd.</p><ul><li>Learned Progress ABL and database queries within an enterprise ERP system.</li><li>Worked with Sales and Purchase modules, business logic, and UI modifications.</li><li>Practiced implementation, testing, and code review with senior developers.</li></ul></article>
      </div></div></section>
      <section className="section container" id="skills"><div className="section-heading"><div><p className="eyebrow">03 / MY TOOLKIT</p><h2>The tools behind the work<span>.</span></h2></div></div><div className="skill-filters" aria-label="Filter skills">{['All', ...skills.map(s => s.category)].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="skill-grid" key={filter}>{skills.filter(s => filter === 'All' || s.category === filter).map(skill => <article className="skill-card" key={skill.category}><div className="skill-top"><span>{skill.category}</span><span>{skill.mark}</span></div><h3>{skill.title}</h3><p>{skill.detail}</p><ul className="tags">{skill.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>{skill.aiNote && <div className="skill-ai-note"><h4>AI-assisted development</h4><p>{skill.aiNote}</p><ul className="tags" aria-label="AI development tools">{skill.aiTools.map(tool => <li key={tool}>{tool}</li>)}</ul></div>}</article>)}</div></section>
      <section className="contact-section container" id="contact"><div className="contact-panel"><div><p className="eyebrow">HAVE A ROLE OR PROJECT IN MIND?</p><h2>Let’s build something<br /><span>worth using.</span></h2><p>Open to full-time roles and contract opportunities.</p><a className="button primary" href={`mailto:${EMAIL}`}>Get in touch <Arrow diagonal /></a></div><div className="contact-details"><span className="contact-star" aria-hidden="true">✳</span><a href={`mailto:${EMAIL}`}>{EMAIL} <Arrow diagonal /></a><a href={GITHUB} target="_blank" rel="noreferrer">Find me on GitHub <Arrow diagonal /></a><span>Bangkok, Thailand · UTC+7</span></div></div></section>
    </main>
    <footer className="container site-footer"><a className="wordmark" href="#home">tk<span>.</span></a><p>© {new Date().getFullYear()} Thanaphat Khunphet</p><a href="#home">Back to top ↑</a></footer>
  </>
}
export default App
