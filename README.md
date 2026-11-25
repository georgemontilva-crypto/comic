# MALA SEÑAL — web del cómic

Web de presentación del cómic. Concepto: un canal pirata que transmite desde las ruinas a las 3:33 a. m.
La paleta y el arte salen de la portada del número uno. Título, nombres y textos son **provisionales**.

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

Todo vive en `src/data/comic.ts`: título, sinopsis, frases de los intersticios, los 6 personajes, la portada y la programación.

### Arte

Las imágenes están en `public/arte/`:

- `portada.webp` — la portada completa (fondo del hero y sección Portada)
- `p-*.webp` — retratos del elenco, recortados de la portada
- `d-*.webp` — detalles de la portada para las viñetas

Para cambiar el arte de un personaje: copia la imagen en `public/arte/` (vertical 4:5, WebP) y cambia su `image` en `src/data/comic.ts`.
Un personaje con `classified: true` y sin `image` se muestra como canal sin señal (el sexto, que no sale en la portada).

## Estructura

- `src/styles.css` — tokens de color/tipografía y todos los estilos
- `src/lib/motion.ts` — scroll suave y animaciones por atributos `data-*`
- `src/lib/sound.ts` — sonido opcional
- `src/components/Sections.tsx` — hero, intersticios, sinopsis, elenco, portada, programación, final
- `src/components/Chrome.tsx` — intro, nav, cursor, capas de TV
- `src/components/ShaderCanvas.tsx` — fondo WebGL del hero (la portada como textura, con interferencia)
