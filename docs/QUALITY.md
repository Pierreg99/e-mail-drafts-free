# Qualitätsmatrix / Quality and evidence

**Belegstand: 7. November 2026.** Die erste CryoPG-Workbench wurde mit [PR #2](https://github.com/Pierreg99/e-mail-drafts-free/pull/2) in `main` gemergt. Dabei wurde ein roter Quality-Check nicht verhindert. Die Korrektur befindet sich deshalb in einem separaten Review-Branch; **kein weiterer Merge ohne grünen PR-Check**.

## Nachweise am gemergten Feature-Head

| Nachweis | Verifizierter Status | Quelle / Grenze |
| --- | --- | --- |
| Katalog: 12 Batches, 36 Vorlagen | **Bestanden** innerhalb des Quality-Jobs | [Quality-Lauf #43](https://github.com/Pierreg99/e-mail-drafts-free/actions/runs/42337934380), vor dem fehlerhaften Unit-Test-Schritt |
| Exportabgleich: 36 Markdown | **Bestanden**; Betreff, Body und Tokenlisten gegen JSON | `scripts/validate-exports.mjs`, Quality-Job-Log |
| 36 PDF-Dateien | **Strukturprüfung bestanden** (Datei, Header und EOF) | Keine PDF-Inhaltsgleichheit garantiert |
| Design- und relative Links | **Bestanden** im Quality-Job | `scripts/check-design.mjs`; 16 lokale Referenzen |
| Reine Node-Unit-Tests | **6/6 bestanden**, aber Job gesamt rot | Automatischer `node --test`-Fund von `test/browser-smoke.mjs` ohne Playwright |
| Quality-Workflow gesamt | **Fehlgeschlagen** | [Originaler Quality-Lauf](https://github.com/Pierreg99/e-mail-drafts-free/actions/runs/42337934380) |
| Chromium Desktop/Mobil-Viewport | **Bestanden**: 1440×900, 390×844, 360×800 | [Browser-Smoke-Lauf](https://github.com/Pierreg99/e-mail-drafts-free/actions/runs/42337934431) |
| Browser-Screenshots | **Erstellt als temporäres GitHub-Actions-Artefakt** | `actual-browser-screenshots`, Ablauf 14.11.2026; nicht in Git getrackt |
| Chrome Android / Safari iOS auf echter Hardware | **Offen** | Chromium-Viewport ist kein physisches Gerät |
| Screenreader / WCAG-Audit | **Offen** | Statische Checks sind kein Accessibility-Audit |
| Rechtliche, faktische und sprachliche Freigabe | **Offen** | Vorlagen erfordern menschliche Prüfung |
| Penetrationstest / Security-Audit | **Offen** | CSP und keine Mailbox-Verbindung ersetzen keinen Audit |

## Korrektur des Quality-Blockers

Ursache: Node.js startet über `node --test` **alle** passenden Dateien im `test/`-Verzeichnis. Der Browser-Smoke-Test importiert Playwright, das nur im separaten Browser-Job installiert wird. Daher wurde der Quality-Job nach sechs bestandenen Unit-Tests mit `ERR_MODULE_NOT_FOUND: playwright` abgebrochen.

Korrektur: `npm test` führt ausschließlich `node --test test/catalog.test.mjs` aus. `npm run test:browser` bleibt separat und benötigt zuvor installierte Playwright-Abhängigkeiten samt Chromium.

```bash
npm run check             # catalogue + exports + static design + unit tests
npm run test:browser      # separate browser suite; install playwright/chromium first
```

**Wichtig:** Die erfolgreiche Durchführung des neuen Quality-Jobs muss am **neuen Korrektur-PR-Head** erneut belegt werden. Der vorherige rote Lauf wird nicht rückwirkend grün.

## Vor einem öffentlichen Release

- [ ] Quality CI auf dem neuen Korrektur-PR-Head grün
- [x] Chromium-Desktop- und Mobil-Viewport-Smoke-Test mit echtem Screenshot-Artefakt
- [x] JSON↔Markdown für 36 Vorlagen; 36 PDF-Strukturprüfungen
- [ ] PDF-Inhaltstexte 1:1 mit JSON abgleichen
- [ ] Echte Android-/iOS-Geräte testen und Ergebnisse dokumentieren
- [ ] Screenreader, Tastatur, Farbkontrast und Kopierfehlerfall manuell prüfen
- [ ] Kritische Texte und rechtlich relevante Behauptungen fachlich prüfen
- [ ] Lizenzstatus eindeutig festlegen
- [ ] Screenshot-Artefakte dauerhaft ablegen, falls gewünscht

## Grenzen der Validierung

Platzhalterfreiheit bedeutet keine Faktensicherheit. Hosting-Anbieter und Browser-Erweiterungen können technische Informationen verarbeiten. Ein Chromium-Screenshot beweist Rendering, nicht gesetzeskonforme Inhalte. Keine automatisch gespeicherten oder versendeten E-Mails werden durch den Anwendungscode implementiert.
