import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const bookmarks = await db.bookmark.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                post: {
                    include: {
                        author: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(bookmarks);

    } catch (error) {
        console.error("BOOKMARKS_FETCH_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
