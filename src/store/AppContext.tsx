import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BY_ID } from '../data'
import { grade, score } from '../lib/grading'
import type { HistoryItem } from '../lib/sets'
import { load, save, remove } from '../lib/storage'
import { rng, shuffle } from '../lib/shuffle'
import type { Answer, Mode, Session, Settings, WrongEntry } from '../types'

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  palette: 'ocean',
  secondsPerQuestion: 60,
  shuffleQuestions: true,
  shuffleOptions: true,
  wrongStreakToClear: 2,
  instantFeedback: true,
}

interface Ctx {
  settings: Settings
  setSettings: (p: Partial<Settings>) => void
  session: Session | null
  history: HistoryItem[]
  wrong: Record<string, WrongEntry>
  seen: string[]
  startSession: (title: string, ids: string[], mode: Mode) => void
  setAnswer: (id: string, a: Answer) => void
  toggleFlag: (id: string) => void
  reveal: (id: string) => void
  goTo: (i: number) => void
  tick: (ms: number) => void
  setPaused: (p: boolean) => void
  submit: () => void
  discardSession: () => void
  /** last submitted session kept for the result page */
  lastResult: Session | null
  resetAll: () => void
  /** start a new round: forget which questions were seen, keep history and wrong book */
  resetSeen: () => void
  reloadFromStorage: () => void
}

const AppCtx = createContext<Ctx | null>(null)

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside provider')
  return c
}

function applyTheme(t: Settings['theme']) {
  const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(() => ({ ...DEFAULT_SETTINGS, ...load('settings', {}) }))
  const [session, setSession] = useState<Session | null>(() => load<Session | null>('session', null))
  const [lastResult, setLastResult] = useState<Session | null>(() => load<Session | null>('last', null))
  const [history, setHistory] = useState<HistoryItem[]>(() => load('history', []))
  const [wrong, setWrong] = useState<Record<string, WrongEntry>>(() => load('wrong', {}))
  const [seen, setSeen] = useState<string[]>(() => load('seen', []))

  useEffect(() => {
    applyTheme(settings.theme)
    document.documentElement.dataset.palette = settings.palette
    save('settings', settings)
    if (settings.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const h = () => applyTheme('system')
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [settings])

  const persistSession = useCallback((s: Session | null) => {
    if (s) save('session', s)
    else remove('session')
  }, [])

  const update = useCallback(
    (fn: (s: Session) => Session) => {
      setSession((prev) => {
        if (!prev || prev.submitted) return prev
        const next = fn(prev)
        persistSession(next)
        return next
      })
    },
    [persistSession],
  )

  const startSession: Ctx['startSession'] = (title, ids, mode) => {
    const seed = Date.now() % 2147483647
    const rand = rng(seed)
    const ordered = settings.shuffleQuestions ? shuffle(ids, rand) : ids
    const orders: Record<string, string[]> = {}
    for (const id of ordered) {
      const q = BY_ID[id]
      if (q.type === 'single') {
        const all = [q.answer, ...q.distractors]
        orders[id] = settings.shuffleOptions ? shuffle(all, rand) : all
      } else if (q.type === 'multi') {
        const all = [...q.answers, ...q.distractors]
        orders[id] = settings.shuffleOptions ? shuffle(all, rand) : all
      } else if (q.type === 'ordering') {
        orders[id] = shuffle(q.items, rand)
      } else if (q.type === 'matching') {
        orders[id] = shuffle(
          q.right.map((_, i) => String(i)),
          rand,
        )
      }
    }
    const s: Session = {
      id: String(Date.now()),
      title,
      mode,
      questionIds: ordered,
      answers: {},
      orders,
      flagged: [],
      revealed: [],
      current: 0,
      startedAt: Date.now(),
      elapsedMs: 0,
      limitMs: mode === 'exam' ? ordered.length * settings.secondsPerQuestion * 1000 : null,
      paused: false,
      submitted: false,
    }
    setSession(s)
    persistSession(s)
  }

  const submit = () => {
    if (!session || session.submitted) return
    const done: Session = { ...session, submitted: true, submittedAt: Date.now() }
    const wr = { ...wrong }
    const perPart: HistoryItem['perPart'] = {}
    let points = 0
    for (const id of done.questionIds) {
      const q = BY_ID[id]
      const r = grade(q, done.answers[id])
      const p = score(r)
      points += p
      const pp = (perPart[q.part] ??= { total: 0, points: 0 })
      pp.total++
      pp.points += p
      if (r === 'wrong' || r === 'partial' || r === 'unanswered') {
        if (r === 'unanswered') continue
        const e = wr[id] ?? { wrongCount: 0, streak: 0, lastSeen: 0 }
        wr[id] = { wrongCount: e.wrongCount + 1, streak: 0, lastSeen: Date.now() }
      } else if (r === 'correct' && wr[id]) {
        const streak = wr[id].streak + 1
        if (streak >= settings.wrongStreakToClear) delete wr[id]
        else wr[id] = { ...wr[id], streak, lastSeen: Date.now() }
      }
    }
    const item: HistoryItem = {
      id: done.id,
      title: done.title,
      at: Date.now(),
      total: done.questionIds.length,
      points,
      durationMs: done.elapsedMs,
      perPart,
    }
    const hist = [item, ...history].slice(0, 200)
    const sn = [...new Set([...seen, ...done.questionIds])]
    setWrong(wr)
    setHistory(hist)
    setSeen(sn)
    save('wrong', wr)
    save('history', hist)
    save('seen', sn)
    save('last', done)
    setLastResult(done)
    setSession(null)
    persistSession(null)
  }

  const value: Ctx = useMemo(
    () => ({
      settings,
      setSettings: (p) => setSettingsState((s) => ({ ...s, ...p })),
      session,
      history,
      wrong,
      seen,
      startSession,
      setAnswer: (id, a) => update((s) => ({ ...s, answers: { ...s.answers, [id]: a } })),
      toggleFlag: (id) =>
        update((s) => ({
          ...s,
          flagged: s.flagged.includes(id) ? s.flagged.filter((x) => x !== id) : [...s.flagged, id],
        })),
      reveal: (id) => update((s) => (s.revealed.includes(id) ? s : { ...s, revealed: [...s.revealed, id] })),
      goTo: (i) => update((s) => ({ ...s, current: Math.max(0, Math.min(s.questionIds.length - 1, i)) })),
      tick: (ms) => update((s) => (s.paused ? s : { ...s, elapsedMs: s.elapsedMs + ms })),
      setPaused: (p) => update((s) => ({ ...s, paused: p })),
      submit,
      discardSession: () => {
        setSession(null)
        persistSession(null)
      },
      lastResult,
      resetSeen: () => {
        remove('seen')
        setSeen([])
      },
      resetAll: () => {
        for (const k of ['session', 'last', 'history', 'wrong', 'seen']) remove(k)
        setSession(null)
        setLastResult(null)
        setHistory([])
        setWrong({})
        setSeen([])
      },
      reloadFromStorage: () => {
        setSettingsState({ ...DEFAULT_SETTINGS, ...load('settings', {}) })
        setSession(load('session', null))
        setLastResult(load('last', null))
        setHistory(load('history', []))
        setWrong(load('wrong', {}))
        setSeen(load('seen', []))
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings, session, history, wrong, seen, lastResult],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
