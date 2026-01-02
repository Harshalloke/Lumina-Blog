import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const exists = await db.user.findUnique({
            where: { email }
        });

        if (exists) {
            return new NextResponse("User already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image: `https://avatar.vercel.sh/${email}` // Random avatar gen
            }
        });

        return NextResponse.json(user);

    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
