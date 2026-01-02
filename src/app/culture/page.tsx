import { getAllPosts } from "@/lib/api/posts";
import { PostPreview } from "@/components/blog/post-preview";

export const metadata = {
    title: "Culture | Lumina",
    description: "Exploring the intersection of life and technology.",
};

export default async function CulturePage() {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter(p => p.category === "Culture" || p.category === "Lifestyle");

    return (
        <div className="container mx-auto px-4 sm:px-8 py-16 lg:py-24">
            <div className="flex flex-col space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Culture</h1>
                <p className="text-muted-foreground text-lg max-w-2xl font-light">
                    Exploring the nuances of modern life, slow living, and human connection.
                </p>
            </div>

            {posts.length > 0 ? (
                <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <PostPreview key={post.slug} post={post} index={index} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-muted-foreground">
                    <p>No stories found in Culture yet.</p>
                </div>
            )}
        </div>
    );
}
