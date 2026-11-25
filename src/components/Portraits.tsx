import type { Character } from '../data/comic'

/** Retrato del personaje. Sin `image` muestra la carta de "sin señal". */
export function Portrait({ character, className = '' }: { character: Character; className?: string }) {
  if (character.image) {
    return <img className={`portrait ${className}`} src={character.image} alt={`Retrato de ${character.name}`} />
  }
  return (
    <svg
      className={`portrait ${className}`}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Personaje sin revelar"
    >
      <rect width="400" height="500" fill="#0b0816" />
      <path d="M60 500 C60 380 130 340 200 340 C270 340 340 380 340 500Z" fill="#1a1530" />
      <circle cx="200" cy="232" r="92" fill="#1a1530" />
      <text
        x="200"
        y="284"
        textAnchor="middle"
        fontFamily="'Dela Gothic One', Impact, sans-serif"
        fontSize="150"
        fill={character.color}
      >
        ?
      </text>
    </svg>
  )
}
