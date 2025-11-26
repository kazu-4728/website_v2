import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { CtaSection } from '../../lib/content';

interface Props {
  data: CtaSection;
}

export function CtaFullscreen({ data }: Props) {
  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden z-0">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Image
          src={data.bgImage}
          alt="CTA Background"
          fill
          className="object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-primary-900/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          {data.title}
        </h2>
        <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
          {data.description}
        </p>
        <Link href={data.action.href}>
          <Button 
            size="xl" 
            className="bg-white text-primary-900 hover:bg-gray-100 min-w-[200px]"
          >
            {data.action.label}
          </Button>
        </Link>
      </div>
    </section>
  );
}
