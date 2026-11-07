# Echte Screenshots / Real browser evidence

**Keine Mockups als Testbelege ausgeben.** Der SVG-Header in `assets/readme-banner.svg` ist eine Illustration, **kein Screenshot**.

## Verfahren / Procedure

1. Lokalen HTTP-Server starten: `python3 -m http.server 8000`.
2. Unter `http://localhost:8000` prüfen, dass 36 Vorlagen geladen werden.
3. Browserkonsole auf Fehler kontrollieren. Suche und alle Filter durchspielen.
4. Auf Desktop mit Tastatur: Tab-Reihenfolge, Fokus, Auswahl, Editor, Zurücksetzen, Originalkopie testen.
5. Bearbeiteten Text mit offenen Tokens prüfen – der entsprechende Kopierbutton muss deaktiviert sein.
6. Tokens im Betreff und Nachricht komplett ersetzen, dann den kopierten Text *außerhalb* des Editors kontrollieren.
7. Zwischenablage verweigern/unsicheren Kontext simulieren und Statusmeldung prüfen.
8. Mobil in echten Browsern oder emuliert auf 360×800 und 390×844 sowie Tablet 768×1024 kontrollieren. Echte Geräteprüfungen separat kennzeichnen.
9. Screenshots ohne persönliche Inhalte erstellen, zum Beispiel:
   - `assets/screenshots/desktop-library.png` (Desktop, vollständige Library + Editor)
   - `assets/screenshots/mobile-editor.png` (Mobil, editierter Beispielentwurf)
10. Bilddateien erst nach der Aufnahme committen. Danach in die README einbinden mit korrektem Stand und Testdatum.

## Nachweisprotokoll

| Gerät/Browser | Viewport | Datum | Commit | Ergebnis | Screenshot |
| --- | --- | --- | --- | --- | --- |
| Desktop / noch nicht geprüft | — | — | — | Offen | — |
| Mobil / noch nicht geprüft | — | — | — | Offen | — |

## Grenzen

Ein Chromium-Emulator ist **kein** Beweis für Safari iOS oder Chrome auf physischer Hardware. Screenshots beweisen visuelles Rendering, nicht Funktions-, Sicherheits- oder Barrierefreiheitstests.
