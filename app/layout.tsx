export const metadata = { 
  title: 'GitHub Docs 完全マニュアル',
  description: '初心者でも分かるGitHubの使い方を、ECサイト形式で学ぶマニュアルサイト' 
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
