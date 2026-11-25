import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap, reduced, ScrollTrigger, scrollToEl, scrollToY } from '../lib/motion'
import { sound } from '../lib/sound'
import { characters, comic, issues } from '../data/comic'
import { Clock } from './Chrome'
import { Portrait } from './Portraits'
import { ShaderCanvas } from './ShaderCanvas'
import { Static } from './Static'

const css = (vars: Record<string, string | number>) => vars as CSSProperties
const byId = (id: string) => characters.find((c) => c.id === id) ?? characters[0]

/* ---------------------------------------------------------------- HERO */

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ready || reduced || !root.current) return
    const ctx = gsap.context(() => {
      gsap.from('.hero__line', {
        yPercent: 45,
        autoAlpha: 0,
        skewY: 7,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.13,
        delay: 0.2,
      })
      gsap.from('[data-hero]', { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, delay: 0.65 })
    }, root)
    return () => ctx.revert()
  }, [ready])

  const [a, b] = comic.title

  return (
    <section className="hero" id="top" ref={root}>
      <ShaderCanvas className="hero__gl" />
      <div className="hero__osd osd" data-hero>
        <span>
          <i className="rec" aria-hidden="true" /> Rec · CH {comic.channel}
        </span>
        <span className="hide-s">Señal: mala ▂▃▅</span>
        <span>
          <Clock /> a. m.
        </span>
      </div>

      <h1 className="hero__title" aria-label={`${a} ${b}`}>
        <span className="hero__line glitch" data-text={a} aria-hidden="true">
          {a}
        </span>
        <span className="hero__line hero__line--b glitch" data-text={b} aria-hidden="true">
          {b}
        </span>
      </h1>

      <div className="hero__foot">
        <div className="hero__copy">
          <p className="hero__tagline" data-hero>
            {comic.tagline}
          </p>
          <p className="hero__lead" data-hero>
            {comic.lead}
          </p>
          <div className="hero__cta" data-hero>
            <a
              className="btn"
              href="#elenco"
              data-cursor="CH+"
              onClick={(e) => {
                e.preventDefault()
                scrollToEl('#elenco')
              }}
            >
              Conoce al elenco
            </a>
            <a
              className="btn btn--ghost"
              href="#programacion"
              onClick={(e) => {
                e.preventDefault()
                scrollToEl('#programacion')
              }}
            >
              Programación
            </a>
          </div>
        </div>

        <div className="badge" data-hero aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <defs>
              <path id="badge-circle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
            </defs>
            <g className="badge__spin">
              <text>
                <textPath href="#badge-circle" textLength="486">
                  NÚMERO UNO ✦ MUY PRONTO ✦ NÚMERO UNO ✦ MUY PRONTO ✦
                </textPath>
              </text>
            </g>
            <circle cx="100" cy="100" r="54" />
            <text className="badge__n" x="100" y="121" textAnchor="middle">
              #1
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- BANDAS */

function Track({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div className="band__track" aria-hidden={hidden || undefined}>
      {[...items, ...items].map((t, i) => (
        <span key={i}>
          {t} <b>✦</b>
        </span>
      ))}
    </div>
  )
  return (
    <>
      {row(false)}
      {row(true)}
    </>
  )
}

export function Bands() {
  return (
    <div className="bands" aria-hidden="true">
      <div className="band band--a">
        <Track items={comic.marqueeA} />
      </div>
      <div className="band band--b">
        <Track items={comic.marqueeB} />
      </div>
    </div>
  )
}

/* --------------------------------------------------------- INTERSTICIO */

export function Bump({ lines }: { lines: string[] }) {
  return (
    <section className="bump">
      <div className="bump__inner" data-type>
        {lines.map((l) => (
          <p key={l} data-type-line>
            {l}
          </p>
        ))}
        <span className="bump__sig osd">— mala señal · canal {comic.channel} —</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ SINOPSIS */

export function Synopsis() {
  return (
    <section className="section synopsis" id="sinopsis">
      <header className="sec-head">
        <span className="tag">01 / Sinopsis</span>
      </header>
      <p className="synopsis__text" data-scrub-words>
        {comic.synopsis}
      </p>
      <ul className="facts">
        {comic.facts.map((f, i) => (
          <li key={f.label} data-reveal data-delay={i * 0.08}>
            <b data-counter={f.value}>{f.value}</b>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------------- ELENCO */

export function Cast() {
  const N = characters.length
  const wrap = useRef<HTMLElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [i, setI] = useState(0)
  const first = useRef(true)

  useEffect(() => {
    if (!wrap.current) return
    const trigger = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const n = Math.min(N - 1, Math.floor(self.progress * N))
        setI((prev) => (prev === n ? prev : n))
      },
    })
    st.current = trigger
    return () => trigger.kill()
  }, [N])

  const go = (n: number) => {
    const t = st.current
    if (!t) return
    const k = Math.max(0, Math.min(N - 1, n))
    scrollToY(t.start + ((k + 0.5) / N) * (t.end - t.start))
  }

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    sound.burst()
  }, [i])

  // ← → cambian de canal mientras la sección está en pantalla
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!st.current?.isActive) return
      if (e.key === 'ArrowRight') go(i + 1)
      if (e.key === 'ArrowLeft') go(i - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const ch = characters[i]
  const num = String(i + 1).padStart(2, '0')

  return (
    <section className="cast" id="elenco" ref={wrap} style={css({ '--n': N, '--c': ch.color })}>
      <div className="cast__sticky">
        <div className="cast__bg" aria-hidden="true">
          <span key={i}>{num}</span>
        </div>

        <header className="cast__head">
          <span className="tag">02 / El elenco</span>
          <span className="cast__count osd">
            CH {num} / {String(N).padStart(2, '0')}
          </span>
        </header>

        <div className="cast__stage">
          <div className="tv">
            <div className="tv__screen">
              <Portrait key={ch.id} character={ch} className="tv__img" />
              <Static key={i} className="tv__static" />
              <span className="tv__osd">CH {num}</span>
              <span className="tv__name osd">{ch.alias}</span>
            </div>
            <div className="tv__knobs" aria-hidden="true">
              <i />
              <i />
              <span />
            </div>
          </div>

          <div className="cast__info" key={ch.id} aria-live="polite">
            <p className="cast__role">{ch.role}</p>
            <h3 className="cast__name">{ch.name}</h3>
            <p className="cast__bio">{ch.bio}</p>
            <blockquote className="cast__quote">«{ch.quote}»</blockquote>
            <ul className="cast__stats">
              {ch.stats.map((s) => (
                <li key={s.label}>
                  <span>{s.label}</span>
                  <i style={css({ '--v': s.value / 100 })} />
                  <b>{s.value}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className="cast__channels" aria-label="Personajes">
          {characters.map((c, n) => (
            <button
              key={c.id}
              onClick={() => go(n)}
              aria-current={n === i ? 'true' : undefined}
              aria-label={`Canal ${n + 1}: ${c.name}`}
              style={css({ '--c': c.color })}
              data-cursor="ZAP"
            >
              <span>{String(n + 1).padStart(2, '0')}</span>
              <em>{c.name}</em>
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ ADELANTO */

export function Pages() {
  return (
    <section className="section pages" id="adelanto">
      <header className="sec-head">
        <span className="tag">03 / Adelanto</span>
        <h2 className="h2" data-split>
          Páginas que no deberías estar viendo
        </h2>
      </header>

      <div className="page-grid">
        <figure className="panel panel--a" data-panel>
          <div className="panel__art" data-parallax="6">
            <Portrait character={byId('pastor')} />
          </div>
          <p className="caption">Canal 33. 3:33 a. m.</p>
          <figcaption className="balloon balloon--br">Hermanos, la señal nos eligió.</figcaption>
        </figure>

        <figure className="panel panel--b" data-panel>
          <span className="sfx">¡KRZZT!</span>
        </figure>

        <figure className="panel panel--c" data-panel>
          <div className="panel__art" data-parallax="8">
            <Portrait character={byId('babas')} />
          </div>
          <figcaption className="balloon balloon--tl">*eructo*</figcaption>
        </figure>

        <figure className="panel panel--d" data-panel>
          <div className="panel__art" data-parallax="8">
            <Portrait character={byId('hueso')} />
          </div>
          <figcaption className="balloon balloon--bl">Le falta el 33-B.</figcaption>
        </figure>

        <figure className="panel panel--e" data-panel>
          <div className="panel__art" data-parallax="10">
            <Portrait character={byId('greta')} />
          </div>
          <p className="caption">Mientras tanto, alguien intenta apagar la tele…</p>
          <figcaption className="balloon balloon--br">No estoy enojada. Estoy cargada.</figcaption>
        </figure>
      </div>
      <p className="pages__note osd">Página de muestra · arte provisional</p>
    </section>
  )
}

/* -------------------------------------------------------- PROGRAMACIÓN */

export function Schedule() {
  return (
    <section className="section schedule" id="programacion">
      <header className="sec-head">
        <span className="tag">04 / Programación</span>
        <h2 className="h2" data-split>
          Esta noche y todas las noches
        </h2>
      </header>
      <ol className="guide">
        {issues.map((it) => (
          <li className="guide__row" key={it.n} data-reveal data-cursor="PRONTO">
            <span className="guide__time osd">{it.time}</span>
            <span className="guide__n">#{it.n}</span>
            <span className="guide__title">{it.title}</span>
            <span className="guide__status osd">{it.status}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* --------------------------------------------------------------- FINAL */

const bars = ['#f1eee4', '#c8ff1a', '#27e6ff', '#a66bff', '#ff2e7e', '#ff5a2b', '#ffb21a']

export function Finale() {
  return (
    <section className="finale" id="final">
      <Static className="finale__static" fps={14} />
      <div className="finale__body">
        <span className="tag">Fin de la transmisión</span>
        <h2 className="finale__title">
          <span className="glitch" data-text="NO CAMBIES">
            NO CAMBIES
          </span>
          <span className="glitch finale__title--b" data-text="DE CANAL">
            DE CANAL
          </span>
        </h2>
        <p className="finale__lead" data-reveal>
          El número uno llega muy pronto. Deja la tele encendida.
        </p>
        <div className="hero__cta finale__cta" data-reveal>
          <a className="btn" href="#top" onClick={(e) => e.preventDefault()} data-cursor="PRONTO">
            Avísame del estreno
          </a>
          <a
            className="btn btn--ghost"
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              scrollToEl('#top')
            }}
          >
            Volver al inicio
          </a>
        </div>
      </div>

      <div className="bars" aria-hidden="true">
        {bars.map((c) => (
          <i key={c} style={{ background: c }} />
        ))}
      </div>
      <footer className="foot osd">
        <span>© 2026 Mala Señal</span>
        <span>
          Canal {comic.channel} · <Clock />
        </span>
        <span>Arte y textos provisionales</span>
      </footer>
    </section>
  )
}
