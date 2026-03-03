import { z } from "zod";

export const registryFileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

export const registryItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  dependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),
  files: z.array(registryFileSchema),
});

export const registryIndexItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  dependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),
});

export const registryIndexSchema = z.array(registryIndexItemSchema);

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryIndexItem = z.infer<typeof registryIndexItemSchema>;
