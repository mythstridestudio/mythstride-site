import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MythStride",
    short_name: "MythStride",
    description: "Run in the real world. Progress in another.",
    start_url: "/",
    display: "standalone",
    background_color: "#090706",
    theme_color: "#17100c",
    lang: "en",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
