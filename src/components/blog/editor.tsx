"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Quote,
    List,
    ListOrdered,
    Image as ImageIcon,
    Link as LinkIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function Editor({ content, onChange, placeholder }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Start writing your story...',
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto my-8 shadow-lg ring-1 ring-border',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 font-medium',
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[400px] font-serif',
            },
        },
    });

    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('Enter image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const url = window.prompt('Enter URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="relative">
            {editor && (
                <BubbleMenu editor={editor} className="flex overflow-hidden rounded-lg bg-background border border-border shadow-xl divide-x divide-border">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn("p-2 hover:bg-secondary transition-colors", editor.isActive('bold') && "text-primary bg-secondary")}
                        type="button"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn("p-2 hover:bg-secondary transition-colors", editor.isActive('italic') && "text-primary bg-secondary")}
                        type="button"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={cn("p-2 hover:bg-secondary transition-colors", editor.isActive('heading', { level: 1 }) && "text-primary bg-secondary")}
                        type="button"
                    >
                        <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={cn("p-2 hover:bg-secondary transition-colors", editor.isActive('heading', { level: 2 }) && "text-primary bg-secondary")}
                        type="button"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={cn("p-2 hover:bg-secondary transition-colors", editor.isActive('blockquote') && "text-primary bg-secondary")}
                        type="button"
                    >
                        <Quote className="w-4 h-4" />
                    </button>
                    <button
                        onClick={setLink}
                        className={cn("p-2 hover:bg-secondary transition-colors", editor.isActive('link') && "text-primary bg-secondary")}
                        type="button"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                </BubbleMenu>
            )}

            <div className="sticky top-20 z-10 flex flex-wrap items-center gap-1 p-1 bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl mb-8 shadow-sm">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(editor.isActive('bold') && "bg-secondary text-primary")}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(editor.isActive('italic') && "bg-secondary text-primary")}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn(editor.isActive('heading', { level: 1 }) && "bg-secondary text-primary")}
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(editor.isActive('heading', { level: 2 }) && "bg-secondary text-primary")}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(editor.isActive('bulletList') && "bg-secondary text-primary")}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(editor.isActive('orderedList') && "bg-secondary text-primary")}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(editor.isActive('blockquote') && "bg-secondary text-primary")}
                >
                    <Quote className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={addImage}
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={setLink}
                    className={cn(editor.isActive('link') && "bg-secondary text-primary")}
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>
            </div>

            <EditorContent editor={editor} />

            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    color: var(--muted-foreground);
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .tiptap {
                    outline: none !important;
                }
                .tiptap p {
                    line-height: 1.8;
                }
            `}</style>
        </div>
    );
}
