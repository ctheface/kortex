"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  Database, Search, Trash2, ExternalLink, Inbox, 
  Sparkles, Code, Dumbbell, Coffee, Map, ShoppingBag, 
  Palette, Music, BookOpen, Heart, Layers, X,
  Instagram, Globe, Linkedin, Youtube, SidebarOpen, SidebarClose
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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this save?")) return;
    try {
      await fetch(`/api/links?id=${id}`, { method: "DELETE" });
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
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
            <div className="bento-grid">
              <AnimatePresence mode="popLayout">
                {links.map((link) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={link.id}
                    className="bento-card"
                    onClick={() => setSpotlight(link)}
                    style={{ cursor: "pointer" }}
                  >
                    <CardImage link={link} />
                    <div className="bento-content">
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <span className="bento-category" style={{ margin: 0 }}>{link.category || "Uncategorized"}</span>
                        {link.platform && link.platform !== "article" && (
                          <span style={{ fontSize: "0.7rem", color: "var(--accents-4)", textTransform: "capitalize", fontWeight: 500 }}>
                            · {link.platform === "twitter" ? "X" : link.platform}
                          </span>
                        )}
                      </div>
                      <h3 className="bento-title">{link.summary || "Untitled"}</h3>
                      <p className="bento-desc">{link.caption}</p>
                      
                      <div className="bento-footer">
                        <span className="bento-date">
                          {new Date(link.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <div className="bento-actions">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="bento-action-btn" onClick={(e) => e.stopPropagation()}>
                            <ExternalLink size={16} />
                          </a>
                          <button className="bento-action-btn danger" onClick={(e) => { e.stopPropagation(); handleDelete(link.id); }}>
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
                <PostEmbed url={spotlight.url} platform={spotlight.platform} />

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
    </>
  );
}
