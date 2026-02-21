"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

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
    <div className="embed-container">
      {!loaded && <EmbedLoader />}
      <iframe
        src={src}
        style={{
          width: "100%",
          height: 450,
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

export default function PostEmbed({ url, platform }) {
  const embed = getEmbedInfo(url, platform);

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "16px 24px",
          border: "1px solid var(--accents-2)",
          borderRadius: 8,
          color: "var(--accents-5)",
          textDecoration: "none",
          fontSize: "0.875rem",
          transition: "border-color 0.15s",
        }}
      >
        <ExternalLink size={16} /> Open in browser
      </a>
    );
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
