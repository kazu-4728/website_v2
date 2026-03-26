/**
 * content/onsen/*.json の各 onsenSpots[].placeId に対して:
 * 1. Google Places API (New) で写真候補を取得
 * 2. Gemini 2.0 Flash で「温泉・浴場が写っている写真」を選ぶ
 * 3. placePhotoName を更新して JSON に書き戻す
 *
 * その後 python scripts/sync-google-place-photos.py を実行すると
 * 選択した写真が R2 にアップロードされる。
 *
 * 使い方:
 *   node scripts/select-onsen-photos.mjs
 *   node scripts/select-onsen-photos.mjs --slug=kawarayu
 *   node scripts/select-onsen-photos.mjs --limit=5
 *   node scripts/select-onsen-photos.mjs --force
 *
 * 必要な環境変数:
 *   GOOGLE_MAPS_API_KEY
 *   GEMINI_API_KEY
 */

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'onsen');
const PLACES_BASE = 'https://places.googleapis.com/v1';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const MAX_PHOTOS = 10;
const DELAY_MS = Number(process.env.DELAY_MS ?? 600);

function loadEnv() {
  for (const file of ['.env', '.env.local', '.env.production']) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    for (const rawLine of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#') || !line.includes('=')) continue;
      const [key, ...rest] = line.split('=');
      if (process.env[key]) continue;
      process.env[key] = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

function parseArgs() {
  const args = { limit: null, slug: null, force: false };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--limit=')) args.limit = Number(arg.split('=')[1]);
    if (arg.startsWith('--slug=')) args.slug = arg.split('=')[1];
    if (arg === '--force') args.force = true;
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPlacePhotos(placeId) {
  const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'photos',
    },
  });
  if (!res.ok) {
    throw new Error(`Places API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return (data.photos ?? []).slice(0, MAX_PHOTOS);
}

async function fetchPhotoAsBase64(photoName, maxWidth = 800) {
  const metaUrl = `${PLACES_BASE}/${photoName}/media?maxWidthPx=${maxWidth}&key=${process.env.GOOGLE_MAPS_API_KEY}&skipHttpRedirect=true`;
  const metaRes = await fetch(metaUrl);
  if (!metaRes.ok) throw new Error(`Photo meta ${metaRes.status}`);

  const { photoUri } = await metaRes.json();
  const imgRes = await fetch(photoUri);
  if (!imgRes.ok) throw new Error(`Photo fetch ${imgRes.status}`);

  const mimeType = imgRes.headers.get('content-type') ?? 'image/jpeg';
  const buffer = await imgRes.arrayBuffer();
  return {
    base64: Buffer.from(buffer).toString('base64'),
    mimeType,
  };
}

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return '{}';
  return cleaned.slice(start, end + 1);
}

function normalizeGeminiResult(raw) {
  const isOnsen = typeof raw?.isOnsen === 'boolean' ? raw.isOnsen : String(raw?.result ?? '').toLowerCase() === 'yes';
  const confidence = Number(raw?.confidence ?? (isOnsen ? 0.9 : 0.1));
  return {
    isOnsen,
    confidence: Number.isFinite(confidence) ? confidence : 0,
    reason: typeof raw?.reason === 'string' && raw.reason.trim() ? raw.reason.trim() : '理由なし',
  };
}

async function isOnsenPhoto(base64, mimeType, spotName) {
  const prompt = `
この写真に温泉・浴場・露天風呂・湯船・浴室が写っているか判定してください。次のJSONだけを返してください。

{
  "isOnsen": true または false,
  "confidence": 0〜1の数値,
  "reason": "1行で理由"
}

施設名: ${spotName}
`.trim();

  const res = await fetch(
    `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ inlineData: { mimeType, data: base64 } }, { text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  try {
    return normalizeGeminiResult(JSON.parse(extractJson(text)));
  } catch {
    return { isOnsen: false, confidence: 0, reason: 'parse error' };
  }
}

function shouldSkipSpot(spot, args) {
  if (!spot.placePhotoName) return false;
  if (args.force) return false;
  if (args.slug) return false;
  return true;
}

function markPendingSelection(spot, nextPhotoName) {
  spot.placePhotoName = nextPhotoName;
  spot.photoStatus = 'pending';
  delete spot.photoUrl;
}

async function processSpot(spot, args) {
  if (!spot.placeId) {
    console.log('    skip: placeId なし');
    return false;
  }

  if (shouldSkipSpot(spot, args)) {
    console.log(`    skip: 設定済み (${spot.placePhotoName.slice(0, 60)}...)`);
    return false;
  }

  const photos = await fetchPlacePhotos(spot.placeId);
  if (photos.length === 0) {
    console.warn('    ✗ 写真なし');
    return false;
  }
  console.log(`    → ${photos.length}枚取得, Gemini判定中...`);

  for (const photo of photos) {
    try {
      const { base64, mimeType } = await fetchPhotoAsBase64(photo.name);
      await sleep(200);
      const result = await isOnsenPhoto(base64, mimeType, spot.name);

      if (result.isOnsen && result.confidence >= 0.7) {
        console.log(`      ✓ 温泉写真を検出: ${result.reason} (conf=${result.confidence.toFixed(2)})`);
        markPendingSelection(spot, photo.name);
        console.log(`    → 選択: ${photo.name.slice(0, 80)}...`);
        return true;
      }

      console.log(`      ✗ 温泉写真ではない: ${result.reason} (conf=${result.confidence.toFixed(2)})`);
      await sleep(DELAY_MS);
    } catch (error) {
      console.warn(`      ✗ エラー: ${error.message}`);
    }
  }

  console.warn('    → 温泉写真なし。1枚目を使用');
  markPendingSelection(spot, photos[0].name);
  return true;
}

async function main() {
  loadEnv();

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY が未設定です');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY が未設定です');
  }

  const args = parseArgs();
  let files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.json') && file !== 'index.json')
    .map((file) => path.join(CONTENT_DIR, file));

  if (args.slug) {
    files = files.filter((file) => path.basename(file, '.json') === args.slug);
    if (files.length === 0) {
      throw new Error(`slug="${args.slug}" が見つかりません`);
    }
  } else if (args.limit) {
    files = files.slice(0, args.limit);
  }

  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const filePath of files) {
    const slug = path.basename(filePath, '.json');
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const spots = content.onsenSpots ?? [];

    console.log(`\n[${slug}] ${content.identity?.name ?? slug} (${spots.length}スポット)`);

    let fileChanged = false;
    for (const spot of spots) {
      console.log(`  [${spot.slug}] ${spot.name}`);
      try {
        const updated = await processSpot(spot, args);
        if (updated) {
          fileChanged = true;
          totalUpdated += 1;
        } else {
          totalSkipped += 1;
        }
      } catch (error) {
        console.error(`  ✗ エラー: ${error.message}`);
        totalSkipped += 1;
      }
      await sleep(DELAY_MS);
    }

    if (fileChanged) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
      console.log(`  → ${filePath} を更新しました`);
    }
  }

  console.log(`\n完了: 更新=${totalUpdated}件 / スキップ=${totalSkipped}件`);
  console.log('\n次のステップ:');
  console.log('  python scripts/sync-google-place-photos.py');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


