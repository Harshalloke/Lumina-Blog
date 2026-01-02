"use client"
import Link from "next/link"
import { useScroll, useMotionValueEvent, motion } from "framer-motion"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Search, Menu, PlusCircle, Sparkles, BadgeCheck, BarChart3, Bookmark, User, LogOut } from "lucide-react"

import { SearchCommand } from "@/components/search-command"

import { useSession } from "next-auth/react"

export function Navbar() {
    const { data: session } = useSession()
    const { scrollY } = useScroll()
    const [hidden, setHidden] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0
        if (latest > previous && latest > 150) {
            setHidden(true)
        } else {
            setHidden(false)
        }
    })

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                            Lumina
                        </Link>
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <Link href="/stories" className="transition-colors hover:text-foreground">
                                Stories
                            </Link>
                            <Link href="/culture" className="transition-colors hover:text-foreground">
                                Culture
                            </Link>
                            <Link href="/tech" className="transition-colors hover:text-foreground">
                                Tech
                            </Link>
                            <Link href="/about" className="transition-colors hover:text-foreground">
                                About
                            </Link>
                            <Link href="/new-story" className="transition-colors hover:text-primary font-semibold">
                                Write
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden sm:flex text-muted-foreground hover:text-foreground rounded-full"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <ThemeToggle />

                        {session ? (
                            <div className="hidden sm:flex items-center gap-4">
                                {(session.user as any).plan !== 'PRO' && (
                                    <Link href="/membership" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors">
                                        <Sparkles className="h-3 w-3" /> Upgrade
                                    </Link>
                                )}
                                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
                                    <Link href="/new-story" title="Write a story">
                                        <PlusCircle className="h-6 w-6" />
                                    </Link>
                                </Button>
                                <Link
                                    href="/profile"
                                    className="relative h-9 w-9 overflow-hidden rounded-full border border-border shadow-sm transition-opacity hover:opacity-80"
                                >
                                    <img
                                        src={session.user?.image || `https://avatar.vercel.sh/${session.user?.email || 'user'}`}
                                        alt={session.user?.name || "User"}
                                        className="h-full w-full object-cover"
                                    />
                                    {(session.user as any).isVerified && (
                                        <div className="absolute bottom-0 right-0 bg-background rounded-full p-0.5">
                                            <BadgeCheck className="h-3 w-3 text-primary fill-primary/10" />
                                        </div>
                                    )}
                                </Link>
                            </div>
                        ) : (
                            <Button variant="default" className="hidden sm:flex rounded-full px-5 font-medium shadow-none" asChild>
                                <Link href="/signin">Sign In</Link>
                            </Button>
                        )}

                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </motion.header>

            <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}
