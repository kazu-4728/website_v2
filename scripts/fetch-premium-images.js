/**
 * Premium Image Collection Script
 * Collects high-quality onsen images from multiple sources
 * 
 * Sources:
 * - Unsplash (high-quality, curated)
 * - Pexels (royalty-free)
 * - Wikimedia Commons (public domain)
 */

const fs = require('fs').promises;
const path = require('path');

// 温泉地のリスト
const onsenLocations = [
  { id: 'hakone', nameEn: 'Hakone', nameJa: '箱根', keywords: ['hakone', 'hot spring', 'outdoor bath', 'onsen'] },
  { id: 'kusatsu', nameEn: 'Kusatsu', nameJa: '草津', keywords: ['kusatsu', 'yubatake', 'hot spring', 'onsen'] },
  { id: 'kinugawa', nameEn: 'Kinugawa', nameJa: '鬼怒川', keywords: ['kinugawa', 'hot spring', 'gorge', 'onsen'] },
  { id: 'ikaho', nameEn: 'Ikaho', nameJa: '伊香保', keywords: ['ikaho', 'stone steps', 'hot spring', 'onsen'] },
  { id: 'nasu', nameEn: 'Nasu', nameJa: '那須', keywords: ['nasu', 'hot spring', 'highland', 'onsen'] },
  { id: 'minakami', nameEn: 'Minakami', nameJa: '水上', keywords: ['minakami', 'hot spring', 'river', 'onsen'] },
];

// Unsplash API configuration (環境変数から取得)
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

/**
 * Fetch images from Unsplash
 */
async function fetchFromUnsplash(query, count = 5) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('⚠️  Unsplash API key not found. Skipping Unsplash...');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.log(`⚠️  Unsplash API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.results.map(photo => ({
      url: photo.urls.raw + '&w=2400&q=85&fm=jpg',
      thumbnail: photo.urls.small,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
      source: 'unsplash',
      width: photo.width,
      height: photo.height,
    }));
  } catch (error) {
    console.error('Error fetching from Unsplash:', error.message);
    return [];
  }
}

/**
 * Fetch images from Pexels
 */
async function fetchFromPexels(query, count = 5) {
  if (!PEXELS_API_KEY) {
    console.log('⚠️  Pexels API key not found. Skipping Pexels...');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.log(`⚠️  Pexels API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.photos.map(photo => ({
      url: photo.src.original,
      thumbnail: photo.src.small,
      author: photo.photographer,
      authorUrl: photo.photographer_url,
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
      source: 'pexels',
      width: photo.width,
      height: photo.height,
    }));
  } catch (error) {
    console.error('Error fetching from Pexels:', error.message);
    return [];
  }
}

/**
 * Fetch high-quality images from Wikimedia Commons
 */
async function fetchFromWikimedia(query, count = 5) {
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?` +
      `action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query + ' outdoor bath')}&` +
      `gsrnamespace=6&gsrlimit=${count}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=2400&origin=*`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!data.query || !data.query.pages) {
      return [];
    }

    const images = [];
    for (const pageId in data.query.pages) {
      const page = data.query.pages[pageId];
      if (page.imageinfo && page.imageinfo[0]) {
        const info = page.imageinfo[0];
        const metadata = info.extmetadata || {};

        // 画像のサイズチェック（大きい画像のみ）
        if (info.width > 1920 && info.height > 1080) {
          images.push({
            url: info.url,
            thumbnail: info.thumburl || info.url,
            author: metadata.Artist?.value || 'Unknown',
            license: metadata.LicenseShortName?.value || 'Unknown',
            licenseUrl: metadata.LicenseUrl?.value || '',
            source: 'wikimedia',
            width: info.width,
            height: info.height,
          });
        }
      }
    }

    return images;
  } catch (error) {
    console.error('Error fetching from Wikimedia:', error.message);
    return [];
  }
}

/**
 * Main collection process
 */
async function collectImages() {
  console.log('🖼️  Starting premium image collection...\n');

  const allImages = {};

  for (const location of onsenLocations) {
    console.log(`📍 Collecting images for ${location.nameJa} (${location.nameEn})...`);

    const images = {
      hero: [],
      cards: [],
      detail: [],
    };

    // Collect from multiple sources
    for (const keyword of location.keywords) {
      console.log(`  🔍 Searching: ${keyword}...`);

      // Hero用（3枚）
      const unsplashImages = await fetchFromUnsplash(`${keyword} japan`, 3);
      images.hero.push(...unsplashImages);

      // Card用（3枚）
      const pexelsImages = await fetchFromPexels(`${keyword} japanese`, 3);
      images.cards.push(...pexelsImages);

      // Detail用（5枚）
      const wikimediaImages = await fetchFromWikimedia(location.nameEn, 5);
      images.detail.push(...wikimediaImages);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Remove duplicates
    images.hero = Array.from(new Set(images.hero.map(img => img.url))).map(url => 
      images.hero.find(img => img.url === url)
    );
    images.cards = Array.from(new Set(images.cards.map(img => img.url))).map(url => 
      images.cards.find(img => img.url === url)
    );
    images.detail = Array.from(new Set(images.detail.map(img => img.url))).map(url => 
      images.detail.find(img => img.url === url)
    );

    allImages[location.id] = images;

    console.log(`  ✅ Collected: ${images.hero.length} hero, ${images.cards.length} cards, ${images.detail.length} detail\n`);
  }

  // Save to file
  const outputPath = path.join(__dirname, '../data/premium-images.json');
  await fs.writeFile(outputPath, JSON.stringify(allImages, null, 2), 'utf-8');

  console.log(`\n✅ Image collection complete!`);
  console.log(`📁 Saved to: ${outputPath}`);

  // Summary
  let totalImages = 0;
  for (const locationId in allImages) {
    const location = allImages[locationId];
    totalImages += location.hero.length + location.cards.length + location.detail.length;
  }
  console.log(`📊 Total images collected: ${totalImages}`);
}

// Run the collection
collectImages().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
