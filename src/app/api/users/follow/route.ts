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

        const { followingId } = await req.json();

        if (!followingId) {
            return new NextResponse("Missing Following ID", { status: 400 });
        }

        if (followingId === session.user.id) {
            return new NextResponse("Cannot follow yourself", { status: 400 });
        }

        // Check if already following
        const existing = await db.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: followingId,
                }
            }
        });

        if (existing) {
            await db.follow.delete({
                where: {
                    id: existing.id
                }
            });
            return NextResponse.json({ following: false });
        } else {
            await db.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId: followingId,
                }
            });
            return NextResponse.json({ following: true });
        }

    } catch (error) {
        console.error("FOLLOW_TOGGLE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
