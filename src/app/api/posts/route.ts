import { getAllPosts } from "@/lib/api/posts";
import { NextResponse } from "next/server";

export async function GET() {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
}
