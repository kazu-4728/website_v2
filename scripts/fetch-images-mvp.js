/**
 * fetch-images-mvp.js
 * 
 * Multi-source Image Fetcher for MVP (Refined for Recovery Phase)
 * - Preset: kanto_jp (Default)
 * - Ladder Search: Specific -> General -> English fallback
 * - Priority: Unsplash > Pexels > Pixabay > Wikimedia (Optional)
 * - Safety: Negative word filter, min-width check, rate limiting
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Configuration ---

const DATA_DIR = path.join(__dirname, '../data/raw');
const OUTPUT_DIR = path.join(__dirname, '../public/images/mvp');
const QUOTA_FILE_PREFIX = 'quota-';
const ATTRIBUTION_FILE = path.join(DATA_DIR, 'image-attribution.jsonl');
const DOCS_ATTRIBUTION = path.join(__dirname, '../docs/IMAGE_ATTRIBUTION.md');

// Default Limits
const MAX_TOTAL_DL_PER_RUN = 8;
const LIMITS = {
    unsplash: { run: 10, day: 50 },
    pexels: { run: 10, day: 50 },
    pixabay: { run: 10, day: 50 },
    wikimedia: { run: 20, day: 100 }
};

// User-Agent (Mozilla compatible for Wikimedia)
const USER_AGENT = 'Mozilla/5.0 (compatible; OnsenSiteMVP/2.1; +https://github.com/kazu-4728/website_v2; contact@example.com)';

// --- Query Presets ---

const PRESETS = {
    kanto_jp: {
        negative: [
            "プール", "海", "ビーチ", "マッサージ", "エステ", "化粧品", "スキンケア", "美容液", "クリーム",
            "広告", "ジム", "バー", "カクテル", "自撮り", "ポートレート", "水着",
            "pool", "beach", "ocean", "spa massage", "cosmetics", "skincare", "portrait", "bikini",
            "tropical", "resort", "palm", "gym", "fitness"
        ],
        slots: {
            hero: {
                unsplash: ["ryokan exterior japan", "japanese inn exterior", "onsen town japan", "hakone ryokan", "kusatsu onsen town"],
                pexels: ["温泉街", "温泉 旅館 外観", "箱根 旅館", "草津 温泉街", "伊香保 石段街", "鬼怒川 温泉 旅館"],
                pixabay: ["温泉 旅館 外観", "温泉街", "箱根", "草津", "旅館 夜景"],
                wikimedia: ["草津温泉 湯畑", "伊香保温泉 石段", "箱根 大涌谷", "鬼怒川温泉", "那須温泉"]
            },
            onsen: {
                unsplash: ["onsen rotenburo", "outdoor hot spring japan", "ryokan onsen bath", "hot spring bath japan", "onsen steam japan"],
                pexels: ["露天風呂", "温泉 露天風呂", "温泉 旅館 露天風呂", "源泉かけ流し 露天風呂", "硫黄泉 露天風呂", "美肌の湯 温泉 露天風呂"],
                pixabay: ["露天風呂", "温泉 露天", "温泉 旅館 露天風呂", "湯けむり 温泉", "源泉かけ流し"],
                wikimedia: ["温泉 露天風呂", "日本 温泉 露天", "草津温泉 共同浴場", "箱根温泉"],
                minWidth: 1600
            },
            rooms: {
                unsplash: ["ryokan room tatami", "tatami room japan", "japanese futon room", "traditional japanese room"],
                pexels: ["旅館 和室", "和室 畳", "布団 和室", "露天風呂付き客室"],
                pixabay: ["和室", "旅館 和室", "畳 部屋"],
                wikimedia: ["旅館 和室"]
            },
            cuisine: {
                unsplash: ["kaiseki cuisine", "japanese dinner course", "traditional japanese cuisine", "kaiseki ryokan"],
                pexels: ["会席料理", "和食 コース", "旅館 夕食", "懐石料理"],
                pixabay: ["会席料理", "懐石料理", "和食"],
                wikimedia: ["懐石料理"]
            },
            // Gallery slots mapped to regions
            "gallery-01": { // Kusatsu/Ikaho
                unsplash: ["kusatsu onsen", "ikaho onsen stone steps"],
                pexels: ["草津 湯畑", "伊香保 石段"],
                pixabay: ["草津 湯畑", "伊香保 石段"],
                wikimedia: ["草津温泉 湯畑", "伊香保温泉 石段街"]
            },
            "gallery-02": { // Hakone/Atami
                unsplash: ["hakone onsen", "owakudani hakone"],
                pexels: ["箱根 大涌谷", "湯河原 温泉"],
                pixabay: ["箱根 大涌谷", "温泉街 夜"],
                wikimedia: ["箱根 大涌谷", "熱海温泉"]
            },
            "gallery-03": { // Kinugawa/Nasu
                unsplash: ["kinugawa onsen", "nasu onsen"],
                pexels: ["鬼怒川 渓谷", "那須 高原"],
                pixabay: ["温泉街", "湯けむり"],
                wikimedia: ["鬼怒川温泉", "那須温泉"]
            },
            "gallery-04": { // Shima/Manza
                unsplash: ["shima onsen", "manza onsen"],
                pexels: ["四万温泉", "万座温泉"],
                pixabay: ["温泉 旅館"],
                wikimedia: ["四万温泉", "万座温泉"]
            }
        }
    }
};

// --- Utilities ---

function loadEnv() {
    ['.env', '.env.local'].forEach(file => {
        const p = path.join(__dirname, '..', file);
        if (fs.existsSync(p)) {
            fs.readFileSync(p, 'utf8').split('\n').forEach(line => {
                const m = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
                if (m && !m[1].startsWith('#') && !process.env[m[1]]) {
                    process.env[m[1]] = m[2] ? m[2].trim().replace(/^['"](.*)['"]$/, '$1') : '';
                }
            });
        }
    });
}

function parseArgs() {
    const args = { dryRun: false, maxTotal: MAX_TOTAL_DL_PER_RUN, enableWikimedia: false };
    process.argv.slice(2).forEach(arg => {
        if (arg === '--dry-run') args.dryRun = true;
        if (arg === '--enable-wikimedia') args.enableWikimedia = true;
        if (arg.startsWith('--max-total=')) args.maxTotal = parseInt(arg.split('=')[1], 10);
    });
    return args;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms + Math.random() * 500)); }

function fetchUrl(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = { method: 'GET', headers: { 'User-Agent': USER_AGENT, ...headers } };
        const req = https.request(url, options, (res) => {
            let body = '';
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
            }
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve({ ok: true, json: JSON.parse(body) }); }
                    catch (e) { resolve({ ok: true, text: body }); }
                } else {
                    resolve({ ok: false, status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const options = { method: 'GET', headers: { 'User-Agent': USER_AGENT } };
        const req = https.request(url, options, (res) => {
            if (res.statusCode >= 300 && res.headers.location) {
                downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
                return;
            }
            const type = res.headers['content-type'] || '';
            if (!type.startsWith('image/')) {
                res.resume();
                return reject(new Error(`Invalid content-type: ${type}`));
            }
            const file = fs.createWriteStream(destPath);
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(true); });
        });
        req.on('error', (e) => {
            if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            reject(e);
        });
        req.end();
    });
}

class QuotaManager {
    constructor(source, dryRun) {
        this.source = source;
        this.dryRun = dryRun;
        this.limit = LIMITS[source];
        this.usage = { run: 0, day: 0 };
        this.loadFile = path.join(DATA_DIR, `${QUOTA_FILE_PREFIX}${source}.json`);
        this.load();
    }
    load() {
        if (this.dryRun || !fs.existsSync(this.loadFile)) return;
        try {
            const d = JSON.parse(fs.readFileSync(this.loadFile, 'utf8'));
            if (d.date === new Date().toISOString().split('T')[0]) this.usage.day = d.downloads;
        } catch (e) { }
    }
    save() {
        if (this.dryRun) return;
        const d = { date: new Date().toISOString().split('T')[0], downloads: this.usage.day };
        fs.writeFileSync(this.loadFile, JSON.stringify(d, null, 2));
    }
    canDownload() { return this.usage.run < this.limit.run && this.usage.day < this.limit.day; }
    increment() { if (this.dryRun) return; this.usage.run++; this.usage.day++; this.save(); }
}

// --- Fetcher Logic ---

class ImageFetcher {
    constructor(args) {
        this.args = args;
        this.quotas = {
            unsplash: new QuotaManager('unsplash', args.dryRun),
            pexels: new QuotaManager('pexels', args.dryRun),
            pixabay: new QuotaManager('pixabay', args.dryRun),
            wikimedia: new QuotaManager('wikimedia', args.dryRun)
        };
        this.preset = PRESETS.kanto_jp;
        this.downloadedCount = 0;
    }

    hasNgWord(text) {
        if (!text) return false;
        const t = text.toLowerCase();
        return this.preset.negative.some(ng => t.includes(ng.toLowerCase()));
    }

    // Source Providers
    async searchUnsplash(queries, minW) {
        if (!process.env.UNSPLASH_ACCESS_KEY || !this.quotas.unsplash.canDownload()) return null;
        for (const q of queries) {
            console.log(`    [Unsplash] Searching: "${q}"`);
            await sleep(1200);
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
            const res = await fetchUrl(url);
            if (res.ok && res.json.results) {
                for (const img of res.json.results) {
                    if (img.width < (minW || 1200)) continue;
                    if (this.hasNgWord(img.description) || this.hasNgWord(img.alt_description)) continue;
                    return {
                        source: 'unsplash', id: img.id, url: img.urls.regular, dl_loc: img.links.download_location,
                        author: img.user.name, author_url: img.user.links.html, license: 'Unsplash License',
                        license_url: 'https://unsplash.com/license', original_url: img.links.html,
                        description: img.alt_description || q
                    };
                }
            }
        }
        return null;
    }

    async searchPexels(queries, minW) {
        if (!process.env.PEXELS_API_KEY || !this.quotas.pexels.canDownload()) return null;
        for (const q of queries) {
            console.log(`    [Pexels] Searching: "${q}"`);
            await sleep(1200);
            const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape`;
            const res = await fetchUrl(url, { Authorization: process.env.PEXELS_API_KEY });
            if (res.ok && res.json.photos) {
                for (const img of res.json.photos) {
                    if (img.width < (minW || 1200)) continue;
                    if (this.hasNgWord(img.alt)) continue;
                    return {
                        source: 'pexels', id: img.id, url: img.src.large2x,
                        author: img.photographer, author_url: img.photographer_url, license: 'Pexels License',
                        license_url: 'https://www.pexels.com/license/', original_url: img.url, description: img.alt || q
                    };
                }
            }
        }
        return null;
    }

    async searchPixabay(queries, minW) {
        if (!process.env.PIXABAY_API_KEY || !this.quotas.pixabay.canDownload()) return null;
        for (const q of queries) {
            console.log(`    [Pixabay] Searching: "${q}"`);
            await sleep(1200);
            const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&min_width=${minW || 1200}`;
            const res = await fetchUrl(url);
            if (res.ok && res.json.hits) {
                for (const img of res.json.hits) {
                    if (this.hasNgWord(img.tags)) continue;
                    return {
                        source: 'pixabay', id: img.id, url: img.largeImageURL,
                        author: img.user, author_url: `https://pixabay.com/users/${img.user}-${img.user_id}/`,
                        license: 'Pixabay License', license_url: 'https://pixabay.com/service/license/',
                        original_url: img.pageURL, description: img.tags || q
                    };
                }
            }
        }
        return null;
    }

    async searchWikimedia(queries) {
        if (!this.args.enableWikimedia || !this.quotas.wikimedia.canDownload()) return null;
        for (const q of queries) {
            console.log(`    [Wikimedia] Searching: "${q}"`);
            await sleep(1000);
            const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrlimit=5&prop=imageinfo&iiprop=url|extmetadata|size&origin=*`;
            const res = await fetchUrl(url);
            if (res.ok && res.json.query && res.json.query.pages) {
                for (const p of Object.values(res.json.query.pages)) {
                    const info = p.imageinfo ? p.imageinfo[0] : null;
                    if (!info || info.width < 1200) continue;
                    const ext = info.extmetadata || {};
                    const desc = ext.ImageDescription ? ext.ImageDescription.value : '';
                    const lic = ext.LicenseShortName ? ext.LicenseShortName.value : '';
                    if (this.hasNgWord(desc) || this.hasNgWord(p.title)) continue;
                    if (['CC', 'Public domain', 'PD'].some(l => lic.includes(l))) {
                        return {
                            source: 'wikimedia', id: p.pageid, url: info.url,
                            author: ext.Artist ? ext.Artist.value.replace(/<[^>]+>/g, '') : 'Wikimedia',
                            author_url: 'https://commons.wikimedia.org', license: lic,
                            license_url: ext.LicenseUrl ? ext.LicenseUrl.value : '',
                            original_url: info.descriptionurl, description: p.title.replace('File:', '')
                        };
                    }
                }
            }
        }
        return null;
    }

    async run() {
        console.log(`Starting Image Fetch (Max: ${this.args.maxTotal}, Wikimedia: ${this.args.enableWikimedia})`);
        if (this.args.dryRun) console.log(`--- DRY RUN MODE ---`);
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

        let attributions = [];
        if (fs.existsSync(ATTRIBUTION_FILE)) {
            attributions = fs.readFileSync(ATTRIBUTION_FILE, 'utf8').trim().split('\n').map(l => JSON.parse(l));
        }

        const slots = Object.keys(this.preset.slots);
        for (const slotName of slots) {
            if (this.downloadedCount >= this.args.maxTotal) break;
            const slotConfig = this.preset.slots[slotName];
            const filename = `${slotName}.jpg`;
            const destPath = path.join(OUTPUT_DIR, filename);

            // Skip if exists (unless forced, but here we skip to save API)
            if (fs.existsSync(destPath) && !this.args.dryRun) {
                console.log(`[Skip] ${slotName} already exists.`);
                continue;
            }

            console.log(`Targeting [${slotName}]...`);
            let result = null;

            // Priority Ladder: Unsplash -> Pexels -> Pixabay -> Wikimedia
            if (!result) result = await this.searchUnsplash(slotConfig.unsplash || [], slotConfig.minWidth);
            if (!result) result = await this.searchPexels(slotConfig.pexels || [], slotConfig.minWidth);
            if (!result) result = await this.searchPixabay(slotConfig.pixabay || [], slotConfig.minWidth);
            if (!result) result = await this.searchWikimedia(slotConfig.wikimedia || []);

            if (result) {
                if (this.args.dryRun) {
                    console.log(`  -> [Preview] Found: ${result.original_url} (${result.source})`);
                    continue;
                }

                console.log(`  -> Downloading from ${result.source}: ${result.original_url}`);
                try {
                    await downloadImage(result.url, destPath);
                    this.downloadedCount++;
                    this.quotas[result.source].increment();

                    if (result.source === 'unsplash' && result.dl_loc) {
                        fetchUrl(`${result.dl_loc}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`).catch(() => { });
                    }

                    const attr = { slot: slotName, localFile: filename, fetchedAt: new Date().toISOString(), ...result };
                    fs.appendFileSync(ATTRIBUTION_FILE, JSON.stringify(attr) + '\n');
                    attributions.push(attr);
                } catch (e) {
                    console.error(`  -> Failed to download: ${e.message}`);
                }
            } else {
                console.warn(`  -> No image found for ${slotName}`);
            }
        }

        if (!this.args.dryRun) {
            this.generateDocs(attributions);
        }
    }

    generateDocs(attrs) {
        const map = new Map();
        attrs.forEach(a => map.set(a.slot, a));
        let md = `# Image Attribution\n\n| Preview | Slot | Source | Author | License |\n|---|---|---|---|---|\n`;
        const slots = Object.keys(this.preset.slots);
        for (const s of slots) {
            if (map.has(s)) {
                const a = map.get(s);
                md += `| <img src="../public/images/mvp/${a.localFile}" width="100"> | **${s}** | [${a.source}](${a.original_url}) | [${a.author}](${a.author_url}) | [${a.license}](${a.license_url}) |\n`;
            }
        }
        fs.writeFileSync(DOCS_ATTRIBUTION, md);
        console.log(`Updated ${DOCS_ATTRIBUTION}`);
    }
}

loadEnv();
new ImageFetcher(parseArgs()).run().catch(console.error);
