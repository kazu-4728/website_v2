import { loadContent } from '../lib/content';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, CalendarIcon, ClockIcon, ArrowLeftIcon } from 'lucide-react';

export default async function BlogPage() {
  const content = await loadContent();
  const blogData = content.pages.blog;

  if (!blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-white">
        Blog content not found.
      </div>
    );
  }

  const { posts } = blogData;
  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-white">
        No posts found.
      </div>
    );
  }

  return (
    <main className="bg-dark-950 min-h-screen pt-24 pb-20">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          ホームに戻る
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
          {blogData.title}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {blogData.description}
        </p>
      </div>

      {/* Featured Post (First item) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <Link href={`/blog/${posts[0].slug}`} className="group block relative h-[60vh] rounded-3xl overflow-hidden card-glass">
          <Image
            src={posts[0].image}
            alt={posts[0].title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-4 text-sm font-mono text-primary-500">
              <span className="px-3 py-1 border border-primary-500 rounded-full">{posts[0].category}</span>
              <span>{posts[0].date}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">
              {posts[0].title}
            </h2>
            <p className="text-xl text-gray-300 mb-8 line-clamp-2">
              {posts[0].excerpt}
            </p>
            <div className="flex items-center text-white font-bold group-hover:translate-x-2 transition-transform">
              Read Story <ArrowRightIcon className="ml-2 w-5 h-5" />
            </div>
          </div>
        </Link>
      </section>

      {/* Grid Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {posts.slice(1).map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="group card-glass rounded-2xl p-6 hover:bg-white/5 transition-colors">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-mono">
                <span className="text-primary-400">{post.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {post.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {post.readTime}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-400 line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
