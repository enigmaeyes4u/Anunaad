/**
 * Workplace1 Restoration Script
 * Restores project_ANUNAAD to the Workplace1 checkpoint.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const checkpointDir = path.join(rootDir, '.checkpoints', 'Workplace1');

if (!fs.existsSync(checkpointDir)) {
  console.error('❌ Checkpoint Workplace1 not found at:', checkpointDir);
  process.exit(1);
}

console.log('🔄 Restoring ANUNAAD codebase to checkpoint: Workplace1...');

const dirsToRestore = ['src', 'server', 'data', 'public', 'scripts', 'tests'];
for (const dir of dirsToRestore) {
  const src = path.join(checkpointDir, dir);
  const dst = path.join(rootDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dst, { recursive: true, force: true });
    console.log(`✓ Restored directory: ${dir}/`);
  }
}

const filesToRestore = [
  'index.html',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'run.bat',
  'README.md'
];

for (const file of filesToRestore) {
  const src = path.join(checkpointDir, file);
  const dst = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✓ Restored file: ${file}`);
  }
}

console.log('✅ Successfully restored codebase to Workplace1 checkpoint!');
