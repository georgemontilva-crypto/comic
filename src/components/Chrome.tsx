import { useEffect, useRef, useState } from 'react'
import { gsap, lockScroll, reduced, scrollToEl } from '../lib/motion'
import { sound } from '../lib/sound'
import { comic } from '../data/comic'
import { Static } from './Static'

/** Reloj atascado en las 3:33. Solo avanzan los segundos. */
export function Clock() {
  const [s, setS] = useState(() => new Date().getSeconds())
  useEffect(() => {
    const id = window.setInterval(() => setS(new Date().getSeconds()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return <span className="clock">03:33:{String(s).padStart(2, '0')}</span>
}

/** Intro: sintonizando. Cuenta 0→100 y se apaga como un tubo. */
export function Preloader({ canFinish, onDone }: { canFinish: boolean; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const [counted, setCounted] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    lockScroll(true)
    let seen = false
    try {
      seen = sessionStorage.getItem('ms-seen') === '1'
      sessionStorage.setItem('ms-seen', '1')
    } catch {
      /* almacenamiento no disponible */
    }
    const state = { v: 0 }
    const tween = gsap.to(state, {
      v: 100,
      duration: reduced ? 0.01 : seen ? 0.6 : 1.7,
      ease: 'power2.inOut',
      onUpdate: () => setN(Math.round(state.v)),
      onComplete: () => setCounted(true),
    })
    return () => {
      tween.kill()
    }
  }, [])

  useEffect(() => {
    if (!counted || !canFinish || !root.current) return
    const screen = root.current.querySelector('.pre__screen')
    const tl = gsap.timeline()
    if (!reduced) {
      tl.to(screen, { scaleY: 0.006, filter: 'brightness(4)', duration: 0.26, ease: 'power4.in' }).to(screen, {
        scaleX: 0,
        duration: 0.2,
        ease: 'power4.in',
      })
    }
    tl.add(() => {
      lockScroll(false)
      onDone()
    })
      .to(root.current, { autoAlpha: 0, duration: reduced ? 0.01 : 0.4 })
      .add(() => setGone(true))
    return () => {
      tl.kill()
    }
  }, [counted, canFinish, onDone])

  if (gone) return null
  return (
    <div className="pre" ref={root} role="status" aria-label="Cargando">
      <div className="pre__screen">
        <Static />
        <div className="pre__box">
          <p className="pre__label osd">Sintonizando canal {comic.channel}</p>
          <p className="pre__n">{String(n).padStart(3, '0')}</p>
          <p className="pre__label osd pre__label--dim">No ajuste su televisor</p>
        </div>
      </div>
    </div>
  )
}

/** Capas fijas: líneas de barrido, grano y viñeta. */
export function Fx() {
  return (
    <div className="fx" aria-hidden="true">
      <div className="fx__grain" />
      <div className="fx__scan" />
      <div className="fx__vig" />
    </div>
  )
}

/** Cursor propio. Solo en dispositivos con ratón. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3' })
    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      el.classList.add('is-on')
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button')
      el.classList.toggle('is-hover', !!t)
      setLabel(t?.getAttribute('data-cursor') || '')
    }
    const leave = () => el.classList.remove('is-on')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className={`cursor ${label ? 'has-label' : ''}`} ref={ref} aria-hidden="true">
      <div className="cursor__dot" />
      <span className="cursor__label osd">{label}</span>
    </div>
  )
}

const links = [
  ['Sinopsis', '#sinopsis'],
  ['Elenco', '#elenco'],
  ['Portada', '#portada'],
  ['Programación', '#programacion'],
] as const

export function Nav() {
  const [on, setOn] = useState(sound.on)
  useEffect(() => sound.subscribe(setOn), [])

  const go = (e: React.MouseEvent, target: string) => {
    e.preventDefault()
    scrollToEl(target)
  }

  return (
    <header className="nav">
      <a className="nav__logo" href="#top" onClick={(e) => go(e, '#top')} aria-label="Mala Señal, inicio">
        MALA<b>SEÑAL</b>
      </a>
      <nav className="nav__links" aria-label="Secciones">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={(e) => go(e, href)}>
            {label}
          </a>
        ))}
      </nav>
      <button className="nav__sound osd" onClick={() => sound.toggle()} aria-pressed={on} data-cursor={on ? 'SHH' : 'SUBE'}>
        <i className={on ? 'is-on' : ''} aria-hidden="true" />
        Sonido: {on ? 'on' : 'off'}
      </button>
    </header>
  )
}

/** Si nadie toca nada en un rato, el canal pregunta. */
export function IdleBump({ after = 45000 }: { after?: number }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let t = 0
    const reset = () => {
      setShow(false)
      window.clearTimeout(t)
      t = window.setTimeout(() => setShow(true), after)
    }
    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }))
    reset()
    return () => {
      window.clearTimeout(t)
      events.forEach((ev) => window.removeEventListener(ev, reset))
    }
  }, [after])

  if (!show) return null
  return (
    <div className="idle" role="dialog" aria-label="¿Sigues ahí?">
      <div className="bump__inner">
        <p>¿sigues ahí?</p>
        <p>la señal sí.</p>
        <span className="bump__sig osd">mueve algo para continuar</span>
      </div>
    </div>
  )
}
