import { getAllPosts } from "@/lib/api/posts";
import { PostPreview } from "@/components/blog/post-preview";

export const metadata = {
    title: "Stories | Lumina",
    description: "Read the latest stories.",
};

export default async function StoriesPage() {
    const posts = await getAllPosts();
    // In a real app, we would filter or paginate here. 
    // For now, we show all posts as "Stories" or filter if we had more content.

    return (
        <div className="container mx-auto px-4 sm:px-8 py-16 lg:py-24">
            <div className="flex flex-col space-y-4 mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Stories</h1>
                <p className="text-muted-foreground text-lg max-w-2xl font-light">
                    Long-form essays, thoughts, and narratives from our editors.
                </p>
            </div>

            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                    <PostPreview key={post.slug} post={post} index={index} />
                ))}
            </div>
        </div>
    );
}
