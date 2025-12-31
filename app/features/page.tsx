import { loadContent } from '../lib/content';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/modern/ui/Button';
import { ZapIcon, ShieldIcon, CpuIcon, ArrowLeftIcon } from 'lucide-react';

// Icon mapper
const iconMap: Record<string, React.ReactNode> = {
  zap: <ZapIcon className="w-8 h-8" />,
  shield: <ShieldIcon className="w-8 h-8" />,
  cpu: <CpuIcon className="w-8 h-8" />,
};

export default async function FeaturesPage() {
  const content = await loadContent();
  const featuresData = content.pages.features;

  const texts = content.texts;

  if (!featuresData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-white">
        {texts.messages.notFound.features}
      </div>
    );
  }

  return (
    <main className="bg-dark-950 min-h-screen">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <Link href="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {texts.nav.backLinks.home}
        </Link>
      </div>

      {/* Cinematic Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={featuresData.hero.image}
            alt="Features Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark-950" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <p className="text-primary-400 font-mono mb-6 tracking-widest uppercase animate-fade-in-up">
            {featuresData.hero.subtitle}
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter animate-fade-in-up delay-100"
            dangerouslySetInnerHTML={{ __html: featuresData.hero.title }} // Allow HTML for gradient span
          />
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
            {featuresData.hero.description}
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-32 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {featuresData.items.map((feature, i) => (
            <div key={i} className="card-glass rounded-2xl p-8 backdrop-blur-xl bg-dark-900/80">
              <div className="w-16 h-16 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-6 border border-primary-500/20">
                {iconMap[feature.icon] || <ZapIcon className="w-8 h-8" />}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                {feature.description}
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Section Placeholder */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            {texts.ui.labels.readyToDeploy.replace('Deploy', '').trim()} <span className="text-gradient-cyan">Deploy</span>?
          </h2>

          <div className="relative mx-auto max-w-4xl aspect-video rounded-xl border border-white/10 bg-dark-900/50 overflow-hidden flex items-center justify-center group">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-50 group-hover:scale-110 transition-transform duration-300">🚀</div>
              <p className="text-gray-400">{texts.ui.labels.interactiveDemoLoading}</p>
            </div>

            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent h-[20%] animate-scan" />
          </div>
        </div>
      </section>
    </main>
  );
}
