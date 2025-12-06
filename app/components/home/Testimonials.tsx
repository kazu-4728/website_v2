import Image from 'next/image';
import { TestimonialsSection } from '../../lib/content';

interface Props {
  data: TestimonialsSection;
}

export function Testimonials({ data }: Props) {
  // グリッドカラム数を口コミ数に基づいて決定
  const itemCount = data.items.length;
  const gridCols = itemCount <= 2 
    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' 
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-6xl';

  return (
    <section className="py-24 sm:py-32 bg-dark-950 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* ヘッダー */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {data.subtitle && (
            <p className="text-primary-400 font-semibold tracking-wider uppercase mb-3 text-sm">
              {data.subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            {data.title}
          </h2>
        </div>
        
        {/* 口コミグリッド */}
        <div className={`grid ${gridCols} gap-6 sm:gap-8 mx-auto`}>
          {data.items.map((item, index) => (
            <div 
              key={index}
              className="bg-dark-900/50 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-dark-800/60 relative hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-900/10 group"
            >
              {/* 引用符アイコン */}
              <div className="absolute top-6 right-6 text-primary-500/10 text-7xl font-serif leading-none group-hover:text-primary-500/20 transition-colors duration-300">
                &ldquo;
              </div>
              
              {/* 口コミ内容 */}
              <p className="text-base sm:text-lg text-gray-300 mb-8 relative z-10 leading-relaxed">
                {item.content}
              </p>
              
              {/* 投稿者情報 */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-500/20 group-hover:border-primary-500/40 transition-colors duration-300 flex-shrink-0">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">{item.author}</div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
