# Mitwirken / Contributing

## Sicherer Workflow: Discovery → Branch → Commit → PR → CI → Review → Squash

1. In `main` die aktuellen Vorlagen und Datenschutzgrenzen lesen.
2. Einen Feature-Branch für Änderungen erstellen (z.B. `feat/accessibility`).
3. Vorlagen ausschließlich anonymisiert ergänzen; immer **EN, DE, MULTI** pro Anwendungsfall liefern.
4. `data/drafts.json` als kanonische Quelle verwenden; `tokens[]` aus Betreff + Nachricht ableiten.
5. `npm run check` ausführen, Beispiele im Browser prüfen.
6. PR mit Änderung, Risiko, Testnachweis und bekannten Grenzen öffnen.
7. CI-Ergebnis und Review prüfen; erst danach ggf. Squash-Merge in `main`.

## Pull-Request-Checkliste / PR checklist

- [ ] Keine personenbezogenen Daten, Zahlungsverbindungen, API-Keys oder privaten E-Mail-Texte
- [ ] Keine unkontrollierte HTML-Einfügung (benutzer-/katalogseitige Werte als `textContent`)
- [ ] Keine neue Persistenz, externe Netzwerkverbindung oder Auto-Send ohne explizite Datenschutz-/Architekturprüfung
- [ ] Katalog- und Token-Prüfungen bestanden
- [ ] Desktop und Mobil geprüft, relevante Screenshots falls vorhanden
- [ ] README, Ausgabedateien und Dokumentation synchron
- [ ] Offen vs. belegt klar getrennt

## Begriffe (DE / EN)

- **Commit:** gespeicherter Änderungsschnappschuss / recorded snapshot.
- **Push:** lokale Commits hochladen / upload local commits.
- **Pull:** Änderungen holen und zusammenführen / fetch and integrate.
- **PR:** Änderungen zur Diskussion und Prüfung / proposal for review.
- **Draft PR:** PR noch nicht zur Freigabe / not ready for merge review.
- **Squash:** mehrere Commits zu einem zusammenfassen / condense commits.
- **CI:** automatisierte Prüfungen / automated quality checks.

Bitte keine sensiblen echten Fälle in Issues oder Pull Requests verwenden.
