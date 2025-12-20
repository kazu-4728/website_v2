export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      <div className="text-center space-y-6">
        {/* スピナー */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            {/* 外側の円 */}
            <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
            {/* 回転する円 */}
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* ローディングテキスト */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-white">読み込み中...</p>
          <p className="text-sm text-gray-400">少々お待ちください</p>
        </div>

        {/* スケルトンプレースホルダー（オプション） */}
        <div className="max-w-4xl mx-auto px-4 pt-8 space-y-4">
          {/* ヘッダースケルトン */}
          <div className="h-12 bg-dark-800/50 rounded-lg animate-pulse"></div>
          
          {/* コンテンツスケルトン */}
          <div className="space-y-3">
            <div className="h-4 bg-dark-800/50 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-dark-800/50 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-dark-800/50 rounded animate-pulse w-2/3"></div>
          </div>

          {/* 画像スケルトン */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="h-48 bg-dark-800/50 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-dark-800/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
