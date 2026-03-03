import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import * as p from "@clack/prompts";
import { logger } from "../utils/logger.js";
import { readConfig } from "../utils/config.js";
import { transformImports } from "../utils/transformer.js";
import { installDependencies } from "../utils/installer.js";
import { registryItemSchema, type RegistryItem } from "../schemas/registry.js";

interface AddOptions {
  cwd: string;
  yes: boolean;
}

async function fetchRegistryItem(
  registryUrl: string,
  name: string
): Promise<RegistryItem> {
  const url = `${registryUrl}/${name}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Component "${name}" not found in registry (${res.status})`
    );
  }
  const data = await res.json();
  return registryItemSchema.parse(data);
}

async function resolveAllDependencies(
  registryUrl: string,
  name: string,
  resolved: Map<string, RegistryItem> = new Map()
): Promise<Map<string, RegistryItem>> {
  if (resolved.has(name)) return resolved;

  const item = await fetchRegistryItem(registryUrl, name);
  resolved.set(name, item);

  for (const dep of item.registryDependencies) {
    await resolveAllDependencies(registryUrl, dep, resolved);
  }

  return resolved;
}

export async function addCommand(
  component: string,
  options: AddOptions
): Promise<void> {
  const cwd = resolve(options.cwd);

  p.intro(`⚔ Thu'um — Adding component`);

  const config = readConfig(cwd);
  logger.shout(component);

  const items = await resolveAllDependencies(config.registryUrl, component);

  // Collect all files and deps
  const allDeps: string[] = [];
  const allFiles: { path: string; content: string }[] = [];

  for (const [, item] of items) {
    allDeps.push(...item.dependencies);

    for (const file of item.files) {
      const transformedContent = transformImports(file.content, config);

      // Map registry path to user's configured aliases
      let destPath: string;
      if (file.path.startsWith("components/ui/")) {
        const filename = file.path.replace("components/ui/", "");
        destPath = join(cwd, "src", "components", "ui", filename);
      } else if (file.path.startsWith("components/")) {
        const filename = file.path.replace("components/", "");
        destPath = join(cwd, "src", "components", filename);
      } else if (file.path.startsWith("lib/")) {
        const filename = file.path.replace("lib/", "");
        destPath = join(cwd, "src", "lib", filename);
      } else if (file.path.startsWith("hooks/")) {
        const filename = file.path.replace("hooks/", "");
        destPath = join(cwd, "src", "hooks", filename);
      } else {
        destPath = join(cwd, "src", file.path);
      }

      allFiles.push({ path: destPath, content: transformedContent });
    }
  }

  // Show what will be written
  if (!options.yes) {
    p.log.info("Files to create:");
    for (const f of allFiles) {
      p.log.message(`  ${f.path.replace(cwd + "/", "")}`);
    }
    if (allDeps.length > 0) {
      p.log.info(`Dependencies: ${[...new Set(allDeps)].join(", ")}`);
    }

    const proceed = await p.confirm({
      message: "Proceed?",
    });
    if (p.isCancel(proceed) || !proceed) {
      p.cancel("Cancelled.");
      return;
    }
  }

  // Write files
  for (const file of allFiles) {
    const dir = dirname(file.path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(file.path, file.content);
    p.log.success(`Created ${file.path.replace(cwd + "/", "")}`);
  }

  // Install deps
  if (allDeps.length > 0) {
    installDependencies(cwd, allDeps);
  }

  logger.power();
  p.outro(`⚔ ${component} has been Shouted into existence.`);
}
