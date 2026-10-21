import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distIndexPath = path.resolve(__dirname, 'dist', 'index.html');
const serverScript = path.resolve(__dirname, 'server', 'index.ts');

// Auto-build fallback: If dist/index.html is missing, build the frontend before starting
if (!fs.existsSync(distIndexPath)) {
  console.log('⚠️ [ANUNAAD] Production frontend build not detected (dist/index.html missing).');
  console.log('🔨 [ANUNAAD] Running automatic frontend build now (npm run build)...');
  try {
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: __dirname,
      env: process.env
    });
    console.log('✅ [ANUNAAD] Frontend build finished successfully!');
  } catch (err) {
    console.error('❌ [ANUNAAD] Automatic build encountered an error:', err);
  }
}

// Launch the Express + TypeScript server using tsx
const child = spawn(
  process.execPath,
  ['--import', 'tsx', serverScript],
  {
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
  process.on(signal, () => {
    if (!child.killed) {
      child.kill(signal);
    }
  });
});
