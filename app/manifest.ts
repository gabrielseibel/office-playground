import type { MetadataRoute } from "next";

// Precisa bater com o basePath configurado em next.config.mjs — o conteúdo
// do manifest não passa pela reescrita automática de rotas do Next, então o
// prefixo tem que ser aplicado manualmente aqui.
const basePath = process.env.GITHUB_ACTIONS === "true" ? "/office-playground" : "";

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: "Office Playground",
    short_name: "OfficePlay",
    description:
      "Aprenda Word, Excel e PowerPoint brincando com laboratórios interativos.",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
