import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { EMAIL, GITHUB, translations } from './translations'

function Arrow({ diagonal = false }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} />
    </svg>
  )
}

function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('portfolio-lang') === 'th' ? 'th' : 'en'
    } catch {
      return 'en'
    }
  })
  const [activeNav, setActiveNav] = useState('home')
  const [filter, setFilter] = useState('all')
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') === 'dark'
    } catch {
      return false
    }
  })

  const t = translations[lang]

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    try {
      localStorage.setItem('portfolio-lang', lang)
    } catch {
      /* The language preference still works in memory if storage is unavailable. */
    }
  }, [lang])

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDark)
    document.body.classList.remove('dark-theme', 'light-theme')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#17191c' : '#faf9f6')
    try {
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light')
    } catch {
      /* The theme still works when storage is unavailable. */
    }
  }, [isDark])

  useEffect(() => {
    const onScroll = () => {
      let current = 'home'
      for (const [id] of t.nav) {
        if (document.getElementById(id)?.getBoundingClientRect().top <= 160) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) current = 'contact'
      setActiveNav(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [t.nav])

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!('IntersectionObserver' in window)) return

    let observer
    const setupReveals = () => {
      observer?.disconnect()
      if (motionPreference.matches) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-in')
              observer.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.08 }
      )
      document.querySelectorAll('.section-heading, .project, .experience-intro, .experience, .contact-panel').forEach((element) => {
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

  return (
    <>
      <Analytics />
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="Thanaphat home">
            tk<span>.</span>
          </a>
          <nav aria-label="Main navigation">
            {t.nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={activeNav === id ? 'active' : ''} aria-current={activeNav === id ? 'location' : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <div className="lang-toggle" role="group" aria-label="Language selection">
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                aria-label="English"
              >
                EN
              </button>
              <span className="lang-sep" aria-hidden="true">
                /
              </span>
              <button
                type="button"
                className={`lang-btn ${lang === 'th' ? 'active' : ''}`}
                onClick={() => setLang('th')}
                aria-pressed={lang === 'th'}
                aria-label="ภาษาไทย"
              >
                TH
              </button>
            </div>
            <button
              className="theme-toggle"
              onClick={() => setIsDark(!isDark)}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                {isDark ? (
                  <>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
                  </>
                ) : (
                  <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero container" id="home">
          <div className="hero-copy">
            <div className="availability">
              <span /> {t.hero.availability}
            </div>
            <p className="eyebrow hero-intro">{t.hero.eyebrow}</p>
            <h1>
              {t.hero.headlineLead}
              <br />
              <span>{t.hero.headlineSub}</span>
            </h1>
            <p className="hero-description">{t.hero.description}</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">
                {t.hero.exploreBtn} <Arrow />
              </a>
              <a className="button secondary" href="/Resume_Thanaphat_Khunphet.pdf" download="Resume_Thanaphat_Khunphet.pdf">
                {t.hero.resumeBtn}{' '}
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />
                </svg>
              </a>
            </div>
            <div className="hero-meta">
              <span>{t.hero.location}</span>
              <span className="meta-dot">·</span>
              <a href={GITHUB} target="_blank" rel="noreferrer">
                GitHub <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="portrait-composition">
            <div className="portrait-frame">
              <img src="/profile.jpg" alt={t.hero.name} fetchPriority="high" />
              <div className="portrait-caption">
                <span>{t.hero.name}</span>
                <small>{t.hero.role}</small>
              </div>
            </div>
          </div>
        </section>
        <div className="expertise-strip">
          <div className="container">
            <span>{t.strip.tag}</span>
            <p>{t.strip.stack}</p>
            <a href="#projects" aria-label={t.strip.aria}>
              ↓
            </a>
          </div>
        </div>
        <section className="section container" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.projectsSection.eyebrow}</p>
              <h2>
                {t.projectsSection.heading}
                <span>.</span>
              </h2>
            </div>
            <p style={{ whiteSpace: 'pre-line' }}>{t.projectsSection.subheading}</p>
          </div>
          <div className="project-list">
            {t.projects.map((project) => (
              <article className="project" key={project.name}>
                <a className={`project-visual ${project.theme}`} href={project.demo} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live demo`}>
                  <div className="visual-label">
                    <span>{project.type}</span>
                    <Arrow diagonal />
                  </div>
                  <div className="browser-frame">
                    <div className="browser-chrome">
                      <span />
                      <span />
                      <span />
                      <small>{project.name}</small>
                    </div>
                    <img src={project.image} alt={`${project.name} application screenshot`} loading="lazy" />
                  </div>
                </a>
                <div className="project-copy">
                  <span className="project-number">PROJECT / {project.number}</span>
                  <h3>{project.name}</h3>
                  <p className="project-lead">{project.description}</p>
                  <p className="project-detail">{project.detail}</p>
                  <ul className="tags" aria-label={t.projectsSection.techStackAria}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    <a href={project.demo} target="_blank" rel="noreferrer">
                      {t.projectsSection.liveDemo} <Arrow diagonal />
                    </a>
                    <a href={`${GITHUB}/${project.repo}`} target="_blank" rel="noreferrer">
                      {t.projectsSection.sourceCode} <Arrow />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="experience-section" id="about">
          <div className="container experience-layout">
            <div className="experience-intro">
              <p className="eyebrow">{t.experienceSection.eyebrow}</p>
              <h2>
                {t.experienceSection.heading}
                <br />
                <span>{t.experienceSection.headingHighlight}</span>
              </h2>
              <p>{t.experienceSection.intro}</p>
              <div className="education">
                <span className="education-icon" aria-hidden="true">
                  ↗
                </span>
                <div>
                  <strong>{t.experienceSection.education.school}</strong>
                  <p>
                    {t.experienceSection.education.major}
                    <br />
                    {t.experienceSection.education.period}
                  </p>
                </div>
              </div>
            </div>
            <div className="timeline">
              {t.experienceSection.timeline.map((exp, idx) => (
                <article className="experience" key={idx}>
                  <div className="experience-date">
                    {exp.date} <span>{exp.badge}</span>
                  </div>
                  <h3>{exp.role}</h3>
                  <p className="company">{exp.company}</p>
                  <ul>
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section container" id="skills">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.skillsSection.eyebrow}</p>
              <h2>
                {t.skillsSection.heading}
                <span>.</span>
              </h2>
            </div>
          </div>
          <div className="skill-filters" aria-label="Filter skills">
            {['all', ...t.skillsSection.skills.map((s) => s.category)].map((category) => (
              <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>
                {category === 'all' ? t.skillsSection.allFilter : category}
              </button>
            ))}
          </div>
          <div className="skill-grid" key={`${lang}-${filter}`}>
            {t.skillsSection.skills
              .filter((s) => filter === 'all' || s.category === filter)
              .map((skill) => (
                <article className="skill-card" key={skill.category}>
                  <div className="skill-top">
                    <span>{skill.category}</span>
                    <span>{skill.mark}</span>
                  </div>
                  <h3>{skill.title}</h3>
                  <p>{skill.detail}</p>
                  <ul className="tags">
                    {skill.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  {skill.aiNote && (
                    <div className="skill-ai-note">
                      <h4>{skill.aiTitle}</h4>
                      <p>{skill.aiNote}</p>
                      <ul className="tags" aria-label="AI development tools">
                        {skill.aiTools.map((tool) => (
                          <li key={tool}>{tool}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
          </div>
        </section>
        <section className="contact-section container" id="contact">
          <div className="contact-panel">
            <div>
              <p className="eyebrow">{t.contactSection.eyebrow}</p>
              <h2>
                {t.contactSection.heading}
                <br />
                <span>{t.contactSection.headingHighlight}</span>
              </h2>
              <p>{t.contactSection.description}</p>
              <a className="button primary" href={`mailto:${EMAIL}`}>
                {t.contactSection.button} <Arrow diagonal />
              </a>
            </div>
            <div className="contact-details">
              <span className="contact-star" aria-hidden="true">
                ✳
              </span>
              <a href={`mailto:${EMAIL}`}>
                {EMAIL} <Arrow diagonal />
              </a>
              <a href={GITHUB} target="_blank" rel="noreferrer">
                {t.contactSection.githubLinkText} <Arrow diagonal />
              </a>
              <span>{t.contactSection.location}</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="container site-footer">
        <a className="wordmark" href="#home">
          tk<span>.</span>
        </a>
        <p>{t.footer.copyright}</p>
        <a href="#home">{t.footer.backToTop}</a>
      </footer>
    </>
  )
}

export default App
