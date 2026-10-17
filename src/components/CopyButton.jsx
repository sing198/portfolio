import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './CopyButton.css'

function copyWithSelection(text) {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false

  const previousFocus = document.activeElement
  const host = previousFocus?.closest('dialog[open]')
    ?? document.querySelector('dialog[open]')
    ?? document.body
  const selection = document.getSelection()
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : []
  let inputSelection
  if (previousFocus instanceof HTMLInputElement || previousFocus instanceof HTMLTextAreaElement) {
    inputSelection = {
      start: previousFocus.selectionStart,
      end: previousFocus.selectionEnd,
      direction: previousFocus.selectionDirection,
    }
  }

  const field = document.createElement('textarea')
  field.value = text
  field.readOnly = true
  field.tabIndex = -1
  field.setAttribute('aria-hidden', 'true')
  Object.assign(field.style, {
    position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', opacity: '0',
  })

  try {
    // The rest of the document is inert while a native modal is open.
    host.append(field)
    field.focus({ preventScroll: true })
    field.select()
    field.setSelectionRange(0, text.length)
    return document.execCommand('copy') === true
  } catch {
    return false
  } finally {
    field.remove()
    try {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
        if (inputSelection?.start !== null && inputSelection?.start !== undefined) {
          previousFocus.setSelectionRange(inputSelection.start, inputSelection.end, inputSelection.direction)
        }
      }
      if (selection) {
        selection.removeAllRanges()
        for (const range of ranges) {
          if (range.commonAncestorContainer.isConnected) selection.addRange(range)
        }
      }
    } catch {
      // A focus target or selected range can become unavailable during a copy.
    }
  }
}

function CopyIcon({ copied }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {copied ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>}
    </svg>
  )
}

export default function CopyButton({ value, label, successLabel, errorLabel, className = '' }) {
  const [state, setState] = useState('idle')
  const requestRef = useRef(0)
  const timerRef = useRef(null)
  const mountedRef = useRef(false)
  const buttonRef = useRef(null)
  const restoreButtonFocusRef = useRef(false)
  const text = String(value ?? '')

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      requestRef.current += 1
      clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    requestRef.current += 1
    clearTimeout(timerRef.current)
    setState('idle')
  }, [text])

  useLayoutEffect(() => {
    if (state === 'pending' || !restoreButtonFocusRef.current) return
    restoreButtonFocusRef.current = false
    // Disabling a focused button can move focus to the page. Keep keyboard users
    // at the copy action, but do not move focus if they have chosen another control.
    if (document.activeElement === document.body) buttonRef.current?.focus({ preventScroll: true })
  }, [state])

  async function handleCopy() {
    if (!text || state === 'pending') return
    clearTimeout(timerRef.current)
    const request = ++requestRef.current
    const isCurrent = () => mountedRef.current && request === requestRef.current
    restoreButtonFocusRef.current = document.activeElement === buttonRef.current
    setState('pending')

    let copied = false
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        copied = true
      }
    } catch {
      // Some browsers deny clipboard permission but still permit a user-initiated copy.
    }
    if (!isCurrent()) return
    if (!copied) copied = copyWithSelection(text)
    if (!isCurrent()) return

    setState(copied ? 'success' : 'error')
    timerRef.current = setTimeout(() => {
      if (isCurrent()) setState('idle')
    }, copied ? 3000 : 5000)
  }

  const feedback = state === 'success' ? successLabel : state === 'error' ? errorLabel : ''
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`copy-button ${className}`.trim()}
        data-copy-state={state}
        disabled={state === 'pending' || !text}
        aria-busy={state === 'pending'}
        onClick={handleCopy}
      >
        <CopyIcon copied={state === 'success'} />
        <span>{feedback || label}</span>
      </button>
      <span className="copy-button-status" role="status" aria-live="polite" aria-atomic="true">{feedback}</span>
    </>
  )
}
