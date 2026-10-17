import { useId, useLayoutEffect, useRef, useState } from 'react'
import './ProjectGallery.css'

const galleryCopy = {
  en: {
    screenshot: 'Application screenshot',
    views: 'Project screenshots',
    enlarge: 'Enlarge screenshot',
    close: 'Close image viewer',
    previous: 'Previous screenshot',
    next: 'Next screenshot',
    hint: 'Click to enlarge',
    keyboard: 'Use the arrow keys to browse.',
  },
  th: {
    screenshot: 'หน้าจอแอปพลิเคชัน',
    views: 'ภาพหน้าจอโปรเจกต์',
    enlarge: 'ขยายภาพหน้าจอ',
    close: 'ปิดหน้าต่างดูภาพ',
    previous: 'ภาพก่อนหน้า',
    next: 'ภาพถัดไป',
    hint: 'คลิกเพื่อขยายภาพ',
    keyboard: 'ใช้ปุ่มลูกศรเพื่อเปลี่ยนภาพ',
  },
}

function GalleryIcon({ direction }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    {direction === 'expand' ? <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /> : <path d={direction === 'previous' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'} />}
  </svg>
}

function BrowserFrame({ project, slide, copy, compact, dimensions, onImageLoad }) {
  return <div className={`portfolio-gallery-frame${compact ? ' is-compact' : ''}`}>
    <div className="portfolio-gallery-chrome" aria-hidden="true"><span /><span /><span /><small>{project.name}</small></div>
    <div className="portfolio-gallery-screen"><img src={slide.src} alt={`${project.name} — ${slide.label || copy.screenshot}`} width={dimensions?.width || slide.width || 1600} height={dimensions?.height || slide.height || 1000} loading="lazy" onLoad={onImageLoad} /></div>
  </div>
}

export default function ProjectGallery({ project, lang = 'en', compact = false }) {
  const copy = galleryCopy[lang] || galleryCopy.en
  const slides = project.gallery?.length ? project.gallery : [{ src: project.image, label: copy.screenshot }]
  const [activeIndex, setActiveIndex] = useState(0)
  const [dimensions, setDimensions] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const viewportRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()
  const index = Math.min(activeIndex, slides.length - 1)
  const slide = slides[index]
  const imageDimensions = dimensions[slide.src]

  useLayoutEffect(() => {
    if (isOpen && viewportRef.current) viewportRef.current.scrollTop = 0
  }, [slide.src, isOpen])

  const rememberDimensions = event => {
    const image = event.currentTarget
    if (!image.naturalWidth || !image.naturalHeight) return
    setDimensions(current => current[slide.src]?.width === image.naturalWidth && current[slide.src]?.height === image.naturalHeight ? current : {
      ...current, [slide.src]: { width: image.naturalWidth, height: image.naturalHeight },
    })
  }

  const openViewer = event => {
    openerRef.current = event.currentTarget
    dialogRef.current.showModal()
    setIsOpen(true)
    closeRef.current.focus()
  }

  const closeViewer = () => dialogRef.current.close()
  const restoreFocus = () => {
    setIsOpen(false)
    openerRef.current?.focus({ preventScroll: true })
  }

  const changeSlide = nextIndex => {
    setActiveIndex((nextIndex + slides.length) % slides.length)
  }

  if (compact) return <div className="portfolio-gallery is-compact"><BrowserFrame project={project} slide={slides[0]} copy={copy} compact dimensions={dimensions[slides[0].src]} /></div>

  return <div className="portfolio-gallery">
    <button type="button" className="portfolio-gallery-trigger" onClick={openViewer} aria-haspopup="dialog" aria-label={`${copy.enlarge}: ${project.name} — ${slide.label || copy.screenshot}`}>
      <BrowserFrame project={project} slide={slide} copy={copy} dimensions={imageDimensions} onImageLoad={rememberDimensions} />
      <span className="portfolio-gallery-expand" aria-hidden="true"><GalleryIcon direction="expand" /></span>
    </button>
    <div className="portfolio-gallery-caption"><span>{slide.label || copy.screenshot}</span><span className="portfolio-gallery-hint"><GalleryIcon direction="expand" />{copy.hint}</span></div>
    {slides.length > 1 && <div className="portfolio-gallery-views" role="group" aria-label={`${copy.views}: ${project.name}`}>
      {slides.map((item, itemIndex) => <button type="button" key={`${item.src}-${itemIndex}`} aria-pressed={index === itemIndex} onClick={() => changeSlide(itemIndex)}>{item.label || `${copy.screenshot} ${itemIndex + 1}`}</button>)}
    </div>}
    <dialog className="portfolio-gallery-dialog" ref={dialogRef} aria-labelledby={titleId} onClose={restoreFocus} onClick={event => { if (event.target === event.currentTarget) closeViewer() }} onKeyDown={event => {
      if (slides.length < 2 || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        changeSlide(index + (event.key === 'ArrowRight' ? 1 : -1))
      }
    }}>
      <div className="portfolio-gallery-dialog-header"><div><p id={titleId}>{project.name}</p><span>{slide.label || copy.screenshot}</span></div><button type="button" className="portfolio-gallery-close" ref={closeRef} onClick={closeViewer} aria-label={copy.close}><span aria-hidden="true">×</span></button></div>
      <div className="portfolio-gallery-image-viewport" ref={viewportRef} tabIndex="0" role="region" aria-label={`${project.name} — ${slide.label || copy.screenshot}`}>
        {isOpen && <img key={slide.src} src={slide.src} alt={`${project.name} — ${slide.label || copy.screenshot}`} width={imageDimensions?.width || slide.width || 1600} height={imageDimensions?.height || slide.height || 1000} onLoad={rememberDimensions} />}
      </div>
      <div className="portfolio-gallery-dialog-footer">
        <span className="portfolio-gallery-keyboard">{slides.length > 1 ? copy.keyboard : copy.screenshot}</span>
        <div className="portfolio-gallery-pagination">
          {slides.length > 1 && <button type="button" onClick={() => changeSlide(index - 1)} aria-label={copy.previous}><GalleryIcon direction="previous" /></button>}
          <span aria-live="polite" aria-atomic="true">{index + 1} / {slides.length}</span>
          {slides.length > 1 && <button type="button" onClick={() => changeSlide(index + 1)} aria-label={copy.next}><GalleryIcon direction="next" /></button>}
        </div>
      </div>
    </dialog>
  </div>
}
