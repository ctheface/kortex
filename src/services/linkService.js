import { supabaseServer } from "@/lib/supabaseServer";

export async function saveLink({ url, platform = "article", caption, summary, category, thumbnail }) {
    const { data, error } = await supabaseServer.from("links").insert([
        {
            url,
            platform,
            caption: caption || "",
            summary: summary || "",
            category: category || "Uncategorized",
            thumbnail: thumbnail || "",
        },
    ]);

    if (error) {
        console.error("Supabase insert error:", error);
        throw new Error("Failed to save link");
    }

    return data;
}

export async function getLinks({ search = "", category = "", platform = "" } = {}) {
    let query = supabaseServer
        .from("links")
        .select("*")
        .order("created_at", { ascending: false });

    if (search) {
        query = query.or(
            `caption.ilike.%${search}%,summary.ilike.%${search}%,category.ilike.%${search}%,url.ilike.%${search}%`
        );
    }

    if (category && category !== "All") {
        query = query.eq("category", category);
    }

    if (platform) {
        query = query.eq("platform", platform);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase query error:", error);
        throw new Error("Failed to fetch links");
    }

    return data;
}

export async function deleteLink(id) {
    const { error } = await supabaseServer.from("links").delete().eq("id", id);

    if (error) {
        console.error("Supabase delete error:", error);
        throw new Error("Failed to delete link");
    }

    return true;
}
