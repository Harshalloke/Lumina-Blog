"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
    BarChart3,
    FileText,
    Eye,
    Heart,
    MessageSquare,
    Bookmark,
    ChevronRight,
    TrendingUp,
    PlusCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function WriterStudio() {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/author/stats")
                const data = await res.json()
                setPosts(data)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0)
    const totalClaps = posts.reduce((acc, p) => acc + (p.claps || 0), 0)
    const totalResponses = posts.reduce((acc, p) => acc + (p._count?.comments || 0), 0)

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse text-muted-foreground font-serif text-xl">Entering the studio...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em]">
                            <BarChart3 className="w-4 h-4" />
                            Author Dashboard
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Writer's Studio</h1>
                        <p className="text-muted-foreground">Monitor your performance and grow your audience.</p>
                    </div>
                    <Link href="/new-story">
                        <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 shadow-lg shadow-primary/20 gap-2">
                            <PlusCircle className="w-5 h-5" />
                            Compose Story
                        </Button>
                    </Link>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard label="Total Views" value={totalViews} icon={Eye} color="text-blue-500" />
                    <StatCard label="Claps Received" value={totalClaps} icon={Heart} color="text-red-500" />
                    <StatCard label="Responses" value={totalResponses} icon={MessageSquare} color="text-primary" />
                    <StatCard label="Followers" value={"--"} icon={TrendingUp} color="text-green-500" />
                </div>

                {/* Stories Table */}
                <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border/50 flex items-center justify-between">
                        <h2 className="font-serif text-2xl font-bold">Your Stories</h2>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{posts.length} Total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/20 text-[10px] uppercase tracking-widest font-black text-muted-foreground border-b border-border/40">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Views</th>
                                    <th className="px-6 py-4 text-center">Claps</th>
                                    <th className="px-6 py-4 text-center">Responses</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-secondary/10 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{post.title}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase mt-1">
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {post.published ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-100 text-green-700">Published</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-amber-100 text-amber-700">Draft</span>
                                            )}
                                            {post.isPremium && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-primary text-white">Pro</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-center font-mono text-sm">{post.views || 0}</td>
                                        <td className="px-6 py-5 text-center font-mono text-sm">{post.claps || 0}</td>
                                        <td className="px-6 py-5 text-center font-mono text-sm">{post._count?.comments || 0}</td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href={`/posts/${post.slug}`}>
                                                <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {posts.length === 0 && (
                            <div className="p-20 text-center space-y-4">
                                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                                <div className="space-y-1">
                                    <p className="text-xl font-serif font-bold italic text-muted-foreground">Your canvas is empty.</p>
                                    <p className="text-sm text-muted-foreground/60">Share your thoughts with the world today.</p>
                                </div>
                                <Link href="/new-story">
                                    <Button variant="outline" className="rounded-full">Start Writing</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-card border border-border/60 p-6 rounded-3xl shadow-sm space-y-4">
            <div className={cn("p-2 rounded-xl bg-secondary/30 w-fit", color)}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-2xl font-mono font-bold tracking-tight">{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
            </div>
        </div>
    )
}
