"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterBox() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (!res.ok) throw new Error("Subscription failed");

            setStatus('success');
            setEmail("");
        } catch (error) {
            console.error(error);
            alert("Could not subscribe at this time. Please try again.");
            setStatus('idle');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full mt-20 p-8 sm:p-12 bg-primary rounded-3xl text-primary-foreground relative overflow-hidden"
        >
            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
                <div className="space-y-2">
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">Stay in the flow</h3>
                    <p className="text-primary-foreground/80 text-lg">
                        Get the best of Lumina delivered to your inbox every week. No spam, just pure inspiration.
                    </p>
                </div>

                {status === 'success' ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-3 py-4"
                    >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                        <p className="font-bold text-xl">You're on the list!</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white border-white/20 text-black placeholder:text-black/40 h-12 rounded-full px-6 focus:ring-white/30"
                        />
                        <Button
                            disabled={status === 'loading'}
                            className="bg-white text-black hover:bg-white/90 h-12 rounded-full px-8 font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                            {status === 'loading' ? (
                                "Joining..."
                            ) : (
                                <>
                                    Join Newsletter <Send className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                )}

                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/40 font-bold">
                    Join 2,400+ other readers — Cancel anytime
                </p>
            </div>
        </motion.div>
    )
}
