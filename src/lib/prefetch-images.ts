import { env } from "@/shared/env";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { parseHTML } from "linkedom";
import z from "zod";

export const prefetchImages = createServerFn()
  .inputValidator(
    z.object({
      pathname: z.string(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const url = new URL(data.pathname, env.VITE_SERVER_URL);
      const response = await fetch(url);
      if (!response.ok) {
        // Return empty array instead of throwing
        return { images: [] };
      }
      const body = await response.text();
      const { document } = parseHTML(body);
      const images = Array.from(document.querySelectorAll("main img"))
        .map((img) => ({
          srcset: img.getAttribute("srcset") || img.getAttribute("srcSet"), // Linkedom is case-sensitive
          sizes: img.getAttribute("sizes"),
          src: img.getAttribute("src"),
          alt: img.getAttribute("alt"),
          loading: img.getAttribute("loading"),
        }))
        .filter((img) => img.src);
      setResponseHeader("Cache-Control", "public, max-age=3600");
      return {
        images,
      };
    } catch (error) {
      // Silently fail and return empty array
      console.error("Prefetch images error:", error);
      return { images: [] };
    }
  });

export const prefetchImagesOptions = (href: string) =>
  queryOptions({
    queryKey: ["prefetch-images", href],
    queryFn: async () => {
      const { images } = await prefetchImages({ data: { pathname: href } });
      return images;
    },
  });
