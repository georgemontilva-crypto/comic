import { useEffect, useRef } from 'react'
import { reduced } from '../lib/motion'

// Fondo del hero: un solo shader de fragmentos en WebGL puro (sin Three.js).
// Si recibe `image`, la pinta como textura con deformación líquida, desgarro
// RGB y bandas de interferencia. Sin imagen dibuja solo el plasma.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTex;
uniform vec2 uImg;
uniform vec2 uFocus;
uniform float uHas;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}
// equivalente a object-fit: cover, con punto de enfoque
vec2 coverUV(vec2 uv){
  float rs = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  s *= 0.955;
  return uv * s + (1.0 - s) * uFocus;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  p *= 1.0 + 0.10 * dot(p, p);

  // bandas horizontales que se desplazan (interferencia)
  float row = floor(uv.y * 46.0);
  float tick = floor(uTime * 7.0);
  float glitch = step(0.968, hash(vec2(row, tick)));
  float dx = glitch * (hash(vec2(tick, row)) - 0.5);

  float t = uTime * 0.07;
  vec2 m = (uMouse - 0.5) * vec2(0.5, -0.5);
  vec2 q = p + 0.42 * vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.2)) + m;
  float n = fbm(q * 2.1 + vec2(0.0, t * 2.4));

  vec3 ink    = vec3(0.027, 0.024, 0.051);
  vec3 pink   = vec3(1.0, 0.31, 0.765);
  vec3 violet = vec3(0.416, 0.302, 1.0);
  vec3 ice    = vec3(0.608, 0.824, 1.0);

  float iso = abs(fract(n * 7.0 + uTime * 0.05) - 0.5);
  float line = smoothstep(0.03, 0.0, iso);

  vec3 col;
  if (uHas > 0.5) {
    float a = n * 6.2831;
    vec2 warp = 0.007 * vec2(cos(a), sin(a));
    vec2 iu = coverUV(uv + warp + vec2(dx * 0.10, 0.0) - m * 0.035);
    float ca = 0.0022 + glitch * 0.014 + 0.0012 * sin(uTime * 0.9);
    col = vec3(texture2D(uTex, iu + vec2(ca, 0.0)).r,
               texture2D(uTex, iu).g,
               texture2D(uTex, iu - vec2(ca, 0.0)).b);
    col *= 0.86;
    col = mix(col, col * vec3(0.82, 0.74, 1.16), 0.3);
    col += pink * line * smoothstep(0.44, 0.68, n) * 0.42;
    col += ice * smoothstep(0.7, 0.92, n) * 0.10;
  } else {
    q.x += dx * 0.35;
    col = ink;
    col = mix(col, violet * 0.45, smoothstep(0.42, 0.70, n));
    col = mix(col, ice * 0.25, smoothstep(0.36, 0.14, n));
    col = mix(col, pink, line * smoothstep(0.38, 0.62, n) * 0.85);
    col += pink * smoothstep(0.66, 0.9, n) * 0.3;
  }

  // líneas de barrido + barra que sube
  col *= 0.87 + 0.13 * sin(gl_FragCoord.y * 1.7);
  float bar = smoothstep(0.08, 0.0, abs(fract(uv.y - uTime * 0.09) - 0.5) - 0.42);
  col += bar * 0.04;
  col += glitch * 0.06;

  // viñeta y grano
  col *= smoothstep(1.35, 0.3, length(p));
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.07;

  gl_FragColor = vec4(col, 1.0);
}`

type Props = { className?: string; image?: string; focus?: [number, number] }

export function ShaderCanvas({ className = '', image, focus = [0.5, 0.74] }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const fx = focus[0]
  const fy = focus[1]

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

    const U = (name: string) => gl.getUniformLocation(prog, name)
    const uRes = U('uRes')
    const uTime = U('uTime')
    const uMouse = U('uMouse')
    gl.uniform1i(U('uTex'), 0)
    gl.uniform2f(U('uImg'), 1, 1)
    gl.uniform2f(U('uFocus'), fx, fy)
    gl.uniform1f(U('uHas'), 0)

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
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
      if (coarse) return
      target.x = e.clientX / window.innerWidth
      target.y = e.clientY / window.innerHeight
    }

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

    let dead = false
    if (image) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (dead) return
        const tex = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.uniform2f(U('uImg'), img.naturalWidth, img.naturalHeight)
        gl.uniform1f(U('uHas'), 1)
        canvas.classList.add('has-image')
        frame(performance.now())
      }
      img.src = image
    }

    frame(performance.now())
    if (reduced) {
      return () => {
        dead = true
      }
    }

    let raf = 0
    let visible = true
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (visible) frame(now)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    return () => {
      dead = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [image, fx, fy])

  return <canvas ref={ref} className={`shader ${className}`} aria-hidden="true" />
}
