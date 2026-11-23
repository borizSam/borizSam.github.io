# Portfolio — Boris Ivan Huarachi Pérez

Portfolio personal de DevOps & Cloud Engineer: <https://borizsam.github.io/>

HTML, CSS y JavaScript sin frameworks ni build, bilingüe (ES/EN). GitHub Pages lo publica tal cual desde `main`.

## Ejecutar en local

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# abrir http://127.0.0.1:8000/
```

## Estructura

| Archivo | Qué hace |
|---|---|
| `index.html` | Todo el marcado. El texto en español vive aquí (`data-i18n`). |
| `styles.css` | Estilos. Temas con `html[data-theme]` (oscuro por defecto). |
| `intro.js` | Intro de carga (una vez por sesión), cursor y línea de tiempo. |
| `script.js` | i18n (diccionario `EN`), tema, skills, navegación, certificado, easter eggs, terminal oculta y el reto de vim del footer. |
| `scenes.js` | Fondos por sección en un único canvas fijo (agujero negro, océano, galaxia, túnel, poliedros, campo profundo). |
| `404.html` | Página de error de GitHub Pages; redirige `/skills`, `/cv`… a su sitio. |
| `assets/` | CV, foto, badges, certificado, imagen para redes (`og.png`) e icono de iPhone. |
| `favicon.svg`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `.nojekyll` | Ficheros de publicación. |

## Al cambiar CSS o JS

`index.html` carga cada archivo con `?v=N`. Sube su número al modificarlo; si no, los visitantes verán la versión cacheada (GitHub Pages cachea 10 minutos).

## Accesibilidad y rendimiento

- Respeta `prefers-reduced-motion`: sin intro, fondos estáticos y transiciones mínimas.
- Scripts con `defer`, fuentes sin bloquear el render y animaciones que se pausan en segundo plano.
- Lighthouse (local): rendimiento 94 móvil / 99 escritorio; accesibilidad, buenas prácticas y SEO 100.
