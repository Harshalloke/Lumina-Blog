"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Post } from "@/lib/types"

// We'll fetch a lightweight index of posts for CLIENT-SIDE searching
// In a larger app, this would call a search API endpoint.
// For now, we will pass the database of posts as a prop or fetch it.

interface SearchCommandProps {
    isOpen: boolean;
    onClose: () => void;
    posts?: Post[]; // Optional: if we want to pass pre-fetched posts
}

export function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<Post[]>([])
    const [allPosts, setAllPosts] = React.useState<Post[]>([])
    const router = useRouter()

    // Fetch all posts once on mount (mocking an index fetch)
    // In production, create an API route: /api/search-index
    React.useEffect(() => {
        if (isOpen && allPosts.length === 0) {
            // We can't use server actions directly in client effect easily without a wrapper
            // So for this demo, we will rely on a separate fetch or just assume data availability
            // Let's stub it with a fetch to our own API
            fetch('/api/posts').then(res => res.json()).then(data => setAllPosts(data)).catch(err => console.error("Failed to load search index", err));
        }
    }, [isOpen]);

    // Filter logic
    React.useEffect(() => {
        if (!query) {
            setResults([])
            return
        }

        const lowerQuery = query.toLowerCase()
        const filtered = allPosts.filter(post =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.category.toLowerCase().includes(lowerQuery) ||
            post.excerpt.toLowerCase().includes(lowerQuery)
        )
        setResults(filtered.slice(0, 5)) // Limit to 5 results
    }, [query, allPosts])

    const handleSelect = (slug: string) => {
        onClose()
        router.push(`/posts/${slug}`)
    }

    // Lock body scroll when open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-[50%] top-[20%] translate-x-[-50%] z-[101] w-full max-w-lg p-4"
                    >
                        <div className="bg-card border border-border/50 shadow-2xl rounded-xl overflow-hidden flex flex-col">

                            {/* Input Area */}
                            <div className="flex items-center px-4 py-4 border-b border-border/50">
                                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                                <input
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50 font-medium"
                                    placeholder="Search stories, authors, tags..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors">
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((post) => (
                                            <div
                                                key={post.slug}
                                                onClick={() => handleSelect(post.slug)}
                                                className="group flex flex-col p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                                            >
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{post.category}</span>
                                                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h4>
                                            </div>
                                        ))}
                                    </div>
                                ) : query ? (
                                    <div className="py-8 text-center text-muted-foreground text-sm">
                                        No results found for "{query}"
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Suggested</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {["Design", "Engineering", "Culture", "Minimalism"].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setQuery(tag)}
                                                    className="text-xs px-2 py-1 bg-secondary rounded-md text-foreground/80 hover:bg-secondary-foreground/10 transition-colors"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-secondary/30 px-4 py-2 border-t border-border/50 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Lumina Search</span>
                                <span>ESC to close</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
