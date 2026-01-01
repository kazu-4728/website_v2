import { loadContent } from '../lib/content';
import { Button } from '../components/modern/ui/Button';
import { ContactForm } from '../components/modern/forms/ContactForm';
import { MailIcon, MapPinIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default async function ContactPage() {
  const content = await loadContent();
  const contactData = content.pages.contact;

  const texts = content.texts;

  if (!contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-white">
        {texts.messages.notFound.contact}
      </div>
    );
  }

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
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" /> {/* ignore-hardcode */}

          <div className="relative z-10">
            <p className="text-primary-500 font-mono mb-4 uppercase tracking-widest">{texts.pages.contact?.title || 'Contact'}</p>
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
                  <h3 className="text-white font-bold mb-1">{texts.form.fields.email.label}</h3>
                  <p className="text-gray-400">{contactData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-primary-400">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{texts.form.fields.office.label}</h3>
                  <p className="text-gray-400">{contactData.office}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:w-1/2 bg-black p-12 lg:p-24 flex flex-col justify-center">
          <ContactForm
            texts={texts.form}
            submitLabel={texts.buttons.submit}
          />
        </div>
      </div>
    </main>
  );
}
