/**
 * onsen-catalog.json の画像が欠落している温泉地に対し、
 * Wikimedia Commons から画像を自動検索して補完するスクリプト。
 * 
 * 使用方法: node scripts/fill-missing-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// プロジェクトルートからのパス
const CATALOG_PATH = path.join(__dirname, '../data/onsen-catalog.json');

// 除外キーワード（これらが含まれる画像はスキップ）
const EXCLUDE_KEYWORDS = [
    'map', '地図', 'diagram', '図', 'chart', 'グラフ',
    'sign', '看板', 'board', 'plate', '標識',
    'building', '建物', '(building)',
    'station', '駅', 'railway', 'railroad', 'train', '鉄道',
    'bus', 'バス',
    'restaurant', '食堂', 'cafe', 'カフェ',
    'hotel', 'ryokan', '旅館', // 建物外観だけの可能性が高いので注意
    'room', '部屋', // 客室画像よりは風呂画像を優先したい
    'food', 'cuisine', 'dish', 'meal', '料理', '食事',
    'souvenir', 'お土産',
    'people', 'person', 'portrait', // 人物がメインのものは避ける
    'statue', 'monument', '銅像',
    'street', 'road', '道路'
];

// 優先キーワード（これらが含まれる画像を優先）
const PRIORITY_KEYWORDS = [
    'rotenburo', 'open-air bath', 'outdoor bath', '露天風呂',
    'yubatake', '湯畑',
    'hot spring source', 'source of hot spring', '源泉',
    'bath', 'public bath', '浴場', '大浴場', '風呂'
];

/**
 * HTTP GET Request wrapper (since fetch might not be available in older node envs without configuration)
 */
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'OnsenCatalogFiller/1.0' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

/**
 * Wikimedia Commons から画像を検索
 */
async function searchWikimedia(searchTerm) {
    try {
        const encodedTerm = encodeURIComponent(searchTerm);
        // File:名前空間(6)で検索、検索結果20件取得
        const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedTerm}&srnamespace=6&srlimit=20&origin=*`;

        const data = await fetchJson(searchUrl);
        if (!data.query || !data.query.search || data.query.search.length === 0) {
            return [];
        }

        // 詳細情報を取得
        const titles = data.query.search.map(item => item.title).join('|');
        const detailsUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|extmetadata|size&origin=*`;

        const detailsData = await fetchJson(detailsUrl);
        const pages = detailsData.query.pages;

        const results = [];

        for (const pageId in pages) {
            const page = pages[pageId];
            if (!page.imageinfo || page.imageinfo.length === 0) continue;

            const info = page.imageinfo[0];
            const metadata = info.extmetadata || {};

            // 除外キーワードチェック
            const titleLower = page.title.toLowerCase();
            const descLower = (metadata.ImageDescription?.value || '').toLowerCase();

            if (EXCLUDE_KEYWORDS.some(kw => titleLower.includes(kw) || descLower.includes(kw))) {
                continue;
            }

            // 画像サイズチェック (小さすぎるものは除外)
            if (info.width < 800 || info.height < 600) continue;

            // ライセンスチェック
            const license = metadata.LicenseShortName?.value || 'Unknown';
            // 商用利用可能なライセンスなどを簡易フィルタ（厳密ではないが目安）
            if (!license.includes('CC') && !license.includes('Public domain') && !license.includes('PD')) {
                continue;
            }

            // 優先度スコア計算
            let score = 0;
            if (PRIORITY_KEYWORDS.some(kw => titleLower.includes(kw) || descLower.includes(kw))) score += 10;
            // 検索語そのものが含まれているか
            if (titleLower.includes(searchTerm.toLowerCase())) score += 5;

            results.push({
                url: info.url,
                alt: page.title.replace(/^File:/, '').replace(/\.\w+$/, ''),
                credit: {
                    name: metadata.Artist?.value?.replace(/<[^>]*>/g, '').trim() || 'Unknown author',
                    url: metadata.Artist?.value?.match(/href="([^"]*)"/)?.[1] || ''
                },
                source: 'wikimedia-auto',
                license: license,
                licenseUrl: metadata.LicenseUrl?.value || '',
                width: info.width,
                height: info.height,
                score: score
            });
        }

        // スコア順にソート
        return results.sort((a, b) => b.score - a.score);

    } catch (error) {
        console.error(`Error searching wikimedia for ${searchTerm}:`, error.message);
        return [];
    }
}

async function main() {
    console.log('Starting to fill missing images in onsen-catalog.json...');

    // カタログ読み込み
    let catalog;
    try {
        const rawData = fs.readFileSync(CATALOG_PATH, 'utf8');
        catalog = JSON.parse(rawData);
    } catch (error) {
        console.error('Failed to read onsen-catalog.json:', error);
        process.exit(1);
    }

    const onsenIds = Object.keys(catalog);
    let updatedCount = 0;

    for (const id of onsenIds) {
        const onsen = catalog[id];

        // 画像が既にある場合はスキップ
        if (onsen.images && onsen.images.length > 0) {
            console.log(`[SKIP] ${onsen.name} (${id}) already has images.`);
            continue;
        }

        console.log(`[SEARCH] Searching images for ${onsen.name} (${id})...`);

        // 検索クエリの生成
        // 1. {英語名} Onsen hot spring
        // 2. {日本語名} 温泉 露天風呂
        const queries = [
            `${onsen.nameEn} Onsen hot spring`,
            `${onsen.name} 温泉 露天風呂`,
            `${onsen.nameEn} Onsen`,
            `${onsen.name} 温泉`
        ];

        let foundImages = [];

        for (const query of queries) {
            console.log(`  Query: "${query}"`);
            const results = await searchWikimedia(query);
            if (results.length > 0) {
                console.log(`    -> Found ${results.length} images.`);
                foundImages = results;
                break; // 良い画像が見つかったらループを抜ける（クエリの優先順位順）
            }
            await new Promise(r => setTimeout(r, 1000)); // APIレートリミット配慮
        }

        if (foundImages.length > 0) {
            // 上位3枚を候補として記録
            const candidates = foundImages.slice(0, 3).map(img => ({
                onsenId: id,
                onsenName: onsen.name,
                url: img.url,
                alt: img.alt,
                credit: img.credit,
                source: "wikimedia-auto",
                sourceUrl: img.credit?.url || '', // credit.url is often the file page or close to it
                license: img.license,
                licenseUrl: img.licenseUrl,
                score: img.score,
                fetchedAt: new Date().toISOString()
            }));

            const candidateFile = path.join(__dirname, '../data/raw/image-candidates.jsonl');
            // Ensure data/raw exists (it should, but just in case)
            const rawDir = path.dirname(candidateFile);
            if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

            // Append to JSONL
            const lines = candidates.map(c => JSON.stringify(c)).join('\n') + '\n';
            fs.appendFileSync(candidateFile, lines);

            updatedCount++;
            console.log(`[CANDIDATE] Saved ${candidates.length} candidates for ${onsen.name}.`);
        } else {
            console.log(`[WARN] No images found for ${onsen.name}.`);
        }

        // 1件ごとに少し待つ
        await new Promise(r => setTimeout(r, 500));
    }

    if (updatedCount > 0) {
        console.log(`\nSearch complete. Candidates saved to data/raw/image-candidates.jsonl`);
        console.log('Done.');
    } else {
        console.log('\nNo new candidates found.');
    }
}

main();
