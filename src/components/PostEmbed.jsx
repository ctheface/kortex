"use client";

import { useState } from "react";
import { ExternalLink, Loader2, Globe } from "lucide-react";

function getEmbedInfo(url, platform) {
  if (!url) return null;

  // YouTube — check first since it's the most reliable embed
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  if (platform === "instagram" || /instagram\.com|instagr\.am/i.test(url)) {
    const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (match) {
      return {
        type: "instagram",
        embedUrl: `https://www.instagram.com/p/${match[1]}/embed/captioned/`,
        shortcode: match[1],
      };
    }
  }

  if (platform === "twitter" || /x\.com|twitter\.com/i.test(url)) {
    const tweetId = url.match(/(?:x\.com|twitter\.com)\/\w+\/status\/(\d+)/)?.[1];
    if (tweetId) {
      return { type: "twitter", tweetId };
    }
  }

  if (platform === "reddit" || /reddit\.com/i.test(url)) {
    const match = url.match(/reddit\.com\/r\/\w+\/comments\/(\w+)/);
    if (match) {
      return {
        type: "reddit",
        postId: match[1],
        embedUrl: `https://www.redditmedia.com/r/${url.match(/\/r\/(\w+)/)[1]}/comments/${match[1]}/?ref_source=embed&embed=true&theme=dark`,
      };
    }
  }

  return null;
}

function InstagramEmbed({ embedUrl }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="embed-container">
      {!loaded && <EmbedLoader />}
      <iframe
        src={embedUrl}
        style={{
          width: "100%",
          height: 600,
          border: "none",
          borderRadius: 8,
          display: loaded ? "block" : "none",
          background: "#000",
        }}
        allowFullScreen
        allow="autoplay; encrypted-media"
        scrolling="no"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function TwitterEmbed({ tweetId }) {
  const [loaded, setLoaded] = useState(false);

  const src = `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=dark&dnt=true`;

  return (
    <div className="embed-container" style={{ maxWidth: 550, margin: "0 auto" }}>
      {!loaded && <EmbedLoader />}
      <iframe
        src={src}
        style={{
          width: "100%",
          minWidth: 350,
          height: 350,
          border: "none",
          borderRadius: 8,
          display: loaded ? "block" : "none",
        }}
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function RedditEmbed({ embedUrl }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="embed-container">
      {!loaded && <EmbedLoader />}
      <iframe
        src={embedUrl}
        style={{
          width: "100%",
          height: 500,
          border: "none",
          borderRadius: 8,
          display: loaded ? "block" : "none",
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function YouTubeEmbed({ embedUrl }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="embed-container" style={{ aspectRatio: "16/9" }}>
      {!loaded && <EmbedLoader />}
      <iframe
        src={embedUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: 8,
          display: loaded ? "block" : "none",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function EmbedLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40, color: "var(--accents-4)" }}>
      <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
      <span style={{ marginLeft: 12, fontSize: "0.875rem" }}>Loading embed...</span>
    </div>
  );
}

function ArticlePreview({ url, thumbnail, summary }) {
  const [imgError, setImgError] = useState(false);
  let domain = "";
  try { domain = new URL(url).hostname.replace("www.", ""); } catch {}

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div className="embed-container" style={{ overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s" }}>
        {thumbnail && !imgError ? (
          <div style={{ position: "relative" }}>
            <img
              src={thumbnail}
              alt={summary || "Article"}
              style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
              onError={() => setImgError(true)}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
            }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Globe size={12} color="rgba(255,255,255,0.7)" />
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{domain}</span>
              </div>
              {summary && (
                <p style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{summary}</p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accents-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Globe size={20} color="var(--accents-5)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.75rem", color: "var(--accents-4)", marginBottom: 4 }}>{domain}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {summary || url}
              </div>
            </div>
            <ExternalLink size={16} color="var(--accents-4)" style={{ flexShrink: 0 }} />
          </div>
        )}
      </div>
    </a>
  );
}

export default function PostEmbed({ url, platform, thumbnail, summary }) {
  const embed = getEmbedInfo(url, platform);

  if (!embed) {
    return <ArticlePreview url={url} thumbnail={thumbnail} summary={summary} />;
  }

  switch (embed.type) {
    case "youtube":
      return <YouTubeEmbed embedUrl={embed.embedUrl} />;
    case "instagram":
      return <InstagramEmbed embedUrl={embed.embedUrl} />;
    case "twitter":
      return <TwitterEmbed tweetId={embed.tweetId} />;
    case "reddit":
      return <RedditEmbed embedUrl={embed.embedUrl} />;
    default:
      return null;
  }
}
