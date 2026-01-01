const fs = require('fs');
const path = require('path');

const CATALOG_FILE = path.join(__dirname, '../data/onsen-catalog.json');

// 既知の高品質画像データ（以前のimages.tsから抽出）
const SEED_IMAGES = {
    "hakone": [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Gorakadan_Onsen_Rotenburo_1.jpg",
            "author": "Chris 73",
            "license": "CC BY-SA 3.0",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
            "alt": "Gorakadan Onsen Rotenburo (outdoor bath) in Hakone",
            "source": "wikimedia-seed"
        },
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/1/1f/%E5%AD%A3%E3%81%AE%E6%B9%AF_%E9%9B%AA%E6%9C%88%E8%8A%B1_%E7%AE%B1%E6%A0%B9%E5%BC%B7%E7%BE%85%E6%B8%A9%E6%B3%89_Apr_2%2C_2015.jpg",
            "author": "Michael Casim",
            "license": "CC BY 2.0",
            "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
            "alt": "Hakone Gora Onsen - Dramatic night hot spring",
            "source": "wikimedia-seed"
        }
    ],
    "kusatsu": [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg",
            "author": "Unknown author",
            "license": "Public domain",
            "licenseUrl": "",
            "alt": "Kusatsu Onsen Yubatake",
            "source": "wikimedia-seed"
        }
    ],
    "kinugawa": [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/f/f8/%E9%AC%BC%E6%80%92%E5%B7%9D%E6%B8%A9%E6%B3%8920250719-P1070976.jpg",
            "author": "くろふね",
            "license": "CC BY 4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
            "alt": "Kinugawa Onsen - Outdoor hot spring bath",
            "source": "wikimedia-seed"
        }
    ],
    "ikaho": [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikaho_Onsen_Stone_Steps.jpg",
            "author": "Qurren",
            "license": "CC BY-SA 4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
            "alt": "Ikaho Onsen - Stone steps",
            "source": "wikimedia-seed"
        }
    ],
    "nasu": [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_Nikko_Tochigi_pref_Japan04s3.jpg",
            "author": "663highland",
            "license": "CC BY-SA 4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
            "alt": "Nasu Onsen (Representative Image)",
            "source": "wikimedia-seed"
        }
    ],
    "shima": [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/4/40/%E5%9B%9B%E4%B8%87%E6%B8%A9%E6%B3%89%E7%A9%8D%E5%96%84%E9%A4%A8%E3%81%AE%E3%83%88%E3%83%B3%E3%83%8D%E3%83%AB.jpg",
            "author": "Komoro no kaze",
            "license": "CC BY-SA 4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
            "alt": "Shima Onsen - Tunnel",
            "source": "wikimedia-seed"
        }
    ],
    "atami": [
        {
            "url": "https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg",
            "author": "663highland",
            "license": "CC BY-SA 4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
            "alt": "Atami Onsen - Outdoor bath",
            "source": "wikimedia-seed"
        }
    ]
};

function loadJSON(filepath) {
    if (!fs.existsSync(filepath)) return {};
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function saveJSON(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

function main() {
    console.log('--- Seeding Catalog with Verified Images ---');
    const catalog = loadJSON(CATALOG_FILE);

    let updatedCount = 0;

    for (const [slug, images] of Object.entries(SEED_IMAGES)) {
        if (catalog[slug]) {
            // 既存のimages配列の先頭に追加（優先表示させるため）
            if (!catalog[slug].images) catalog[slug].images = [];

            // 重複チェック
            const newImages = images.filter(img =>
                !catalog[slug].images.some(existing => existing.url === img.url)
            );

            if (newImages.length > 0) {
                catalog[slug].images.unshift(...newImages.map(img => ({
                    url: img.url,
                    alt: img.alt,
                    credit: {
                        name: img.author,
                        url: ""
                    },
                    source: img.source,
                    license: img.license,
                    licenseUrl: img.licenseUrl
                })));
                console.log(`Updated [${slug}]: Added ${newImages.length} verified images.`);
                updatedCount++;
            }
        }
    }

    saveJSON(CATALOG_FILE, catalog);
    console.log(`\nDone. Updated ${updatedCount} locations with seed data.`);
}

main();
