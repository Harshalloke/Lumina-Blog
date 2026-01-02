"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Upload, User, Check, Camera, Loader2, Sparkles, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface ProfileFormProps {
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
        bio: string | null;
        plan?: string | null;
        isVerified?: boolean | null;
    }
}

const PREMADE_AVATARS = [
    "https://api.dicebear.com/9.x/notionists/svg?seed=Felix",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Aneka",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Milo",
    "https://api.dicebear.com/9.x/notionists/svg?seed=Lola",
    "https://api.dicebear.com/9.x/micah/svg?seed=Felix",
    "https://api.dicebear.com/9.x/micah/svg?seed=Aneka",
    "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/9.x/bottts/svg?seed=Felix",
]

export function ProfileForm({ user }: ProfileFormProps) {
    const { update } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [bio, setBio] = useState(user.bio || "");
    const [image, setImage] = useState(user.image || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, bio, image })
            });

            if (!res.ok) throw new Error("Failed to update profile");

            // Force session update to reflect changes in Navbar immediately
            // We call update() with no arguments to trigger a re-fetch of the session
            // The session callback will then pull the new image from the DB
            await update();

            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (limit to 1MB for base64 safety)
            if (file.size > 1024 * 1024) {
                alert("File size must be less than 1MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                    <img
                        src={image || user.image || `https://avatar.vercel.sh/${user.email}`}
                        alt={user.name || "User"}
                        className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-xl"
                    />
                </div>

                {!isEditing && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex items-center gap-3 px-4 py-2 bg-secondary/30 rounded-full border border-border/50 shadow-sm">
                            <div className={cn(
                                "p-1 rounded-full",
                                user.plan === 'PRO' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                                {user.plan === 'PRO' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground leading-none mb-0.5">Plan</p>
                                <h3 className="font-bold text-[11px] tracking-tight whitespace-nowrap">
                                    {user.plan === 'PRO' ? "Lumina PRO" : "Free Account"}
                                </h3>
                            </div>
                            {user.plan !== 'PRO' && (
                                <Link href="/membership">
                                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                                </Link>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-xl font-bold">{user.name}</h3>
                                    {user.isVerified && <BadgeCheck className="w-5 h-5 text-primary fill-primary/10" />}
                                </div>
                                <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>
                            {user.bio && (
                                <p className="text-sm text-foreground/80 max-w-sm mx-auto">{user.bio}</p>
                            )}
                        </div>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-4">
                            <Label>Profile Picture</Label>

                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {PREMADE_AVATARS.map((avatar, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setImage(avatar)}
                                        className={cn(
                                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                            image === avatar ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"
                                        )}
                                    >
                                        <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                                        {image === avatar && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <Check className="w-6 h-6 text-primary drop-shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-muted-foreground uppercase">Or upload</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload from Device
                                </Button>
                                {/* Optional: Add URL input toggle if they really want it back hidden somewhere, but simplified for now */}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                        Edit Profile
                    </Button>
                )}
            </div>
        </div>
    )
}
