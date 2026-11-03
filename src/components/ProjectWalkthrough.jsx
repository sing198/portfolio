import { useId, useState } from 'react'
import ProjectGallery from './ProjectGallery.jsx'
import './ProjectWalkthrough.css'

const walkthroughCopy = {
  en: {
    heading: 'Try the project',
    steps: 'Walkthrough steps',
    expected: 'What to look for',
    previous: 'Previous',
    next: 'Next',
    screenshot: 'View screenshot',
    demo: 'Open live demo',
    show: 'Show walkthrough steps',
    hide: 'Hide walkthrough steps',
    status: (step, count) => `Step ${step} of ${count}`,
  },
  th: {
    heading: 'ลองใช้งานโปรเจกต์',
    steps: 'ขั้นตอนการลองใช้งาน',
    expected: 'สิ่งที่ควรเห็น',
    previous: 'ก่อนหน้า',
    next: 'ถัดไป',
    screenshot: 'ดูภาพนี้',
    demo: 'เปิด Live demo',
    show: 'แสดงขั้นตอนการลองใช้งาน',
    hide: 'ซ่อนขั้นตอนการลองใช้งาน',
    status: (step, count) => `ขั้นตอน ${step} จาก ${count}`,
  },
}

function WalkthroughArrow({ previous = false }) {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={previous ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'} /></svg>
}

export default function ProjectWalkthrough({ project, lang = 'en', onViewImage }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const headingId = useId()
  const detailId = useId()
  const copy = walkthroughCopy[lang] || walkthroughCopy.en
  const walkthrough = project.walkthrough
  const steps = walkthrough?.steps || []
  const index = Math.min(activeIndex, Math.max(steps.length - 1, 0))
  const step = steps[index]

  if (!step) return null

  const image = step.imageSrc && <img src={step.imageSrc} alt={`${project.name} — ${step.imageLabel || step.title}`} loading="lazy" />

  return <section className="project-walkthrough" aria-labelledby={headingId}>
    <div className="project-walkthrough-heading">
      <div>
        <h3 id={headingId}>{copy.heading}</h3>
        {walkthrough.intro && <p>{walkthrough.intro}</p>}
      </div>
      {project.demo && <a className="project-walkthrough-demo" href={project.demo} target="_blank" rel="noreferrer">{walkthrough.demoLabel || copy.demo}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 17 17 7M7 7h10v10" /></svg></a>}
    </div>

    <button type="button" className="project-walkthrough-toggle" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? copy.hide : copy.show}</button>

    {expanded && <>
    <div className="project-walkthrough-selectors" role="group" aria-label={`${copy.steps}: ${project.name}`}> 
      {steps.map((item, itemIndex) => <button type="button" key={item.id || itemIndex} aria-pressed={index === itemIndex} aria-controls={detailId} onClick={() => setActiveIndex(itemIndex)}>
        <span className="project-walkthrough-number" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
        <span>{item.title}</span>
      </button>)}
    </div>

    <div className="project-walkthrough-detail" id={detailId}>
      <div className="project-walkthrough-instructions">
        <h4>{step.title}</h4>
        <p>{step.instruction}</p>
        {step.expectation && <div className="project-walkthrough-expectation"><span>{copy.expected}</span><p>{step.expectation}</p></div>}
      </div>
      {image && (onViewImage ? <figure className="project-walkthrough-figure">
        <button type="button" className="project-walkthrough-image" onClick={() => onViewImage(step.imageSrc)} aria-label={`${copy.screenshot}: ${project.name} — ${step.imageLabel || step.title}`}>{image}</button>
        <figcaption><span>{step.imageLabel || step.title}</span><button type="button" onClick={() => onViewImage(step.imageSrc)}>{copy.screenshot}<WalkthroughArrow /></button></figcaption>
      </figure> : <div className="project-walkthrough-gallery">
        <ProjectGallery project={{ ...project, gallery: [{ ...(project.gallery?.find(item => item.src === step.imageSrc) || {}), src: step.imageSrc, label: step.imageLabel || step.title }] }} lang={lang} />
      </div>)}
    </div>

    <div className="project-walkthrough-footer">
      <p className="project-walkthrough-status" role="status" aria-live="polite" aria-atomic="true">{copy.status(index + 1, steps.length)}</p>
      <div className="project-walkthrough-navigation">
        <button type="button" disabled={index === 0} onClick={() => setActiveIndex(index - 1)}><WalkthroughArrow previous />{copy.previous}</button>
        <button type="button" disabled={index === steps.length - 1} onClick={() => setActiveIndex(index + 1)}>{copy.next}<WalkthroughArrow /></button>
      </div>
    </div>
    {walkthrough.note && <p className="project-walkthrough-note">{walkthrough.note}</p>}
    </>}
  </section>
}
