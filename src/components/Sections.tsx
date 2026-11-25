import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap, reduced, ScrollTrigger, scrollToEl, scrollToY } from '../lib/motion'
import { sound } from '../lib/sound'
import { art, characters, comic, issues } from '../data/comic'
import { Clock } from './Chrome'
import { Portrait } from './Portraits'
import { ShaderCanvas } from './ShaderCanvas'
import { Static } from './Static'

const css = (vars: Record<string, string | number>) => vars as CSSProperties

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
      <img className="hero__art" src={art.cover} alt="" aria-hidden="true" />
      <ShaderCanvas className="hero__gl" image={art.cover} />
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
          <div className={`tv ${ch.classified ? 'is-classified' : ''}`}>
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

/* ------------------------------------------------------------- PORTADA */

export function Cover() {
  const frame = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)

  // La portada se inclina: con el ratón en escritorio, con el scroll en táctil.
  useEffect(() => {
    const box = frame.current
    const el = card.current
    if (!box || !el || reduced) return

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' })
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = box.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        ry(x * 18)
        rx(-y * 13)
        el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
        el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
      }
      const leave = () => {
        rx(0)
        ry(0)
      }
      box.addEventListener('pointermove', move)
      box.addEventListener('pointerleave', leave)
      return () => {
        box.removeEventListener('pointermove', move)
        box.removeEventListener('pointerleave', leave)
      }
    }

    const tween = gsap.fromTo(
      el,
      { rotationY: -16, rotationX: 7 },
      {
        rotationY: 16,
        rotationX: -5,
        ease: 'none',
        scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  const [a, b] = comic.title

  return (
    <section className="section cover" id="portada">
      <header className="sec-head">
        <span className="tag">03 / Portada</span>
        <h2 className="h2" data-split>
          El número uno, de frente
        </h2>
      </header>

      <div className="cover__stage">
        <div className="cover__frame" ref={frame} data-cursor="#01">
          <div className="cover__card" ref={card}>
            <img
              src={art.cover}
              alt="Portada del número uno: cinco personajes miran hacia una ciudad flotante dentro de un anillo de luz"
              width={1086}
              height={1448}
              loading="lazy"
            />
            <span className="cover__glare" aria-hidden="true" />
            <span className="cover__logo" aria-hidden="true">
              {a}
              <b>{b}</b>
            </span>
            <span className="cover__num osd" aria-hidden="true">
              #01
            </span>
          </div>
        </div>

        <div className="cover__info">
          <p className="cover__text" data-reveal>
            {comic.cover.text}
          </p>
          <dl className="cover__meta">
            {comic.cover.meta.map(([k, v]) => (
              <div key={k} data-reveal>
                <dt className="osd">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="page-grid">
        <figure className="panel panel--a" data-panel>
          <div className="panel__art" data-parallax="6">
            <img src={art.city} alt="La ciudad flotante dentro del anillo de luz" loading="lazy" />
          </div>
          <p className="caption">Sobre las ruinas. 3:33 a. m.</p>
          <figcaption className="caption caption--end">La ciudad no baja.</figcaption>
        </figure>

        <figure className="panel panel--b" data-panel>
          <span className="sfx">¡KRAKK!</span>
        </figure>

        <figure className="panel panel--c" data-panel>
          <div className="panel__art" data-parallax="8">
            <img src={art.eyes} alt="Dos ojos encendidos bajo una capucha gigante" loading="lazy" />
          </div>
          <figcaption className="caption">Arriba, algo abre los ojos.</figcaption>
        </figure>

        <figure className="panel panel--d" data-panel>
          <div className="panel__art" data-parallax="8">
            <img src={art.sword} alt="Una espada oscura clavada entre los escombros" loading="lazy" />
          </div>
          <figcaption className="caption">Una espada sin dueño.</figcaption>
        </figure>

        <figure className="panel panel--e" data-panel>
          <div className="panel__art" data-parallax="10">
            <img src={art.gaze} alt="El protagonista mira hacia arriba" loading="lazy" />
          </div>
          <figcaption className="balloon balloon--br">Yo solo pasaba por aquí.</figcaption>
        </figure>
      </div>
      <p className="pages__note osd">Detalles de la portada · textos provisionales</p>
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

const bars = ['#f1eee4', '#ff4fc3', '#9bd2ff', '#6a4dff', '#ff3048', '#f5b72e', '#6f86ff']

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
