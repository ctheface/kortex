import { NextResponse } from "next/server";
import { getLinks, deleteLink } from "@/services/linkService";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const platform = searchParams.get("platform") || "";

    try {
        const data = await getLinks({ search, category, platform });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    try {
        await deleteLink(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
