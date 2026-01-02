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

        const { postId } = await req.json();

        if (!postId) {
            return new NextResponse("Missing Post ID", { status: 400 });
        }

        // Check if already bookmarked
        const existing = await db.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId: postId,
                }
            }
        });

        if (existing) {
            await db.bookmark.delete({
                where: {
                    id: existing.id
                }
            });
            return NextResponse.json({ bookmarked: false });
        } else {
            await db.bookmark.create({
                data: {
                    userId: session.user.id,
                    postId: postId,
                }
            });
            return NextResponse.json({ bookmarked: true });
        }

    } catch (error) {
        console.error("BOOKMARK_TOGGLE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
