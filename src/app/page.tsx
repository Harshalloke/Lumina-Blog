import { getAllPosts, getFeaturedPost } from "@/lib/api/posts";
import { FeaturedPost } from "@/components/blog/featured-post";
import { PostPreview } from "@/components/blog/post-preview";
import { TrendingSection } from "@/components/blog/trending-section";

export default async function Home() {
  const posts = await getAllPosts();
  const featuredPost = await getFeaturedPost();

  const morePosts = posts.filter(p => p.id !== featuredPost?.id);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {featuredPost && <FeaturedPost post={featuredPost} />}

      <TrendingSection posts={posts} />

      <section className="container mx-auto px-4 sm:px-8">
        <div className="border-t border-border pt-16">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Latest Stories</h2>
            <span className="hidden sm:block text-muted-foreground font-medium text-sm tracking-widest uppercase">
              Issue 01 — Oct 2025
            </span>
          </div>

          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {morePosts.map((post, index) => (
              <PostPreview key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
