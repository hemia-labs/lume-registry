# lume-registry

**Source of truth** for [Lume](https://github.com/hemia-labs/lume) components. Components are developed as real `.vue` files with a playground for visual development. A build script converts them to JSON so the Lume CLI can consume them via `fetch`.

## Project structure

```
lume-registry/
├── src/
│   ├── components/              # Real .vue components
│   │   ├── button/
│   │   │   ├── Button.vue
│   │   │   └── meta.json
│   │   └── input/
│   │       ├── Input.vue
│   │       └── meta.json
│   └── playground/              # Vite + Vue app for local preview
│       ├── App.vue
│       ├── main.ts
│       └── index.html
├── scripts/
│   └── build-registry.ts        # .vue → .json build script
├── public/
│   └── r/                       # Generated output (gitignored)
│       └── components/
│           ├── index.json
│           ├── button.json
│           └── input.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting started

```bash
npm install
```

## Development

Run the playground with hot-module replacement:

```bash
npm run dev
```

Opens at `http://localhost:5173`. The sidebar lists all components in `src/components/`. Clicking one renders it in the preview area.

## Building the registry

Convert all `.vue` components to JSON:

```bash
npm run build:registry
```

This reads every `src/components/<name>/meta.json` and the `.vue` files listed there, embeds their content and writes:

- `public/r/components/<name>.json` — one file per component
- `public/r/components/index.json` — list of all available components

Watch mode (re-builds on every change):

```bash
npm run dev:registry
```

## Serving the registry locally

```bash
npm run serve:registry
```

Serves the generated JSON at `http://localhost:3000/components/button.json`.

## JSON schema

Each component JSON follows this schema:

```json
{
  "name": "button",
  "framework": "vue",
  "description": "Botón reutilizable con variantes",
  "files": [
    {
      "name": "Button.vue",
      "content": "<script setup>...</script>..."
    }
  ],
  "dependencies": {},
  "registryDependencies": []
}
```

`public/r/components/index.json`:

```json
{
  "components": [
    { "name": "button", "description": "Botón reutilizable con variantes" },
    { "name": "input",  "description": "Input de texto reutilizable" }
  ]
}
```

## How the Lume CLI consumes the registry

```ts
// Set REGISTRY_URL to your deployed registry or use http://localhost:3000 for local testing
const REGISTRY_URL = process.env.REGISTRY_URL ?? 'https://registry-ui.hemia.cloud';

const res  = await fetch(`${REGISTRY_URL}/r/components/button.json`);
const comp = await res.json();

// comp.files → write each file to the user's project
// comp.dependencies → install with npm/pnpm
```

## Adding a new component

1. Create a directory under `src/components/<name>/`.
2. Add a `meta.json`:
   ```json
   {
     "name": "<name>",
     "framework": "vue",
     "description": "…",
     "dependencies": {},
     "registryDependencies": [],
     "files": ["<Name>.vue"]
   }
   ```
3. Add the `.vue` file(s) listed in `meta.files`.
4. Run `npm run dev` to preview, then `npm run build:registry` to generate the JSON.

## Flow

```
Development                   Build                     Consumption (CLI)
─────────────────────────     ───────────────────────   ──────────────────────────────
src/components/button/        npm run build:registry    lume add button
  Button.vue  ──────────────► public/r/components/  ──► fetch(registry/r/button.json)
  meta.json                     button.json              write Button.vue to project
      │                                                  install dependencies
      ▼
Playground (Vite HMR)
http://localhost:5173
```

