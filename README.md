# Kinetics Hackathon 2026 — Live AI & Robotics Leaderboard

> **A broadcast-grade real-time command center dashboard and interactive 3D championship presentation stage for autonomous robotics and AI/ML competitions.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.13-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169.0-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## 📌 Overview

**Kinetics Hackathon 2026 Leaderboard** is a dual-mode telemetry visualization platform designed for high-stakes robotics, machine learning, and autonomous systems competitions. It connects directly to live data feeds (such as public or authenticated Google Sheets) and renders competition metrics, real-time rank overtakes, score changes, and system health without requiring a dedicated backend server.

The platform provides two primary modes of operation:
1. **Live Evaluation Mode (2D Dashboard)**: High-density command center layout featuring a stepped physical podium, procedural telemetry indicators, animated score counters, and categorized status tracking.
2. **Final 3D Podium Ceremony Stage**: A WebGL-powered 3D stadium presentation environment built with Three.js featuring dynamic pillar elevation, GPU point-cloud LiDAR terrain scanning, golden ember particle physics, interactive mouse parallax, and floating HTML scorecards.

---

## ✨ Key Capabilities

* **Dual-View Operational Architecture**:
  * **Live Mode**: Stepped podium cards for the top 3 contenders (#1 elevated gold, #2 silver, #3 bronze) with a 12-column ranked table for contenders #4 through #15.
  * **3D Ceremony Mode**: Full-window Three.js WebGL arena with procedural lighting, reflective floor planes, and score-proportional pillar heights that trigger on competition conclusion.
* **Zero-Backend Google Sheets Live Sync**:
  * Automated background polling (3–5 second configurable intervals) using Google Visualization API (`gviz/tq`) with CSV export fallback.
  * Robust column matching for `Team Name`, `Institute`, `Total Score`, `Task Score`, `Penalty`, `Tasks Completed`, `Status`, and `Last Updated`.
  * Sanitization engine with automatic row filtering and duplicate key protection.
* **Procedural Telemetry & Glyph Engine**:
  * Inline SVG telemetry visualizations representing algorithm performance: LiDAR accuracy, Point Cloud depth, Neural RL convergence, Trajectory path planning, Grid alignment, Hyperparameter optimization, and Visual SLAM.
* **Event Simulator & Organizer Controls**:
  * Built-in drawer to simulate score surges (+150 to +500 pts), rank swaps (Rank 4 overtaking Rank 2), and connection latency.
  * 1-click loading of the standard 15-team competition reference dataset (975 to 380 pts).
* **Web Audio Sound Effects Synthesizer**:
  * Browser-native Web Audio API synthesizer generating real-time ascending and descending sci-fi harmonic chords on rank promotions and overtakes.
* **Dual Distribution Format**:
  * **Full React + TypeScript + Vite SPA** for modular development and custom deployments.
  * **Zero-Install Standalone `index.html`** executable directly in any modern browser without Node.js or build steps.

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    subgraph DataSources["Data Sources & Ingestion"]
        GS["Google Sheets (GViz / CSV / v4 API)"]
        MD["Static Reference Dataset (15 Teams)"]
        SIM["Live Event Simulator (State Injector)"]
    end

    subgraph CoreEngine["Leaderboard Core Engine"]
        Normalizer["Data Normalizer & Sanitizer"]
        RankEngine["Rank Delta & Sorting Engine"]
        AudioEngine["Web Audio Synthesizer"]
        Store["State Management (Teams, Status, Mode)"]
    end

    subgraph Views["Presentation Views"]
        Live2D["Live 2D HUD & Stepped Podium"]
        Stage3D["Three.js 3D Stadium Ceremony Stage"]
        Table["12-Column Contender Table (#4 - #15)"]
    end

    GS -->|Periodic Fetch (3500ms)| Normalizer
    MD -->|Initial Load| Normalizer
    SIM -->|Simulated Surge / Swap| Normalizer

    Normalizer --> RankEngine
    RankEngine -->|Rank Delta Detected| AudioEngine
    RankEngine --> Store

    Store --> Live2D
    Store --> Stage3D
    Store --> Table
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18.3](https://react.dev/) | Component architecture, state lifecycle, and rendering |
| **Language** | [TypeScript 5.4](https://www.typescriptlang.org/) | Strict static typing and interface definitions |
| **Build Tool** | [Vite 5.2](https://vitejs.dev/) | Hot Module Replacement (HMR) and production bundling |
| **3D & Graphics** | [Three.js](https://threejs.org/) / [@react-three/fiber](https://r3f.docs.pmnd.rs/) | WebGL 3D stadium stage, camera rig, and shaders |
| **Post-Processing** | [@react-three/drei](https://github.com/pmndrs/drei) / [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | Bloom, vignette, and ambient effects |
| **3D Background** | [@splinetool/runtime](https://spline.design/) | Interactive retrofuturism ambient canvas layer |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) / Vanilla CSS | Dark theme design system, layout grid, and micro-animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Interface iconography |
| **Audio** | Web Audio API | Procedural synthesizer for telemetry sound cues |

---

## 📁 Project Structure

```text
kinetics-hackathon-leaderboard/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── common/             # Modals, drawers, and simulator UI
│   │   │   ├── ConfigModal.tsx       # Telemetry & Google Sheets settings
│   │   │   └── SimulatorDrawer.tsx   # Live event test simulator
│   │   ├── hero3d/             # Three.js 3D championship presentation stage
│   │   │   ├── CameraRig.tsx         # Parallax & dynamic camera controls
│   │   │   ├── Effects.tsx           # Bloom & ember particle systems
│   │   │   ├── Hero3D.tsx            # Stage container & quality coordinator
│   │   │   ├── Podium.tsx            # 3D brushed-metal elevation pillars
│   │   │   ├── Scene3D.tsx           # WebGL canvas & lighting
│   │   │   ├── Stage.tsx             # Studio floor, volumetric beams & rings
│   │   │   ├── TeamBadge.tsx         # Projected HTML leaderboard badges
│   │   │   └── Terrain.tsx           # GPU point-cloud LiDAR scanline
│   │   ├── layout/             # Navigation, branding header & HUD
│   │   │   ├── Header.tsx            # Logo, LIVE status & controls
│   │   │   └── TelemetryHUD.tsx      # System telemetry header
│   │   ├── leaderboard/        # Ranking table and metric visualizers
│   │   │   ├── LeaderboardRow.tsx    # Single team record row
│   │   │   ├── LeaderboardTable.tsx  # 12-column scrollable table
│   │   │   ├── MetricVisual.tsx      # Procedural SVG telemetry glyphs
│   │   │   └── ScoreCounter.tsx      # Eased numeric counter
│   │   ├── podium/             # 2D stepped physical podium cards
│   │   │   ├── Podium.tsx            # Top 3 podium layout
│   │   │   └── PodiumCard.tsx        # Chamfered gold/silver/bronze cards
│   │   └── spline/             # Spline & canvas background effects
│   │       └── SplineBackground.tsx  # Volumetric beam & particle canvas
│   ├── services/               # Telemetry, sound, and data ingestion
│   │   ├── audioEffects.ts     # Web Audio harmonic synthesizer
│   │   ├── googleSheets.ts     # GViz & CSV sync engine with fuzzy parsing
│   │   └── mockData.ts         # Hackathon 15-team reference dataset
│   ├── types/                  # TypeScript interfaces & types
│   │   └── leaderboard.ts      # Team, MetricType, Config declarations
│   ├── App.tsx                 # Root application component
│   ├── index.css               # Global styles & design system
│   ├── main.tsx                # React entry point
│   └── vite-env.d.ts           # Vite client type definitions
├── .editorconfig               # Editor code formatting standard
├── .env.example                # Environment variables template
├── .gitattributes              # Git line endings & binary declarations
├── .gitignore                  # Git ignore rules
├── index.html                  # Standalone zero-install broadcast dashboard
├── package.json                # Project dependencies & scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind theme & color definitions
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite server & build configuration
```

---

## 📋 Prerequisites

* **Node.js**: Version `18.0.0` or higher
* **npm**: Version `9.0.0` or higher (or `pnpm` / `yarn`)
* **Modern Web Browser**: Chrome, Edge, Firefox, or Safari with WebGL support

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/kinetics-hackathon-leaderboard.git
   cd kinetics-hackathon-leaderboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional)**:
   ```bash
   cp .env.example .env
   ```

---

## ⚙️ Configuration (`.env`)

Configure the data engine and connection parameters in your `.env` file:

```env
# Data Source Mode: 'google-sheets' | 'mock' | 'simulator'
VITE_DATA_SOURCE=google-sheets

# Google Sheet ID (from URL: https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit)
VITE_GOOGLE_SHEET_ID=your_google_sheet_id_here

# Sheet Tab Name (Default: Sheet1)
VITE_GOOGLE_SHEET_NAME=Sheet1

# Google Sheets API v4 Key (Optional for private sheets; public sheets sync without key)
VITE_GOOGLE_SHEETS_API_KEY=

# Real-time polling interval in milliseconds (Default: 3500)
VITE_LEADERBOARD_POLL_INTERVAL=3500

# Spline 3D Scene URL
VITE_SPLINE_SCENE_URL=https://prod.spline.design/fba5a24b-a843-461d-b983-e5c140313420/scene.splinecode
```

---

## 📊 Google Sheets Setup Guide

To feed live scores directly from Google Sheets:

1. Create a Google Sheet with the following recommended columns:
   | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
   | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
   | **Team Name** | **Institute** | **Total Score** | **Task Score** | **Penalty** | **Tasks Completed** | **Status** | **Last Updated** |
   | AetherBots | NIT Delhi | 975 | 980 | 5 | 12 | Qualified | 2026-10-07 04:15:00 |
   | RoboVanguard | IIT Delhi | 915 | 930 | 15 | 11 | Qualified | 2026-10-07 04:14:00 |
   | NeuroDrive | DTU | 870 | 890 | 20 | 10 | Qualified | 2026-10-07 04:13:00 |
   | CircuitForge | NSUT | 825 | 850 | 25 | 10 | Qualified | 2026-10-07 04:12:00 |

2. In Google Sheets, click **Share** → select **"Anyone with the link can view"**.
3. Copy the Spreadsheet ID from the URL:
   ```text
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
4. In the web dashboard, click the **Settings (Gear Icon)** in the header, paste your Sheet ID, and click **Apply & Save**.

---

## 💻 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on `http://localhost:3000` with hot reloading. |
| `npm run build` | Runs TypeScript compilation (`tsc`) and builds the optimized production bundle to `/dist`. |
| `npm run preview` | Locally serves the production build from `/dist` for validation. |

---

## ⚡ Standalone Zero-Install Mode

For offline presentations, hackathon stages, or low-latency environments:

* Open [`index.html`](file:///d:/Software%20Projects/Kinetics%20Hackathon%20-%20Leaderboard%20Website/index.html) directly in any browser.
* Includes all components, Three.js 3D stage, audio synthesizers, Google Sheet sync engine, and full simulator in a single distribution file with zero build step required.

---

## 🌐 Deployment

### Vercel / Netlify / Cloudflare Pages

* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Node Version**: `18.x` or `20.x`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
