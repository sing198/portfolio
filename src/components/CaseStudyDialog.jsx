import { useEffect, useId, useRef } from 'react'
import CopyButton from './CopyButton'
import ArchitectureDiagram from './ArchitectureDiagram'
import ProjectWalkthrough from './ProjectWalkthrough'
import './CaseStudyDialog.css'

function ExternalArrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 18 18 6M6 6h12v12" /></svg>
}

export default function CaseStudyDialog({ project, lang, onClose, shareUrl }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const headingId = useId()
  const descriptionId = useId()
  const study = project.caseStudy
  const labels = lang === 'th' ? {
    eyebrow: 'เบื้องหลังโปรเจกต์', close: 'ปิดกรณีศึกษา', context: 'บริบท',
    contribution: 'สิ่งที่รับผิดชอบ', challenge: 'โจทย์ที่ต้องแก้',
    decisions: 'การตัดสินใจในการพัฒนา', outcome: 'ผลและการตรวจสอบ',
    evidence: 'หลักฐานจากโปรเจกต์', limits: 'ขั้นตอนถัดไป',
    code: 'ดูซอร์สโค้ด', demo: 'ลองใช้งาน',
    copy: 'คัดลอกลิงก์', copied: 'คัดลอกลิงก์แล้ว', copyError: 'คัดลอกไม่สำเร็จ กรุณาคัดลอก URL ของหน้านี้',
  } : {
    eyebrow: 'Behind the project', close: 'Close case study', context: 'Context',
    contribution: 'My contribution', challenge: 'The challenge',
    decisions: 'Development decisions', outcome: 'Results & validation',
    evidence: 'Project evidence', limits: 'What I would build next',
    code: 'Read the code', demo: 'Live demo',
    copy: 'Copy link', copied: 'Link copied', copyError: 'Couldn’t copy. Copy this page’s URL.',
  }

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    closeRef.current.focus()
    return () => { if (dialog.open) dialog.close() }
  }, [])

  const close = () => dialogRef.current.close()

  return <dialog
    ref={dialogRef}
    className="case-study-dialog"
    aria-labelledby={headingId}
    aria-describedby={descriptionId}
    onClose={() => { if (!dialogRef.current?.open) onClose() }}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
    }}
  >
    <div className="case-study-panel">
      <div className="case-study-toolbar">
        <p>{labels.eyebrow}</p>
        <div className="case-study-toolbar-actions">
        <CopyButton value={shareUrl} label={labels.copy} successLabel={labels.copied} errorLabel={labels.copyError} />
        <button ref={closeRef} className="case-study-close" type="button" onClick={close} aria-label={labels.close}>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
        </div>
      </div>
      <div className="case-study-body">
        <header className="case-study-intro">
          <p className="case-study-kicker">{project.type}</p>
          <h2 id={headingId}>{project.name}</h2>
          <p className="case-study-description" id={descriptionId}>{project.description}</p>
          <div className="case-study-facts">
            {project.context && <div><h3>{labels.context}</h3><p>{project.context}</p></div>}
            {(project.contribution || study.role) && <div><h3>{labels.contribution}</h3>{study.role && <p className="case-study-role">{study.role}</p>}{project.contribution && <p>{project.contribution}</p>}</div>}
          </div>
        </header>
        <section className="case-study-section">
          <h3>{labels.challenge}</h3>
          <p>{study.challenge}</p>
        </section>
        <section className="case-study-section">
          <h3>{labels.decisions}</h3>
          <ol className="case-study-decisions">
            {study.decisions.map((decision, index) => <li key={decision.title}>
              <span className="case-study-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div><h4>{decision.title}</h4><p>{decision.detail}</p></div>
            </li>)}
          </ol>
        </section>
        <ProjectWalkthrough project={project} lang={lang} />
        <ArchitectureDiagram architecture={study.architecture} lang={lang} />
        <section className="case-study-section case-study-outcome">
          <div><h3>{labels.outcome}</h3><p>{study.outcome}</p></div>
          {study.evidence?.length > 0 && <div className="case-study-evidence"><h3>{labels.evidence}</h3><ul>{study.evidence.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}<ExternalArrow /></a></li>)}</ul></div>}
        </section>
        {study.limits && <aside className="case-study-limits"><h3>{labels.limits}</h3><p>{study.limits}</p></aside>}
        <footer className="case-study-footer">
          <div className="case-study-actions">
            <a className="case-study-action" href={`https://github.com/sing198/${project.repo}`} target="_blank" rel="noreferrer">{labels.code}<ExternalArrow /></a>
            {project.demo && <a className="case-study-action is-primary" href={project.demo} target="_blank" rel="noreferrer">{labels.demo}<ExternalArrow /></a>}
          </div>
          {project.demoNote && <p>{project.demoNote}</p>}
        </footer>
      </div>
    </div>
  </dialog>
}
