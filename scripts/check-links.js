#!/usr/bin/env node
/**
 * 厳格な内部リンクチェッカー
 * - JSONコンテンツ内のリンクも検証
 * - 存在しない動的ルートへのリンクも検証（可能な範囲で）
 */

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');
const themesDir = path.join(__dirname, '../themes');
const themeName = process.env.NEXT_PUBLIC_THEME || 'github-docs';
const contentPath = path.join(themesDir, themeName, 'content.json');

const errors = [];
const warnings = [];
const validLinks = new Set(['/']); // ルートは常に有効

// 1. 存在するルートの収集
function getRoutes(dir, basePath = '') {
  const routes = new Set();
  if (!fs.existsSync(dir)) return routes;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && !item.startsWith('_')) {
      const routePath = `${basePath}/${item}`;
      
      // page.tsxがあれば有効なルート
      if (fs.existsSync(path.join(fullPath, 'page.tsx'))) {
        routes.add(routePath);
        routes.add(routePath + '/'); // 末尾スラッシュ対応
        
        // 動的ルート ([slug]など) の場合、ワイルドカードとして登録
        if (item.startsWith('[') && item.endsWith(']')) {
          // 例: /docs/[slug] -> /docs/*
          const parentPath = basePath || '/';
          routes.add(`${parentPath}*`); 
        }
      }
      
      const subRoutes = getRoutes(fullPath, routePath);
      subRoutes.forEach(r => routes.add(r));
    }
  }
  return routes;
}

// 2. コンテンツJSONから動的ルートの有効な値を収集
function getValidDynamicRoutes() {
  const valid = new Set();
  try {
    if (fs.existsSync(contentPath)) {
      const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
      
      // Docs pages
      if (content.pages?.docs) {
        content.pages.docs.forEach(doc => {
          valid.add(`/docs/${doc.slug}`);
        });
      }
      
      // Blog pages
      if (content.pages?.blog?.posts) {
        content.pages.blog.posts.forEach(post => {
          valid.add(`/blog/${post.slug}`);
        });
      }
    }
  } catch (e) {
    console.error('Failed to parse content.json:', e);
  }
  return valid;
}

// 3. ファイルからリンクを抽出
function extractLinksFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const links = new Set();
  const hrefPattern = /href=["']([^"']+)["']|href=\{["']([^"']+)["']\}/g;
  let match;
  
  while ((match = hrefPattern.exec(content)) !== null) {
    const link = match[1] || match[2];
    if (link && (link.startsWith('/') || link.startsWith('./'))) {
      const cleanLink = link.split('?')[0].split('#')[0];
      const normalized = cleanLink.endsWith('/') && cleanLink !== '/' ? cleanLink.slice(0, -1) : cleanLink;
      links.add({ link: normalized, file: filePath });
    }
  }
  return links;
}

// 4. コンテンツJSONからリンクを抽出
function extractLinksFromJSON() {
  const links = new Set();
  try {
    const contentStr = fs.readFileSync(contentPath, 'utf-8');
    // シンプルに "href": "..." または "link": "..." を検索
    const jsonLinks = contentStr.match(/"(href|link|url)":\s*"(\/[^"]+)"/g);
    
    if (jsonLinks) {
      jsonLinks.forEach(match => {
        const url = match.match(/"(\/[^"]+)"/)[1];
        const cleanLink = url.split('?')[0].split('#')[0];
        const normalized = cleanLink.endsWith('/') && cleanLink !== '/' ? cleanLink.slice(0, -1) : cleanLink;
        links.add({ link: normalized, file: 'content.json' });
      });
    }
  } catch (e) {
    // ignore
  }
  return links;
}

function scanFiles(dir) {
  const links = [];
  if (!fs.existsSync(dir)) return links;
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      links.push(...scanFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
      links.push(...extractLinksFromFile(fullPath));
    }
  }
  return links;
}

// メイン処理
console.log('🔍 厳格な内部リンクチェックを開始...\n');

const fileRoutes = getRoutes(appDir);
const dynamicRoutes = getValidDynamicRoutes();
const allValidRoutes = new Set([...fileRoutes, ...dynamicRoutes]);

// ワイルドカードルートの抽出
const wildcardRoutes = new Set();
fileRoutes.forEach(r => {
  if (r.endsWith('*')) wildcardRoutes.add(r.slice(0, -1)); // 末尾の*を除去
});

const fileLinks = scanFiles(appDir);
const jsonLinks = extractLinksFromJSON();
const allLinks = [...fileLinks, ...jsonLinks];

console.log(`📄 定義済みルート: ${allValidRoutes.size}`);
console.log(`🔗 検証対象リンク: ${allLinks.length}\n`);

allLinks.forEach(({ link, file }) => {
  if (link === '/' || link === '') return;
  
  // 1. 完全一致チェック
  if (allValidRoutes.has(link) || allValidRoutes.has(link + '/')) return;
  
  // 2. 動的ルート（ワイルドカード）チェック
  // 例: /docs/unknown-slug が /docs/* にマッチするか
  let matchedWildcard = false;
  for (const wildcard of wildcardRoutes) {
    if (link.startsWith(wildcard)) {
      matchedWildcard = true;
      // ワイルドカードにマッチした場合、その具体的slugが有効かどうかを確認
      // validDynamicRoutesに含まれていなければエラー
      // ただし、validDynamicRoutesはcontent.jsonから生成されたものだけなので、
      // content.json外で動的に生成されるページがある場合は誤検知の可能性があるが、
      // 今回のアーキテクチャではcontent.jsonが正解なので厳格にチェックする。
      
      if (!dynamicRoutes.has(link) && !dynamicRoutes.has(link + '/')) {
         // エラー: パス形式は合っているが、データが存在しない
         const relPath = file === 'content.json' ? file : path.relative(process.cwd(), file);
         errors.push({ link, file: relPath, reason: 'Slug not found in data' });
         return;
      }
      return; // 有効な動的ルート
    }
  }

  // 特別な除外ルール (mailto, tel等は抽出regexで弾いているはずだが念のため)
  if (link.startsWith('mailto:') || link.startsWith('tel:')) return;

  // エラー登録
  const relPath = file === 'content.json' ? file : path.relative(process.cwd(), file);
  errors.push({ link, file: relPath, reason: 'Route not found' });
});

if (errors.length > 0) {
  console.error('❌ 以下のリンク切れが見つかりました:\n');
  errors.forEach(e => {
    console.error(`  🔗 ${e.link} (in ${e.file}) - ${e.reason}`);
  });
  console.error(`\n計 ${errors.length} 件のエラー`);
  process.exit(1);
}

console.log('✅ すべての内部リンクが有効です');
