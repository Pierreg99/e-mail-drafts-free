# Quality and evidence / Qualität und Nachweise

**Stand:** Implementierung auf `feat/cryo-drafts-workbench-20261107`. Hier werden keine CI-Erfolge oder Browser-Screenshots ohne tatsächlichen Nachweis behauptet.

## Evidence-Matrix

| Prüfung | Was sie nachweist | Stand | Nachweis |
| --- | --- | --- | --- |
| Source review | Dateien und Verhalten sind im Feature-Branch vorhanden | Implementiert, manuell sichtbar | `index.html`, `app.js`, `styles.css` |
| Katalogstruktur | Eindeutige IDs, 12 Themen, 36 Entwürfe und 3 Varianten/Thema | Test implementiert; CI ausstehend | `scripts/validate-catalog.mjs` |
| Token-Metadaten | `tokens[]` stimmt mit Betreff und Nachricht überein | 10 Inkonsistenzen korrigiert; CI ausstehend | `data/drafts.json`, `src/catalog.mjs` |
| Filter und Readiness | Basisfunktionen und Negativfälle | Tests implementiert; CI ausstehend | `test/catalog.test.mjs` |
| Design / Links | DOM-IDs, CSP, lokale README-Links, responsive CSS, kein innerHTML | statischer Test implementiert; CI ausstehend | `scripts/check-design.mjs` |
| Sicherheit | Kein autorisierter E-Mail-Versand, kein API-Key-Formular, keine Text-Persistenz im App-Code | Architekturprüfung; externes Audit offen | `app.js`, `docs/ANONYMIZATION.md` |
| Browser Desktop | Chrome/Firefox/Edge: Katalog, Filter, Edit, Copy, Keyboard | Noch nicht belegt | `docs/SCREENSHOTS.md` |
| Browser Mobile | 360 / 390 / 768 px, Chrome Android, Safari iOS | Noch nicht belegt | `docs/SCREENSHOTS.md` |
| Export-Gleichheit | 36 Markdown- und 36 PDF-Artefakte vs. JSON | Noch nicht vollständig belegt | `drafts/INDEX.md` |
| Rechtliche/faktische Richtigkeit | Texte auf jeweilige Situation und aktuelle Gesetzeslage prüfen | Nur durch Menschen/fachkundige Prüfung | Kein Automatik-Gate |

## Lokale Prüfung

```bash
npm run check
```

Dieser Befehl führt `validate`, `check:design` und `node --test` aus. Er belegt keine Ende-zu-Ende-Tests in realen Browsern.

## Release-Gates (für Merge)

- [ ] CI erfolgreich auf dem aktuellen PR-Head (nicht nur auf einem alten Commit)
- [ ] Desktop: Suche, Sprache, Ton, Thema, Editor, Zurücksetzen, Kopieren getestet
- [ ] Mobil: 360px/390px ohne horizontales Überlaufen oder verdeckte Buttons
- [ ] Tastatur: Tab-Reihenfolge, Fokus, Screenreader-Ansagen überprüft
- [ ] Kopieren: erlaubter und verweigerter Clipboard-Zugriff getestet
- [ ] Vorlagen: mindestens kritische Beispiele für Konto, Rechnung, Beschwerde rechtlich und sprachlich geprüft
- [ ] JSON/Markdown/PDF-Exportkonsistenz geprüft oder Abweichungen veröffentlicht
- [ ] Zwei echte Screenshots dokumentiert (Desktop und Mobil)
- [ ] Keine persönlichen Daten, Tokens oder Mailbox-Inhalte in PR und Screenshots
- [ ] Lizenzstatus geklärt, bevor Dritten Nutzungsrechte behauptet werden

## Risiken und Einschränkungen

1. Ein ersetzter Platzhalter garantiert weder korrekte Inhalte noch eine passende Tonalität.
2. Statische Hosting-Logs können Metadaten zum Seitenaufruf enthalten. Der Anwendungscode übermittelt keine eingegebenen Texte.
3. Die statische CSP ist eine zusätzliche Hürde, kein vollständiges Security-Audit.
4. Eine lokal gespeicherte HTML-Kopie unter `file://` kann Fetch blockieren; verwende einen HTTP-Server.
5. Browser-Erweiterungen und das Betriebssystem sind außerhalb der Prüfbarkeit dieses Repos.
6. Die Bestands-PDFs sind Dokumentexporte, nicht automatisch an den kanonischen JSON-Katalog gekoppelt.
