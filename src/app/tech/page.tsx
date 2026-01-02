import { getAllPosts } from "@/lib/api/posts";
import { PostPreview } from "@/components/blog/post-preview";

export const metadata = {
    title: "Technology | Lumina",
    description: "Engineering, design, and the future of web.",
};

export default async function TechPage() {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter(p => p.category === "Engineering" || p.category === "Tech" || p.category === "Design");

    return (
        <div className="container mx-auto px-4 sm:px-8 py-16 lg:py-24">
            <div className="flex flex-col space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Technology</h1>
                <p className="text-muted-foreground text-lg max-w-2xl font-light">
                    Deep dives into code, architecture, and the design of digital systems.
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
                    <p>No stories found in Technology yet.</p>
                </div>
            )}
        </div>
    );
}
