# YomiNinja

Desktop OCR application for Japanese text recognition. Captures screenshots, runs OCR via Google Cloud Vision, and displays recognized text in a transparent overlay. Supports automatic translation of OCR results via Gemini API or KoboldCpp.

## Features

- Screen/window capture with OCR text recognition (Google Cloud Vision)
- Transparent overlay displaying recognized text with positioning metadata
- Automatic translation of recognized text (Gemini API or KoboldCpp)
- Dictionary lookups (Yomichan/Yomitan integration)
- Configurable hotkeys and overlay behavior
- OCR templates for region-based recognition
- Browser extension support

## Tech Stack

- Electron + Next.js (React)
- TypeScript
- TypeORM + SQLite
- MUI (Material UI)

## Development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Build

```bash
npm run build
npm run dist
```

## Translation Setup

1. Open Settings > Translation
2. Select a source (Gemini or KoboldCpp)
3. For Gemini: enter your API key and optionally change the model
4. For KoboldCpp: enter the host URL (e.g. `http://localhost:5001`)
5. Select target language and enable translation
6. OCR results will be automatically translated before displaying in the overlay
