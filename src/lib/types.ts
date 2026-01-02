export interface Author {
    id?: string;
    name: string;
    avatar: string;
    image: string | null;
    bio?: string | null;
    isVerified?: boolean;
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: Author;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    readTime: string;
    publishedAt: string;
    author: Author;
    coverImage: string;
    tags?: string[];
    featured?: boolean;
    claps?: number;
    views?: number;
    comments?: Comment[];
    isPremium?: boolean;
    isVerified?: boolean;
    isBookmarked?: boolean;
    isFollowingAuthor?: boolean;
    content?: string;
}
