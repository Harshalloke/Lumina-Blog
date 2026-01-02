"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { BadgeCheck, Send, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Comment } from "@/lib/types"

interface CommentSectionProps {
    postId: string;
    initialComments?: Comment[];
}

export function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
    const { data: session } = useSession()
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session || !newComment.trim()) return

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/comments/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, content: newComment })
            })

            if (!res.ok) throw new Error("Failed to post comment")

            const comment = await res.json()
            setComments(prev => [comment, ...prev])
            setNewComment("")
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-serif text-2xl font-bold">Responses ({comments.length})</h3>
            </div>

            {session ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <Avatar className="w-10 h-10 border border-border">
                            <AvatarImage src={session.user?.image || ""} />
                            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <Textarea
                                placeholder="What are your thoughts?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px] bg-secondary/20 border-none focus-visible:ring-1 focus-visible:ring-primary/20 resize-none font-sans"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="rounded-full px-6 bg-primary hover:bg-primary/90 text-black font-bold h-10 shadow-lg shadow-primary/10"
                                >
                                    {isSubmitting ? "Posting..." : "Respond"}
                                    <Send className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="p-8 bg-secondary/20 rounded-2xl text-center border border-dashed border-border">
                    <p className="text-muted-foreground mb-4">Sign in to join the conversation.</p>
                    <Button variant="outline" className="rounded-full" asChild>
                        <a href="/api/auth/signin">Sign In</a>
                    </Button>
                </div>
            )}

            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <Avatar className="w-10 h-10 border border-border">
                            <AvatarImage src={comment.author.avatar || ""} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-sm">{comment.author.name}</span>
                                    {comment.author.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary fill-primary/10" />}
                                    <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight ml-2">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90 font-sans">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
