# 📖 BuchApp – Frontend

Eine moderne Single-Page-Application (SPA) zur Verwaltung von Buchbeständen. Entwickelt mit React 19, TypeScript und Vite, bietet diese Anwendung eine responsive Benutzeroberfläche zum Suchen, Anzeigen, Anlegen und Bearbeiten von Büchern.

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Built%20with-React%20%7C%20Vite%20%7C%20Tailwind-zn)

## 🚀 Features

* **Bücherübersicht & Suche**: Filterbare Liste aller Bücher (Titel, Art, Lieferbarkeit, Rating) mit Paginierung.
* **Detailansicht**: Umfassende Informationen zu jedem Buch (Preis, ISBN, Autoren, Bilder).
* **Administration (Geschützt)**:
    * **Authentifizierung**: JWT-basierter Login-Bereich.
    * **Erstellen**: Hinzufügen neuer Bücher mit Formular-Validierung.
    * **Bearbeiten**: Aktualisieren von Buchdaten (inkl. *Optimistic Locking* via `If-Match` Header).
    * **Löschen**: Entfernen von Datensätzen (nur für Admins).
* **Responsive Design**: Optimiert für Desktop und Mobile dank Tailwind CSS & daisyUI.
* **Feedback**: Ladeanimationen, Fehlermeldungen (Toasts/Alerts) und 404-Handling.

## 🛠 Technologie-Stack

Dieses Projekt nutzt aktuelle Web-Technologien für maximale Performance und Developer Experience:

* **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [daisyUI 5](https://daisyui.com/)
* **Routing**: [React Router v7](https://reactrouter.com/)
* **State Management**: React Context API & Hooks
* **Testing**:
    * E2E: [Playwright](https://playwright.dev/)
    * Unit: [Vitest](https://vitest.dev/)
* **Qualitätssicherung**: ESLint, Prettier
* **Deployment**: Docker (Nginx Alpine)

## ⚙️ Voraussetzungen

Stelle sicher, dass folgende Tools auf deinem System installiert sind:

* [Node.js](https://nodejs.org/) (Version 20 oder höher empfohlen)
* [pnpm](https://pnpm.io/) (Empfohlener Paketmanager)
* Ein laufendes Backend (REST-API), auf das die App zugreifen kann.

## 📦 Installation & Start

1.  **Repository klonen**
    ```bash
    git clone [https://github.com/dein-user/web-anwendung.git](https://github.com/dein-user/web-anwendung.git)
    cd web-anwendung
    ```

2.  **Abhängigkeiten installieren**
    ```bash
    pnpm install
    ```

3.  **Umgebungsvariablen konfigurieren**
    Erstelle eine `.env` Datei im Hauptverzeichnis (siehe `.env.example` falls vorhanden) oder nutze die Defaults:
    ```env
    VITE_API_URL=https://localhost:3000/rest
    ```

4.  **Entwicklungsserver starten**
    ```bash
    pnpm dev
    ```
    Die App ist nun unter `http://localhost:5173` erreichbar.

## 📜 Verfügbare Skripte

In der `package.json` sind folgende Befehle definiert:

| Befehl | Beschreibung |
| :--- | :--- |
| `pnpm dev` | Startet den lokalen Entwicklungsserver. |
| `pnpm build` | Kompiliert TypeScript und baut die App für Production (`dist/`). |
| `pnpm preview` | Startet einen lokalen Server, um den Production-Build zu testen. |
| `pnpm lint` | Prüft den Code auf Fehler mit ESLint. |
| `pnpm format` | Formatiert den Code mit Prettier. |
| `pnpm test` | Führt Unit-Tests mit Vitest aus. |
| `pnpm test:e2e` | Führt End-to-End Tests mit Playwright aus. |

## 🐳 Docker & Deployment

Das Projekt enthält ein `Dockerfile` für ein Multi-Stage Build. Das Ergebnis ist ein leichtgewichtiger Nginx-Container, der die statischen Dateien ausliefert.

**Image bauen:**
```bash
docker build -t buch-frontend .
```

**Container starten:**
```bash
docker run -p 80:80 buch-frontend
```

Die Anwendung ist anschließend unter http://localhost verfügbar. Die Nginx-Konfiguration (nginx.conf) kümmert sich zudem um das Proxying von API-Anfragen an das Backend (z.B. /rest, /auth), um CORS-Probleme zu vermeiden

## CI/CD

Das Projekt nutzt GitHub Actions für Continuous Integration:
* **CI:** Führt bei jedem Push Linting, Format-Checks, Builds und Sicherheitsaudits durch.
* **Deploy:** Erstellt bei erfolgreichem Build automatisch ein Docker-Image und pusht es in die GitHub Container Registry (ghcr.io).

## 📂 Projektstruktur

```text
src/
├── API/            # API-Funktionen (Fetch-Wrapper)
├── assets/         # Statische Bilder/Icons
├── components/     # Wiederverwendbare UI-Komponenten (Layout, Loader, Alerts)
├── pages/          # Hauptansichten (Routes) der Anwendung
├── tests/          # E2E Tests (Playwright)
├── App.tsx         # Routing-Logik
└── main.tsx        # Einstiegspunkt
```

## 📄 Lizenz
Dieses Projekt ist unter der [MIT Lizenz](https://www.google.com/search?q=LICENSE) veröffentlicht.
