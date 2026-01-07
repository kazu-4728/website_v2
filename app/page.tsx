
import { withBasePath } from './lib/base-path';

export default function Page() {
  // MVP: 静的コンテンツ + 実画像
  // Ocean & Sky デザインシステムを直書きして軽量化

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={withBasePath('/images/mvp/hero.jpg')}
            alt="Ocean View Onsen"
            className="w-full h-full object-cover object-center animate-scale-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-xl md:text-2xl text-white/90 mb-4 tracking-[0.2em] uppercase font-light">
            Kanto Onsen Collection
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg font-heading">
            あえの風
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            海と空が溶け合う、至福の湯浴み。<br />
            関東近郊の厳選された絶景温泉宿をご紹介します。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#features" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300 font-medium">
              宿を探す
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/70">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 2. FEATURE SECTION (Cards) */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6 text-gray-900 font-heading">
            極上の滞在体験
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1: Rooms */}
          <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
            <div className="relative h-64 overflow-hidden">
              <img
                src={withBasePath('/images/mvp/rooms.jpg')}
                alt="Luxury Rooms"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 font-heading text-gray-900">客室</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                全室オーシャンビュー。水平線を望む開放的な空間で、心安らぐひとときをお過ごしください。
              </p>
            </div>
          </div>

          {/* Card 2: Onsen */}
          <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
            <div className="relative h-64 overflow-hidden">
              <img
                src={withBasePath('/images/mvp/onsen.jpg')}
                alt="Open-air bath"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 font-heading text-gray-900">温泉</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                源泉かけ流しの露天風呂。波の音と潮風を感じながら、極上の湯浴みをお愉しみいただけます。
              </p>
            </div>
          </div>

          {/* Card 3: Cuisine */}
          <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
            <div className="relative h-64 overflow-hidden">
              <img
                src={withBasePath('/images/mvp/cuisine.jpg')}
                alt="Kaiseki Cuisine"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3 font-heading text-gray-900">料理</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                地元の旬の食材をふんだんに使用した創作懐石。四季折々の味覚を五感でご堪能ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GALLERY SECTION */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Gallery</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 font-heading">
                館内のご案内
              </h2>
            </div>
            <a href="#" className="hidden md:inline-block px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-gray-900 transition-colors text-sm">
              View All Photos
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px] md:h-[400px]">
            {/* Main Large Image */}
            <div className="col-span-2 row-span-2 md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group">
              <img
                src={withBasePath('/images/mvp/gallery-01.jpg')}
                alt="Gallery Main"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                <span className="font-medium">癒しの空間</span>
              </div>
            </div>

            {/* Sub Images */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={withBasePath('/images/mvp/gallery-02.jpg')}
                alt="Gallery Sub 1"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={withBasePath('/images/mvp/gallery-03.jpg')}
                alt="Gallery Sub 2"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-2 md:col-span-2 relative rounded-2xl overflow-hidden group">
              <img
                src={withBasePath('/images/mvp/gallery-04.jpg')}
                alt="Gallery Wide"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACCESS (Text Only) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 font-heading">アクセス</h2>
          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-lg mb-6">
              〒123-4567<br />
              神奈川県足柄下郡箱根町湯本 1-2-3
            </p>
            <div className="space-y-4 text-gray-600">
              <p>
                <span className="font-bold text-gray-900 block mb-1">電車でお越しの場合</span>
                箱根登山鉄道「箱根湯本駅」より送迎バスで5分<br />
                小田急ロマンスカー「新宿駅」より約85分
              </p>
              <p>
                <span className="font-bold text-gray-900 block mb-1">お車でお越しの場合</span>
                小田原厚木道路「箱根口IC」より約10分
              </p>
            </div>
            <div className="mt-8">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Google Maps で見る
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area with Attribution Link */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2024 Aenokaze Ryokan. All rights reserved.</p>
        <p className="mt-2">
          <a href={withBasePath('/docs/IMAGE_ATTRIBUTION')} className="hover:underline">Image Attributions</a>
        </p>
      </footer>
    </div>
  );
}
