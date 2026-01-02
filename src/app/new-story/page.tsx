"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Camera, Upload, Check, X, Zap, Loader2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { Editor } from "@/components/blog/editor"
import { useEffect } from "react"

const PRESET_IMAGES = [
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070",
    "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?q=80&w=1973",
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2028",
]

export default function NewStoryPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")
    const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0])
    const [isPremium, setIsPremium] = useState(false)
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Auto-save logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title || content) {
                setSaveStatus("saving")
                localStorage.setItem("lumina-draft", JSON.stringify({ title, content, category, coverImage }));
                setTimeout(() => setSaveStatus("saved"), 500);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [title, content, category, coverImage]);

    // Load draft on mount
    useEffect(() => {
        const saved = localStorage.getItem("lumina-draft");
        if (saved) {
            const { title: t, content: c, category: cat, coverImage: img } = JSON.parse(saved);
            if (!title) setTitle(t);
            if (!content) setContent(c);
            if (!category) setCategory(cat);
            if (!coverImage) setCoverImage(img);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, category, content, coverImage, isPremium })
            });

            if (!res.ok) throw new Error("Failed to create post");

            localStorage.removeItem("lumina-draft");
            router.push("/");
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Could not publish story. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1.5 * 1024 * 1024) {
                alert("Please upload an image smaller than 1.5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 py-16 max-w-4xl">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-serif font-bold tracking-tight">Compose Story</h1>
                <div className="flex gap-4">
                    <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !title || !content}
                        className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        {isLoading ? "Publishing..." : "Publish Story"}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_350px] gap-12">
                {/* Main Content Area */}
                <div className="space-y-8">
                    {/* Cover Preview */}
                    <div className="relative aspect-[21/9] w-full bg-secondary/30 rounded-2xl overflow-hidden border border-border/50 group">
                        {coverImage ? (
                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <span className="font-medium">No cover image selected</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="bg-white/90 text-black text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                Preview Mode
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Draft Title</span>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                {saveStatus === 'saving' ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                                    </>
                                ) : saveStatus === 'saved' ? (
                                    <>
                                        <Check className="w-3 h-3 text-green-500" /> Draft Saved
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3 h-3" /> Auto-save enabled
                                    </>
                                )}
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Type your title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/20 leading-[1.1]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="CATEGORIZE (E.G. DESIGN, PHILOSOPHY)"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full text-xs font-bold uppercase tracking-[0.3em] text-primary bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
                        />
                    </div>

                    <div className="pt-8">
                        <Editor
                            content={content}
                            onChange={setContent}
                            placeholder="The story begins here..."
                        />
                    </div>
                </div>

                {/* Sidebar: Media Controls */}
                <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
                    <div className="p-6 bg-card border border-border/60 rounded-2xl space-y-6 shadow-sm">
                        {/* Premium Toggle */}
                        <div className="flex items-center justify-between pb-4 border-b border-border/50">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm tracking-tight text-foreground">Premium Story</h3>
                                    <span className="bg-primary text-[8px] text-white font-black px-1.5 py-0.5 rounded uppercase">Pro</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Only visible to paid subscribers.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPremium(!isPremium)}
                                className={cn(
                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                    isPremium ? "bg-primary" : "bg-secondary"
                                )}
                            >
                                <span
                                    className={cn(
                                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                        isPremium ? "translate-x-5" : "translate-x-0"
                                    )}
                                />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-bold text-sm tracking-tight">Cover Presentation</h3>
                            <p className="text-xs text-muted-foreground">Choose a visual that defines your narrative.</p>
                        </div>

                        {/* Presets Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            {PRESET_IMAGES.map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setCoverImage(img)}
                                    className={cn(
                                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all group",
                                        coverImage === img ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"
                                    )}
                                >
                                    <img src={img} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                                    {coverImage === img && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <Check className="w-6 h-6 text-primary drop-shadow-md" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Custom Media</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <div className="space-y-3">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full justify-start gap-2 h-11 rounded-xl text-xs font-semibold"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4 text-primary" />
                                Upload local image
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start gap-2 h-11 rounded-xl text-xs font-semibold"
                                onClick={() => {
                                    const url = prompt("Enter image URL:");
                                    if (url) setCoverImage(url);
                                }}
                            >
                                <Camera className="w-4 h-4 text-muted-foreground" />
                                Paste external URL
                            </Button>
                        </div>

                        {coverImage && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-destructive hover:text-destructive/80 text-[10px] uppercase font-bold tracking-widest h-auto p-2"
                                onClick={() => setCoverImage("")}
                            >
                                <X className="w-3 h-3 mr-1" /> Remove Image
                            </Button>
                        )}
                    </div>

                    <div className="p-6 bg-secondary/30 rounded-2xl border border-dashed border-border/60">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Publishing Tip</h4>
                        <p className="text-xs text-foreground/70 leading-relaxed italic">
                            High-quality horizontal images (16:9) perform best for featured stories.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
