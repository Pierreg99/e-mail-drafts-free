# CryoPG Draft Studio – Evidence Roadmap

| Phase | Status (7.11.2026) | Nachweis / nächster Gate |
| --- | --- | --- |
| Discovery | Abgeschlossen | 12 Themen, 36 Vorlagen, 3 Sprachfassungen |
| UI/UX Design | Implementiert und gemergt | `index.html`, `styles.css` |
| Editor und Datensicherheit | Implementiert | `app.js`, `src/catalog.mjs`, manuelle Auditpflicht |
| Katalog & Export | Automatisierter Abgleich bestanden | 36 Markdown-Exports passen zu JSON; PDF-Struktur valide |
| Desktop-/Mobile Chromium-Smoke | Bestanden | [Test-Run](https://github.com/Pierreg99/e-mail-drafts-free/actions/runs/42337934431); 3 Viewports |
| Quality CI | Blockiert im ursprünglichen Merge | Playwright-Import in Node-Test-Discovery; Fix-Branch erstellt |
| Reale Geräte / Accessibility | Offen | Android + iOS + Screenreader + Kontrast |
| Content/Legal Review | Offen | Fakten-/Rechtsprüfung der Vorlagen |
| Public SaaS/Release | Nicht vorwegnehmen | Keine Backend-/Mailbox-Integration, keine Produktfreigabe |

## Konkreter nächster Meilenstein

- Quality-Gate-Fix als **separaten PR** prüfen und erfolgreich ausführen.
- Sicherstellen, dass Browser-Smoke unabhängig von Unit-Tests läuft.
- Bestehende Artefakte zeitnah sichern, sofern Bilder dauerhaft in README eingebunden werden sollen.
- 36 PDF-Textinhalte mit JSON verifizieren, nicht bloß Header/EOF.
- Browserabnahmen auf echter Hardware sowie fachliche Freigabe dokumentieren.

## P1 und P2 – nur Vorschläge

- Mehrsprachige Oberflächentexte (derzeit sind vor allem die Vorlagen EN/DE/MULTI).
- Sprach- und Faktenreview pro Kategorie mit referenzierten Belegen.
- Explizite Tests zu Clipboard-Rechten und Accessibility mit Playwright.
- Optionaler Offline-Export nach bewusster Nutzeraktion, ohne Server-Persistenz.

Keine Release-, Sicherheits- oder Qualitätsbehauptung ohne konkrete Nachweise.
