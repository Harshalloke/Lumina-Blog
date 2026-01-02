import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { postId } = await req.json();

        if (!postId) {
            return new NextResponse("Missing Post ID", { status: 400 });
        }

        await db.post.update({
            where: { id: postId },
            data: {
                views: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("VIEW_TRACK_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
