import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        // Verify the post belongs to the user
        const post = await db.post.findUnique({
            where: { id },
            select: { authorId: true }
        });

        if (!post) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (post.authorId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await db.post.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error("POST_DELETE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
