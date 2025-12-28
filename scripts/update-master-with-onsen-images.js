/**
 * 既存の温泉画像データからマスターデータを更新するスクリプト
 * onsen-image-stock.jsonとwikimedia-images.jsonから実際の温泉画像を取得し、
 * マスターデータを更新します
 */

const fs = require('fs');
const path = require('path');

// 既存のデータを読み込み
const onsenImageStock = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/onsen-image-stock.json'), 'utf-8'));
const wikimediaImages = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/wikimedia-images.json'), 'utf-8'));
const unsplashOnsenData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/unsplash-onsen-images.json'), 'utf-8'));
const masterData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/onsen-image-master.json'), 'utf-8'));

// 温泉画像でない画像のURL（置き換えが必要）
const nonOnsenImages = {
  'kamogawa': 'Kamogawa_Sea_World_2008.jpg',
  'chichibu': 'Chichibu-Shrine.JPG',
  'yugawara': 'Yugawara_view_of_downtown.jpg',
  'gora': 'Gōra_Park_20090818_10.jpg',
  'chuzenji': 'Lake_Chuzenji_and_Mt_Nantai_2008.jpg',
  'katsuura': 'Katsuura_Chiba_2011.jpg',
  'oarai': 'Oarai_Isosaki_Shrine_Kamiiso_no_Torii_2015.jpg',
  'kamikawa': 'Kami-izumi_Dam_02.jpg',
  'okutama': 'LakeOkutama0050.jpg',
  'sengokuhara': '230910_Sengokuhara_Hakone_Japan06s3.jpg',
  'shirahama': 'Nojimazaki_Lighthouse_2011.jpg',
  'yorokeikoku': 'Yoro_Ravine_2008.jpg',
  'fukuroda': 'Fukuroda_Falls_2011.jpg',
  'seotonoyu': 'LakeOkutama0050.jpg',
  'shiobara': 'Shiobara_Onsen_Visitor_Center.JPG',
};

// 既存の温泉画像からマスターデータを更新
function updateMasterFromStock() {
  let updatedCount = 0;
  
  // onsen-image-stock.jsonから取得
  if (onsenImageStock.onsenPages) {
    for (const [slug, images] of Object.entries(onsenImageStock.onsenPages)) {
      if (images && images.length > 0) {
        // hasOnsen: trueの画像を優先的に選択
        const onsenImage = images.find(img => img.hasOnsen === true) || images[0];
        
        if (onsenImage && masterData[slug]) {
          masterData[slug].hero.url = onsenImage.url;
          masterData[slug].hero.alt = onsenImage.title || `${slug}温泉の露天風呂`;
          masterData[slug].hero.author = onsenImage.author || 'Unknown';
          masterData[slug].hero.license = onsenImage.license || 'Unknown';
          masterData[slug].hero.licenseUrl = onsenImage.licenseUrl || '';
          
          // thumbnailも更新
          const thumbnailUrl = onsenImage.url.replace('/commons/', '/commons/thumb/').replace(/\/([^/]+)$/, '/800px-$1');
          masterData[slug].thumbnail.url = thumbnailUrl;
          masterData[slug].thumbnail.alt = `${slug}温泉のサムネイル`;
          
          updatedCount++;
          console.log(`✓ Updated ${slug} from onsen-image-stock.json`);
        }
      }
    }
  }
  
  // wikimedia-images.jsonから取得（onsen-image-stock.jsonにない場合）
  for (const [slug, imageData] of Object.entries(wikimediaImages)) {
    if (masterData[slug] && !masterData[slug].hero.url.includes('onsen') && !masterData[slug].hero.url.includes('rotenburo')) {
      // 温泉画像でない画像をスキップ
      if (nonOnsenImages[slug] && imageData.url.includes(nonOnsenImages[slug])) {
        continue;
      }
      
      masterData[slug].hero.url = imageData.url;
      masterData[slug].hero.author = imageData.author.replace(/<[^>]*>/g, '').trim() || 'Unknown';
      masterData[slug].hero.license = imageData.license || 'Unknown';
      masterData[slug].hero.licenseUrl = imageData.licenseUrl || '';
      
      const thumbnailUrl = imageData.url.replace('/commons/', '/commons/thumb/').replace(/\/([^/]+)$/, '/800px-$1');
      masterData[slug].thumbnail.url = thumbnailUrl;
      
      updatedCount++;
      console.log(`✓ Updated ${slug} from wikimedia-images.json`);
    }
  }
  
  // unsplash-onsen-images.jsonから取得（まだ更新されていない場合）
  if (unsplashOnsenData.images) {
    for (const onsen of unsplashOnsenData.images) {
      const slug = onsen.slug;
      if (masterData[slug] && nonOnsenImages[slug] && masterData[slug].hero.url.includes(nonOnsenImages[slug])) {
        // 温泉画像でない画像を置き換え
        masterData[slug].hero.url = onsen.imgUrl;
        masterData[slug].hero.alt = onsen.alt || `${slug}温泉の露天風呂`;
        
        const thumbnailUrl = onsen.imgUrl.replace('/commons/', '/commons/thumb/').replace(/\/([^/]+)$/, '/800px-$1');
        masterData[slug].thumbnail.url = thumbnailUrl;
        
        updatedCount++;
        console.log(`✓ Updated ${slug} from unsplash-onsen-images.json`);
      }
    }
  }
  
  return updatedCount;
}

// 実行
console.log('Updating master data with actual onsen images...\n');
const updatedCount = updateMasterFromStock();
console.log(`\nUpdated ${updatedCount} images.`);

// マスターデータを保存
const outputPath = path.join(__dirname, '../data/onsen-image-master.json');
fs.writeFileSync(outputPath, JSON.stringify(masterData, null, 2));
console.log(`Master data saved to ${outputPath}`);

