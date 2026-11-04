/**
 * Extra safety if dashboard deploy is still bare `npx wrangler deploy`
 * and wrangler [build] did not run yet. Local `npm install` skips this.
 * wrangler.toml [build] command is the primary path (always runs on deploy).
 */
import { spawnSync } from 'node:child_process';

const onCi =
  process.env.WORKERS_CI === '1' ||
  process.env.CF_PAGES === '1' ||
  process.env.CI === 'true' ||
  process.env.CI === '1';

if (!onCi) {
  process.exit(0);
}

const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});

process.exit(result.status === 0 ? 0 : (result.status ?? 1));
