# WebAI

WebAI ist ein intuitiver, KI-gestützter Website-Builder, der es dir ermöglicht, professionelle Websites durch einfaches Drag-and-Drop von vorgefertigten Sections zu erstellen. Die KI (basierend auf Ollama und dem Mistral-Modell) generiert dann automatisch vollständigen HTML-Code für deine Website.

Was kann WebAI?

- **Drag-and-Drop Interface:** Ziehe Sections wie Hero, Features, Testimonials, Pricing usw. in deinen Canvas, um die Struktur deiner Website zu definieren.
- **Anpassbare Einstellungen:** Passe Farben, Formen (abgerundet, eckig, pill), Schriftarten und Sprache an.
- **KI-Generierung:** Gib eine Beschreibung deines Projekts ein, und die KI erstellt eine vollständige, responsive Website mit eingebettetem CSS und minimalem JavaScript.
- **Inspiration-URLs:** Orientiere dich an bestehenden Websites, indem du eine URL angibst, die die KI als Stilvorlage verwendet.
- **Mehrsprachig:** Unterstützt Deutsch, Englisch, Französisch und Spanisch.

## Voraussetzungen

Bevor du WebAI benutzt, stelle sicher, dass du folgende Software installiert hast:

- **Python 3.7+:** Für das Generierungsskript.
- **Ollama:** Eine lokale KI-Plattform. Lade sie von [ollama.ai](https://ollama.ai) herunter.
- **Mistral-Modell:** Das KI-Modell, das für die Generierung verwendet wird. Installiere es mit `ollama pull mistral`.
- **Moderner Webbrowser:** Für die Benutzeroberfläche (z.B. Chrome, Firefox).

## Installation und Setup

1. **Repository klonen:**
   ```bash
   git clone https://github.com/Hannuta12/WebAI.git
   cd WebAI
   ```

2. **Ollama einrichten:**
   - Installiere Ollama von [ollama.ai](https://ollama.ai).
   - Installiere das Mistral-Modell: `ollama pull mistral`
   - Starte Ollama: `ollama run mistral`

4. **Projekt starten:**
   - Öffne `index.html` in deinem Webbrowser. (Du kannst es direkt aus dem Datei-Explorer öffnen oder einen lokalen Server starten, z.B. mit Python: `python -m http.server 8000`)

## Benutzung

### 1. Website-Struktur erstellen
- Öffne `index.html` in deinem Browser.
- Auf der linken Seite findest du verschiedene Sections (z.B. Hero, Features, Footer).
- Ziehe Sections per Drag-and-Drop in den mittleren Canvas oder klicke darauf, um sie hinzuzufügen.
- Ordne die Sections mit den Pfeil-Buttons neu an oder entferne sie mit dem X-Button.

### 2. Einstellungen anpassen
- Auf der rechten Seite kannst du Einstellungen vornehmen:
  - **Farbschema:** Wähle vordefinierte Presets oder passe Primär-, Hintergrund- und Dunkelfarben manuell an.
  - **Formen & Stil:** Wähle zwischen abgerundet, eckig oder pill-Formen.
  - **Schrift:** Wähle aus verschiedenen Schriftarten (System, Inter, Playfair, etc.).
  - **Inspiration:** Gib eine URL einer Website ein, an der sich die KI orientieren soll.
  - **Beschreibung:** Beschreibe dein Business oder Projekt, damit die KI passenden Content generiert.
  - **Sprache:** Wähle die Sprache für den generierten Text.

### 3. Website generieren
- Klicke auf "Website generieren".
- Das Tool lädt eine JSON-Konfigurationsdatei (`website-config.json`) herunter.
- Führe im Terminal den Befehl aus: `python generate.py website-config.json output.html`
- Die KI generiert die Website und speichert sie als `output.html`.
- Öffne `output.html` in deinem Browser, um die fertige Website zu sehen.

### Beispiel-Workflow
1. Füge eine Hero-Section hinzu.
2. Passe die Farben auf Blau an.
3. Gib als Beschreibung ein: "Eine moderne Webdesign-Agentur."
4. Generiere die Config und führe das Python-Skript aus.
5. Voilà — deine Website ist fertig!

## Projekt-Struktur

```
siteforge/
├── index.html          # Haupt-Benutzeroberfläche
├── builder.js          # JavaScript für Drag-and-Drop und Interaktionen
├── style.css           # CSS-Stile für die UI
├── generate.py         # Python-Skript für KI-Generierung
└── README.md           # Diese Anleitung
```

## Erweiterte Optionen

- **Interaktiver Modus:** Wenn du kein Config-File hast, führe `python generate.py` ohne Argumente aus und gib die Einstellungen manuell ein.
- **Custom Output:** Ändere den Output-Pfad: `python generate.py config.json meine-website.html`
- **KI-Anpassungen:** Bearbeite `generate.py`, um Temperatur, Modell oder Prompt anzupassen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe [LICENSE](LICENSE) für Details.

## Hilfe

Falls du Probleme hast:
- Stelle sicher, dass Ollama läuft (`ollama run mistral`).
- Überprüfe, ob Mistral installiert ist (`ollama list`).
- Öffne die Browser-Konsole für Fehler in der UI.

Viel Spaß beim Bauen deiner Websites mit WebAI
