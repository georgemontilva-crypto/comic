import { useId, type ReactNode } from 'react'
import type { Character } from '../data/comic'

// Retratos PROVISIONALES dibujados en SVG. Se reemplazan solos cuando un
// personaje tiene `image` en src/data/comic.ts.

const INK = '#07070a'
const PAPER = '#f1eee4'
const S = { stroke: INK, strokeWidth: 8, strokeLinejoin: 'round', strokeLinecap: 'round' } as const

function Eye({ x, y, r, px = 0, py = 0, iris = INK }: { x: number; y: number; r: number; px?: number; py?: number; iris?: string }) {
  return (
    <g className="eye">
      <circle cx={x} cy={y} r={r} fill="#fff" {...S} />
      <circle cx={x + px} cy={y + py} r={r * 0.42} fill={iris} />
      <circle cx={x + px - r * 0.14} cy={y + py - r * 0.14} r={r * 0.12} fill="#fff" />
    </g>
  )
}

const figures: Record<string, (c: Character) => ReactNode> = {
  greta: (c) => (
    <>
      <path d="M40 500 C40 400 130 372 200 372 C270 372 360 400 360 500Z" fill={INK} />
      <path d="M150 500 L150 410 L250 410 L250 500" fill={c.color} {...S} />
      <rect x="176" y="326" width="48" height="62" fill={PAPER} {...S} />
      <path d="M98 196 L74 104 L138 150 L150 60 L202 138 L244 52 L262 142 L330 92 L304 200 Z" fill={INK} {...S} />
      <rect x="110" y="160" width="180" height="196" rx="46" fill={PAPER} {...S} />
      <Eye x={162} y={248} r={36} px={8} py={4} />
      <Eye x={246} y={256} r={19} px={-3} py={2} iris="#ff2e7e" />
      <path d="M132 204 L190 218 M226 226 L274 212" fill="none" {...S} />
      <path d="M148 312 L168 300 L188 316 L208 300 L228 316 L252 302" fill="none" {...S} />
      <path d="M52 250 L80 232 L72 262 L100 248" fill="none" {...S} strokeWidth={6} />
      <path d="M318 300 L346 282 L338 312 L366 298" fill="none" {...S} strokeWidth={6} />
      <path d="M330 140 L352 118 M356 160 L384 152 M60 150 L36 132" fill="none" {...S} strokeWidth={6} />
    </>
  ),
  pastor: () => (
    <>
      <path d="M30 500 C30 410 120 384 200 384 C280 384 370 410 370 500Z" fill={INK} />
      <rect x="178" y="384" width="44" height="24" rx="4" fill={PAPER} {...S} strokeWidth={6} />
      <rect x="182" y="330" width="36" height="58" fill={INK} />
      <path d="M200 132 L146 48 M200 132 L262 58" fill="none" {...S} />
      <circle cx="146" cy="48" r="10" fill={PAPER} {...S} />
      <circle cx="262" cy="58" r="10" fill={PAPER} {...S} />
      <ellipse cx="190" cy="26" rx="60" ry="11" fill="none" stroke="#c8ff1a" strokeWidth={7} />
      <rect x="84" y="130" width="232" height="206" rx="28" fill="#1b1b24" {...S} />
      <rect x="106" y="152" width="158" height="162" rx="20" fill={PAPER} {...S} />
      <g stroke={INK} strokeWidth={3} opacity={0.28}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="110" x2="260" y1={166 + i * 12} y2={166 + i * 12} />
        ))}
      </g>
      <ellipse cx="185" cy="226" rx="50" ry="32" fill="#fff" {...S} />
      <circle cx="191" cy="226" r="18" fill="#ff2e7e" />
      <circle cx="191" cy="226" r="8" fill={INK} />
      <path d="M150 280 Q185 262 220 280" fill="none" {...S} strokeWidth={6} />
      <circle cx="290" cy="178" r="11" fill={PAPER} {...S} strokeWidth={5} />
      <circle cx="290" cy="214" r="11" fill="#c8ff1a" {...S} strokeWidth={5} />
      <path d="M278 252 L302 252 M278 268 L302 268 M278 284 L302 284" {...S} strokeWidth={5} stroke={PAPER} />
    </>
  ),
  mosca: (c) => (
    <>
      <ellipse cx="72" cy="356" rx="64" ry="26" transform="rotate(-28 72 356)" fill="#fff" opacity={0.75} {...S} strokeWidth={5} />
      <ellipse cx="328" cy="356" rx="64" ry="26" transform="rotate(28 328 356)" fill="#fff" opacity={0.75} {...S} strokeWidth={5} />
      <path d="M50 500 C50 410 130 380 200 380 C270 380 350 410 350 500Z" fill={INK} />
      <path d="M176 380 L200 430 L224 380" fill={PAPER} {...S} strokeWidth={6} />
      <circle cx="200" cy="246" r="100" fill={PAPER} {...S} />
      <path d="M102 222 C104 120 296 120 298 222 Z" fill={INK} {...S} />
      <rect x="82" y="208" width="170" height="26" rx="13" fill={INK} />
      <rect x="150" y="150" width="100" height="34" rx="6" fill={c.color} {...S} strokeWidth={5} />
      <text x="200" y="176" textAnchor="middle" fontFamily="VT323, monospace" fontSize="30" fill={INK}>
        YA VOY
      </text>
      <circle cx="158" cy="272" r="48" fill={INK} />
      <circle cx="252" cy="272" r="48" fill={INK} />
      <circle cx="158" cy="272" r="35" fill={c.color} />
      <circle cx="252" cy="272" r="35" fill={c.color} />
      <g stroke={INK} strokeWidth={3} opacity={0.5}>
        <path d="M128 272 H188 M136 254 H180 M136 290 H180 M222 272 H282 M230 254 H274 M230 290 H274" />
        <path d="M146 242 V302 M170 242 V302 M240 242 V302 M264 242 V302" />
      </g>
      <path d="M186 326 Q200 318 214 326" fill="none" {...S} strokeWidth={6} />
    </>
  ),
  hueso: () => (
    <>
      <path d="M36 500 C36 410 120 380 200 380 C280 380 364 410 364 500Z" fill={INK} />
      <path d="M150 384 L200 470 L250 384Z" fill={PAPER} {...S} strokeWidth={6} />
      <path d="M188 396 L212 396 L222 470 L200 496 L178 470Z" fill="#ff2e7e" {...S} strokeWidth={5} />
      <path
        d="M104 232 C104 112 296 112 296 232 C296 284 274 302 264 312 L264 362 L136 362 L136 312 C126 302 104 284 104 232Z"
        fill={PAPER}
        {...S}
      />
      <ellipse cx="160" cy="236" rx="31" ry="35" fill={INK} />
      <ellipse cx="240" cy="236" rx="31" ry="35" fill={INK} />
      <circle cx="164" cy="240" r="7" fill="#c8ff1a" />
      <circle cx="244" cy="240" r="7" fill="#c8ff1a" />
      <rect x="120" y="196" width="80" height="80" rx="12" fill="none" {...S} strokeWidth={6} />
      <rect x="200" y="196" width="80" height="80" rx="12" fill="none" {...S} strokeWidth={6} />
      <path d="M200 288 L188 312 L212 312Z" fill={INK} />
      <path d="M150 334 H250 M170 322 V348 M190 322 V348 M210 322 V348 M230 322 V348" fill="none" {...S} strokeWidth={5} />
      <g transform="rotate(-14 300 110)">
        <rect x="232" y="84" width="150" height="48" rx="6" fill="none" stroke="#d1162b" strokeWidth={6} />
        <text x="307" y="120" textAnchor="middle" fontFamily="VT323, monospace" fontSize="40" fill="#d1162b">
          DENEGADO
        </text>
      </g>
    </>
  ),
  neon: (c) => (
    <>
      <path d="M48 420 C-6 220 108 46 200 46 C292 46 406 220 352 420 Z" fill={INK} {...S} />
      <path d="M40 500 C40 420 130 392 200 392 C270 392 360 420 360 500Z" fill="#ff2e7e" {...S} />
      <ellipse cx="200" cy="262" rx="84" ry="106" fill={PAPER} {...S} />
      <ellipse cx="200" cy="184" rx="24" ry="14" fill="#fff" {...S} strokeWidth={6} />
      <circle cx="200" cy="184" r="8" fill={c.color} />
      <ellipse cx="164" cy="254" rx="26" ry="15" fill="#fff" {...S} strokeWidth={6} />
      <ellipse cx="236" cy="254" rx="26" ry="15" fill="#fff" {...S} strokeWidth={6} />
      <circle cx="168" cy="254" r="9" fill={INK} />
      <circle cx="240" cy="254" r="9" fill={INK} />
      <path d="M134 238 L122 222 M148 232 L142 214 M252 232 L258 214 M266 238 L278 222" fill="none" {...S} strokeWidth={5} />
      <path d="M172 318 Q186 304 200 316 Q214 304 228 318 Q200 344 172 318Z" fill="#ff2e7e" {...S} strokeWidth={5} />
      <circle cx="106" cy="316" r="27" fill="none" stroke="#c8ff1a" strokeWidth={8} />
      <circle cx="294" cy="316" r="27" fill="none" stroke="#c8ff1a" strokeWidth={8} />
      <circle cx="200" cy="474" r="58" fill="#fff" opacity={0.92} {...S} />
      <path d="M168 452 Q180 430 204 428" fill="none" stroke={c.color} strokeWidth={8} strokeLinecap="round" />
    </>
  ),
  babas: () => (
    <>
      <path d="M100 222 C26 196 18 330 76 362 C98 330 110 276 122 244Z" fill={INK} {...S} />
      <path d="M300 222 C374 196 382 330 324 362 C302 330 290 276 278 244Z" fill={INK} {...S} />
      <path d="M64 500 C44 330 88 176 200 166 C312 176 356 330 336 500Z" fill={PAPER} {...S} />
      <Eye x={146} y={268} r={27} px={-6} py={5} />
      <Eye x={200} y={236} r={32} px={2} py={-8} iris="#ff2e7e" />
      <Eye x={254} y={268} r={27} px={7} py={6} />
      <ellipse cx="200" cy="346" rx="64" ry="44" fill="#fff" {...S} />
      <ellipse cx="200" cy="322" rx="19" ry="13" fill={INK} />
      <path d="M162 354 Q200 392 238 354" fill="none" {...S} strokeWidth={6} />
      <path d="M184 370 C184 430 216 430 216 370Z" fill="#ff2e7e" {...S} strokeWidth={6} />
      <path d="M236 364 C242 404 230 432 238 456" fill="none" stroke="#27e6ff" strokeWidth={9} strokeLinecap="round" />
      <circle cx="239" cy="474" r="9" fill="#27e6ff" />
      <rect x="120" y="440" width="160" height="24" rx="12" fill={INK} />
      <circle cx="200" cy="472" r="16" fill="#c8ff1a" {...S} strokeWidth={5} />
    </>
  ),
}

export function Portrait({ character, className = '' }: { character: Character; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  if (character.image) {
    return <img className={`portrait ${className}`} src={character.image} alt={character.name} loading="lazy" />
  }

  const draw = figures[character.id]
  return (
    <svg
      className={`portrait ${className}`}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Retrato provisional de ${character.name}`}
    >
      <defs>
        <pattern id={`dots-${uid}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <circle cx="7" cy="7" r="2.8" fill={INK} opacity="0.2" />
        </pattern>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={character.color} />
      <rect width="400" height="500" fill={`url(#dots-${uid})`} />
      <rect width="400" height="500" fill={`url(#glow-${uid})`} />
      {draw ? draw(character) : null}
    </svg>
  )
}
