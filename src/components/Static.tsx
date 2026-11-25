import { useEffect, useRef } from 'react'
import { reduced } from '../lib/motion'

/** Nieve de televisor en un canvas de baja resolución (barato y con píxel gordo). */
export function Static({ className = '', fps = 20 }: { className?: string; fps?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const c = canvas?.getContext('2d')
    if (!canvas || !c) return
    const w = (canvas.width = 128)
    const h = (canvas.height = 96)
    const img = c.createImageData(w, h)
    const buf = new Uint32Array(img.data.buffer)

    const draw = () => {
      for (let i = 0; i < buf.length; i++) {
        const v = (Math.random() * 255) | 0
        buf[i] = (255 << 24) | (v << 16) | (v << 8) | v
      }
      c.putImageData(img, 0, 0)
    }
    draw()
    if (reduced) return

    let raf = 0
    let last = 0
    let visible = true
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || t - last < 1000 / fps) return
      last = t
      draw()
    }
    raf = requestAnimationFrame(loop)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [fps])

  return <canvas ref={ref} className={`static ${className}`} aria-hidden="true" />
}
