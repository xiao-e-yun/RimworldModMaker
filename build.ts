import { $, type BuildConfig } from 'bun'
import { readFileSync, watch, WatchEventType } from 'fs'

const [command] = process.argv.slice(2);
if (command && !["build", "dev"].includes(command)) {
  console.error(`Unexpected command '${command}' - use 'build' or  instead.`)
  process.exit(1)
}

const dependencyNames = Object.keys(JSON.parse(readFileSync('./package.json', 'utf-8')).dependencies)

const defaultBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: "node",
  external: ["lodash", ...dependencyNames],
  sourcemap: "linked",
}

if (command === "dev") {
  console.clear();
  console.log(`[${new Date().toLocaleTimeString()}] starting hot-reload development build...`);
  let sourceDebounce = new Date();
  const rebuildSource = async () => {
    console.clear();
    console.log(`[${new Date().toLocaleTimeString()}] rebuilding source...`);
    await Promise.allSettled([
      Bun.build({
        ...defaultBuildConfig,
        format: 'esm',
        naming: "[dir]/[name].js",
      }),
      $`bun run build-type`,
    ])
    console.log(`[${new Date().toLocaleTimeString()}] source rebuilt.`);
  }

  const rebuildRuntime = async (_eventType?: WatchEventType,path?: string | null) => {
    if (path?.startsWith("obj/") || path?.startsWith("obj\\")) return;
    console.log(`[${new Date().toLocaleTimeString()}] rebuilding runtime...`);
    await $`dotnet build ./runtime`
    console.log(`[${new Date().toLocaleTimeString()}] runtime rebuilt.`);
  }

  rebuildSource()
  rebuildRuntime()
  watch('./src', { recursive: true }, debounce(rebuildSource, 300))
  watch('./runtime', { recursive: true }, debounce(rebuildRuntime, 300))
} else {
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
    $`dotnet build ./runtime`
  ])
}

function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}