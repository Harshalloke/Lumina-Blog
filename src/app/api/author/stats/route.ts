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

        const posts = await db.post.findMany({
            where: {
                authorId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: {
                        comments: true,
                        bookmarks: true,
                    }
                }
            } as any
        });

        return NextResponse.json(posts);

    } catch (error) {
        console.error("STATS_FETCH_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
