#!/usr/bin/env python3
"""One-off codemod: add self-referencing canonical + og tags (and HowTo JSON-LD
for converter tools) to every route that already renders a <Helmet> head."""
import re, pathlib, sys

ROOT = pathlib.Path("src")
CANON = '`https://docunova.online${typeof window !== "undefined" ? window.location.pathname : "/"}`'

TITLE_RE = re.compile(r"<title>(\{[^<]*?\}|[^<]*?)</title>")
DESC_RE = re.compile(r'<meta name="description" content=(\{[^>]*?\}|"[^"]*")\s*/>')

HOWTO_FILES = {
    "WordToPDF", "PDFToWord", "ExcelToPDF", "PowerPointToPDF", "PDFToExcel",
    "PDFToPowerPoint", "PDFToText", "TextToPDF", "MarkdownToPDF", "HTMLToPDF",
    "PDFToHTML", "PDFToEPUB", "PDFToSVG", "PDFToPNG", "SVGToPDF", "ScanToPDF",
}

changed = []
for path in sorted(ROOT.rglob("*.tsx")):
    if "__tests__" in str(path):
        continue
    src = path.read_text()
    if "<Helmet" not in src or 'rel="canonical"' in src:
        continue
    m_t, m_d = TITLE_RE.search(src), DESC_RE.search(src)
    if not m_t or not m_d:
        continue

    raw_title = m_t.group(1).strip()
    title_expr = raw_title if raw_title.startswith("{") else '"%s"' % raw_title.replace('"', "&quot;")
    desc_expr = m_d.group(1)
    if not desc_expr.startswith("{"):
        desc_expr = desc_expr  # already a quoted string literal
    title_attr = title_expr if title_expr.startswith("{") else title_expr
    stem = path.stem

    lines = [
        '        <link rel="canonical" href={%s} />' % CANON,
        '        <meta property="og:url" content={%s} />' % CANON,
        '        <meta property="og:type" content="website" />',
        '        <meta property="og:site_name" content="The Docunova AI Suite" />',
        '        <meta property="og:title" content=%s />' % title_attr,
        '        <meta property="og:description" content=%s />' % desc_expr,
        '        <meta name="twitter:card" content="summary_large_image" />',
        '        <meta name="twitter:title" content=%s />' % title_attr,
        '        <meta name="twitter:description" content=%s />' % desc_expr,
    ]

    if stem in HOWTO_FILES and "HowTo" not in src:
        howto = (
            '        <script type="application/ld+json">{JSON.stringify({\n'
            '          "@context": "https://schema.org", "@type": "HowTo",\n'
            '          name: %s, description: %s,\n'
            '          totalTime: "PT1M",\n'
            '          step: [\n'
            '            { "@type": "HowToStep", position: 1, name: "Add your file", text: "Select or drag your file into the tool. Everything is processed in your browser, so nothing is uploaded." },\n'
            '            { "@type": "HowToStep", position: 2, name: "Choose your options", text: "Adjust the available settings for your output, then start the conversion." },\n'
            '            { "@type": "HowToStep", position: 3, name: "Download the result", text: "Save the finished file to your device. It is free with no file size limit." },\n'
            '          ],\n'
            '        })}</script>'
        ) % (title_attr.strip("{}") if title_attr.startswith("{") else title_attr,
             desc_expr.strip("{}") if desc_expr.startswith("{") else desc_expr)
        lines.append(howto)

    insert_at = m_d.end()
    src = src[:insert_at] + "\n" + "\n".join(lines) + src[insert_at:]
    path.write_text(src)
    changed.append(str(path))

print(f"updated {len(changed)} files")
for c in changed:
    print(" -", c)
