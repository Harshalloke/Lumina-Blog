import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const post = await db.post.update({
            where: { id },
            data: {
                claps: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ claps: post.claps });
    } catch (error) {
        console.error("CLAP_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
