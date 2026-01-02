import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with the API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return new NextResponse("Invalid email", { status: 400 });
        }

        // 1. Save to Database
        await db.newsletter.upsert({
            where: { email },
            update: {},
            create: { email }
        });

        // 2. Send Welcome Email via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "Lumina <onboarding@resend.dev>", // Default Resend test domain
                    to: email,
                    subject: "Welcome to Lumina",
                    html: `
                        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 12px;">
                            <h1 style="font-size: 32px; color: #111;">Welcome to Lumina</h1>
                            <p style="font-size: 18px; line-height: 1.6; color: #444;">
                                Thank you for joining our community of readers. We're excited to have you with us.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #666;">
                                Every week, we'll send you a curated selection of stories about design, technology, and culture.
                            </p>
                            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
                            <p style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
                                Lumina | Editorial Content Platform
                            </p>
                        </div>
                    `
                });
            } catch (emailError) {
                // We don't want to fail the whole request if the email fails 
                // but the DB save succeeded.
                console.error("EMAIL_SEND_ERROR", emailError);
            }
        } else {
            console.warn("RESEND_API_KEY not found in .env. Email was not sent, but user was added to database.");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("NEWSLETTER_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
