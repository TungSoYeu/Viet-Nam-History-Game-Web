const { spawn } = require('child_process');

const command = process.argv[2];

if (!command) {
  console.error('Missing react-scripts command.');
  process.exit(1);
}

const normalize = (value) => (typeof value === 'string' ? value.trim() : '');

const googleClientId = normalize(process.env.REACT_APP_GOOGLE_CLIENT_ID) || normalize(process.env.GOOGLE_CLIENT_ID);
const apiUrl =
  normalize(process.env.REACT_APP_API_URL) ||
  normalize(process.env.REACT_APP_API_BASE_URL) ||
  normalize(process.env.API_URL);

if (googleClientId && !normalize(process.env.REACT_APP_GOOGLE_CLIENT_ID)) {
  process.env.REACT_APP_GOOGLE_CLIENT_ID = googleClientId;
}

if (apiUrl && !normalize(process.env.REACT_APP_API_URL)) {
  process.env.REACT_APP_API_URL = apiUrl;
}

const reactScriptsBin = require.resolve('react-scripts/bin/react-scripts');

const child = spawn(process.execPath, [reactScriptsBin, command], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(typeof code === 'number' ? code : 1);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
