import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from "@/lib/types";
import { db } from "@/lib/db";

// Because we are using the App Router and Server Components, 
// using 'process.cwd()' correctly points to the root in Node environments.
const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function getFeaturedPost(): Promise<Post | undefined> {
    const posts = await getAllPosts();
    return posts.find((post) => post.featured);
}

export async function getAllPosts(): Promise<Post[]> {
    const posts: Post[] = [];

    // 1. Fetch File System Posts (Editorial Content)
    if (fs.existsSync(postsDirectory)) {
        const fileNames = fs.readdirSync(postsDirectory);
        const filePosts = fileNames.filter(fileName => fileName.endsWith('.mdx')).map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                id: slug,
                slug: slug,
                title: data.title,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                author: data.author,
                publishedAt: data.date,
                readTime: data.readTime,
                category: data.category,
                featured: data.featured || false,
                content: content,
            } as Post;
        });
        posts.push(...filePosts);
    }

    // 2. Fetch Database Posts (User Content)
    try {
        const dbPosts = await db.post.findMany({
            where: { published: true },
            include: { author: true },
            orderBy: { createdAt: 'desc' }
        });

        const formattedDbPosts: Post[] = (dbPosts as any[]).map((p: any) => {
            const wordsPerMinute = 200;
            const noOfWords = (p.content || "").split(/\s/g).length;
            const minutes = Math.ceil(noOfWords / wordsPerMinute);
            const readTime = `${minutes} min read`;

            return {
                id: p.id,
                slug: p.slug,
                title: p.title,
                excerpt: p.content.slice(0, 150) + "...",
                coverImage: p.coverImage || "/images/hero-abstract.png",
                author: {
                    id: p.author.id,
                    name: p.author.name,
                    avatar: p.author.image || `https://avatar.vercel.sh/${p.author.email}`,
                    image: p.author.image,
                    bio: p.author.bio,
                    isVerified: p.author.isVerified || false,
                },
                publishedAt: p.createdAt.toISOString(),
                readTime: readTime,
                category: p.category,
                featured: p.featured,
                isPremium: p.isPremium,
                isVerified: p.author.isVerified || false,
                content: p.content,
                claps: p.claps
            };
        });

        posts.push(...formattedDbPosts);

    } catch (e) {
        console.warn("Failed to fetch DB posts or DB not initialized yet.", e);
    }

    // Sort all merged posts by date (String comparison is okay for ISO/Formatted dates roughly, but could be improved)
    // For now, simple sort.
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string, currentUserId?: string): Promise<Post | undefined> {
    // 1. Try File System First
    if (fs.existsSync(postsDirectory)) {
        const filePath = path.join(postsDirectory, `${slug}.mdx`);
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);
            return {
                id: slug,
                slug: slug,
                title: data.title,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                author: data.author,
                publishedAt: data.date,
                readTime: data.readTime,
                category: data.category,
                featured: data.featured || false,
                content: content,
                views: 0,
                claps: 0,
                comments: [],
            } as Post;
        }
    }

    // 2. Try Database
    try {
        const p = await db.post.findUnique({
            where: { slug },
            include: {
                author: {
                    include: {
                        followers: currentUserId ? {
                            where: { followerId: currentUserId }
                        } : false
                    }
                },
                comments: {
                    include: {
                        author: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                bookmarks: currentUserId ? {
                    where: { userId: currentUserId }
                } : false
            } as any
        });

        const pData = p as any;
        if (!pData) return undefined;
        const wordsPerMinute = 200;
        const noOfWords = (pData.content || "").split(/\s/g).length;
        const minutes = Math.ceil(noOfWords / wordsPerMinute);
        const readTime = `${minutes} min read`;

        return {
            id: pData.id,
            slug: pData.slug,
            title: pData.title,
            excerpt: pData.content.slice(0, 150) + "...",
            coverImage: pData.coverImage || "/images/hero-abstract.png",
            author: {
                id: pData.author.id,
                name: pData.author.name,
                avatar: pData.author.image || `https://avatar.vercel.sh/${pData.author.email}`,
                image: pData.author.image,
                bio: pData.author.bio,
                isVerified: pData.author.isVerified || false,
            },
            publishedAt: pData.createdAt.toISOString(),
            readTime: readTime,
            category: pData.category,
            featured: pData.featured,
            isPremium: pData.isPremium,
            isVerified: pData.author.isVerified || false,
            content: pData.content,
            claps: pData.claps,
            views: pData.views,
            comments: (pData.comments || []).map((c: any) => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt.toISOString(),
                author: {
                    id: c.author.id,
                    name: c.author.name,
                    avatar: c.author.image || `https://avatar.vercel.sh/${c.author.email}`,
                    isVerified: c.author.isVerified || false,
                }
            })),
            isBookmarked: (pData.bookmarks || []).length > 0,
            isFollowingAuthor: (pData.author?.followers || []).length > 0,
        } as Post;

    } catch (e) {
        console.error("Failed to fetch detailed post", e);
        return undefined;
    }
}

