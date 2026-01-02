import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="border-t border-border bg-secondary/30 mt-auto">
            <div className="container mx-auto px-4 sm:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2 space-y-6">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
                            Lumina
                        </Link>
                        <p className="text-muted-foreground max-w-sm leading-relaxed">
                            A digital sanctuary for thought-provoking stories, deep dives, and quiet reading in a noisy world.
                        </p>
                        <div className="flex gap-4">
                            {/* Social icons could go here */}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm tracking-widest uppercase">Explore</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/stories" className="hover:text-foreground transition-colors">Stories</Link></li>
                            <li><Link href="/culture" className="hover:text-foreground transition-colors">Culture</Link></li>
                            <li><Link href="/tech" className="hover:text-foreground transition-colors">Technology</Link></li>
                            <li><Link href="/design" className="hover:text-foreground transition-colors">Design</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-sm tracking-widest uppercase">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/authors" className="hover:text-foreground transition-colors">Authors</Link></li>
                            <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Lumina. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span>Designed for Reading</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
