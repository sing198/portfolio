import { useEffect, useId, useRef } from 'react'
import { GITHUB } from '../translations'
import CopyButton from './CopyButton'
import ArchitectureDiagram from './ArchitectureDiagram'
import ProjectGallery from './ProjectGallery'
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
  const outcomeId = useId()
  const galleryId = useId()
  const study = project.caseStudy
  const context = project.context || project.type
  const labels = lang === 'th' ? {
    caseStudy: 'กรณีศึกษา', close: 'ปิดกรณีศึกษา', challenge: 'โจทย์ที่ต้องแก้',
    decisions: 'การตัดสินใจในการพัฒนา', outcome: 'ผลและการตรวจสอบ',
    evidence: 'หลักฐานจากโปรเจกต์', details: 'รายละเอียดผลทดสอบ', stack: 'เทคโนโลยีที่ใช้', gallery: 'ภาพตัวอย่างโปรเจกต์', limits: 'ขั้นตอนถัดไป',
    code: 'ดูซอร์สโค้ด', demo: 'ลองใช้งาน',
    copy: 'คัดลอกลิงก์', copied: 'คัดลอกลิงก์แล้ว', copyError: 'คัดลอกไม่สำเร็จ กรุณาคัดลอก URL ของหน้านี้',
  } : {
    caseStudy: 'Case study', close: 'Close case study', challenge: 'The challenge',
    decisions: 'Development decisions', outcome: 'Results & validation',
    evidence: 'Project evidence', details: 'Full validation details', stack: 'Tech stack', gallery: 'Project gallery', limits: 'What I would build next',
    code: 'Source code', demo: 'Live demo',
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
        <p>{labels.caseStudy}</p>
        <div className="case-study-toolbar-actions">
          <CopyButton value={shareUrl} label={labels.copy} successLabel={labels.copied} errorLabel={labels.copyError} />
          <button ref={closeRef} className="case-study-close" type="button" onClick={close} aria-label={labels.close}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
      </div>
      <div className="case-study-body">
        <header className="case-study-intro">
          {context && <p className="case-study-context">{context}</p>}
          <h2 id={headingId}>{project.name}</h2>
          <p className="case-study-description" id={descriptionId}>{project.description}</p>
          {study.role && <p className="case-study-role">{study.role}</p>}
          {project.contribution && <p className="case-study-role">{project.contribution}</p>}
        </header>
        <section className="case-study-outcome" aria-labelledby={outcomeId}>
          <div className="case-study-result">
            <h3 id={outcomeId}>{labels.outcome}</h3>
            <p>{study.outcomeSummary || study.outcome}</p>
            <div className="case-study-actions">
              {project.demo && <a className="case-study-action is-primary" href={project.demo} target="_blank" rel="noreferrer">{labels.demo}<ExternalArrow /></a>}
              <a className="case-study-action" href={`${GITHUB}/${project.repo}`} target="_blank" rel="noreferrer">{labels.code}<ExternalArrow /></a>
            </div>
            {project.demoNote && <p className="case-study-demo-note">{project.demoNote}</p>}
            {study.outcomeSummary && <details className="case-study-outcome-details">
              <summary>{labels.details}</summary>
              <p>{study.outcome}</p>
            </details>}
          </div>
          {study.evidence?.length > 0 && <div className="case-study-evidence">
            <h4>{labels.evidence}</h4>
            <ul role="list">{study.evidence.map(source => <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer">{source.label}<ExternalArrow /></a>
            </li>)}</ul>
          </div>}
        </section>
        <section className="case-study-section">
          <h3>{labels.challenge}</h3>
          <p>{study.challenge}</p>
        </section>
        <section className="case-study-section">
          <h3>{labels.decisions}</h3>
          <ul className="case-study-decisions" role="list">
            {study.decisions.map(decision => <li key={decision.title}>
              <h4>{decision.title}</h4>
              <p>{decision.detail}</p>
            </li>)}
          </ul>
          {project.tags?.length > 0 && <div className="case-study-stack">
            <h4>{labels.stack}</h4>
            <ul className="tags" role="list">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
          </div>}
        </section>
        {(project.gallery?.length > 0 || project.image) && <section className={`case-study-section case-study-gallery ${project.theme}`} aria-labelledby={galleryId}>
          <h3 id={galleryId}>{labels.gallery}</h3>
          <ProjectGallery project={project} lang={lang} />
        </section>}
        <ProjectWalkthrough project={project} lang={lang} />
        <ArchitectureDiagram architecture={study.architecture} lang={lang} />
        {study.limits && <aside className="case-study-limits"><h3>{labels.limits}</h3><p>{study.limits}</p></aside>}
      </div>
    </div>
  </dialog>
}
