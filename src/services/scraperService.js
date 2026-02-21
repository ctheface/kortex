/**
 * Universal social media scraper.
 * Detects platform from URL and routes to the best strategy.
 * Supports: Instagram, X/Twitter, Reddit, LinkedIn, and generic articles/blogs.
 */

// ─── Platform Detection ────────────────────────────────────────────────────

export function detectPlatform(url) {
  if (/instagram\.com|instagr\.am/i.test(url)) return "instagram";
  if (/x\.com|twitter\.com/i.test(url)) return "twitter";
  if (/reddit\.com|redd\.it/i.test(url)) return "reddit";
  if (/linkedin\.com/i.test(url)) return "linkedin";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  return "article";
}

export function extractSocialUrl(message) {
  const regex = /https?:\/\/[^\s]+/i;
  const match = message.match(regex);
  return match ? match[0].replace(/[.,!?]+$/, "") : null;
}

// ─── Main Entry Point ──────────────────────────────────────────────────────

export async function scrapeLink(url) {
  const platform = detectPlatform(url);
  console.log(`[Scraper] Platform detected: ${platform} for ${url}`);

  let result;
  switch (platform) {
    case "instagram":
      result = await scrapeWithSupadata(url, platform);
      if (!result) result = await scrapeWithNoembed(url);
      if (!result) result = await scrapeWithHtml(url);
      return result;
    case "twitter":
      result = await scrapeWithSupadata(url, platform);
      if (!result) result = await scrapeWithNoembed(url);
      if (!result) result = await scrapeWithHtml(url);
      return result;
    case "reddit":
      return scrapeReddit(url);
    case "youtube":
      result = await scrapeWithNoembed(url);
      if (!result) result = await scrapeWithHtml(url);
      return result;
    case "linkedin":
      return scrapeWithHtml(url);
    case "article":
    default:
      return scrapeWithHtml(url);
  }
}

// ─── Supadata (Instagram + X/Twitter) ─────────────────────────────────────

async function scrapeWithSupadata(url, platform) {
  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) return null;

  try {
    const endpoint = `https://api.supadata.ai/v1/metadata?url=${encodeURIComponent(url)}`;
    const res = await fetch(endpoint, {
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error("[Scraper] Supadata error:", res.status);
      return null;
    }

    const data = await res.json();
    console.log(`[Scraper] Supadata success: ${data.platform} ${data.type}`);

    let thumbnail = "";
    if (data.media) {
      thumbnail = data.media.thumbnailUrl || data.media.url || "";
      if (!thumbnail && data.media.items?.length > 0) {
        const first = data.media.items[0];
        thumbnail = first.thumbnailUrl || first.url || "";
      }
    }

    return {
      platform,
      caption: data.description || data.title || "",
      thumbnail,
      author: data.author?.displayName || data.author?.username || "",
      tags: data.tags || [],
    };
  } catch (e) {
    console.error("[Scraper] Supadata failed:", e.message);
    return null;
  }
}

// ─── Reddit (JSON API) ─────────────────────────────────────────────────────

async function scrapeReddit(url) {
  try {
    // Reddit provides a JSON endpoint by appending .json
    const jsonUrl = url.replace(/\/?(\?.*)?$/, ".json$1");
    const res = await fetch(jsonUrl, {
      headers: { "User-Agent": "Kortex/1.0 knowledge-base-bot" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Reddit API ${res.status}`);

    const data = await res.json();
    const post = data[0]?.data?.children?.[0]?.data;

    if (!post) return scrapeWithHtml(url);

    const thumbnail =
      post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ||
      post.thumbnail?.startsWith("http") ? post.thumbnail : "";

    return {
      platform: "reddit",
      caption: post.title + (post.selftext ? `\n\n${post.selftext.slice(0, 500)}` : ""),
      thumbnail: thumbnail || "",
      author: post.author || "",
      tags: post.link_flair_text ? [post.link_flair_text] : [],
      subreddit: post.subreddit_name_prefixed || "",
    };
  } catch (e) {
    console.error("[Scraper] Reddit scrape failed:", e.message);
    return scrapeWithHtml(url);
  }
}

// ─── noembed (YouTube, Twitter, etc.) ─────────────────────────────────────

async function scrapeWithNoembed(url) {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.error) return null;

    return {
      platform: detectPlatform(url),
      caption: data.title || "",
      thumbnail: data.thumbnail_url || "",
      author: data.author_name || "",
      tags: [],
    };
  } catch (e) {
    return null;
  }
}

// ─── Generic HTML / og:tags scraper ───────────────────────────────────────

async function scrapeWithHtml(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return { platform: detectPlatform(url), caption: "", thumbnail: "", author: "", tags: [] };
    const html = await res.text();

    const get = (patterns) => {
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[1]) return decodeHTMLEntities(m[1]);
      }
      return "";
    };

    const caption = get([
      /<meta\s+property="og:description"\s+content="([^"]*?)"/i,
      /<meta\s+content="([^"]*?)"\s+property="og:description"/i,
      /<meta\s+name="description"\s+content="([^"]*?)"/i,
      /<meta\s+content="([^"]*?)"\s+name="description"/i,
    ]);

    const title = get([
      /<meta\s+property="og:title"\s+content="([^"]*?)"/i,
      /<meta\s+content="([^"]*?)"\s+property="og:title"/i,
      /<title>([^<]*?)<\/title>/i,
    ]);

    const thumbnail = get([
      /<meta\s+property="og:image"\s+content="([^"]*?)"/i,
      /<meta\s+content="([^"]*?)"\s+property="og:image"/i,
    ]);

    const author = get([
      /<meta\s+(?:property|name)="author"\s+content="([^"]*?)"/i,
      /<meta\s+content="([^"]*?)"\s+(?:property|name)="author"/i,
    ]);

    return {
      platform: detectPlatform(url),
      caption: caption || title || "",
      thumbnail,
      author,
      tags: [],
    };
  } catch (e) {
    console.error("[Scraper] HTML scrape failed:", e.message);
    return { platform: detectPlatform(url), caption: "", thumbnail: "", author: "", tags: [] };
  }
}

function decodeHTMLEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Keep backward compat
export const scrapeInstagramLink = scrapeLink;
export const extractInstagramUrl = extractSocialUrl;
