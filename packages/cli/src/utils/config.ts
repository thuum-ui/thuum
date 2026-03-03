import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { configSchema, type Config } from "../schemas/config.js";

const CONFIG_FILE = "thuum.json";

export function getConfigPath(cwd: string): string {
  return join(cwd, CONFIG_FILE);
}

export function configExists(cwd: string): boolean {
  return existsSync(getConfigPath(cwd));
}

export function readConfig(cwd: string): Config {
  const path = getConfigPath(cwd);
  if (!existsSync(path)) {
    throw new Error(
      `No thuum.json found. Run "thuum init" first.`
    );
  }
  const raw = JSON.parse(readFileSync(path, "utf-8"));
  return configSchema.parse(raw);
}

export function writeConfig(cwd: string, config: Config): void {
  writeFileSync(getConfigPath(cwd), JSON.stringify(config, null, 2) + "\n");
}
