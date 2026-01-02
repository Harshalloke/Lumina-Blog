import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostList } from "@/components/profile/post-list";
import { Metadata } from "next";

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const user = await db.user.findUnique({
        where: { id },
        select: { name: true }
    });

    return {
        title: user?.name ? `${user.name} - Profile` : "User Profile",
    };
}

export default async function PublicProfilePage({ params }: Props) {
    const { id } = await params;

    const user = await db.user.findUnique({
        where: { id },
        include: {
            posts: {
                where: { published: true }, // Only show published posts for public view
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-8 max-w-4xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="relative group">
                    <img
                        src={user.image || `https://avatar.vercel.sh/${user.email}`}
                        alt={user.name || "User"}
                        className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-xl"
                    />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold">{user.name}</h1>
                    {user.bio && (
                        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{user.bio}</p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold border-b border-border/50 pb-4">Published Stories</h2>
                {user.posts.length > 0 ? (
                    <PostList posts={user.posts as any[]} />
                ) : (
                    <div className="text-center py-12 text-muted-foreground italic">
                        No stories published yet.
                    </div>
                )}
            </div>
        </div>
    );
}
