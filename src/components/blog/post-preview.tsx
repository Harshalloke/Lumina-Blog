"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Post } from "@/lib/types"
import { Heart, Sparkles } from "lucide-react"

export function PostPreview({ post, index }: { post: Post, index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col space-y-4"
        >
            <Link href={`/posts/${post.slug}`} className="block overflow-hidden rounded-sm">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-secondary">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {post.isPremium && (
                        <div className="absolute top-3 right-3 bg-primary text-white text-[8px] font-black px-2 py-1 rounded shadow-lg backdrop-blur-md flex items-center gap-1 uppercase tracking-tighter">
                            <Sparkles className="h-2 w-2" />
                            Premium
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    <span className="text-primary">{post.category}</span>
                    <div className="flex items-center gap-3">
                        {post.claps !== undefined && post.claps > 0 && (
                            <span className="flex items-center gap-1 text-red-500/80">
                                <Heart className="h-3 w-3 fill-red-500" />
                                {post.claps}
                            </span>
                        )}
                        <span>{post.readTime}</span>
                    </div>
                </div>
                <Link href={`/posts/${post.slug}`} className="block">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold leading-snug group-hover:text-primary/70 transition-colors">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-muted-foreground line-clamp-2 leading-relaxed text-sm sm:text-base">
                    {post.excerpt}
                </p>

                <div className="flex items-center pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {post.author.avatar && (
                            <div className="relative h-6 w-6 rounded-full overflow-hidden bg-muted shadow-sm">
                                <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
                            </div>
                        )}
                        <span>{post.author.name}</span>
                    </div>
                </div>
            </div>
        </motion.article>
    )
}
