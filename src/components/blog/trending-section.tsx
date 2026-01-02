"use client"

import { Post } from "@/lib/types"
import Link from "next/link"
import { motion } from "framer-motion"
import { TrendingUp, Eye } from "lucide-react"

interface TrendingSectionProps {
    posts: Post[];
}

export function TrendingSection({ posts }: TrendingSectionProps) {
    // Sort by views or claps (mocking trending logic)
    const trendingPosts = [...posts]
        .sort((a, b) => (b.views || 0) + (b.claps || 0) - ((a.views || 0) + (a.claps || 0)))
        .slice(0, 6);

    if (trendingPosts.length === 0) return null;

    return (
        <section className="container mx-auto px-4 sm:px-8 mb-20 lg:mb-32">
            <div className="flex items-center gap-2 mb-10 text-primary font-bold text-xs uppercase tracking-[0.3em]">
                <TrendingUp className="w-4 h-4" />
                Trending on Lumina
            </div>

            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {trendingPosts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex gap-6 group cursor-pointer"
                    >
                        <span className="text-4xl font-serif font-black text-muted-foreground/20 group-hover:text-primary/20 transition-colors leading-none">
                            {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <div className="flex-1 space-y-2">
                            <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                                {post.author.avatar && (
                                    <img src={post.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                                )}
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">{post.author.name}</span>
                            </Link>
                            <Link href={`/posts/${post.slug}`}>
                                <h3 className="text-lg font-serif font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                            </Link>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
