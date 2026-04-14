import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');
const OUTPUT_DIR = path.resolve(__dirname, '../public/r/components');

interface MetaFile {
  name: string;
  framework: string;
  description?: string;
  dependencies: Record<string, string>;
  registryDependencies: string[];
  files: string[];
}

interface RegistryEntry {
  name: string;
  framework: string;
  description?: string;
  files: { name: string; content: string }[];
  dependencies: Record<string, string>;
  registryDependencies: string[];
}

function pluralize(count: number, word: string): string {
  return `${count} ${word}${count !== 1 ? 's' : ''}`;
}

function buildRegistry(): void {
  // Clean and recreate output directory
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const entries = fs.readdirSync(COMPONENTS_DIR).filter((f) =>
    fs.statSync(path.join(COMPONENTS_DIR, f)).isDirectory()
  );

  const index: { name: string; description?: string }[] = [];

  for (const entry of entries) {
    const metaPath = path.join(COMPONENTS_DIR, entry, 'meta.json');

    if (!fs.existsSync(metaPath)) {
      console.warn(`⚠  Skipping "${entry}": no meta.json found`);
      continue;
    }

    const meta: MetaFile = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

    const files = meta.files.map((fileName) => {
      const filePath = path.join(COMPONENTS_DIR, entry, fileName);
      if (!fs.existsSync(filePath)) {
        throw new Error(
          `File "${fileName}" listed in ${entry}/meta.json was not found at ${filePath}`
        );
      }
      return {
        name: fileName,
        content: fs.readFileSync(filePath, 'utf-8'),
      };
    });

    const registryEntry: RegistryEntry = {
      name: meta.name,
      framework: meta.framework,
      description: meta.description,
      files,
      dependencies: meta.dependencies,
      registryDependencies: meta.registryDependencies,
    };

    const outputPath = path.join(OUTPUT_DIR, `${meta.name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(registryEntry, null, 2));
    console.log(`✓ Built ${meta.name}.json (${pluralize(files.length, 'file')})`);

    index.push({ name: meta.name, description: meta.description });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify({ components: index }, null, 2)
  );

  console.log(`\n✅ Registry built: ${pluralize(index.length, 'component')}`);
}

buildRegistry();
