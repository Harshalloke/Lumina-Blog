"use client"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const PLANS = [
    {
        name: "Free Reader",
        price: "$0",
        description: "Explore the community and read public stories.",
        features: [
            "Unlimited public stories",
            "Newsletter subscription",
            "Basic claps and interactions",
            "Ad-supported experience"
        ],
        cta: "Stay Free",
        highlight: false
    },
    {
        name: "Lumina Pro",
        price: "$12",
        description: "Deep-dive into exclusive editorial content.",
        features: [
            "All Premium/Locked stories",
            "Ad-free reading experience",
            "Early access to new issues",
            "Exclusive bi-weekly newsletter",
            "Support independent writers"
        ],
        cta: "Upgrade to PRO",
        highlight: true
    }
]

export default function MembershipPage() {
    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-8 relative pt-24 pb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                        <Sparkles className="w-3 h-3" /> Membership Plans
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        Invest in your <span className="italic">curiosity.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Join 10,000+ readers who support high-quality journalism and independent thinking.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-20">
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-8 sm:p-12 rounded-3xl border transition-all text-left flex flex-col",
                                plan.highlight
                                    ? "bg-card border-primary/50 shadow-2xl scale-105 z-10"
                                    : "bg-background border-border shadow-sm hover:border-border-foreground/20"
                            )}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-12 -translate-y-1/2 px-4 py-1.5 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="space-y-2 mb-8">
                                <h3 className="text-2xl font-serif font-bold">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold font-serif">{plan.price}</span>
                                    <span className="text-muted-foreground font-medium">/month</span>
                                </div>
                                <p className="text-muted-foreground text-sm">{plan.description}</p>
                            </div>

                            <div className="space-y-4 flex-1 mb-10">
                                {plan.features.map(feature => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className="mt-1 p-0.5 rounded-full bg-primary/20 text-primary">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm font-medium leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.highlight ? "default" : "outline"}
                                className={cn(
                                    "w-full h-14 rounded-full text-lg font-bold transition-all",
                                    plan.highlight ? "shadow-lg shadow-primary/20 hover:scale-[1.02]" : "hover:bg-secondary"
                                )}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 flex flex-wrap justify-center gap-12"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Zap className="text-primary w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cancel Anytime</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="text-primary w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secure Payments</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

import { cn } from "@/lib/utils"
