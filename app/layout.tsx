export const metadata = { 
  title: 'Café Culture - コーヒーが紡ぐ、心温まる物語',
  description: '一杯のコーヒーから始まる素敵な時間。全国のカフェ文化を探求し、あなただけの居場所を見つける旅へ。' 
};
import './globals.css';
import { Header } from './components/navigation/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
