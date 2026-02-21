import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS = ["gemini-2.5-flash-lite-preview-09-2025", "gemini-3-flash-preview"];

const PLATFORM_CONTEXT = {
  instagram: "an Instagram post/reel",
  twitter: "an X (Twitter) post/tweet",
  reddit: "a Reddit post",
  linkedin: "a LinkedIn post or article",
  article: "a blog post or web article",
};

// Predefined categories — Gemini can also suggest new ones beyond this list
const PREDEFINED = [
  "Fitness", "Coding", "Food", "Travel", "Fashion",
  "Design", "Music", "Education", "Motivation", "Lifestyle",
];

export async function categorizeAndSummarize(caption, platform = "article", url = "") {
    if (!caption || caption.trim() === "") {
        return { category: "Uncategorized", summary: "No content available." };
    }

    const platformContext = PLATFORM_CONTEXT[platform] || "a web page";
    const isUrlOnly = caption.startsWith("http") && !caption.includes(" ");
    const urlContext = url ? `\n\nURL (use for extra context — subreddit, path, domain, etc.): "${url}"` : "";

    const summaryRules = `Write a SHORT 1-sentence summary (max 12 words). Rules:
- Do NOT repeat or copy the title/caption. Rephrase it in your own words.
- Do NOT start with "This content", "This post", "This video", "The post", "The tweet", "A video of".
- Do NOT end with "is available", "is shared", "is posted".
- Write it like a short, natural headline. Examples:
  Good: "Classic Kishore Kumar romantic ballad from Mr. X In Bombay"
  Good: "Quick 15-minute abs workout for beginners"
  Good: "Messi's reaction to winning the Ballon d'Or"
  Bad: "MERE MEHBOOB QAYAMAT HOGI Original Full Song 4K is available."
  Bad: "This content is about a workout routine"
  Bad: "A video showing a football match highlight"`;

    const prompt = isUrlOnly
        ? `You are a content categorizer. I have a URL from ${platformContext} but couldn't extract content.

URL: "${caption}"

Pick the best category. Prefer one from this list if it fits well:
${PREDEFINED.join(", ")}

If NONE of them fit, invent a short (1-2 word) category name that accurately describes the content (e.g. "Photography", "Finance", "Gaming", "Politics").

${summaryRules}

Respond ONLY in this exact JSON format (no markdown):
{"category": "CategoryName", "summary": "One sentence summary."}`
        : `You are a content categorizer. I have content from ${platformContext}.

Content: "${caption}"${urlContext}

Pick the best category. Prefer one from this list if it fits well:
${PREDEFINED.join(", ")}

If NONE of them fit, invent a short (1-2 word) category name that accurately describes the content (e.g. "Photography", "Finance", "Gaming", "Politics").

${summaryRules}

Respond ONLY in this exact JSON format (no markdown):
{"category": "CategoryName", "summary": "One sentence summary."}`;

    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                // Capitalize first letter of custom categories
                parsed.category = parsed.category.trim().replace(/^\w/, (c) => c.toUpperCase());
                console.log(`[AI] Success with ${modelName} → category: ${parsed.category}`);
                return parsed;
            }

            return { category: "Other", summary: text.slice(0, 200) };
        } catch (error) {
            console.error(`[AI] ${modelName} failed:`, error.message?.slice(0, 100));
        }
    }

    return { category: "Uncategorized", summary: "Could not analyze content." };
}
