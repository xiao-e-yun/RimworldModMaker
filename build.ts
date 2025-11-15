import { $, type BuildConfig } from 'bun'
import { readFileSync } from 'node:fs'

const dependencyNames = Object.keys(JSON.parse(readFileSync('./package.json', 'utf-8')).dependencies)

const defaultBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: "node",
  external: ["lodash", ...dependencyNames],
  sourcemap: "linked",
}

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    format: 'esm',
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: 'cjs',
    naming: "[dir]/[name].cjs",
  }),
  // Build type definitions
  $`bun run build-type`,
])
