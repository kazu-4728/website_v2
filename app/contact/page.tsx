import { loadContent } from '../lib/content';
import { Button } from '../components/ui/Button';
import { MailIcon, MapPinIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default async function ContactPage() {
  const content = await loadContent();
  const contactData = content.pages.contact;

  if (!contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-white">
        Contact content not found.
      </div>
    );
  }

  const texts = content.texts;

  return (
    <main className="bg-dark-950 min-h-screen flex flex-col">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 w-full">
        <Link href="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {texts.nav.backLinks.home}
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Info */}
        <div className="lg:w-1/2 bg-dark-900 p-12 lg:p-24 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-primary-500 font-mono mb-4 uppercase tracking-widest">{texts.pages.contact.title}</p>
            <h1 
              className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight"
              dangerouslySetInnerHTML={{ __html: contactData.title }}
            />
            
            <div className="space-y-8 mt-12">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-primary-400">
                  <MailIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email</h3>
                  <p className="text-gray-400">{contactData.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-primary-400">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Office</h3>
                  <p className="text-gray-400">{contactData.office}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:w-1/2 bg-black p-12 lg:p-24 flex flex-col justify-center">
          <form className="space-y-8 max-w-md w-full mx-auto">
            <div className="space-y-2">
              <label className="text-sm font-mono text-gray-500 uppercase">お名前</label>
              <input 
                type="text" 
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                placeholder="山田 太郎"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-mono text-gray-500 uppercase">メールアドレス</label>
              <input 
                type="email" 
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                placeholder="example@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-mono text-gray-500 uppercase">メッセージ</label>
              <textarea 
                rows={4}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                placeholder="お問い合わせ内容をご記入ください..."
              />
            </div>
            
            <Button variant="primary" size="lg" className="w-full justify-center btn-neon">
              送信する <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
