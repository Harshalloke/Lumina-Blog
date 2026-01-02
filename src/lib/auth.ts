import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image
                };
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user && token.sub) {
                session.user.id = token.sub as string;
                // Fetch fresh data from DB to reflect profile updates immediately
                const dbUser = await db.user.findUnique({
                    where: { id: token.sub as string },
                    select: {
                        name: true,
                        image: true,
                        plan: true,
                        isVerified: true,
                    }
                });

                if (dbUser) {
                    session.user.name = dbUser.name;
                    session.user.image = dbUser.image;
                    (session.user as any).plan = dbUser.plan;
                    (session.user as any).isVerified = dbUser.isVerified;
                }
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.sub = user.id;
            }

            // Handle client-side updates (e.g. from useSession().update())
            if (trigger === "update" && session?.user) {
                // Merge the updated user data into the token
                // We keep sub/id intact, just update display fields
                // NOTE: We do NOT update 'picture' here because if it's a base64 string, 
                // it will exceed the 4KB cookie limit and break the session.
                // The 'session' callback fetches the fresh image from the DB anyway.
                return {
                    ...token,
                    name: session.user.name ?? token.name,
                };
            }

            return token;
        }
    }
}
