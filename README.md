# Lumina — A Premium Editorial Blog Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://lumina-blog-one.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

**Lumina** is a sophisticated, full-stack editorial platform designed for writers who demand excellence and readers who appreciate deep focus. It combines a distraction-free writing environment with a premium reading experience, featuring advanced social interactions and real-time analytics.

🔗 **Live Demo:** [lumina-blog-one.vercel.app](https://lumina-blog-one.vercel.app/)

---

## ✨ Key Features

### 🖋️ Professional Editorial Suite
- **Tiptap-Powered Editor**: A rich text experience with floating formatting menus, inline image support, and clean typography.
- **Intelligent Auto-save**: Background draft persistence to `localStorage` every 3 seconds—never lose a word.
- **Story Categorization**: Organize narratives by Technology, Culture, Design, and more.
- **Premium Toggling**: Gate exclusive content behind a "Pro" membership system.

### 📊 Real-Time Analytics & Growth
- **Writer's Studio**: A comprehensive author dashboard to monitor story performance (Views, Claps, Responses).
- **Engagement Tracking**: Real-time view counts and clap increments for every story.
- **Social Ecosystem**: Support for author following and personalized reading lists (Bookmarking).

### 📖 Immersive Reading Experience
- **Focus Mode**: Distraction-free reading with adjustable font sizes.
- **Editorial Typography**: Carefully selected serif paired with modern sans-serif for maximum legibility.
- **Trending Feed**: A sleek, numbered discovery bar highlighting the platform's top stories.
- **Responsive Design**: Flawlessly optimized for desktop, tablet, and mobile.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Modern CSS
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (JWT & Credentials)
- **Editor**: [Tiptap v3](https://tiptap.dev/) (with Floating UI)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Email**: [Resend](https://resend.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A PostgreSQL database (Neon, Supabase, or local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Harshalloke/Lumina-Blog.git
   cd Lumina-Blog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXTAUTH_SECRET="your-secret-string"
   NEXTAUTH_URL="http://localhost:3000"
   RESEND_API_KEY="your-resend-key"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Building for Production

To create an optimized production build:
```bash
npm run build
npm start
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contact
Harshalloke - [@your_twitter](https://twitter.com/your_twitter)

Project Link: [https://github.com/Harshalloke/Lumina-Blog](https://github.com/Harshalloke/Lumina-Blog)
