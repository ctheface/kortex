"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  Database, Search, Trash2, ExternalLink, Inbox, 
  Sparkles, Code, Dumbbell, Coffee, Map, ShoppingBag, 
  Palette, Music, BookOpen, Heart, Layers, X,
  Instagram, Globe, Linkedin, Youtube, SidebarOpen, SidebarClose,
  BarChart3, TrendingUp, Calendar, Link2, ChevronUp,
  ArrowUpDown, LayoutGrid, List, Download
} from "lucide-react";

function XLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.264 5.633 5.9-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function RedditLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import PostEmbed from "@/components/PostEmbed";

const PLATFORM_COLORS = {
  instagram: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
  twitter: "#000000",
  reddit: "#ff4500",
  youtube: "#ff0000",
  linkedin: "#0077b5",
  article: "#1a1a1a",
};

const PLATFORM_ICONS_MAP = {
  instagram: Instagram,
  linkedin: Linkedin,
  globe: Globe,
};

function CardImage({ link }) {
  const [imgError, setImgError] = useState(false);

  if (link.thumbnail && !imgError) {
    return (
      <div className="bento-image" style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={link.thumbnail}
          alt={link.summary || "Thumbnail"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const platform = link.platform || "article";
  const bg = PLATFORM_COLORS[platform] || PLATFORM_COLORS.article;

  let Icon;
  if (platform === "twitter") Icon = XLogo;
  else if (platform === "reddit") Icon = RedditLogo;
  else if (platform === "instagram") Icon = Instagram;
  else if (platform === "youtube") Icon = Youtube;
  else if (platform === "linkedin") Icon = Linkedin;
  else Icon = Globe;

  return (
    <div
      className="bento-image"
      style={{
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <Icon size={36} color="rgba(255,255,255,0.85)" />
      <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
        {platform === "twitter" ? "X / Twitter" : platform}
      </span>
    </div>
  );
}

function AnalyticsModal({ links, onClose }) {
  const total = links.length;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = links.filter((l) => new Date(l.created_at) >= weekAgo).length;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayCount = links.filter((l) => new Date(l.created_at) >= today).length;

  const platformCounts = {};
  const categoryCounts = {};
  links.forEach((l) => {
    const p = l.platform || "article";
    platformCounts[p] = (platformCounts[p] || 0) + 1;
    const c = l.category || "Uncategorized";
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  });

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];

  const PLAT_LABELS = { instagram: "Instagram", twitter: "X / Twitter", reddit: "Reddit", youtube: "YouTube", linkedin: "LinkedIn", article: "Articles" };

  const sortedPlatforms = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxPlatCount = sortedPlatforms[0]?.[1] || 1;
  const maxCatCount = sortedCategories[0]?.[1] || 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="modal-window"
        style={{ maxWidth: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BarChart3 size={20} />
            <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>Your Kortex Analytics</h2>
          </div>
          <button onClick={onClose} style={{ padding: 8, color: "var(--accents-5)", borderRadius: 6 }}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body" style={{ padding: "20px 24px 28px" }}>
          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Total Saved", value: total, icon: Link2, color: "var(--geist-foreground)" },
              { label: "This Week", value: thisWeek, icon: TrendingUp, color: "#3b82f6" },
              { label: "Today", value: todayCount, icon: Calendar, color: "#10b981" },
              { label: "Categories", value: Object.keys(categoryCounts).length, icon: Layers, color: "#f59e0b" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "var(--accents-1)", borderRadius: 10, padding: "16px 12px", textAlign: "center", border: "1px solid var(--accents-2)" }}>
                <stat.icon size={18} style={{ color: stat.color, marginBottom: 6 }} />
                <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{stat.value}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--accents-5)", fontWeight: 500, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Top Highlights */}
          {topCategory && topPlatform && (
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              <div style={{ flex: 1, background: "var(--accents-1)", borderRadius: 10, padding: "14px 16px", border: "1px solid var(--accents-2)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--accents-4)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Top Category</div>
                <div style={{ fontSize: "1rem", fontWeight: 600 }}>{topCategory[0]} <span style={{ color: "var(--accents-4)", fontWeight: 400 }}>({topCategory[1]})</span></div>
              </div>
              <div style={{ flex: 1, background: "var(--accents-1)", borderRadius: 10, padding: "14px 16px", border: "1px solid var(--accents-2)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--accents-4)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Top Source</div>
                <div style={{ fontSize: "1rem", fontWeight: 600 }}>{PLAT_LABELS[topPlatform[0]] || topPlatform[0]} <span style={{ color: "var(--accents-4)", fontWeight: 400 }}>({topPlatform[1]})</span></div>
              </div>
            </div>
          )}

          {/* Platform Breakdown */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accents-4)", textTransform: "uppercase", marginBottom: 10 }}>By Platform</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sortedPlatforms.map(([p, count]) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 500, width: 90, flexShrink: 0 }}>{PLAT_LABELS[p] || p}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--accents-2)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(count / maxPlatCount) * 100}%`, height: "100%", background: "var(--geist-foreground)", borderRadius: 4, transition: "width 0.4s ease" }} />
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, width: 28, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accents-4)", textTransform: "uppercase", marginBottom: 10 }}>By Category</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sortedCategories.slice(0, 8).map(([c, count]) => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 500, width: 90, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--accents-2)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(count / maxCatCount) * 100}%`, height: "100%", background: "var(--geist-foreground)", borderRadius: 4, transition: "width 0.4s ease" }} />
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, width: 28, textAlign: "right" }}>{count}</span>
                </div>
              ))}
              {sortedCategories.length > 8 && (
                <div style={{ fontSize: "0.75rem", color: "var(--accents-4)", textAlign: "center", marginTop: 4 }}>
                  +{sortedCategories.length - 8} more categories
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const CATEGORIES = [
  { name: "All", icon: Layers },
  { name: "Fitness", icon: Dumbbell },
  { name: "Coding", icon: Code },
  { name: "Food", icon: Coffee },
  { name: "Travel", icon: Map },
  { name: "Fashion", icon: ShoppingBag },
  { name: "Design", icon: Palette },
  { name: "Music", icon: Music },
  { name: "Education", icon: BookOpen },
  { name: "Lifestyle", icon: Heart },
];

const PLATFORMS = [
  { name: "All Sources", value: "", icon: Globe },
  { name: "Instagram", value: "instagram", icon: Instagram },
  { name: "X / Twitter", value: "twitter", icon: XLogo },
  { name: "Reddit", value: "reddit", icon: RedditLogo },
  { name: "YouTube", value: "youtube", icon: Youtube },
  { name: "LinkedIn", value: "linkedin", icon: Linkedin },
  { name: "Articles", value: "article", icon: Globe },
];

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [allLinks, setAllLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePlatform, setActivePlatform] = useState("");
  const [spotlight, setSpotlight] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always show predefined categories, plus any new AI-generated ones from saved links
  const PREDEFINED_NAMES = ["Fitness", "Coding", "Food", "Travel", "Fashion", "Design", "Music", "Education", "Motivation", "Lifestyle"];
  const savedCategoryNames = allLinks.map((l) => l.category).filter(Boolean);
  const extraCategories = savedCategoryNames.filter((c) => !PREDEFINED_NAMES.includes(c) && c !== "Uncategorized");
  const dynamicCategories = ["All", ...PREDEFINED_NAMES, ...Array.from(new Set(extraCategories)).sort()];

  // Fetch ALL links once for sidebar category list
  useEffect(() => {
    fetch("/api/links")
      .then((r) => r.json())
      .then((d) => setAllLinks(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [links]); // refresh when links change (after delete)

  useEffect(() => {
    async function fetchLinks() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (activeCategory !== "All") params.set("category", activeCategory);
        if (activePlatform) params.set("platform", activePlatform);

        const res = await fetch(`/api/links?${params}`);
        const data = await res.json();
        setLinks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch links:", err);
        setLinks([]);
      }
      setLoading(false);
    }
    
    const timer = setTimeout(() => fetchLinks(), 300);
    return () => clearTimeout(timer);
  }, [search, activeCategory, activePlatform]);

  const sortedLinks = [...links].sort((a, b) => {
    const da = new Date(a.created_at), db = new Date(b.created_at);
    return sortOrder === "newest" ? db - da : da - db;
  });

  const exportLinks = (format) => {
    if (links.length === 0) return;
    let content, filename, mime;

    if (format === "csv") {
      const rows = [["Title", "Category", "Platform", "URL", "Date"]];
      links.forEach((l) => {
        rows.push([
          `"${(l.summary || "").replace(/"/g, '""')}"`,
          l.category || "",
          l.platform || "",
          l.url,
          new Date(l.created_at).toLocaleDateString(),
        ]);
      });
      content = rows.map((r) => r.join(",")).join("\n");
      filename = "kortex-export.csv";
      mime = "text/csv";
    } else {
      const lines = [`# Kortex Export\n`, `Exported on ${new Date().toLocaleDateString()}\n`];
      links.forEach((l) => {
        lines.push(`## ${l.summary || "Untitled"}\n`);
        lines.push(`- **Category:** ${l.category || "Uncategorized"}`);
        lines.push(`- **Platform:** ${l.platform || "article"}`);
        lines.push(`- **URL:** ${l.url}`);
        lines.push(`- **Date:** ${new Date(l.created_at).toLocaleDateString()}`);
        if (l.caption) lines.push(`\n> ${l.caption.slice(0, 300)}`);
        lines.push("\n---\n");
      });
      content = lines.join("\n");
      filename = "kortex-export.md";
      mime = "text/markdown";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/links?id=${deleteTarget}`, { method: "DELETE" });
      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget));
    } catch (err) {
      console.error("Delete error:", err);
    }
    setDeleteTarget(null);
  };

  const handleRandom = () => {
    if (links.length === 0) return;
    const random = links[Math.floor(Math.random() * links.length)];
    setSpotlight(random);
  };

  return (
    <>
      <nav className="nav">
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 24px", alignItems: "center" }}>
          <Link href="/" className="nav-logo">
            <Database size={20} />
            Kortex
          </Link>
          <div className="nav-links">
            <button onClick={() => setShowAnalytics(true)} className="btn btn-secondary" style={{ border: "none", color: "var(--accents-5)" }}>
              <BarChart3 size={16} /> Analytics
            </button>
            <button onClick={handleRandom} className="btn btn-secondary" style={{ border: "none", color: "var(--accents-5)" }}>
              <Sparkles size={16} /> Random Pick
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar${sidebarOpen ? "" : " sidebar-collapsed"}`}>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="sidebar-toggle-btn"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? <SidebarClose size={16} /> : <SidebarOpen size={16} />}
          </button>

          {sidebarOpen && <>
          <div style={{ marginBottom: 8, fontSize: "0.75rem", fontWeight: 600, color: "var(--accents-4)", textTransform: "uppercase", letterSpacing: "0.05em", paddingLeft: 12 }}>
            Sources
          </div>
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.value}
                className="sidebar-link"
                data-active={activePlatform === p.value}
                onClick={() => setActivePlatform(p.value)}
              >
                <Icon size={16} />
                {p.name}
              </button>
            );
          })}

          <div style={{ margin: "20px 0 8px", fontSize: "0.75rem", fontWeight: 600, color: "var(--accents-4)", textTransform: "uppercase", letterSpacing: "0.05em", paddingLeft: 12, borderTop: "1px solid var(--accents-2)", paddingTop: 20 }}>
            Categories
          </div>
          {dynamicCategories.map((catName) => {
            const StaticCat = CATEGORIES.find((c) => c.name === catName);
            const Icon = StaticCat?.icon || Layers;
            return (
              <button
                key={catName}
                className="sidebar-link"
                data-active={activeCategory === catName}
                onClick={() => setActiveCategory(catName)}
              >
                <Icon size={16} />
                {catName}
              </button>
            );
          })}
          </>}
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <h1 className="dashboard-title">{activeCategory}</h1>
              <p style={{ color: "var(--accents-5)", fontSize: "0.875rem" }}>
                {links.length} {links.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={16} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search memories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </header>

          {/* Sort / View / Export controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <button
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="btn btn-secondary"
              style={{ height: 34, padding: "0 12px", fontSize: "0.8rem", border: "1px solid var(--accents-2)" }}
            >
              <ArrowUpDown size={14} /> {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>

            <div style={{ display: "flex", borderRadius: 8, border: "1px solid var(--accents-2)", overflow: "hidden" }}>
              <button
                onClick={() => setViewMode("grid")}
                style={{ padding: "6px 10px", background: viewMode === "grid" ? "var(--accents-2)" : "transparent", border: "none", color: viewMode === "grid" ? "var(--geist-foreground)" : "var(--accents-4)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{ padding: "6px 10px", background: viewMode === "list" ? "var(--accents-2)" : "transparent", border: "none", color: viewMode === "list" ? "var(--geist-foreground)" : "var(--accents-4)", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <List size={15} />
              </button>
            </div>

            <div style={{ flex: 1 }} />

            <button
              onClick={() => exportLinks("csv")}
              className="btn btn-secondary"
              style={{ height: 34, padding: "0 12px", fontSize: "0.8rem", border: "1px solid var(--accents-2)" }}
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={() => exportLinks("md")}
              className="btn btn-secondary"
              style={{ height: 34, padding: "0 12px", fontSize: "0.8rem", border: "1px solid var(--accents-2)" }}
            >
              <Download size={14} /> Markdown
            </button>
          </div>

          {loading ? (
            <div className="empty-state-modern" style={{ border: "none" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: "inline-block", marginBottom: 16 }}>
                <Sparkles size={32} color="var(--accents-4)" />
              </motion.div>
              <p style={{ color: "var(--accents-5)" }}>Syncing your vault...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="empty-state-modern">
              <Inbox size={48} color="var(--accents-3)" style={{ margin: "0 auto 24px" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 8 }}>Nothing found</h2>
              <p style={{ color: "var(--accents-5)", maxWidth: 400, margin: "0 auto" }}>
                {search ? "No results match your search." : "Send a link from Instagram, X, Reddit, LinkedIn, or any article to your WhatsApp bot to populate your library."}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "bento-grid" : "bento-list"}>
              <AnimatePresence mode="popLayout">
                {sortedLinks.map((link) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={link.id}
                    className={viewMode === "grid" ? "bento-card" : "list-card"}
                    onClick={() => setSpotlight(link)}
                    style={{ cursor: "pointer" }}
                  >
                    {viewMode === "grid" && <CardImage link={link} />}
                    <div className={viewMode === "grid" ? "bento-content" : "list-content"}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: viewMode === "grid" ? 8 : 4 }}>
                        <span className="bento-category" style={{ margin: 0 }}>{link.category || "Uncategorized"}</span>
                        {link.platform && (
                          <span style={{ fontSize: "0.7rem", color: "var(--accents-4)", textTransform: "capitalize", fontWeight: 500 }}>
                            · {link.platform === "twitter" ? "X" : link.platform === "article" ? "Article" : link.platform}
                          </span>
                        )}
                      </div>
                      <h3 className="bento-title">{link.summary || "Untitled"}</h3>
                      <p className="bento-desc">{link.caption}</p>
                      
                      <div className="bento-footer">
                        <span className="bento-date">
                          {new Date(link.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}{", "}{new Date(link.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                        <div className="bento-actions">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="bento-action-btn" onClick={(e) => e.stopPropagation()}>
                            <ExternalLink size={16} />
                          </a>
                          <button className="bento-action-btn danger" onClick={(e) => { e.stopPropagation(); setDeleteTarget(link.id); }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Spotlight Modal */}
      <AnimatePresence>
        {spotlight && (
          <div className="modal-overlay" onClick={() => setSpotlight(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="modal-window"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accents-5)", fontWeight: 600, marginBottom: 4 }}>
                    {spotlight.category || "Uncategorized"}
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.3 }}>{spotlight.summary}</h2>
                </div>
                <button onClick={() => setSpotlight(null)} style={{ padding: 8, color: "var(--accents-5)", borderRadius: 6 }}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <PostEmbed url={spotlight.url} platform={spotlight.platform} thumbnail={spotlight.thumbnail} summary={spotlight.summary} />

                {spotlight.caption && (
                  <p style={{ color: "var(--accents-6)", lineHeight: 1.6, margin: "24px 0" }}>
                    {spotlight.caption}
                  </p>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                  <a href={spotlight.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1 }}>
                    View Original Link <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && <AnalyticsModal links={allLinks} onClose={() => setShowAnalytics(false)} />}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-window"
              style={{ maxWidth: 400, textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "32px 24px 24px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Trash2 size={22} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Delete this save?</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--accents-5)", lineHeight: 1.5 }}>This action cannot be undone.</p>
                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary" style={{ flex: 1, height: 40 }}>
                    Cancel
                  </button>
                  <button onClick={confirmDelete} style={{ flex: 1, height: 40, borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
            style={{
              position: "fixed",
              right: 24,
              bottom: 24,
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid var(--accents-2)",
              background: "var(--geist-background)",
              color: "var(--geist-foreground)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 100,
            }}
            title="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
