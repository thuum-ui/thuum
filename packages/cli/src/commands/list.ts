import * as p from "@clack/prompts";
import {
  registryIndexSchema,
  type RegistryIndexItem,
} from "../schemas/registry.js";

const DEFAULT_REGISTRY = "https://thuum.dev/r";

export async function listCommand(): Promise<void> {
  p.intro("⚔ Thu'um — Available Components");

  try {
    const res = await fetch(`${DEFAULT_REGISTRY}/index.json`);
    if (!res.ok) {
      throw new Error(`Failed to fetch registry (${res.status})`);
    }
    const data = await res.json();
    const items = registryIndexSchema.parse(data);

    const uiItems = items.filter((i) => i.type === "registry:ui");
    const libItems = items.filter((i) => i.type === "registry:lib");

    if (uiItems.length > 0) {
      p.log.info("Components:");
      for (const item of uiItems) {
        const deps =
          item.registryDependencies.length > 0
            ? ` (requires: ${item.registryDependencies.join(", ")})`
            : "";
        p.log.message(`  ${item.name}${deps}`);
      }
    }

    if (libItems.length > 0) {
      p.log.info("Utilities:");
      for (const item of libItems) {
        p.log.message(`  ${item.name}`);
      }
    }

    p.outro(`${items.filter((i) => i.type === "registry:ui").length} components available`);
  } catch (err) {
    p.log.error(
      `Failed to fetch component list. Is the registry available?`
    );
    p.cancel("Could not reach registry.");
  }
}
