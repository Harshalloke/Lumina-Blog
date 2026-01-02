"use client"
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion"
import { useSession } from "next-auth/react"
import { Post } from "@/lib/types"
import { useState, useEffect } from "react"
import {
    Maximize2,
    Minimize2,
    Type,
    Heart,
    Lock,
    BadgeCheck,
    Bookmark,
    MessageSquare,
    Share2,
    Plus,
    Check,
    Eye
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { NewsletterBox } from "@/components/blog/newsletter-box"
import { CommentSection } from "@/components/blog/comment-section"
import { cn } from "@/lib/utils"

export function ArticleReader({ post }: { post: Post }) {
    const { data: session } = useSession();
    const { scrollYProgress, scrollY } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [focusMode, setFocusMode] = useState(false);
    const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
    const [claps, setClaps] = useState(post.claps || 0);
    const [isClapping, setIsClapping] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
    const [isFollowing, setIsFollowing] = useState(post.isFollowingAuthor || false);
    const [views, setViews] = useState(post.views || 0);

    // Track View on Mount
    useEffect(() => {
        const trackView = async () => {
            try {
                await fetch("/api/posts/track-view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId: post.id })
                });
                setViews(v => v + 1);
            } catch (e) {
                console.error("View tracking failed", e);
            }
        };
        trackView();
    }, [post.id]);

    const handleClap = async () => {
        setIsClapping(true);
        setClaps(prev => prev + 1);
        try {
            await fetch(`/api/posts/${post.id}/clap`, { method: "POST" });
        } catch (error) {
            setClaps(prev => prev - 1);
        } finally {
            setTimeout(() => setIsClapping(false), 300);
        }
    };

    const handleBookmark = async () => {
        if (!session) return alert("Sign in to bookmark stories");
        const previous = isBookmarked;
        setIsBookmarked(!isBookmarked);
        try {
            await fetch("/api/bookmarks/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post.id })
            });
        } catch (e) {
            setIsBookmarked(previous);
        }
    };

    const handleFollow = async () => {
        if (!session) return alert("Sign in to follow authors");
        if (session.user.id === post.author.id) return;
        const previous = isFollowing;
        setIsFollowing(!isFollowing);
        try {
            await fetch("/api/users/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ followingId: post.author.id })
            });
        } catch (e) {
            setIsFollowing(previous);
        }
    };

    // Reading Memory Logic
    useEffect(() => {
        const key = `reading-pos-${post.slug}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const y = parseFloat(saved);
            setTimeout(() => window.scrollTo({ top: y, behavior: 'smooth' }), 500);
        }
    }, [post.slug]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        localStorage.setItem(`reading-pos-${post.slug}`, latest.toString());
    });

    return (
        <>
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-primary origin-left z-[60]"
                style={{ scaleX }}
            />

            {/* Floating Controls */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("fixed bottom-8 right-8 z-40 flex flex-col gap-3 transition-opacity duration-300", focusMode ? "opacity-0 hover:opacity-100" : "opacity-100")}
            >
                <div className="flex flex-col items-center gap-1 mb-2">
                    <motion.div animate={isClapping ? { scale: [1, 1.4, 1] } : {}}>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={handleClap}
                            className="bg-background/80 backdrop-blur border border-border rounded-full h-12 w-12 shadow-2xl hover:bg-background group relative overflow-hidden"
                        >
                            <Heart className={cn("h-5 w-5 transition-colors z-10", claps > 0 ? "fill-red-500 text-red-500" : "text-muted-foreground group-hover:text-red-500")} />
                            {isClapping && (
                                <motion.span
                                    initial={{ y: 20, opacity: 1 }}
                                    animate={{ y: -40, opacity: 0 }}
                                    className="absolute text-red-500 font-bold text-xs"
                                >
                                    +1
                                </motion.span>
                            )}
                        </Button>
                    </motion.div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{claps}</span>
                </div>

                <div className="flex flex-col items-center gap-1 mb-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleBookmark}
                        className="bg-background/80 backdrop-blur border border-border rounded-full h-12 w-12 shadow-2xl hover:bg-background group"
                    >
                        <Bookmark className={cn("h-5 w-5 transition-colors", isBookmarked ? "fill-primary text-primary" : "text-muted-foreground group-hover:text-primary")} />
                    </Button>
                </div>

                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => document.getElementById('responses')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-background/80 backdrop-blur border border-border rounded-full h-12 w-12 shadow-2xl hover:bg-background text-muted-foreground hover:text-primary"
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>

                <div className="w-px h-8 bg-border/50 mx-auto my-1" />

                <Button variant="secondary" size="icon" onClick={() => setFocusMode(!focusMode)} className="bg-background/80 backdrop-blur border border-border rounded-full h-12 w-12 shadow-2xl hover:bg-background text-muted-foreground hover:text-primary">
                    {focusMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
                <Button variant="secondary" size="icon" onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')} className="bg-background/80 backdrop-blur border border-border rounded-full h-12 w-12 shadow-2xl hover:bg-background text-muted-foreground hover:text-primary">
                    <Type className="h-5 w-5" />
                </Button>
            </motion.div>

            {/* Focus Mode Backdrop */}
            <div className={cn("fixed inset-0 bg-background z-30 transition-opacity duration-700 pointer-events-none", focusMode ? "opacity-100" : "opacity-0")} />

            {/* Article Content */}
            <article className={cn("relative z-30 transition-all duration-700", focusMode ? "py-24" : "py-12")}>
                <header className="container mx-auto px-4 sm:px-8 mb-12 lg:mb-16 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center items-center gap-3 mb-8 text-xs sm:text-sm font-bold tracking-widest uppercase text-primary/60"
                    >
                        <span>{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        <span>{post.readTime}</span>
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {views}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] mb-8 text-foreground"
                    >
                        {post.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center justify-center gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <Link href={`/profile/${post.author.id}`} className="group flex items-center gap-3">
                                {post.author.avatar && (
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-background border border-border group-hover:ring-primary/20 transition-all shadow-sm">
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="text-left leading-tight">
                                    <div className="flex items-center gap-1">
                                        <div className="font-semibold text-sm group-hover:text-primary transition-colors">{post.author.name}</div>
                                        {post.author.isVerified && <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />}
                                    </div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{post.publishedAt}</div>
                                </div>
                            </Link>

                            {session?.user.id !== post.author.id && (
                                <Button
                                    variant={isFollowing ? "outline" : "default"}
                                    size="sm"
                                    onClick={handleFollow}
                                    className={cn(
                                        "rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-widest transition-all",
                                        isFollowing ? "border-primary/50 text-primary hover:bg-primary/5" : "bg-primary text-white hover:bg-primary/90"
                                    )}
                                >
                                    {isFollowing ? (
                                        <><Check className="w-3 h-3 mr-1.5" /> Following</>
                                    ) : (
                                        <><Plus className="w-3 h-3 mr-1.5" /> Follow</>
                                    )}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </header>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={cn("relative w-full overflow-hidden transition-all duration-700 mb-16", focusMode ? "aspect-[2.35/1] max-w-[1400px] mx-auto rounded-xl shadow-2xl" : "aspect-[21/9] lg:aspect-[2.4/1]")}
                >
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
                </motion.div>

                <div className={cn("container mx-auto px-4 sm:px-8 max-w-[680px] font-serif text-foreground/90 space-y-8 select-text", fontSize === 'large' ? "text-xl md:text-2xl leading-relaxed" : "text-lg md:text-xl leading-loose")}>
                    {post.isPremium && (session?.user as any)?.plan !== 'PRO' ? (
                        <div className="relative">
                            <div
                                dangerouslySetInnerHTML={{ __html: (post.content || "").slice(0, 400) + "..." }}
                                className="prose-content blur-[2px] pointer-events-none select-none mask-gradient-to-b from-black to-transparent"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background flex items-end justify-center pb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full p-8 bg-card border border-border/60 rounded-3xl shadow-2xl text-center space-y-6 mb-12"
                                >
                                    <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-2">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-serif font-bold">This story is for Pro members</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto">
                                            Lumina's best stories are reserved for our community of professional readers.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3 pt-4 max-w-xs mx-auto">
                                        <Link href="/membership">
                                            <Button className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 font-bold text-white shadow-lg shadow-primary/20">
                                                Upgrade to PRO — $12/mo
                                            </Button>
                                        </Link>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                            Instant access • Cancel anytime
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }} className="prose-content" />
                    )}

                    <NewsletterBox />

                    <hr className="my-12 border-border" />

                    <div className="flex flex-col items-center justify-center text-center space-y-4 p-8 bg-secondary/30 rounded-xl border border-border/50">
                        <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">Written By</p>
                        {post.author.avatar && (
                            <Link href={`/profile/${post.author.id}`} className="hover:opacity-80 transition-opacity">
                                <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="h-20 w-20 rounded-full object-cover border-4 border-background shadow-lg"
                                />
                            </Link>
                        )}
                        <div className="space-y-4">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-serif font-bold">{post.author.name}</h3>
                                    {post.author.isVerified && <BadgeCheck className="w-5 h-5 text-primary fill-primary/10" />}
                                </div>
                                <p className="text-muted-foreground max-w-sm mt-1">{post.author.bio || "Editor at Lumina. Writing about design and technology."}</p>
                            </div>

                            {session?.user.id !== post.author.id && (
                                <Button
                                    onClick={handleFollow}
                                    variant={isFollowing ? "outline" : "default"}
                                    className="rounded-full px-6"
                                >
                                    {isFollowing ? "Following Author" : "Follow Author"}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div id="responses" className="pt-20">
                        <CommentSection postId={post.id} initialComments={post.comments} />
                    </div>
                </div>
            </article>

            {/* Style injection for Editorial Typography */}
            <style jsx global>{`
                .prose-content p { margin-bottom: 2em; }
                .prose-content h2 { font-family: var(--font-sans); font-size: 1.5em; font-weight: 700; margin-top: 3em; margin-bottom: 1em; letter-spacing: -0.02em; color: var(--foreground); }
                .prose-content blockquote { position: relative; padding-left: 2em; font-style: italic; margin: 3em 0; font-size: 1.25em; line-height: 1.6; color: var(--foreground); }
                .prose-content blockquote::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--primary); border-radius: 2px; }
                .prose-content .lead { font-size: 1.2em; font-weight: 500; margin-bottom: 3em; line-height: 1.8; color: var(--foreground); }
                .prose-content strong { font-weight: 600; color: var(--primary); }
                .prose-content em { font-style: italic; color: var(--foreground); }
                .prose-content img { border-radius: 1rem; margin: 3rem 0; width: 100%; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
            `}</style>
        </>
    )
}
