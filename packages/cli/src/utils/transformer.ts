import type { Config } from "../schemas/config.js";

/**
 * Rewrites import aliases in component source code.
 * Transforms `@/lib/utils` → the user's configured alias path.
 * Transforms `@/components/ui/...` → the user's configured ui alias.
 */
export function transformImports(content: string, config: Config): string {
  let result = content;

  // Rewrite @/lib/ imports
  result = result.replace(
    /from\s+["']@\/lib\/(.*?)["']/g,
    `from "${config.aliases.lib}/$1"`
  );

  // Rewrite @/components/ui/ imports
  result = result.replace(
    /from\s+["']@\/components\/ui\/(.*?)["']/g,
    `from "${config.aliases.ui}/$1"`
  );

  // Rewrite @/components/ imports (non-ui)
  result = result.replace(
    /from\s+["']@\/components\/((?!ui\/).*?)["']/g,
    `from "${config.aliases.components}/$1"`
  );

  // Rewrite @/hooks/ imports
  result = result.replace(
    /from\s+["']@\/hooks\/(.*?)["']/g,
    `from "${config.aliases.hooks}/$1"`
  );

  return result;
}
