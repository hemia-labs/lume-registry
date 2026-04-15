# lume-registry

**Fuente de verdad** para componentes de [Lume](https://github.com/hemia-labs/lume). Los componentes se desarrollan como archivos `.vue` reales con un playground para desarrollo visual. Un script de build los convierte a JSON para que la CLI de Lume los consuma via `fetch`.

## Estructura del proyecto

```
lume-registry/
├── src/
│   ├── components/              # Componentes .vue reales
│   │   ├── button/
│   │   │   ├── Button.vue
│   │   │   └── meta.json
│   │   └── input/
│   │       ├── Input.vue
│   │       └── meta.json
│   └── playground/              # App Vite + Vue para previsualización local
│       ├── App.vue
│       ├── main.ts
│       └── index.html
├── scripts/
│   └── build-registry.ts        # Script de build .vue → .json
├── public/
│   └── r/                       # Output generado (gitignore)
│       └── components/
│           ├── index.json
│           ├── button.json
│           └── input.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Primeros pasos

```bash
npm install
```

## Desarrollo

Ejecuta el playground con hot-module replacement:

```bash
npm run dev
```

Se abre en `http://localhost:5173`. La barra lateral lista todos los componentes en `src/components/`. Al hacer clic en uno, se renderiza en el área de previsualización.

## Construyendo el registry

Convierte todos los componentes `.vue` a JSON:

```bash
npm run build:registry
```

Esto lee cada `src/components/<name>/meta.json` y los archivos `.vue` listados ahí, embebe su contenido y escribe:

- `public/r/components/<name>.json` — un archivo por componente
- `public/r/components/index.json` — lista de todos los componentes disponibles

Modo watch (reconstruye en cada cambio):

```bash
npm run dev:registry
```

## Sirviendo el registry localmente

```bash
npm run serve:registry
```

Sirve el JSON generado en `http://localhost:3000/components/button.json`.

## Schema JSON

Cada component JSON sigue este schema:

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

## Cómo la CLI de Lume consume el registry

```ts
// Configura REGISTRY_URL a tu registry desplegado o usa http://localhost:3000 para testing local
const REGISTRY_URL = process.env.REGISTRY_URL ?? 'https://registry-ui.hemia.cloud';

const res  = await fetch(`${REGISTRY_URL}/r/components/button.json`);
const comp = await res.json();

// comp.files → escribir cada archivo al proyecto del usuario
// comp.dependencies → instalar con npm/pnpm
```

## Agregando un nuevo componente

1. Crea un directorio bajo `src/components/<name>/`.
2. Agrega un `meta.json`:
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
3. Agrega el archivo `.vue` (o archivos) listados en `meta.files`.
4. Ejecuta `npm run dev` para previsualizar, luego `npm run build:registry` para generar el JSON.

## Flujo

```
Desarrollo                   Build                     Consumo (CLI)
─────────────────────────     ───────────────────────   ──────────────────────────────
src/components/button/        npm run build:registry    lume add button
  Button.vue  ──────────────► public/r/components/  ──► fetch(registry/r/button.json)
  meta.json                     button.json              escribir Button.vue al proyecto
      │                                                  instalar dependencias
      ▼
Playground (Vite HMR)
http://localhost:5173
```