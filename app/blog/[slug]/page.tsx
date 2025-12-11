import { getBlogPost, getAllBlogSlugs, loadContent } from '../../lib/content';
import { MarkdownRenderer } from '../../components/_legacy/ui/MarkdownRenderer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../components/_legacy/ui/Button';
import { ArrowLeftIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const content = await loadContent();
  const texts = content.texts;

  return (
    <main className="bg-dark-950 min-h-screen pb-24 pt-24">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link href="/blog" className="inline-flex items-center text-primary-400 mb-8 hover:text-primary-300 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {texts.nav.backLinks.blog}
        </Link>
        
        <div className="flex items-center gap-4 text-sm font-mono text-gray-500 mb-6">
          <span className="text-primary-400">{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-invert prose-lg max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </div>
    </main>
  );
}
