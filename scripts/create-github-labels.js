#!/usr/bin/env node

/**
 * GitHub ラベル作成スクリプト
 * 
 * Dependabotが必要とするラベルを作成します。
 * 
 * 使用方法:
 *   GITHUB_TOKEN=your_token node scripts/create-github-labels.js
 * 
 * または GitHub Actions 内で:
 *   node scripts/create-github-labels.js
 */

const https = require('https');

const OWNER = 'kazu-4728';
const REPO = 'website_v2';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const LABELS = [
  {
    name: 'dependencies',
    color: '8b5cf6',
    description: '依存関係の更新'
  },
  {
    name: 'security',
    color: 'd73a4a',
    description: 'セキュリティ更新'
  },
  {
    name: 'github-actions',
    color: '000000',
    description: 'GitHub Actionsの更新'
  }
];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'User-Agent': 'GitHub-Labels-Script',
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function createLabel(label) {
  console.log(`\nラベル "${label.name}" を作成中...`);
  
  // まず存在確認
  const checkResponse = await makeRequest('GET', `/repos/${OWNER}/${REPO}/labels/${encodeURIComponent(label.name)}`);
  
  if (checkResponse.status === 200) {
    console.log(`  ℹ️  ラベル "${label.name}" は既に存在します`);
    return { success: true, exists: true };
  }
  
  if (checkResponse.status === 404) {
    // ラベルが存在しないので作成
    const createResponse = await makeRequest('POST', `/repos/${OWNER}/${REPO}/labels`, label);
    
    if (createResponse.status === 201) {
      console.log(`  ✅ ラベル "${label.name}" を作成しました`);
      return { success: true, created: true };
    } else {
      console.error(`  ❌ ラベル "${label.name}" の作成に失敗: ${createResponse.status}`);
      console.error(`     ${JSON.stringify(createResponse.data)}`);
      return { success: false, error: createResponse.data };
    }
  }
  
  console.error(`  ❌ ラベル確認エラー: ${checkResponse.status}`);
  return { success: false, error: checkResponse.data };
}

async function main() {
  console.log('=== GitHub ラベル作成スクリプト ===\n');
  console.log(`リポジトリ: ${OWNER}/${REPO}`);
  
  if (!GITHUB_TOKEN) {
    console.error('\n❌ エラー: GITHUB_TOKEN 環境変数が設定されていません');
    console.error('\n使用方法:');
    console.error('  GITHUB_TOKEN=your_token node scripts/create-github-labels.js');
    console.error('\nまたは GitHub Actions 内で実行してください');
    process.exit(1);
  }
  
  console.log('\n作成するラベル:');
  LABELS.forEach(label => {
    console.log(`  - ${label.name} (#${label.color}): ${label.description}`);
  });
  
  const results = [];
  for (const label of LABELS) {
    const result = await createLabel(label);
    results.push({ label: label.name, ...result });
  }
  
  console.log('\n=== 実行結果 ===');
  const created = results.filter(r => r.created).length;
  const existed = results.filter(r => r.exists).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ 作成: ${created}個`);
  console.log(`ℹ️  既存: ${existed}個`);
  if (failed > 0) {
    console.log(`❌ 失敗: ${failed}個`);
    process.exit(1);
  }
  
  console.log('\n✨ すべてのラベルが利用可能です！');
  console.log('\nDependabot は次回の実行時にこれらのラベルを使用できます。');
}

main().catch(error => {
  console.error('\n❌ エラーが発生しました:', error.message);
  process.exit(1);
});
