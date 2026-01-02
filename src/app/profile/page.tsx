import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/profile/profile-form";
import { PostList } from "@/components/profile/post-list";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/signin");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            posts: {
                orderBy: { createdAt: 'desc' }
            },
            bookmarks: {
                include: {
                    post: true
                },
                orderBy: { createdAt: 'desc' }
            }
        } as any
    });

    if (!user) {
        return <div>User not found</div>;
    }

    const bookmarkedPosts = ((user as any).bookmarks || []).map((b: any) => ({
        ...b.post,
        published: true // Bookmarked posts are always published from the reader's view
    })) as any[];

    return (
        <div className="container mx-auto py-12 px-4 sm:px-8 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold mb-8">Your Profile</h1>

            <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
                {/* Left Column: User Details & Edit Form */}
                <div className="space-y-6">
                    <ProfileForm user={{
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        bio: user.bio,
                        plan: user.plan,
                        isVerified: user.isVerified,
                    }} />
                </div>

                {/* Right Column: User's Content */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold">Your Stories</h2>
                        <PostList posts={user.posts as any[]} editable={true} />
                    </div>

                    {bookmarkedPosts.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold">Reading List</h2>
                            <PostList posts={bookmarkedPosts} editable={false} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
