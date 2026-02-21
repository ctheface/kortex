"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowRight, Smartphone, BrainCircuit, Search, Database, MessageCircle, Zap, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <>
      <nav className="nav">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <div className="nav-logo">
            <Database size={20} />
            Kortex
          </div>
          <div className="nav-links">
            <Link href="#how-it-works" className="nav-link">How it Works</Link>
            <Link href="#features" className="nav-link">Features</Link>
            <ThemeToggle />
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-title"
          >
            The Knowledge Base<br />for your Social Saves.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-subtitle"
          >
            Stop losing valuable content in endless saves and bookmarks. Forward links from Instagram, X, Reddit, YouTube, and more — let AI organize your personal library.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-cta"
          >
            <Link href="/dashboard" className="btn btn-primary" style={{ height: 48, padding: "0 24px", fontSize: "1rem" }}>
              Get Started <ArrowRight size={18} />
            </Link>
            <a href="https://wa.me/14155238886" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ height: 48, padding: "0 24px", fontSize: "1rem" }}>
              Message the Bot
            </a>
          </motion.div>
        </section>

        <section id="how-it-works" style={{ padding: "80px 0", backgroundColor: "var(--accents-1)", borderTop: "1px solid var(--accents-2)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>How Kortex Works</h2>
              <p style={{ color: "var(--accents-5)", fontSize: "1.1rem" }}>Three simple steps to build your second brain.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", position: "relative" }}>
              <motion.div whileHover={{ y: -5 }} style={{ padding: "32px", background: "var(--geist-background)", borderRadius: "var(--radius)", border: "1px solid var(--accents-2)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--geist-foreground)", color: "var(--geist-background)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <MessageCircle size={28} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>1. Send a Link</h3>
                <p style={{ color: "var(--accents-5)", lineHeight: 1.5 }}>See something you like on Instagram or X? Just forward the URL to your dedicated Kortex WhatsApp bot.</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} style={{ padding: "32px", background: "var(--geist-background)", borderRadius: "var(--radius)", border: "1px solid var(--accents-2)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--geist-foreground)", color: "var(--geist-background)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <Zap size={28} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>2. AI Processing</h3>
                <p style={{ color: "var(--accents-5)", lineHeight: 1.5 }}>Our AI instantly reads the content, generates a concise summary, and auto-assigns relevant tags like "Fitness" or "Coding".</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} style={{ padding: "32px", background: "var(--geist-background)", borderRadius: "var(--radius)", border: "1px solid var(--accents-2)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--geist-foreground)", color: "var(--geist-background)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <LayoutDashboard size={28} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>3. Instant Dashboard</h3>
                <p style={{ color: "var(--accents-5)", lineHeight: 1.5 }}>Your save is immediately available in your searchable, beautifully organized dashboard.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>Designed for immediate recall.</h2>
              <p style={{ color: "var(--accents-5)", fontSize: "1.1rem" }}>Every save is processed, summarized, and categorized automatically.</p>
            </div>

            <div className="features-grid">
              <motion.div 
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <div className="feature-icon"><Smartphone size={24} color="var(--geist-foreground)" /></div>
                <h3 className="feature-title">Frictionless Input</h3>
                <p className="feature-desc">No new apps to download. Just text or forward links directly to Kortex via WhatsApp while you browse.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <div className="feature-icon"><BrainCircuit size={24} color="var(--geist-foreground)" /></div>
                <h3 className="feature-title">AI Auto-Tagging</h3>
                <p className="feature-desc">Our intelligent pipeline extracts context and automatically assigns perfect categories to your saves.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <div className="feature-icon"><Search size={24} color="var(--geist-foreground)" /></div>
                <h3 className="feature-title">Instant Retrieval</h3>
                <p className="feature-desc">A blazing-fast, beautiful dashboard built to help you find that one recipe or coding tip in milliseconds.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--accents-2)", padding: "40px 0", color: "var(--accents-5)", fontSize: "0.875rem", textAlign: "center" }}>
        <p>© {new Date().getFullYear()} Kortex. The "Social Saver" Hackathon Challenge.</p>
      </footer>
    </>
  );
}
