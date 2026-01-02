import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name, bio, image } = await req.json();

        const user = await db.user.update({
            where: { id: session.user.id },
            data: { name, bio, image }
        });

        return NextResponse.json(user);

    } catch (error) {
        console.error("PROFILE_UPDATE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
