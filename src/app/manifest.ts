import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moral Clean",
    short_name: "Moral Clean",
    description:
      "Moral Clean supplies industrial cleaning machines, replacement parts, and repair services for commercial and facility cleaning teams across Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "rgb(255 255 255)",
    theme_color: "rgb(10 37 64)",
    icons: [
      {
        src: "/icon.png",
        sizes: "800x800",
        type: "image/png",
      },
    ],
  };
}
