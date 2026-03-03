import { existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { logger } from "./logger.js";

type PackageManager = "bun" | "pnpm" | "yarn" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installDependencies(cwd: string, deps: string[]): void {
  if (deps.length === 0) return;

  const pm = detectPackageManager(cwd);
  const dedupedDeps = [...new Set(deps)];
  const cmd =
    pm === "bun"
      ? `bun add ${dedupedDeps.join(" ")}`
      : pm === "pnpm"
        ? `pnpm add ${dedupedDeps.join(" ")}`
        : pm === "yarn"
          ? `yarn add ${dedupedDeps.join(" ")}`
          : `npm install ${dedupedDeps.join(" ")}`;

  logger.info(`Installing dependencies with ${pm}...`);
  execSync(cmd, { cwd, stdio: "inherit" });
}
