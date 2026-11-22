// Turns a YouTube or Vimeo link into an embeddable URL. Returns null for anything else.
export function embedUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    const h = u.hostname.replace(/^www\./, "");
    const params = "?rel=0&modestbranding=1&showinfo=0";
    if (h === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}${params}`;
    if (h === "youtube.com") {
      const id = u.searchParams.get("v") ?? (u.pathname.startsWith("/embed/") ? u.pathname.split("/")[2] : null);
      return id ? `https://www.youtube-nocookie.com/embed/${id}${params}` : null;
    }
    if (h === "vimeo.com") { const id = u.pathname.split("/").filter(Boolean)[0]; return /^\d+$/.test(id ?? "") ? `https://player.vimeo.com/video/${id}` : null; }
  } catch {}
  return null;
}
