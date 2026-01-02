"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Post {
    id: string
    title: string
    slug: string
    published?: boolean
    createdAt: Date | string
    excerpt?: string | null
}

interface PostListProps {
    posts: Post[]
    editable?: boolean
}

export function PostList({ posts, editable = false }: PostListProps) {
    const router = useRouter()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this story?")) return

        setDeletingId(id)
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete post")

            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to delete post")
        } finally {
            setDeletingId(null)
        }
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed rounded-xl border-border/60">
                <p className="text-muted-foreground mb-4">You haven't published any stories yet.</p>
                {editable && (
                    <Link
                        href="/new-story"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Write your first story
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="group p-5 bg-card border border-border/40 rounded-lg hover:border-primary/50 transition-colors relative">
                    <div className="flex justify-between items-start mb-2 pr-10">
                        <Link href={`/posts/${post.slug}`} className="hover:underline">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>
                        </Link>
                        <span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {post.published ? 'Published' : 'Draft'}
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3 pr-10">
                        {post.excerpt || "No description"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <time>{format(new Date(post.createdAt), "MMM d, yyyy")}</time>
                    </div>

                    {editable && (
                        <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                            title="Delete story"
                        >
                            {deletingId === post.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Trash2 className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
