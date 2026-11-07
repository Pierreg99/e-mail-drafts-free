# Roadmap / Überprüfbare Meilensteine

| Phase | Umfang | Evidenzkriterium | Status |
| --- | --- | --- | --- |
| Discovery | Bestandsaufnahme: 36 Vorlagen, 12 Themen, 3 Sprachen; Sicherheitsgrenzen | Quell-Dateien gelesen | Erledigt |
| Design | CryoPG-Tokens, responsive Workbench, mobile Layouts | HTML + CSS in Feature-Branch | Implementiert |
| Implementation | Katalog, Filter, Bearbeitung, Token-Gate, Originalkopie | `app.js` + `src/catalog.mjs` | Implementiert |
| Validation | Katalog- und Unit-Tests, statische Design-Prüfung | grüner CI-Lauf am PR-Head | Ausstehend bis CI-Nachweis |
| Browser pilot | Desktop, Android/iOS, Tastatur, Zwischenablage | Protokoll und Screenshots | Ausstehend |
| Content review | Kritische Texte und Exportkonsistenz | Review der 36 Vorlagen & PDF-/MD-Exportpfade | Ausstehend |
| Release | Review, Squash-Merge, optional Pages | Merge und produktive Abnahme | Nicht freigegeben |

## Priorität P0 / Vor einem Release

1. CI-Status der aktuellen Branch-Spitze einsehen und Probleme beheben.
2. Echte Desktop- und mobile Browserabnahmen inkl. Kopierfehlerfall durchführen.
3. Bestehende Markdown-/PDF-Artefakte gegen `data/drafts.json` vergleichen.
4. Sicherheit/Korrektheit kritischer Formulierungen fachlich prüfen; keine Rechtsgarantien.
5. README, Screenshots und Lizenzstatus vor dem Merge überprüfen.

## Priorität P1 / Nützliche, aber nicht versprochene Funktionen

- Optionaler, **nur lokal** bereitgestellter JSON-Export eigener Texte (mit Privatsphäre-Hinweis).
- Sprachumschalter für die Bedienoberfläche (die Vorlagen sind bereits EN/DE/MULTI).
- Visuell nachvollziehbarer Theme-Switcher mit getesteten Kontrastwerten.
- Besseres Screenreader-Review und automatisierte Browser-Smoke-Tests.

## Nicht im Scope

- Auto-Send, API-Key-Speicherung, Browser-basierte Gmail-Synchronisierung oder ungeprüfte KI-Zusammenfassungen.
- Backend, SaaS-Abrechnung, Account-System, Tracking.
- Ohne Nachweis behauptete Qualitäts-Scores, Sicherheitszertifikate und Integrationen.

Statusangaben dürfen erst anhand **konkreter** CI-Runs, Tests oder Dateiartefakte auf „bestanden“ gesetzt werden.
