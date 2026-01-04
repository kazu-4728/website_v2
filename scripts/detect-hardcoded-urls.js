const fs = require('fs');
const path = require('path');

// 検索対象のディレクトリ
const TARGET_DIRS = ['app', 'components', 'themes'];
// 除外するディレクトリ・ファイル
const EXCLUDE_PATHS = [
    'node_modules',
    '.next',
    '.git',
    'scripts', // 自分自身は除外
    'detect-hardcoded-urls.js',
    'package-lock.json',
    'tsconfig.json',
    'next-env.d.ts',
    '.DS_Store',
    'onsen-image-stock.json', // 正規の画像データなので除外
    'onsen-image-candidates.json', // 収集結果なので除外
    'wikimedia-images.json', // 収集結果なので除外
    'onsen-catalog.json', // カタログデータなので除外
    'debug_unsplash_response.json', // デバッグデータなので除外
    'candidates_raw', // 生データ保存ディレクトリなので除外
    'themes/github-docs' // テンプレートテーマなので除外
];
// 画像URLとみなすパターン (http/https で始まり、画像拡張子で終わる、または /images/ 等が含まれる)
const URL_PATTERN = /["'](https?:\/\/[^"']+\.(jpg|jpeg|png|gif|webp|svg)|https?:\/\/images\.unsplash\.com[^"']*|https?:\/\/upload\.wikimedia\.org[^"']*)["']/gi;
// 特定のキーワードを含む行は許可（例: コメント、特定のインポートなど）
const ALLOW_PATTERNS = [
    '// eslint-disable-line',
    'ignore-hardcode',
    'import ', // import文は許可（画像ファイルのimport）
    'next.config', // 設定ファイルは許可
];

function scanDirectory(dir, errors = []) {
    if (!fs.existsSync(dir)) return errors;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(process.cwd(), fullPath);

        const normalizedFullPath = fullPath.replace(/\\/g, '/');
        if (EXCLUDE_PATHS.some(exclude => normalizedFullPath.includes(exclude))) {
            continue;
        }

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath, errors);
        } else {
            if (!/\.(tsx?|jsx?|json)$/.test(file)) continue; // 対象拡張子のみ

            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, index) => {
                if (ALLOW_PATTERNS.some(p => line.includes(p))) return;

                let match;
                // Reset regex state
                URL_PATTERN.lastIndex = 0;

                while ((match = URL_PATTERN.exec(line)) !== null) {
                    // JSONファイルの場合、キーが "url" や "image" でない場合は許容するなど、緩和が必要ならここに追加
                    // 今回はStrictに検出する
                    errors.push({
                        file: relativePath,
                        line: index + 1,
                        match: match[0],
                        content: line.trim()
                    });
                }
            });
        }
    }
    return errors;
}

console.log('🔍 Scanning for hardcoded image URLs...');
const errors = [];
TARGET_DIRS.forEach(dir => {
    scanDirectory(path.join(process.cwd(), dir), errors);
});

if (errors.length > 0) {
    const reportContent = errors.map(e => `${e.file}:${e.line}\n  Code: ${e.content}\n  URL:  ${e.match}\n`).join('\n');
    fs.writeFileSync('hardcode-report.txt', reportContent);
    console.error(`\n❌ Found ${errors.length} hardcoded image URLs! See hardcode-report.txt for details.`);

    console.error('❌ Error: Hardcoded URLs detected. Build failed.');
    process.exit(1);
} else {
    if (fs.existsSync('hardcode-report.txt')) fs.unlinkSync('hardcode-report.txt');
    console.log('✅ No hardcoded image URLs found.');
    process.exit(0);
}
