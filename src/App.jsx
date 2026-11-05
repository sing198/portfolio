import { useEffect, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { EMAIL, GITHUB, translations } from './translations'
import { getProjectDetails } from './projectDetails'
import ProjectGallery from './components/ProjectGallery'
import ProjectWalkthrough from './components/ProjectWalkthrough'
import CaseStudyDialog from './components/CaseStudyDialog'
import CopyButton from './components/CopyButton'
import useCaseStudyRoute from './hooks/useCaseStudyRoute'

const PROJECT_REPOS = translations.en.projects.map(project => project.repo)

function Arrow({ diagonal = false }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'm9 5 7 7-7 7'} /></svg>
}

function SkillIcon({ index }) {
  return <svg aria-hidden="true" width="38" height="38" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">{index === 0 ? <><rect x="4" y="5" width="24" height="22" rx="4" /><path d="M4 12h24M12 12v15M8 8.5h.1m3 0h.1" /></> : index === 1 ? <><rect x="5" y="4" width="22" height="10" rx="3" /><rect x="5" y="18" width="22" height="10" rx="3" /><path d="M9 9h.1m0 14h.1M14 9h9m-9 14h9" /></> : <><ellipse cx="16" cy="7" rx="11" ry="4" /><path d="M5 7v18c0 5.3 22 5.3 22 0V7M5 16c0 5.3 22 5.3 22 0" /></>}</svg>
}

function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('portfolio-lang') === 'th' ? 'th' : 'en' } catch { return 'en' }
  })
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') !== 'light' } catch { return true }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [activeNav, setActiveNav] = useState('home')
  const { caseStudyRepo, openCaseStudy, closeCaseStudy, getCaseStudyUrl } = useCaseStudyRoute(PROJECT_REPOS)
  const drawerRef = useRef(null)
  const t = translations[lang]
  const projects = t.projects.map(project => getProjectDetails(project, lang))
  const selectedProject = projects.find(project => project.repo === caseStudyRepo)
  const pageTitle = selectedProject
    ? `${selectedProject.name} — ${t.hero.name} | Case Study`
    : `${t.hero.name} — Full-Stack Developer`
  const c = lang === 'th' ? {
    menu: 'เมนู', close: 'ปิดเมนู',
    title: ['Junior Full-Stack Developer', 'ตั้งแต่ Frontend ถึง Backend.'], subtitle: 'Full-stack developer ที่พัฒนาเว็บแอปครบทั้ง front-end และ back-end เช่น ร้านขายคีย์เกมด้วย Go + PostgreSQL, บอร์ดทำงานร่วมกันแบบ real-time และระบบจัดการที่ดินบนแผนที่ GIS',
    intro: ['ดีไซน์ที่คิดมาอย่างดี.', 'โค้ดที่ทำงานได้จริง.'],
    highlights: 'ดูไฮไลท์ผลงาน.', caseStudy: 'อ่าน Case Study', work: ['ผลงานที่สร้าง.', 'ปัญหาที่แก้.'],
    focus: 'แนวคิดเบื้องหลัง', stack: 'เทคโนโลยีที่ใช้', education: 'การศึกษา',
    toolkit: ['เครื่องมือที่ใช่.', 'สำหรับทุกส่วนของงาน.'], contact: ['ไอเดียถัดไปของคุณ.', 'มาสร้างด้วยกัน.'],
    resume: 'ดาวน์โหลดเรซูเม่', navigation: 'ส่วนต่าง ๆ ของเว็บไซต์', connect: 'ช่องทางติดต่อ',
    copyEmail: 'คัดลอกอีเมล', emailCopied: 'คัดลอกอีเมลแล้ว', copyEmailError: 'คัดลอกไม่สำเร็จ กรุณาเลือกอีเมลแล้วคัดลอก',
    highlightTitles: ['Checkout ที่จัดการข้อมูลอย่างรอบคอบ.', 'พื้นที่เดียว วางแผนได้หลายรูปแบบ.', 'ข้อมูลที่ดิน มองเห็นได้บนแผนที่.'],
  } : {
    menu: 'Menu', close: 'Close menu',
    title: ['Junior Full-Stack Developer', 'Frontend to backend.'], subtitle: 'Full-stack developer who builds web apps end to end: a Go + PostgreSQL online store with safe checkout, a real-time collaborative board, and a GIS land-records system.',
    intro: ['Considered design.', 'Code that delivers.'],
    highlights: 'Get the highlights.', caseStudy: 'Read case study', work: ['Made to work.', 'Built to solve.'],
    focus: 'The thinking behind it', stack: 'Built with', education: 'Education',
    toolkit: ['The right tools.', 'For every layer.'], contact: ['Your next idea.', 'Let’s build it.'],
    resume: 'Download resume', navigation: 'Explore the portfolio', connect: 'Connect',
    copyEmail: 'Copy email', emailCopied: 'Email copied', copyEmailError: 'Couldn’t copy. Select the email and copy it.',
    highlightTitles: ['A checkout built around consistency.', 'One workspace. More ways to plan.', 'Land records. Right on the map.'],
  }

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('portfolio-lang', lang) } catch { /* Keep preference in memory. */ }
  }, [lang])
  useEffect(() => { document.title = pageTitle }, [pageTitle])
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#000000' : '#ffffff')
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light') } catch { /* Keep preference in memory. */ }
  }, [isDark])
  useEffect(() => {
    const update = () => {
      let current = 'home'
      for (const [id] of t.nav) {
        if (document.getElementById(id)?.getBoundingClientRect().top <= 180) current = id
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) current = 'contact'
      setActiveNav(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [t.nav])
  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.08 })
    root.classList.add('motion-ready')
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => { observer.disconnect(); root.classList.remove('motion-ready') }
  }, [lang, filter])

  const openMenu = () => {
    drawerRef.current.showModal()
    drawerRef.current.querySelector('.drawer-close').focus()
    setMenuOpen(true)
  }
  const closeMenu = () => drawerRef.current.close()

  return <>
    <Analytics />
    <a className="skip-link" href="#main">{t.skipLink}</a>
    <header className="site-header">
      <div className="header-inner container">
        <a className="brand header-brand" href="#home" aria-label={`${t.hero.name} — ${t.nav[0][1]}`}><span className="brand-logo">tk<span>.</span></span><span className="brand-label">Portfolio</span></a>
        <nav className="primary-nav" aria-label={c.navigation}>{t.nav.slice(1, 4).map(([id, label]) => <a href={`#${id}`} key={id} aria-current={activeNav === id ? 'location' : undefined}>{label}</a>)}</nav>
        <div className="header-actions">
          <div className="lang-toggle" role="group" aria-label="Language selection"><button aria-label="English" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button><button aria-label="ภาษาไทย" aria-pressed={lang === 'th'} onClick={() => setLang('th')}>TH</button></div>
          <button className="theme-toggle" aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} onClick={() => setIsDark(!isDark)}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{isDark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z" />}</svg></button>
          <a className="button button-small header-contact" href="#contact">{t.nav[4][1]}<Arrow /></a>
          <button className="menu-toggle" aria-label={c.menu} aria-haspopup="dialog" aria-controls="site-menu" aria-expanded={menuOpen} onClick={openMenu}><span className="menu-icon" aria-hidden="true"><i /><i /></span></button>
        </div>
      </div>
    </header>
    <dialog id="site-menu" className="menu-drawer" ref={drawerRef} aria-labelledby="menu-title" onClose={() => setMenuOpen(false)} onClick={event => { if (event.target === event.currentTarget) closeMenu() }}>
      <div className="drawer-header"><a className="brand" href="#home" onClick={closeMenu}>tk<span>.</span></a><button className="drawer-close" onClick={closeMenu} autoFocus aria-label={c.close}><span aria-hidden="true">×</span></button></div>
      <div className="drawer-content"><nav aria-labelledby="menu-title"><p className="eyebrow" id="menu-title">{c.navigation}</p>{t.nav.map(([id, label]) => <a key={id} href={`#${id}`} onClick={closeMenu} aria-current={activeNav === id ? 'location' : undefined}>{label}<Arrow /></a>)}</nav><div className="drawer-info"><p>{t.hero.name}</p><span>Full-Stack Developer<br />{t.hero.location}</span><a className="text-link" href={`mailto:${EMAIL}`}>{EMAIL}<Arrow /></a><a className="text-link" href="/Resume_Thanaphat_Khunphet.pdf" download>{c.resume}<Arrow /></a><a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">GitHub<Arrow /></a></div></div>
    </dialog>
    {selectedProject && <CaseStudyDialog key={selectedProject.repo} project={selectedProject} lang={lang} onClose={closeCaseStudy} shareUrl={getCaseStudyUrl(selectedProject.repo)} />}
    <main id="main">
      <section className="hero" id="home">
        <div className="hero-heading container"><img className="hero-portrait" src="/profile.jpg" alt={t.hero.name} width="104" height="104" fetchPriority="high" /><p className="hero-role"><span>{t.hero.name}</span><span>Full-Stack Developer</span></p><h1>{c.title[0]}<br /><span>{c.title[1]}</span></h1><p className="hero-subtitle">{c.subtitle}</p><div className="hero-actions"><a className="button" href="#projects">{t.hero.exploreBtn}</a><a className="text-link" href="/Resume_Thanaphat_Khunphet.pdf" download>{c.resume}<Arrow /></a></div><div className="hero-meta"><span className="hero-availability"><i className="status-dot" />{t.hero.availability}</span><span>{t.hero.location}</span></div></div>
      </section>
      <section className="highlights-section section-space"><div className="container"><div className="section-heading reveal"><h2>{c.highlights}</h2><a href="#projects" className="text-link">{t.nav[1][1]}<Arrow /></a></div><div className="highlight-grid">{projects.map((project, index) => <button type="button" className={`highlight-card reveal ${project.theme}`} key={project.repo} onClick={() => openCaseStudy(project.repo)} aria-haspopup="dialog" aria-label={`${c.caseStudy}: ${project.name}`}><div className="highlight-copy"><p className="eyebrow">{project.name}</p><h3>{c.highlightTitles[index]}</h3></div><div className="highlight-visual"><ProjectGallery project={project} compact lang={lang} /></div><span className="highlight-link">{c.caseStudy}<span className="plus-icon" aria-hidden="true">+</span></span></button>)}</div></div></section>
      <section className="manifesto section-space" id="intro"><div className="container reveal"><p className="eyebrow">Design meets engineering.</p><h2>{c.intro[0]}<br /><span>{c.intro[1]}</span></h2><p>{t.hero.description}</p><div className="foundation"><span>React</span><span>Go</span><span>Node.js</span></div></div></section>
      <section className="work-section section-space" id="projects"><div className="container"><div className="section-heading reveal"><h2>{c.work[0]}<br /><span>{c.work[1]}</span></h2><p>{t.projectsSection.subheading}</p></div><div className="project-list">{projects.map(project => <article className={`project ${project.theme}`} id={`project-${project.repo}`} key={project.repo}>
        <div className="project-intro reveal"><p className="eyebrow">{project.type}</p><h3>{project.name}</h3><p className="project-lead">{project.description}</p><div className="project-links"><a className="button button-small" href={project.demo} target="_blank" rel="noreferrer" aria-label={`${t.projectsSection.liveDemo}: ${project.name}`}>{t.projectsSection.liveDemo}</a><button type="button" className="case-study-trigger" onClick={() => openCaseStudy(project.repo)} aria-haspopup="dialog" aria-label={`${c.caseStudy}: ${project.name}`}>{c.caseStudy}<Arrow /></button><a className="text-link" href={`${GITHUB}/${project.repo}`} target="_blank" rel="noreferrer" aria-label={`${t.projectsSection.sourceCode}: ${project.name}`}>{t.projectsSection.sourceCode}<Arrow /></a></div>{project.demoNote && <p className="project-demo-note">{project.demoNote}</p>}</div>
        <div className="reveal"><ProjectGallery project={project} lang={lang} /></div>
        <div className="reveal"><ProjectWalkthrough project={project} lang={lang} /></div>
        <div className="project-information reveal"><div><p className="eyebrow">{c.focus}</p><p>{project.detail}</p><p className="project-context">{project.context}</p>{project.contribution && <p className="project-contribution">{project.contribution}</p>}</div><div><p className="eyebrow">{c.stack}</p><ul className="tags" aria-label={t.projectsSection.techStackAria}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div></div>
      </article>)}</div></div></section>
      <section className="experience-section section-space" id="about"><div className="container"><div className="section-heading reveal"><h2>{t.experienceSection.heading}<br /><span>{t.experienceSection.headingHighlight}</span></h2><p>{t.experienceSection.intro}</p></div><div className="experience-grid">{t.experienceSection.timeline.map(exp => <article className="experience-card reveal" key={exp.company}><div className="experience-date"><span>{exp.date}</span><span>{exp.badge}</span></div><p className="company">{exp.company}</p><h3>{exp.role}</h3><ul>{exp.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}<article className="education-card reveal"><img src="/profile.jpg" alt={t.hero.name} loading="lazy" /><div><p className="eyebrow">{c.education}</p><h3>{t.experienceSection.education.school}</h3><p>{t.experienceSection.education.major}</p><span>{t.experienceSection.education.period}</span></div></article></div></div></section>
      <section className="skills-section section-space" id="skills"><div className="container"><div className="section-heading reveal"><h2>{c.toolkit[0]}<br /><span>{c.toolkit[1]}</span></h2><div className="skill-filters" role="group" aria-label={lang === 'th' ? 'กรองทักษะ' : 'Filter skills'}>{['all', ...t.skillsSection.skills.map(skill => skill.category)].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category === 'all' ? t.skillsSection.allFilter : category}</button>)}</div></div><div className={`skill-grid ${filter !== 'all' ? 'is-filtered' : ''}`}>{t.skillsSection.skills.filter(skill => filter === 'all' || filter === skill.category).map(skill => <article className="skill-card reveal" key={skill.category}><SkillIcon index={t.skillsSection.skills.indexOf(skill)} /><p className="eyebrow">{skill.category}</p><h3>{skill.title}</h3><p>{skill.detail}</p><ul className="skill-stack">{skill.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>{skill.aiNote && <div className="skill-ai-note"><h4>{skill.aiTitle}</h4><p>{skill.aiNote}</p><ul className="tags">{skill.aiTools.map(tool => <li key={tool}>{tool}</li>)}</ul></div>}</article>)}</div></div></section>
      <section className="contact-section section-space" id="contact"><div className="container reveal"><p className="eyebrow">{t.contactSection.eyebrow}</p><h2>{c.contact[0]}<br /><span>{c.contact[1]}</span></h2><p>{t.contactSection.description}</p><a className="button" href={`mailto:${EMAIL}`}>{t.contactSection.button}</a><div className="contact-email-row"><a className="contact-email text-link" href={`mailto:${EMAIL}`}>{EMAIL}<Arrow /></a><CopyButton value={EMAIL} label={c.copyEmail} successLabel={c.emailCopied} errorLabel={c.copyEmailError} /></div><div className="contact-secondary"><a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">GitHub<Arrow diagonal /></a><a className="text-link" href="/Resume_Thanaphat_Khunphet.pdf" download>{c.resume}<Arrow /></a></div></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-heading"><a className="brand" href="#home" aria-label={t.nav[0][1]}>tk<span>.</span></a><span>{t.hero.name} / Full-Stack Developer</span></div><div className="footer-columns"><div><h3>{c.navigation}</h3>{t.nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><div><h3>{c.connect}</h3><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a><a href="/Resume_Thanaphat_Khunphet.pdf" download>{c.resume}</a></div><div><h3>{t.hero.name}</h3><p>{t.contactSection.location}</p><p>{t.hero.availability}</p></div></div><div className="footer-bottom"><p>{t.footer.copyright}</p><a href="#home">{t.footer.backToTop}</a></div></div></footer>
  </>
}
export default App
