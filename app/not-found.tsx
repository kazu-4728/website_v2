import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="space-y-6">
          {/* 404 大きく表示 */}
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              404
            </h1>
            <p className="text-2xl font-semibold text-white">
              ページが見つかりません
            </p>
          </div>

          {/* 説明 */}
          <p className="text-lg text-gray-400">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>

          {/* アクション */}
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              トップページへ
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-lg font-medium transition-colors border border-dark-700"
            >
              温泉ガイドを見る
            </Link>
          </div>

          {/* おすすめリンク */}
          <div className="pt-8 border-t border-dark-800">
            <p className="text-sm text-gray-500 mb-4">よく見られているページ</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/hakone"
                className="px-4 py-2 bg-dark-800/50 hover:bg-dark-800 text-gray-300 rounded-lg text-sm transition-colors"
              >
                箱根温泉
              </Link>
              <Link
                href="/kusatsu"
                className="px-4 py-2 bg-dark-800/50 hover:bg-dark-800 text-gray-300 rounded-lg text-sm transition-colors"
              >
                草津温泉
              </Link>
              <Link
                href="/kinugawa"
                className="px-4 py-2 bg-dark-800/50 hover:bg-dark-800 text-gray-300 rounded-lg text-sm transition-colors"
              >
                鬼怒川温泉
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
