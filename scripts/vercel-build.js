const { spawnSync } = require('child_process');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');
const buildCommand = process.platform === 'win32' ? 'npm run build' : 'npm run build';
const buildPath = process.env.BUILD_PATH || '../dist';

const result = spawnSync(buildCommand, {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    BUILD_PATH: buildPath,
    CI: 'false',
  },
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
