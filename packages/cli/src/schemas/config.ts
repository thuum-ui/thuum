import { z } from "zod";

export const configSchema = z.object({
  tsx: z.boolean().default(true),
  aliases: z.object({
    components: z.string().default("@/components"),
    ui: z.string().default("@/components/ui"),
    lib: z.string().default("@/lib"),
    hooks: z.string().default("@/hooks"),
  }),
  registryUrl: z.string().default("https://thuum.dev/r"),
});

export type Config = z.infer<typeof configSchema>;
