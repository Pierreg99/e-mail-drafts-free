# Anonymisierung und Datenschutzgrenze / Privacy boundary

Dieses öffentliche Repository verteilt **Vorlagen**, keine Nachrichten aus echten Postfächern. Im Katalog sollen keine echten Personen, Identifikatoren oder vertraulichen Kommunikationsinhalte stehen.

## Verboten im Repository / Never commit

- Echte Namen, E-Mail-Adressen, Kontaktlisten oder private Mail-Threads
- Konto-, Vertrags-, Kunden-, Fall- oder Rechnungsnummern
- IBAN, BIC, Karten-, Wallet- und Zahlungsdaten
- Anschriften, medizinische Details, Gerätekennungen oder Zugangsdaten
- API-Schlüssel, Zugangstokens, Cookies, Passwörter, authentische Mail-Screenshots

## Erlaubte Platzhalter / Allowed placeholders

- Rollen: `[NAME]`, `[COMPANY]`, `[SUPPORT]`
- Vorgänge: `[REFERENCE]`, `[ACCOUNT]`, `[CONTRACT]`
- Daten: `[DATE]`, `[END DATE]`, `[AMOUNT]`, `[CURRENCY]`
- Nur leere Zahlungsfelder: `[IBAN]`, `[BIC]`, `[BANK]`

## Was die Anwendung macht / Runtime behavior

Die statische Seite lädt den öffentlichen Katalog `data/drafts.json` vom selben Webserver und verarbeitet Bearbeitungen **nur im Arbeitsspeicher des Browsers**. Sie hat keine Speicher-, Konto-, API-, Analyse- oder Versandfunktion im Anwendungscode. Der Browser und der Hosting-Dienst können unabhängig davon technische Abrufdaten verarbeiten; Endgeräte und Browser-Erweiterungen liegen außerhalb der Kontrolle des Projekts.

**Wichtig:** Ergänze vertrauliche Informationen möglichst erst im eigenen Mailprogramm. Verlasse dich nicht auf ein öffentliches Webangebot als sicheren Tresor.

## Vor Versand / Before sending

1. Platzhalter und leere Felder beheben.
2. Sachangaben, Beträge, Fristen, rechtliche Formulierungen und Empfänger prüfen.
3. Im eigenen E-Mail-Programm versenden – nicht aus dieser Anwendung.
4. Keine realen Fälle/Schlüssel in Issues, Pull Requests oder Screenshots posten.

Eine grüne technische Platzhalterprüfung ist **keine** Inhalts-, Sicherheits- oder Rechtsfreigabe.
