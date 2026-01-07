📖 BuchApp – Web-AnwendungEine moderne Web-Anwendung zur Verwaltung von Büchern, entwickelt mit React, TypeScript und Vite. Die Anwendung ermöglicht das Suchen, Anzeigen, Erstellen und Bearbeiten von Buchdatensätzen über eine REST-API.🚀 FeaturesBücherliste & Suche: Durchsuche den Buchbestand mit Filtern für Titel, Art (EPUB, Hardcover, Paperback), Lieferbarkeit und Mindest-Rating.Detailansicht: Detaillierte Informationen zu jedem Buch inklusive Preis, ISBN und Abbildungen.Bestandsverwaltung:Anlegen: Neue Bücher über ein validiertes Formular hinzufügen.Bearbeiten: Vorhandene Buchdaten aktualisieren.Löschen: Entfernen von Büchern aus dem System (Admin-Rechte erforderlich).Authentifizierung: JWT-basierter Login zum Schutz administrativer Funktionen.Modernes UI: Responsives Design mit Tailwind CSS.🛠 TechnologienFrontend-Framework: React (mit TypeScript)Build-Tool: ViteStyling: Tailwind CSS & daisyUI (falls installiert)Routing: React RouterState & Data: React Hooks & Context APITesting:E2E-Tests: PlaywrightUnit-Tests: VitestCI/CD: GitHub Actions (Linting, Testing, Docker-Build)Code Quality: ESLint, Prettier📦 Installation & StartVoraussetzungenNode.js (Version 20+ empfohlen)pnpm (empfohlener Package Manager, npm funktioniert ebenfalls)Schritt-für-SchrittRepository klonen:git clone <repository-url>
cd web-anwendung
Abhängigkeiten installieren:pnpm install
Umgebungsvariablen konfigurieren:Kopiere die Vorlage oder erstelle eine .env Datei im Hauptverzeichnis:# Beispiel .env
VITE_API_URL=https://localhost:3000/rest
Entwicklungsserver starten:pnpm dev
Die App ist nun unter http://localhost:5173 erreichbar.📜 Verfügbare SkripteIn der package.json sind folgende Skripte definiert:BefehlBeschreibungpnpm devStartet den lokalen Entwicklungsserver.pnpm buildErstellt den optimierten Production-Build im dist/ Ordner.pnpm previewStartet einen lokalen Server, um den Production-Build zu testen.pnpm lintÜberprüft den Code auf Fehler (ESLint).pnpm formatFormatiert den Code (Prettier).pnpm testFührt Unit-Tests aus (Vitest).pnpm test:e2eFührt End-to-End Tests aus (Playwright).🐳 Docker DeploymentDas Projekt ist für den Betrieb in einem Docker-Container vorbereitet (via Nginx).Image bauen:docker build -t buch-frontend .
Container starten:docker run -p 80:80 buch-frontend
Die Anwendung ist anschließend unter http://localhost verfügbar.🧪 TestingE2E Tests (Playwright)Die End-to-End Tests simulieren Benutzerinteraktionen im Browser.# Tests ausführen
pnpm test:e2e

# UI-Modus öffnen (für Debugging)

pnpm exec playwright test --ui
Unit Testspnpm test
📄 LizenzDieses Projekt ist lizenziert unter der MIT License (oder siehe https://www.google.com/search?q=LICENSE Datei).
