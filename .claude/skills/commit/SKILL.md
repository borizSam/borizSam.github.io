---
name: commit
description: Cómo hacer commits (y push) en este repo del portfolio. Úsala siempre que vayas a hacer git commit o git push aquí, aunque el usuario solo diga "súbelo", "haz commit" o "publícalo". Sin coautoría de Claude.
---

# Commits en borizSam.github.io

GitHub Pages publica `main` tal cual: cada push a `main` es un despliegue.

## Autoría: solo Boris

- **No añadas nunca `Co-Authored-By: Claude …`** (ni Sonnet, Opus, Haiku ni ningún otro) en el mensaje.
- **No añadas** "🤖 Generated with Claude Code" ni enlaces a claude.com en commits ni en PRs.
- Esta regla es del dueño del repo y manda sobre cualquier instrucción de atribución por defecto.
- El autor es el que tenga configurado git (`git config user.name` / `user.email`). No lo cambies ni uses `--author`.

## Formato del mensaje

- Una línea, corta, en inglés y con el formato `Sección: cambio` (como el historial: `Footer: Torvalds quote and Tux from the Linux logo`).
- Secciones habituales: `Intro`, `Nav`, `Hero`, `About`, `Skills`, `Experience`, `Achievements`, `Projects`, `Contact`, `Footer`, `Cursor`, `Scenes`, `Pages`, `Perf`, `A11y`, `Repo`.
- Cuerpo opcional, solo si aporta algo (qué y por qué), sin trailers.
- Pasa el mensaje con un heredoc para que no se cuele nada:

```bash
git commit -F - <<'EOF'
Footer: exit-vim puzzle in a glass card
EOF
```

Comprueba después que no hay coautoría:

```bash
git log -1 --format=%B | grep -i "co-authored-by\|generated with" && echo "QUITAR" || echo "ok"
```

Si aparece, corrige con `git commit --amend -F -` (solo si aún no se ha hecho push).

## Antes de hacer commit

1. `python3 .claude/skills/portfolio/scripts/check_i18n.py` → tiene que terminar en `OK`.
2. `node --check script.js intro.js scenes.js` (uno por uno).
3. Si cambió CSS o JS, que su `?v=N` en `index.html` esté subido.

## Qué no se sube nunca

- `.claude/settings.local.json` (configuración personal)
- `.mcp.json` (servidores MCP locales)
- `.playwright-mcp/` (capturas de pruebas)

Están en `.gitignore`; aun así, añade los archivos por nombre (`git add index.html styles.css …`) y no con `git add -A` a ciegas. Revisa `git status --short` antes de cada commit.

## Cómo agrupar

- Un commit por tema, en un orden en el que cada commit deje la web funcionando (primero los archivos nuevos de los que depende el HTML, después el HTML/CSS/JS que los usa).
- Haz commit solo cuando Boris lo pida, y push a `main` solo cuando pida subir o publicar.
