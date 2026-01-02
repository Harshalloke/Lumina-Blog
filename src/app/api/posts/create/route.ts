import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content, category, coverImage, isPremium } = await req.json();

        if (!title || !content) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Create a slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

        const post = await db.post.create({
            data: {
                title,
                content,
                category: category || "Stories",
                slug,
                published: true,
                isPremium: !!isPremium,
                authorId: session.user.id,
                coverImage: coverImage || "/images/hero-abstract.png", // Use provided or default
                featured: false,
            }
        });

        return NextResponse.json(post);

    } catch (error) {
        console.error("CREATE_POST_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
