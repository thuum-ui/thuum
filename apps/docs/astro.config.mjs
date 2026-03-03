import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [
    starlight({
      title: "Thu'um",
      description:
        "A Skyrim-themed React component library. Copy-paste components with the power of the Voice.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/thuum-ui/thuum",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          autogenerate: { directory: "getting-started" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
      ],
      customCss: ["./src/styles/global.css"],
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
