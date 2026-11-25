import { useCallback, useEffect, useRef, useState } from 'react'
import { lockScroll, ScrollTrigger, setupMotion, setupScroll } from './lib/motion'
import { sound } from './lib/sound'
import { comic } from './data/comic'
import { Cursor, Fx, IdleBump, Nav, Preloader } from './components/Chrome'
import { Bands, Bump, Cast, Cover, Finale, Hero, Schedule, Synopsis } from './components/Sections'

export default function App() {
  const main = useRef<HTMLElement>(null)
  const [fontsReady, setFontsReady] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stopScroll = setupScroll()
    lockScroll(true)
    let cleanup: (() => void) | undefined
    let dead = false

    const start = () => {
      if (dead || cleanup || !main.current) return
      cleanup = setupMotion(main.current)
      ScrollTrigger.refresh()
      setFontsReady(true)
    }
    // no esperar a las fuentes más de 2,5 s
    const timer = window.setTimeout(start, 2500)
    document.fonts.ready.then(start)

    const blip = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a, button')) sound.blip()
    }
    document.addEventListener('click', blip)

    return () => {
      dead = true
      window.clearTimeout(timer)
      document.removeEventListener('click', blip)
      cleanup?.()
      stopScroll()
    }
  }, [])

  const onDone = useCallback(() => setReady(true), [])

  return (
    <>
      <Preloader canFinish={fontsReady} onDone={onDone} />
      <Fx />
      <Cursor />
      <Nav />
      <main ref={main}>
        <Hero ready={ready} />
        <Bands />
        <Bump lines={comic.bumps[0]} />
        <Synopsis />
        <Cast />
        <Bump lines={comic.bumps[1]} />
        <Cover />
        <Schedule />
        <Finale />
      </main>
      <IdleBump />
    </>
  )
}
