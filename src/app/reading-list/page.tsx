"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Bookmark, Eye, Heart, MessageSquare, ChevronRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ReadingList() {
    const { data: session } = useSession()
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await fetch("/api/bookmarks")
                const data = await res.json()
                setBookmarks(data)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        if (session) fetchBookmarks()
    }, [session])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-muted-foreground font-serif text-xl">Opening your list...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 sm:px-8 max-w-4xl text-center">
                <header className="mb-16 space-y-4">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-4">
                        <Bookmark className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Your Reading List</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">Stories you've saved to read and reflect upon later.</p>
                </header>

                <div className="space-y-6 text-left">
                    {bookmarks.map((bookmark) => (
                        <motion.div
                            key={bookmark.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group p-6 bg-card border border-border/60 rounded-3xl hover:border-primary/30 transition-all hover:bg-secondary/10"
                        >
                            <Link href={`/posts/${bookmark.post.slug}`} className="flex flex-col md:flex-row gap-6">
                                {bookmark.post.coverImage && (
                                    <div className="relative w-full md:w-48 aspect-[3/2] rounded-2xl overflow-hidden border border-border/50">
                                        <img src={bookmark.post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                                        {bookmark.post.category}
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">{bookmark.post.title}</h2>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {bookmark.post.views}</div>
                                        <div className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {bookmark.post.claps}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    {bookmarks.length === 0 && (
                        <div className="py-20 text-center space-y-6">
                            <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                            <div className="space-y-1">
                                <h3 className="text-2xl font-serif font-bold italic text-muted-foreground">The best is yet to be read.</h3>
                                <p className="text-muted-foreground/60 max-w-sm mx-auto">Start exploring Lumina's curated collection and save stories for later.</p>
                            </div>
                            <Link href="/">
                                <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg shadow-primary/20">
                                    Explore Stories
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
