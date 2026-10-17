import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const CASE_PREFIX = '#case-study-'
const HISTORY_KEY = '__portfolioCaseStudy'

function readCaseStudy(hash, validRepos) {
  if (!hash.startsWith(CASE_PREFIX)) return null
  try {
    const repo = decodeURIComponent(hash.slice(CASE_PREFIX.length))
    return validRepos.has(repo) ? repo : null
  } catch {
    return null
  }
}

function historyStateWithoutCase() {
  const current = window.history.state
  const state = current && typeof current === 'object' ? { ...current } : {}
  delete state[HISTORY_KEY]
  return state
}

function createOwnerId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

export default function useCaseStudyRoute(validRepos) {
  const repoKey = validRepos.join('\u0000')
  const repositories = useMemo(() => new Set(repoKey ? repoKey.split('\u0000') : []), [repoKey])
  const [historyOwner] = useState(createOwnerId)
  const [caseStudyRepo, setCaseStudyRepo] = useState(() => (
    typeof window === 'undefined' ? null : readCaseStudy(window.location.hash, repositories)
  ))
  const openedEntries = useRef(new Map())
  const closingEntry = useRef(null)

  useEffect(() => {
    const syncRoute = () => {
      closingEntry.current = null
      setCaseStudyRepo(readCaseStudy(window.location.hash, repositories))
    }

    syncRoute()
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
    }
  }, [repositories])

  const getCaseStudyUrl = useCallback(repo => {
    if (!repositories.has(repo)) return null
    const hash = `${CASE_PREFIX}${encodeURIComponent(repo)}`
    if (typeof window === 'undefined') return hash
    const url = new URL(window.location.href)
    url.hash = hash
    return url.href
  }, [repositories])

  const openCaseStudy = useCallback(repo => {
    const url = getCaseStudyUrl(repo)
    if (!url || typeof window === 'undefined') return false

    const currentRepo = readCaseStudy(window.location.hash, repositories)
    if (currentRepo === repo) {
      setCaseStudyRepo(repo)
      return true
    }

    closingEntry.current = null
    const state = historyStateWithoutCase()
    const marker = window.history.state?.[HISTORY_KEY]

    if (currentRepo) {
      // Switching a case keeps a single modal entry in browser history.
      if (marker?.owner === historyOwner && openedEntries.current.has(marker.entryId)) {
        state[HISTORY_KEY] = { ...marker, repo }
        openedEntries.current.set(marker.entryId, repo)
      }
      window.history.replaceState(state, '', url)
    } else {
      const entryId = createOwnerId()
      openedEntries.current.set(entryId, repo)
      state[HISTORY_KEY] = { owner: historyOwner, entryId, repo }
      // pushState changes the share URL without scrolling the underlying page.
      window.history.pushState(state, '', url)
    }

    setCaseStudyRepo(repo)
    return true
  }, [getCaseStudyUrl, historyOwner, repositories])

  const closeCaseStudy = useCallback(() => {
    if (typeof window === 'undefined') return
    const repo = readCaseStudy(window.location.hash, repositories)
    if (!repo) {
      setCaseStudyRepo(null)
      return
    }

    const marker = window.history.state?.[HISTORY_KEY]
    const ownsEntry = marker?.owner === historyOwner
      && marker.repo === repo
      && openedEntries.current.get(marker.entryId) === repo

    if (ownsEntry) {
      // Native dialog close can arrive alongside a close-button callback.
      if (closingEntry.current === marker.entryId) return
      closingEntry.current = marker.entryId
      setCaseStudyRepo(null)
      window.history.back()
      return
    }

    // A direct or reloaded case URL has no known previous app entry to return to.
    const url = new URL(window.location.href)
    url.hash = `#project-${encodeURIComponent(repo)}`
    window.history.replaceState(historyStateWithoutCase(), '', url)
    setCaseStudyRepo(null)
    window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(`project-${repo}`)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }, [historyOwner, repositories])

  return { caseStudyRepo, openCaseStudy, closeCaseStudy, getCaseStudyUrl }
}
