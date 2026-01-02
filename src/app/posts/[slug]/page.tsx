import { getPostBySlug, getAllPosts } from "@/lib/api/posts";
import { ArticleReader } from "@/components/blog/article-reader";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    // Fetch detailed post with session context (for bookmarks, follows, comments, etc)
    const post = await getPostBySlug(slug, session?.user?.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <ArticleReader post={post} />
        </div>
    );
}
