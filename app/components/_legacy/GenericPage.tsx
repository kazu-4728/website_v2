import Link from 'next/link';
import { Button } from './ui/Button';
import { ArrowLeftIcon } from 'lucide-react';

interface GenericPageProps {
  title: string;
  description: string;
}

export default function GenericPage({ title, description }: GenericPageProps) {
  return (
    <main className="bg-dark-950 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
          {title}
        </h1>
        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          {description}
        </p>
        <div className="p-6 border border-dashed border-dark-700 rounded-xl bg-dark-900/50 mb-10">
          <p className="text-sm text-gray-500">
            This page is currently under construction as part of the Code Voyage narrative.
            <br />
            Check back soon for updates.
          </p>
        </div>
        <Link href="/">
          <Button variant="primary" size="lg">
            <ArrowLeftIcon className="mr-2 w-5 h-5" />
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
