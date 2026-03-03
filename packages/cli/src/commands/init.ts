import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import * as p from "@clack/prompts";
import { logger } from "../utils/logger.js";
import { writeConfig, configExists } from "../utils/config.js";
import type { Config } from "../schemas/config.js";

interface InitOptions {
  cwd: string;
}

type Framework = "nextjs" | "vite" | "remix" | "unknown";

function detectFramework(cwd: string): Framework {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return "unknown";

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  if (allDeps["next"]) return "nextjs";
  if (allDeps["@remix-run/react"]) return "remix";
  if (allDeps["vite"]) return "vite";
  return "unknown";
}

function detectAliases(cwd: string): { baseUrl?: string; paths?: Record<string, string[]> } {
  for (const name of ["tsconfig.json", "jsconfig.json"]) {
    const p = join(cwd, name);
    if (existsSync(p)) {
      try {
        const raw = readFileSync(p, "utf-8");
        // Strip comments for JSON parse
        const stripped = raw.replace(/\/\/.*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
        const parsed = JSON.parse(stripped);
        return {
          baseUrl: parsed.compilerOptions?.baseUrl,
          paths: parsed.compilerOptions?.paths,
        };
      } catch {
        return {};
      }
    }
  }
  return {};
}

export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = resolve(options.cwd);

  p.intro("⚔ Thu'um — Awaken the Voice within your project");

  if (configExists(cwd)) {
    const overwrite = await p.confirm({
      message: "thuum.json already exists. Overwrite?",
    });
    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("Init cancelled.");
      return;
    }
  }

  const framework = detectFramework(cwd);
  const tsInfo = detectAliases(cwd);

  p.log.info(`Detected framework: ${framework}`);
  if (tsInfo.paths) {
    p.log.info(`Detected path aliases from tsconfig`);
  }

  // Determine default aliases from tsconfig
  let componentsAlias = "@/components";
  let libAlias = "@/lib";
  if (tsInfo.paths) {
    const keys = Object.keys(tsInfo.paths);
    if (keys.some((k) => k.startsWith("@/"))) {
      componentsAlias = "@/components";
      libAlias = "@/lib";
    }
  }

  const settings = await p.group(
    {
      tsx: () =>
        p.confirm({
          message: "Use TypeScript (tsx)?",
          initialValue: true,
        }),
      componentsAlias: () =>
        p.text({
          message: "Components alias:",
          initialValue: componentsAlias,
        }),
      uiAlias: () =>
        p.text({
          message: "UI components alias:",
          initialValue: `${componentsAlias}/ui`,
        }),
      libAlias: () =>
        p.text({
          message: "Lib/utils alias:",
          initialValue: libAlias,
        }),
      hooksAlias: () =>
        p.text({
          message: "Hooks alias:",
          initialValue: "@/hooks",
        }),
    },
    {
      onCancel: () => {
        p.cancel("Init cancelled.");
        process.exit(0);
      },
    }
  );

  const config: Config = {
    tsx: settings.tsx as boolean,
    aliases: {
      components: settings.componentsAlias as string,
      ui: settings.uiAlias as string,
      lib: settings.libAlias as string,
      hooks: settings.hooksAlias as string,
    },
    registryUrl: "https://thuum.dev/r",
  };

  writeConfig(cwd, config);
  p.log.success("Created thuum.json");

  // Copy utils
  const libDir = join(cwd, "src", "lib");
  if (!existsSync(libDir)) {
    mkdirSync(libDir, { recursive: true });
  }

  const utilsContent = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  writeFileSync(join(libDir, "utils.ts"), utilsContent);
  p.log.success("Created src/lib/utils.ts");

  // Inject CSS tokens
  const globalsCssContent = `@import "tailwindcss";

@theme {
  /* Skyrim-inspired color tokens */
  --color-background: oklch(0.14 0.004 285);
  --color-foreground: oklch(0.93 0.01 80);

  --color-muted: oklch(0.22 0.006 285);
  --color-muted-foreground: oklch(0.65 0.01 80);

  --color-card: oklch(0.17 0.005 285);
  --color-card-foreground: oklch(0.93 0.01 80);

  --color-popover: oklch(0.17 0.005 285);
  --color-popover-foreground: oklch(0.93 0.01 80);

  --color-primary: oklch(0.68 0.12 55);
  --color-primary-foreground: oklch(0.14 0.004 285);

  --color-secondary: oklch(0.25 0.008 285);
  --color-secondary-foreground: oklch(0.93 0.01 80);

  --color-accent: oklch(0.55 0.15 30);
  --color-accent-foreground: oklch(0.93 0.01 80);

  --color-destructive: oklch(0.55 0.2 25);
  --color-destructive-foreground: oklch(0.93 0.01 80);

  --color-border: oklch(0.3 0.01 285);
  --color-input: oklch(0.25 0.008 285);
  --color-ring: oklch(0.68 0.12 55);

  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
`;

  // Determine globals path based on framework
  let globalsDir: string;
  if (framework === "nextjs") {
    globalsDir = join(cwd, "src", "app");
    if (!existsSync(globalsDir)) {
      globalsDir = join(cwd, "app");
    }
    if (!existsSync(globalsDir)) {
      globalsDir = join(cwd, "src");
    }
  } else {
    globalsDir = join(cwd, "src");
  }

  if (!existsSync(globalsDir)) {
    mkdirSync(globalsDir, { recursive: true });
  }

  const globalsPath = join(globalsDir, "globals.css");
  writeFileSync(globalsPath, globalsCssContent);
  p.log.success(`Created ${globalsPath.replace(cwd + "/", "")}`);

  p.outro("⚔ Thu'um has been awakened. Use `thuum add <component>` to begin.");
}
