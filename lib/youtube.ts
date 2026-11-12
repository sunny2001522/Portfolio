import type { ProjectLink } from "@/lib/types";

export function getYouTubeEmbedUrl(links?: ProjectLink[]): string | null {
  const rawUrl = links?.find((link) => link.type === "YouTube")?.url;
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parts[0] ?? "";
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
        videoId = parts[1] ?? "";
      } else {
        videoId = url.searchParams.get("v") ?? "";
      }
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}
