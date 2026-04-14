import json
import sys
import urllib.request
import urllib.error

# ========================================
# OLLAMA CONFIG
# ========================================
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral:latest"

# ========================================
# SECTION DESCRIPTIONS
# Gibt der KI Kontext was jede Section sein soll
# ========================================
SECTION_DESCRIPTIONS = {
    "hero":         "Ein großer, eindrucksvoller Hero-Bereich mit Headline, Subheadline und einem Call-to-Action Button.",
    "kurz":         "Eine kurze, prägnante Beschreibung (1-2 Sätze) des Unternehmens oder Produkts.",
    "lang":         "Eine ausführliche Beschreibung mit Fließtext, strukturiert in Absätze. Optional mit Bild-Platzhaltern.",
    "plaintext":    "Reiner Fließtext ohne besondere Gestaltung, sauber typografiert.",
    "features":     "Eine Features-Section mit Icon-Karten die Vorteile und Highlights zeigt (3-6 Features).",
    "leistungen":   "Eine Leistungs-Section die Services oder Angebote in Karten oder einer Liste darstellt.",
    "stats":        "Eine Stats-Section mit großen Zahlen und kurzen Labels (z.B. '500+ Kunden', '10 Jahre Erfahrung').",
    "testimonials": "Kundenstimmen/Bewertungen in Karten mit Name, Zitat und optional Sternebewertung.",
    "pricing":      "Preistabellen mit 2-3 Paketen, Preisen und einer Feature-Liste pro Paket.",
    "team":         "Team-Mitglieder in Karten mit Bild-Platzhalter, Name und Rolle.",
    "ueberuns":     "Über uns Section mit Story, Mission und Werten des Unternehmens.",
    "bilder":       "Eine Bilder-Galerie oder Grid mit Bild-Platzhaltern.",
    "video":        "Eine Video-Section mit einem eingebetteten Video-Platzhalter.",
    "blog":         "Blog-Vorschau mit 2-3 Artikel-Karten (Bild, Titel, Datum, Kurztext).",
    "cta":          "Ein starker Call-to-Action Bereich mit Headline und Button.",
    "impressum":    "Ein Impressum-Bereich mit Platzhaltern für Firmenname, Adresse, Kontakt.",
    "footer":       "Ein Footer mit Logo, Links-Spalten und Copyright.",
}

SHAPE_CSS = {
    "rounded": {"card": "12px", "button": "8px", "image": "16px"},
    "sharp":   {"card": "0px",  "button": "0px", "image": "0px"},
    "pill":    {"card": "24px", "button": "50px", "image": "24px"},
}

FONT_IMPORTS = {
    "system":   "",
    "inter":    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');",
    "playfair": "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');",
    "space":    "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');",
    "mono":     "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');",
}

FONT_FAMILY = {
    "system":   "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "inter":    "'Inter', sans-serif",
    "playfair": "'Playfair Display', serif",
    "space":    "'Space Grotesk', sans-serif",
    "mono":     "'JetBrains Mono', monospace",
}

# ========================================
# BUILD PROMPT
# ========================================
def build_prompt(config):
    sections = config.get("sections", [])
    colors = config.get("colors", {})
    shape = config.get("shape", "rounded")
    font = config.get("font", "system")
    inspiration = config.get("inspiration", "")
    prompt_text = config.get("prompt", "")
    language = config.get("language", "de")

    shape_values = SHAPE_CSS.get(shape, SHAPE_CSS["rounded"])

    section_list = "\n".join([
        f"{i+1}. {s.upper()} — {SECTION_DESCRIPTIONS.get(s, s)}"
        for i, s in enumerate(sections)
    ])

    lang_instruction = "auf Deutsch" if language == "de" else f"in {language}"

    inspiration_note = f"\nDie Website soll sich stilistisch an dieser URL orientieren: {inspiration}" if inspiration else ""

    prompt = f"""Du bist ein erfahrener Web-Designer und Frontend-Entwickler. Erstelle eine vollständige, professionelle Website als einzelne HTML-Datei.

WICHTIG: Gib NUR den vollständigen HTML-Code aus, ohne Erklärungen, ohne Markdown-Blöcke, ohne ```html. Starte direkt mit <!DOCTYPE html>.

BESCHREIBUNG DES PROJEKTS:
{prompt_text if prompt_text else "Eine professionelle Business-Website."}
{inspiration_note}

SPRACHE: Alle Texte {lang_instruction} verfassen.

SECTIONS (in dieser Reihenfolge):
{section_list}

DESIGN-VORGABEN:
- Primärfarbe (Accent): {colors.get('primary', '#1cc7b8')}
- Hintergrundfarbe: {colors.get('background', '#f3f6f5')}
- Dunkelfarbe (Texte/Backgrounds): {colors.get('dark', '#0f2f33')}
- Border-Radius Karten: {shape_values['card']}
- Border-Radius Buttons: {shape_values['button']}
- Border-Radius Bilder: {shape_values['image']}
- Schriftart: {FONT_FAMILY.get(font, FONT_FAMILY['system'])}

TECHNISCHE ANFORDERUNGEN:
- Einzige HTML-Datei mit eingebettetem CSS im <style>-Tag
- Minimales JavaScript nur für Animationen (Scroll-Reveal, Hover-Effekte) im <script>-Tag am Ende
- Responsives Design (Mobile-First)
- Smooth Scrolling aktiviert
- Bilder als Platzhalter mit background-color oder SVG-Platzhalter
- Semantisches HTML (header, main, section, footer)
- Professionelles, modernes Design — kein generisches Standard-Layout
- Jede Section hat eine eindeutige ID (z.B. id="hero", id="features")
- Navigation am Anfang die zu den Sections scrollt
- Die Website soll beeindruckend und wirklich gut aussehen

Erstelle jetzt die vollständige HTML-Datei:"""

    return prompt

# ========================================
# CALL OLLAMA
# ========================================
def call_ollama(prompt):
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": True,
        "options": {
            "temperature": 0.7,
            "num_predict": 8000,
        }
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        OLLAMA_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    print("🔄 Verbinde mit Ollama (Mistral)...", flush=True)

    full_response = ""

    try:
        with urllib.request.urlopen(req, timeout=300) as response:
            print("✅ Verbindung hergestellt. Generiere Website...\n", flush=True)
            for line in response:
                line = line.decode("utf-8").strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                    token = obj.get("response", "")
                    full_response += token
                    print(token, end="", flush=True)
                    if obj.get("done"):
                        break
                except json.JSONDecodeError:
                    continue

    except urllib.error.URLError as e:
        print(f"\n❌ Fehler: Kann Ollama nicht erreichen auf {OLLAMA_URL}")
        print(f"   Details: {e}")
        print("\n💡 Stelle sicher dass Ollama läuft: ollama serve")
        print("💡 Und Mistral installiert ist: ollama pull mistral")
        sys.exit(1)

    return full_response

# ========================================
# SAVE OUTPUT
# ========================================
def save_output(html_content, output_path="output.html"):
    # Bereinige falls KI trotzdem Markdown-Blöcke eingefügt hat
    html_content = html_content.strip()
    if html_content.startswith("```"):
        lines = html_content.split("\n")
        html_content = "\n".join(lines[1:])
    if html_content.endswith("```"):
        html_content = html_content[:-3]
    html_content = html_content.strip()

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"\n\n✅ Website gespeichert: {output_path}")
    return output_path

# ========================================
# MAIN
# ========================================
def main():
    # Config einlesen — entweder aus Datei oder als Argument
    if len(sys.argv) > 1:
        config_path = sys.argv[1]
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
        except FileNotFoundError:
            print(f"❌ Config-Datei nicht gefunden: {config_path}")
            sys.exit(1)
        except json.JSONDecodeError:
            print(f"❌ Ungültiges JSON in: {config_path}")
            sys.exit(1)
    else:
        # Interaktiver Modus wenn kein Argument
        print("=" * 50)
        print("🔧 Website Builder — KI Generator")
        print("=" * 50)
        print("\nKeine Config-Datei angegeben. Interaktiver Modus:\n")

        sections_input = input("Sections (kommagetrennt, z.B. hero,features,cta,footer): ").strip()
        sections = [s.strip() for s in sections_input.split(",") if s.strip()]

        print("\nVerfügbare Formen: rounded, sharp, pill")
        shape = input("Form [rounded]: ").strip() or "rounded"

        primary = input("Primärfarbe [#1cc7b8]: ").strip() or "#1cc7b8"
        bg = input("Hintergrundfarbe [#f3f6f5]: ").strip() or "#f3f6f5"
        dark = input("Dunkelfarbe [#0f2f33]: ").strip() or "#0f2f33"

        print("\nVerfügbare Schriften: system, inter, playfair, space, mono")
        font = input("Schrift [system]: ").strip() or "system"

        inspiration = input("Inspiration URL (optional): ").strip()
        prompt_text = input("Beschreibung deines Projekts: ").strip()

        print("\nSprache: de, en, fr, es")
        language = input("Sprache [de]: ").strip() or "de"

        config = {
            "sections": sections,
            "colors": {"primary": primary, "background": bg, "dark": dark},
            "shape": shape,
            "font": font,
            "inspiration": inspiration,
            "prompt": prompt_text,
            "language": language,
        }

    # Output-Pfad
    output_path = sys.argv[2] if len(sys.argv) > 2 else "output.html"

    print("\n" + "=" * 50)
    print(f"📋 Config:")
    print(f"   Sections:  {', '.join(config.get('sections', []))}")
    print(f"   Farben:    {config.get('colors', {})}")
    print(f"   Form:      {config.get('shape', 'rounded')}")
    print(f"   Schrift:   {config.get('font', 'system')}")
    print(f"   Sprache:   {config.get('language', 'de')}")
    if config.get('inspiration'):
        print(f"   Inspiration: {config['inspiration']}")
    print("=" * 50 + "\n")

    prompt = build_prompt(config)
    html = call_ollama(prompt)
    save_output(html, output_path)

    print(f"\n🌐 Öffne {output_path} im Browser um die generierte Website zu sehen.")

if __name__ == "__main__":
    main()
