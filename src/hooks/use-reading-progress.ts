"use client"

import { useState, useEffect } from "react"

export function useReadingProgress(slug: string) {
    const [readingProgress, setReadingProgress] = useState(0)

    // Load progress from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(`reading-progress-${slug}`)
        if (saved) {
            const progress = parseFloat(saved)
            setReadingProgress(progress)

            // Optional: Restore scroll position smoothly
            // This is a bit aggressive for auto-scroll, so we might just return the value 
            // and let the component decide, or show a "Resume" button.
            // For this MVP "Memory UI", we'll just log it or provide the value.
        }
    }, [slug])

    // Save progress
    const saveProgress = (progress: number) => {
        localStorage.setItem(`reading-progress-${slug}`, progress.toString())
        setReadingProgress(progress)
    }

    return { readingProgress, saveProgress }
}
