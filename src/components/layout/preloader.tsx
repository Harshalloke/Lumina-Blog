"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds delay for a premium feel

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
                >
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl sm:text-6xl font-serif font-bold tracking-tighter mb-8"
                        >
                            Lumina
                        </motion.div>

                        <div className="h-0.5 w-32 bg-secondary overflow-hidden rounded-full">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.2,
                                    ease: "easeInOut"
                                }}
                                className="h-full w-full bg-primary"
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="mt-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium"
                        >
                            Loading Experience
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
