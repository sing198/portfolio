import { useEffect, useRef } from 'react'

export default function DotBackground() {
  const backgroundRef = useRef(null)

  useEffect(() => {
    const element = backgroundRef.current
    const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let previousTime = 0
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0

    const animate = (time) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16
      previousTime = time
      const easing = 1 - Math.exp(-elapsed / 110)
      x += (targetX - x) * easing
      y += (targetY - y) * easing
      element.style.setProperty('--grid-x', `${x.toFixed(2)}px`)
      element.style.setProperty('--grid-y', `${y.toFixed(2)}px`)
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.05) {
        frame = requestAnimationFrame(animate)
      } else {
        frame = 0
        previousTime = 0
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(animate)
    }
    const move = (event) => {
      if (!motion.matches || event.pointerType !== 'mouse') return
      targetX = (event.clientX / window.innerWidth - 0.5) * 28
      targetY = (event.clientY / window.innerHeight - 0.5) * 28
      element.style.setProperty('--pointer-x', `${event.clientX}px`)
      element.style.setProperty('--pointer-y', `${event.clientY}px`)
      element.style.setProperty('--pointer-visible', '1')
      schedule()
    }
    const reset = () => {
      targetX = 0
      targetY = 0
      element.style.setProperty('--pointer-visible', '0')
      if (motion.matches && !document.hidden) {
        schedule()
      } else {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = 0
        x = y = 0
        element.style.setProperty('--grid-x', '0px')
        element.style.setProperty('--grid-y', '0px')
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('resize', reset)
    document.addEventListener('visibilitychange', reset)
    motion.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('resize', reset)
      document.removeEventListener('visibilitychange', reset)
      motion.removeEventListener('change', reset)
    }
  }, [])

  return <div className="dot-background" ref={backgroundRef} aria-hidden="true"><div className="dot-background-grid" /><div className="dot-background-glow" /></div>
}
