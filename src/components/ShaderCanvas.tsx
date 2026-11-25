import { useEffect, useRef } from 'react'
import { reduced } from '../lib/motion'

// Fondo del hero: un solo shader de fragmentos en WebGL puro (sin Three.js).
// Plasma oscuro deformado + bandas de interferencia + curvatura de tubo.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  p *= 1.0 + 0.10 * dot(p, p);

  // bandas horizontales que se desplazan (interferencia)
  float row = floor(uv.y * 46.0);
  float tick = floor(uTime * 7.0);
  float glitch = step(0.965, hash(vec2(row, tick)));
  p.x += glitch * (hash(vec2(tick, row)) - 0.5) * 0.35;

  float t = uTime * 0.07;
  vec2 m = (uMouse - 0.5) * vec2(0.5, -0.5);
  vec2 q = p + 0.42 * vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.2));
  q += m;
  float n = fbm(q * 2.1 + vec2(0.0, t * 2.4));

  vec3 ink  = vec3(0.027, 0.027, 0.039);
  vec3 acid = vec3(0.784, 1.0, 0.102);
  vec3 hot  = vec3(1.0, 0.18, 0.494);
  vec3 cyan = vec3(0.153, 0.902, 1.0);

  vec3 col = ink;
  col = mix(col, hot * 0.42, smoothstep(0.42, 0.70, n));
  col = mix(col, cyan * 0.30, smoothstep(0.36, 0.14, n));

  // curvas de nivel ácidas
  float iso = abs(fract(n * 7.0 + uTime * 0.05) - 0.5);
  float line = smoothstep(0.035, 0.0, iso);
  col = mix(col, acid, line * smoothstep(0.38, 0.62, n) * 0.85);
  col += acid * smoothstep(0.66, 0.9, n) * 0.35;

  // líneas de barrido + barra que sube
  col *= 0.86 + 0.14 * sin(gl_FragCoord.y * 1.7);
  float bar = smoothstep(0.08, 0.0, abs(fract(uv.y - uTime * 0.09) - 0.5) - 0.42);
  col += bar * 0.035;
  col += glitch * 0.07;

  // viñeta y grano
  col *= smoothstep(1.3, 0.25, length(p));
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.07;

  gl_FragColor = vec4(col, 1.0);
}`

export function ShaderCanvas({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) {
      canvas.classList.add('is-fallback')
      return
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.classList.add('is-fallback')
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const target = { x: 0.5, y: 0.5 }
    const mouse = { x: 0.5, y: 0.5 }
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth
      target.y = e.clientY / window.innerHeight
    }

    let raf = 0
    let visible = true
    const start = performance.now()
    const frame = (now: number) => {
      mouse.x += (target.x - mouse.x) * 0.05
      mouse.y += (target.y - mouse.y) * 0.05
      resize()
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000 + 12)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (visible) frame(now)
    }

    frame(performance.now())
    if (reduced) return

    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={`shader ${className}`} aria-hidden="true" />
}
