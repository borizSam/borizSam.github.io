#!/usr/bin/env python3
"""Check ES/EN parity: every data-i18n / data-i18n-label key in index.html
must have an English entry in the EN dictionary of script.js.
Usage: python3 .claude/skills/portfolio/scripts/check_i18n.py [repo_root]"""
import re, sys, pathlib

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
html = (root / "index.html").read_text(encoding="utf-8")
js = (root / "script.js").read_text(encoding="utf-8")

html_keys = set(re.findall(r'data-i18n(?:-label)?="([^"]+)"', html))
m = re.search(r"const EN = \{(.*?)\n\s*\};", js, re.S)
if not m:
    sys.exit("No se encontró `const EN = {...};` en script.js")
en_keys = set(re.findall(r'"([\w.-]+)"\s*:', m.group(1)))

missing = sorted(html_keys - en_keys)
js_only = sorted(en_keys - html_keys)
print(f"HTML keys: {len(html_keys)} · EN keys: {len(en_keys)}")
if js_only:
    print("EN-only (usadas desde JS o sobrantes, revisar):", ", ".join(js_only))
if missing:
    print("FALTA traducción EN para:", ", ".join(missing))
    sys.exit(1)
print("OK: todas las claves del HTML tienen traducción EN")
