"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Post } from "@/lib/types"
import { ArrowRight, Sparkles } from "lucide-react"

export function FeaturedPost({ post }: { post: Post }) {
    if (!post) return null;
    return (
        <section className="relative w-full overflow-hidden py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col space-y-6 order-2 lg:order-1"
                    >
                        <div className="flex items-center space-x-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground/80">
                            <span className="bg-secondary px-2 py-1 rounded-sm text-secondary-foreground">{post.category}</span>
                            {post.isPremium && (
                                <span className="bg-primary text-white px-2 py-1 rounded-sm flex items-center gap-1 font-black text-[9px]">
                                    <Sparkles className="w-2 h-2" /> PRO
                                </span>
                            )}
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                        <Link href={`/posts/${post.slug}`} className="block group">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-[1.05] group-hover:opacity-80 transition-opacity">
                                {post.title}
                            </h1>
                        </Link>
                        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-light">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 relative rounded-full overflow-hidden bg-secondary shadow-sm">
                                    {/* Placeholder avatar if missing */}
                                    {post.author.avatar && (
                                        <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium text-foreground">{post.author.name}</span>
                                    <span className="text-muted-foreground text-xs">{post.publishedAt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link href={`/posts/${post.slug}`} className="inline-flex items-center space-x-2 text-foreground font-medium text-lg group">
                                <span className="border-b border-foreground/30 pb-0.5 group-hover:border-foreground transition-all">Read Story</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="relative aspect-[4/3] lg:aspect-[5/4] w-full overflow-hidden rounded-sm order-1 lg:order-2"
                    >
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
