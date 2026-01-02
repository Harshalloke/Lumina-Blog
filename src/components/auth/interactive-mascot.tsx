"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Types for tracking mouse relative to the mascot
type EyePosition = {
    x: number;
    y: number;
}

export function InteractiveMascot({
    isPasswordFocused,
    eyePosition
}: {
    isPasswordFocused: boolean;
    eyePosition: EyePosition; // -1 to 1 range for x and y
}) {

    // Calculate eye movement limited to a range
    // We multiply the normalized position (-1 to 1) by a max pixel offset (e.g., 6px)
    const pupilX = isPasswordFocused ? 0 : eyePosition.x * 10;
    const pupilY = isPasswordFocused ? 8 : eyePosition.y * 10;

    return (
        <div className="relative w-48 h-48 mx-auto mb-8">
            <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-2xl"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Body/Head Shape */}
                <path
                    d="M100 40C60 40 30 70 30 110V180H170V110C170 70 140 40 100 40Z"
                    className="fill-foreground transition-colors duration-500"
                />

                {/* Ears */}
                <path d="M30 110L20 60L50 80" className="fill-foreground transition-colors duration-500" />
                <path d="M170 110L180 60L150 80" className="fill-foreground transition-colors duration-500" />

                {/* Face Background (lighter area) */}
                <circle cx="100" cy="110" r="55" className="fill-background transition-colors duration-500" />

                {/* Eyes Container */}
                <g className="transition-transform duration-200">
                    {/* Left Eye */}
                    <circle cx="75" cy="100" r="15" className="fill-foreground/10" />
                    <motion.circle
                        cx="75"
                        cy="100"
                        r="6"
                        className="fill-foreground"
                        animate={{ x: pupilX, y: pupilY }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />

                    {/* Right Eye */}
                    <circle cx="125" cy="100" r="15" className="fill-foreground/10" />
                    <motion.circle
                        cx="125"
                        cy="100"
                        r="6"
                        className="fill-foreground"
                        animate={{ x: pupilX, y: pupilY }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                </g>

                {/* Hands (Arms) - Usually hidden, animate up to cover eyes */}
                <motion.g
                    initial={{ y: 200, opacity: 0 }}
                    animate={isPasswordFocused ? { y: 0, opacity: 1 } : { y: 200, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    {/* Left Arm covering left eye */}
                    <path
                        d="M30 180C30 180 40 90 75 90C90 90 90 110 90 120"
                        stroke="var(--foreground)"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />

                    {/* Right Arm covering right eye */}
                    <path
                        d="M170 180C170 180 160 90 125 90C110 90 110 110 110 120"
                        stroke="var(--foreground)"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />
                </motion.g>

                {/* Mouth (only visible when not hiding) */}
                <motion.path
                    d="M85 140Q100 150 115 140"
                    stroke="var(--foreground)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    animate={isPasswordFocused ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                />
            </svg>
        </div>
    )
}
