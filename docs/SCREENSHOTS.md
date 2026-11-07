# Echte Screenshots / Real browser evidence

## Verifizierter Workflow-Beleg vom 07.11.2026

Der [Browser-Smoke-Workflow](https://github.com/Pierreg99/e-mail-drafts-free/actions/runs/42337934431) wurde auf dem Feature-Commit `e20121152c3c3643504e6ec46b469e5b4ac31cc0` **erfolgreich** abgeschlossen.

Dabei entstand das GitHub-Actions-Artefakt **`actual-browser-screenshots`** (Artifact-ID `13560083172`). Es enthält echte Playwright/Chromium-Screenshots. Die Dateien sind in GitHub Actions erreichbar; sie wurden **nicht** in das Repository übernommen. Das Artefakt läuft laut GitHub am **14. November 2026** ab.

| Browser-Test | Viewport | Ergebnis | Art |
| --- | --- | --- | --- |
| Chromium Desktop | 1440 × 900 | Bestanden | Playwright, tatsächlicher Browser |
| Chromium mobiler Viewport | 390 × 844 | Bestanden | Simulierte mobile Größe, kein Android-Gerät |
| Chromium kleiner mobiler Viewport | 360 × 800 | Bestanden | Simulierte mobile Größe, kein iPhone |

**Wichtig:** Der SVG-Header `assets/readme-banner.svg` ist ein Design-Vektorbild, kein Screenshot und kein Funktionsbeleg. Im README dürfen nur tatsächlich vorhandene, überprüfte Bildpfade verlinkt werden.

## Reproduzieren / Reproduce

```bash
python3 -m http.server 8000
npm install --no-save --package-lock=false playwright@1.56.1
npx playwright install chromium
npm run test:browser
```

Für CI unter Ubuntu nutzt `.github/workflows/browser-smoke.yml` zusätzlich `npx playwright install --with-deps chromium`.

Die Testdatei `test/browser-smoke.mjs` kontrolliert unter anderem 36 geladene Entwürfe, Filter, Bearbeitungs- und Reset-Status, Kopier-Feedback, fehlende horizontale Überläufe und JavaScript-Fehler. Sie erfasst echte Screenshots als `artifacts/desktop-library.png`, `artifacts/mobile-editor.png` und `artifacts/mobile-small.png`.

## Weiter erforderliche manuelle Abnahme

1. Chrome Android und Safari iOS auf **echten Geräten**, nicht nur in Chromium-Viewport-Simulation.
2. Tastaturnavigation, Screenreader, Fokus und Kontrast.
3. Zwischenablage im verweigerten Kontext.
4. Sachlich und rechtlich vollständige Kontrolle der kritischen E-Mail-Texte.
5. Screenshots ohne private Daten dauerhaft committen, wenn Veröffentlichungsfreigabe vorliegt.

Screenshots beweisen nur die sichtbare Anwendung in ihrer Testkonfiguration; sie beweisen weder Sicherheitszertifizierung noch vollständige Funktionalität.
