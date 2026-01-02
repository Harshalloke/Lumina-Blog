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

        const { postId, content } = await req.json();

        if (!postId || !content) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const comment = await db.comment.create({
            data: {
                content,
                postId,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        isVerified: true,
                    }
                }
            }
        });

        return NextResponse.json(comment);

    } catch (error) {
        console.error("COMMENT_CREATE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
