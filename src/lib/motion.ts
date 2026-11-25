import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText)

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

/** Scroll suave (Lenis) sincronizado con ScrollTrigger. Se omite con prefers-reduced-motion. */
export function setupScroll() {
  if (reduced) return () => {}
  const l = new Lenis({ lerp: 0.11 })
  lenis = l
  l.on('scroll', ScrollTrigger.update)
  const tick = (t: number) => l.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    l.destroy()
    lenis = null
  }
}

export function lockScroll(lock: boolean) {
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.documentElement.classList.toggle('is-locked', lock)
}

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.1 })
  else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
}

export function scrollToEl(selector: string) {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.2 })
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

/**
 * Capa de movimiento por atributos. El HTML declara qué se anima:
 *  data-reveal        aparece subiendo
 *  data-split         el texto entra palabra por palabra, enmascarado por líneas
 *  data-scrub-words   las palabras se encienden según el scroll
 *  data-type          efecto máquina de escribir (intersticios)
 *  data-parallax="n"  se desplaza n% contra el scroll
 *  data-panel         viñeta que se abre con clip-path
 *  data-counter="n"   cuenta de 0 a n
 */
export function setupMotion(root: HTMLElement) {
  const ctx = gsap.context(() => {
    if (reduced) return

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 46,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        delay: Number(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines,words', mask: 'lines' })
      gsap.from(split.words, {
        yPercent: 115,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-scrub-words]').forEach((el) => {
      const split = SplitText.create(el, { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: true },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>('[data-type]').forEach((el) => {
      const split = SplitText.create(el.querySelectorAll('[data-type-line]'), { type: 'words,chars' })
      gsap.set(split.chars, { autoAlpha: 0 })
      gsap.to(split.chars, {
        autoAlpha: 1,
        duration: 0.01,
        stagger: 0.03,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 62%' },
      })
    })

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax || 10)
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((el, i) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(48% 48% 48% 48%)', rotate: i % 2 ? 5 : -5, scale: 0.92 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          rotate: 0,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
      const end = Number(el.dataset.counter)
      const state = { v: end === 0 ? 99 : 0 }
      gsap.to(state, {
        v: end,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        onUpdate: () => {
          el.textContent = String(Math.round(state.v))
        },
      })
    })
  }, root)

  return () => ctx.revert()
}

export { gsap, ScrollTrigger }
