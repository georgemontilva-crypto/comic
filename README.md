# MALA SEÑAL — web del cómic

Web de presentación del cómic. Concepto: un canal pirata que transmite a las 3:33 a. m.
Título, personajes, textos y arte son **provisionales**.

## Stack

React + Vite + TypeScript, GSAP (ScrollTrigger, SplitText), Lenis y un shader WebGL propio en el hero.
Sin backend. El sonido se genera con Web Audio (no hay archivos de audio).

## Comandos

```bash
npm install
npm run dev      # desarrollo
npm run build    # tsc + build de producción en /dist
npm start        # sirve /dist (lo usa Railway; lee $PORT)
```

## Cambiar el contenido

Todo vive en `src/data/comic.ts`: título, sinopsis, frases de los intersticios, los 6 personajes y la programación.

### Poner el arte real de un personaje

1. Copia la imagen en `public/personajes/` (vertical, proporción 4:5, WebP).
2. En `src/data/comic.ts` añade `image: './personajes/nombre.webp'` al personaje.

Mientras `image` esté vacío se muestra el retrato provisional en SVG (`src/components/Portraits.tsx`).

## Estructura

- `src/styles.css` — tokens de color/tipografía y todos los estilos
- `src/lib/motion.ts` — scroll suave y animaciones por atributos `data-*`
- `src/lib/sound.ts` — sonido opcional
- `src/components/Sections.tsx` — hero, intersticios, sinopsis, elenco, adelanto, programación, final
- `src/components/Chrome.tsx` — intro, nav, cursor, capas de TV
- `src/components/ShaderCanvas.tsx` — fondo WebGL del hero
