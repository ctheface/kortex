import { NextResponse } from "next/server";
import { extractSocialUrl, scrapeLink, detectPlatform } from "@/services/scraperService";
import { categorizeAndSummarize } from "@/services/aiService";
import { saveLink, findByUrl } from "@/services/linkService";

const PLATFORM_LABELS = {
  instagram: "Instagram",
  twitter: "X (Twitter)",
  reddit: "Reddit",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  article: "Article",
};

const PLATFORM_EMOJIS = {
  instagram: "📸",
  twitter: "🐦",
  reddit: "🤖",
  youtube: "🎬",
  linkedin: "💼",
  article: "📰",
};

const CATEGORY_EMOJIS = {
  Fitness: "💪",
  Coding: "💻",
  Food: "🍜",
  Travel: "✈️",
  Fashion: "👗",
  Design: "🎨",
  Music: "🎵",
  Education: "📚",
  Motivation: "⚡",
  Lifestyle: "🌿",
  Finance: "💰",
  Gaming: "🎮",
  Photography: "📷",
  Politics: "🗳️",
  Science: "🔬",
  Sports: "⚽",
  Other: "📌",
  Uncategorized: "📌",
};

function escapeXml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function twimlResponse(message) {
    const safe = escapeXml(message);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safe}</Message></Response>`;
    return new NextResponse(twiml, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
    });
}

async function sendWhatsAppFollowUp(to, message) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
        console.error("[Webhook] Missing Twilio credentials for follow-up");
        return;
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams({
        To: to,
        From: `whatsapp:${fromNumber}`,
        Body: message,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("[Webhook] Follow-up send failed:", err);
    } else {
        console.log("[Webhook] Follow-up sent to", to);
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const body = (formData.get("Body") || "").trim();
        const from = formData.get("From") || "";

        console.log(`[Webhook] From: ${from} | Body: ${body}`);

        const url = extractSocialUrl(body);

        if (!url) {
            return twimlResponse(
                "👋 Hey! Send me a link from Instagram, X, Reddit, LinkedIn, or any article — I'll save & organize it for you.\n\n📌 Supported:\n• 📸 Instagram posts & reels\n• 🐦 X / Twitter posts\n• 🤖 Reddit threads\n• 💼 LinkedIn articles\n• 📰 Any blog or article"
            );
        }

        const platform = detectPlatform(url);
        const label = PLATFORM_LABELS[platform] || "link";
        const platformEmoji = PLATFORM_EMOJIS[platform] || "🔗";
        console.log(`[Webhook] ${label} link detected:`, url);

        // Check for duplicates
        const existing = await findByUrl(url);
        if (existing) {
            const savedDate = new Date(existing.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const categoryEmoji = CATEGORY_EMOJIS[existing.category] || "🏷️";
            return twimlResponse(`🔁 *Already in your Kortex!*\n\nYou saved this on *${savedDate}*.\n${categoryEmoji} *Category:* ${existing.category}\n📝 *Summary:* ${existing.summary}\n\n🔍 Check your dashboard to find it!`);
        }

        // Reply to Twilio instantly, process in background
        processAndNotify(from, url, platform);

        return twimlResponse(`${platformEmoji} Got it! Processing your *${label}* link...\n\n⏳ I'll send you a summary in just a moment!`);
    } catch (error) {
        console.error("[Webhook] Fatal error:", error.message);
        return twimlResponse("⚠️ Something went wrong. Please try again!");
    }
}

async function processAndNotify(from, url, platform) {
    try {
        const scrapedData = await scrapeLink(url);
        console.log("[Webhook] Scraped:", JSON.stringify(scrapedData));

        let captionForAi = scrapedData.caption || "";
        if (scrapedData.tags?.length > 0) {
            captionForAi += "\nTags: " + scrapedData.tags.join(", ");
        }
        if (!captionForAi) captionForAi = url;

        const aiResult = await categorizeAndSummarize(captionForAi, platform, url);
        console.log("[Webhook] AI result:", JSON.stringify(aiResult));

        await saveLink({
            url,
            platform,
            caption: scrapedData.caption || "",
            summary: aiResult.summary,
            category: aiResult.category,
            thumbnail: scrapedData.thumbnail || "",
        });

        const label = PLATFORM_LABELS[platform] || "link";
        const platformEmoji = PLATFORM_EMOJIS[platform] || "🔗";
        const categoryEmoji = CATEGORY_EMOJIS[aiResult.category] || "🏷️";

        await sendWhatsAppFollowUp(
            from,
            `✅ *Saved to your Kortex!*\n\n${platformEmoji} *Source:* ${label}\n${categoryEmoji} *Category:* ${aiResult.category}\n\n📝 *Summary:*\n${aiResult.summary}\n\n🔍 View it on your dashboard!`
        );
    } catch (err) {
        console.error("[Webhook] processAndNotify error:", err.message);
        await sendWhatsAppFollowUp(from, "⚠️ Something went wrong saving your link. Please try again.");
    }
}

export async function GET() {
    return NextResponse.json({ status: "Webhook endpoint active" });
}
