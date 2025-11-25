import './globals.css';
import { Header } from './components/navigation/Header';

export const metadata = { 
  title: 'Café Culture - コーヒーが紡ぐ、心温まる物語',
  description: '一杯のコーヒーから始まる素敵な時間。全国のカフェ文化を探求し、あなただけの居場所を見つける旅へ。' 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
