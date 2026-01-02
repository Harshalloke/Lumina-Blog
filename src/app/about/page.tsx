import Image from "next/image"

export const metadata = {
    title: "About | Lumina",
    description: "About Lumina - Our mission and values.",
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 sm:px-8 py-16 lg:py-24 max-w-3xl">
            <div className="space-y-6 mb-12">
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground">
                    About Lumina
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                    We believe the internet has become too loud. Lumina is our attempt to turn down the volume and bring focus back to the written word.
                </p>
            </div>

            <div className="prose prose-lg dark:prose-invert font-serif leading-loose">
                <p>
                    Founded in 2025, Lumina is a digital publication dedicated to <strong>slow content</strong>. In an age of algorithmic feeds and click-bait headlines, we are building a sanctuary for deep reading.
                </p>

                <div className="relative w-full h-64 md:h-80 my-10 rounded-sm overflow-hidden">
                    {/* Using a placeholder or reusing an abstract image */}
                    <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center text-muted-foreground">
                        <span className="italic">Editorial Office</span>
                    </div>
                </div>

                <h3>Our Philosophy</h3>
                <p>
                    Reading is an immersive act. It requires attention, silence, and space. Our design system is built around these core principles:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Typography First:</strong> Words are our primary interface.</li>
                    <li><strong>Respect for Attention:</strong> No pop-ups, no auto-play, no clutter.</li>
                    <li><strong>Sustainable Technology:</strong> Built on a lightweight, performant stack.</li>
                </ul>

                <h3>The Mechanics</h3>
                <p>
                    Lumina is built using the latest web technologies—Next.js, React Server Components, and Edge Caching—not to add complexity, but to ensure that content is delivered instantly, anywhere in the world.
                </p>

                <hr className="my-12 border-border" />

                <p className="text-sm text-muted-foreground">
                    Contact us at <a href="mailto:hello@lumina.dev" className="underline hover:text-foreground">hello@lumina.dev</a>
                </p>
            </div>
        </div>
    );
}
