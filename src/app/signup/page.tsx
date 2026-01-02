"use client"

import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { InteractiveMascot } from "@/components/auth/interactive-mascot"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Track mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            // Normalize coordinates to -1 to 1
            const x = (e.clientX - centerX) / (width / 2); // Divide by half width for sensitivity
            const y = (e.clientY - centerY) / (height / 2);

            // Clamp values to -1 to 1 range (eyes shouldn't roll out of head)
            const clampedX = Math.max(-1, Math.min(1, x));
            const clampedY = Math.max(-1, Math.min(1, y));

            setEyePosition({ x: clampedX, y: clampedY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const form = e.target as HTMLFormElement
        const name = (form.elements.namedItem('name') as HTMLInputElement).value
        const email = (form.elements.namedItem('email') as HTMLInputElement).value
        const password = (form.elements.namedItem('password') as HTMLInputElement).value

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Something went wrong");
            }

            // Auto sign in
            await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center py-12 px-4 sm:px-8 bg-secondary/20">
            <div
                ref={containerRef}
                className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border space-y-8"
            >
                <InteractiveMascot isPasswordFocused={isPasswordFocused} eyePosition={eyePosition} />

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Join Lumina</h1>
                    <p className="text-muted-foreground">Create your personal reading space.</p>
                </div>

                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Jane Doe"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium leading-none">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/signin" className="underline underline-offset-4 hover:text-foreground">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
