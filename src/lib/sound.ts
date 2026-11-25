// Sonido generado con Web Audio: no hay archivos que cargar.
// Apagado por defecto; solo arranca tras un gesto del usuario.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuf: AudioBuffer | null = null
let on = false
const listeners = new Set<(v: boolean) => void>()

function build() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AC) return false
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.6
  master.connect(ctx.destination)

  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  // zumbido de tubo
  const hum = ctx.createOscillator()
  hum.type = 'sawtooth'
  hum.frequency.value = 55
  const humFilter = ctx.createBiquadFilter()
  humFilter.type = 'lowpass'
  humFilter.frequency.value = 170
  const humGain = ctx.createGain()
  humGain.gain.value = 0.05
  hum.connect(humFilter).connect(humGain).connect(master)
  hum.start()

  // siseo de fondo
  const hiss = ctx.createBufferSource()
  hiss.buffer = noiseBuf
  hiss.loop = true
  const hissFilter = ctx.createBiquadFilter()
  hissFilter.type = 'bandpass'
  hissFilter.frequency.value = 3200
  const hissGain = ctx.createGain()
  hissGain.gain.value = 0.012
  hiss.connect(hissFilter).connect(hissGain).connect(master)
  hiss.start()
  return true
}

export const sound = {
  get on() {
    return on
  },
  subscribe(fn: (v: boolean) => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
  toggle() {
    if (!on) {
      if (!ctx && !build()) return
      void ctx?.resume()
      on = true
    } else {
      void ctx?.suspend()
      on = false
    }
    listeners.forEach((fn) => fn(on))
    if (on) sound.burst()
  },
  /** Ráfaga de estática: cambio de canal. */
  burst(dur = 0.24) {
    if (!on || !ctx || !master || !noiseBuf) return
    const src = ctx.createBufferSource()
    src.buffer = noiseBuf
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 900
    const g = ctx.createGain()
    const t = ctx.currentTime
    g.gain.setValueAtTime(0.22, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    src.connect(hp).connect(g).connect(master)
    src.start(t, Math.random() * 0.5, dur)
  },
  /** Pitido corto: botones. */
  blip() {
    if (!on || !ctx || !master) return
    const o = ctx.createOscillator()
    o.type = 'square'
    const g = ctx.createGain()
    const t = ctx.currentTime
    o.frequency.setValueAtTime(880, t)
    o.frequency.exponentialRampToValueAtTime(330, t + 0.07)
    g.gain.setValueAtTime(0.05, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    o.connect(g).connect(master)
    o.start(t)
    o.stop(t + 0.09)
  },
}
