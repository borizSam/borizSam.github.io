---
name: portfolio
description: Convenciones para editar este portfolio estático bilingüe (ES/EN) — index.html, styles.css, script.js, intro.js. Úsala siempre que cambies textos, secciones, estilos o scripts del sitio, al añadir un proyecto/certificación/experiencia, o antes de hacer commit de un cambio en la web.
---

# Portfolio de Boris (borizsam.github.io)

Web estática sin framework ni build. GitHub Pages la publica desde `main`.

## Archivos
- `index.html`: todo el marcado. **El texto en español vive aquí** (es la fuente del ES).
- `script.js`: el comportamiento principal. El diccionario `const EN = {...}` guarda los textos en inglés y `CATS` las etiquetas del filtro de skills en los dos idiomas.
- `intro.js`: la intro de carga (animación de terminal/pipeline CI). Solo se ve una vez por sesión (`sessionStorage.intro`).
- `scenes.js`: los fondos por sección (agujero negro, océano de partículas, galaxia, túnel, poliedros, campo profundo) en un único canvas fijo `#scene`.
- `styles.css`: todos los estilos. Los temas van con `html[data-theme]` (`dark` por defecto).
- `assets/`: `cv.pdf` y `boris-foto.webp`.

## Reglas de i18n
1. Todo texto visible va en el HTML, en español, con `data-i18n="seccion.clave"`.
2. Los `aria-label` traducibles llevan `data-i18n-label="clave"`.
3. Añade la misma clave en inglés a `EN` en `script.js`, junto a las demás claves de su sección.
4. El valor se asigna con `innerHTML`, así que el HTML inline (`<b>`, `<br />`) funciona y tiene que coincidir en los dos idiomas.
5. Comprueba la paridad:
   ```bash
   python3 .claude/skills/portfolio/scripts/check_i18n.py
   ```
   Tiene que acabar en `OK`. Las claves que salen como "EN-only" las usa el JS (`hero.hi`, `id.photo`…). No las borres sin comprobar antes con grep que nada las usa.

## Cache-busting
`index.html` carga `styles.css?v=N`, `intro.js?v=N`, `script.js?v=N` y `scenes.js?v=N`. **Cuando modifiques uno de esos archivos, sube su `v`** (solo el suyo). Si no, los visitantes seguirán viendo la versión cacheada.

## Estilo y contenido
- La estética es de terminal/DevOps: títulos como comandos (`terraform state list`, `./flip`), fuente mono Geist Mono y Orbitron para display. Mantén ese tono.
- Las animaciones nuevas tienen que respetar `prefers-reduced-motion` (variable `reduced` en script.js).
- Los canvas y elementos decorativos llevan `aria-hidden="true"`.
- No inventes datos reales del perfil (empresa, fechas, certificaciones). Si falta alguno, pregúntale a Boris.
- Los textos tienen que sonar naturales, no a marketing. Para eso sirve la skill `humanizer`.

## Verificar antes de hacer commit
1. `python3 .claude/skills/portfolio/scripts/check_i18n.py`
2. Levanta el servidor local con `python3 -m http.server 8000 --bind 127.0.0.1` y abre `http://127.0.0.1:8000/`. Revisa ES y EN (botón `#lang-btn`), tema oscuro y claro (`#theme-btn`) y el ancho de móvil (~390px).
3. Mensajes de commit cortos con el formato `Sección: cambio` (p. ej. `Footer: Tux constellation`). Para hacer el commit sigue la skill `commit` (sin coautoría de Claude).
