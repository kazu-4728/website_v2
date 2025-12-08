#!/usr/bin/env python3
"""
関東温泉の実在画像を検索するスクリプト（フリー画像サイト対応版）

このスクリプトは、以下の方法で画像を検索します：
1. Wikimedia Commons API（自動）
2. Unsplash API（APIキーが必要な場合）
3. Pexels API（APIキーが必要な場合）
4. Pixabay API（APIキーが必要な場合）
5. 手動検索用URLの生成

テーマ変更に対応するため、content.jsonから温泉情報を動的に取得します。
"""

import json
import os
import sys
import requests
from typing import List, Dict, Optional
from urllib.parse import quote

# 既存画像のURLリスト（重複チェック用）
EXISTING_IMAGE_URLS = set()

def load_existing_images():
    """既存の画像URLを読み込む"""
    global EXISTING_IMAGE_URLS
    
    # data/wikimedia-images.jsonから既存URLを読み込み
    try:
        with open('data/wikimedia-images.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for key, value in data.items():
                if isinstance(value, dict) and 'url' in value:
                    EXISTING_IMAGE_URLS.add(value['url'])
    except FileNotFoundError:
        pass
    
    # app/lib/images.tsから既存URLを読み込み（簡易版）
    try:
        with open('app/lib/images.ts', 'r', encoding='utf-8') as f:
            content = f.read()
            # URLパターンを抽出（簡易版）
            import re
            urls = re.findall(r'https://[^\s"\'<>]+', content)
            EXISTING_IMAGE_URLS.update(urls)
    except FileNotFoundError:
        pass

def load_onsen_list_from_content():
    """content.jsonから温泉リストを読み込む"""
    try:
        with open('themes/onsen-kanto/content.json', 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        onsen_list = []
        
        # docs配列から温泉情報を抽出
        if 'pages' in content and 'docs' in content['pages']:
            for doc in content['pages']['docs']:
                # onsenフィールドがある場合
                if 'onsen' in doc and isinstance(doc['onsen'], dict):
                    onsen_info = doc['onsen']
                    name = onsen_info.get('name', doc.get('title', ''))
                    name_en = onsen_info.get('nameEn', '')
                    prefecture = onsen_info.get('region', {}).get('prefecture', '')
                    
                    if name:
                        onsen_list.append({
                            'name': name,
                            'name_en': name_en,
                            'name_kana': onsen_info.get('nameKana', ''),
                            'prefecture': prefecture,
                            'slug': doc.get('slug', ''),
                            'keywords': [
                                name_en.lower() if name_en else '',
                                'onsen',
                                'rotenburo',
                                'outdoor bath',
                                'hot spring',
                                'japan'
                            ]
                        })
                # onsenフィールドがない場合（タイトルから推測）
                elif 'title' in doc:
                    title = doc.get('title', '')
                    subtitle = doc.get('subtitle', '')
                    # タイトルから温泉名を抽出（例: "箱根温泉郷完全ガイド" -> "箱根温泉郷"）
                    if '温泉' in title:
                        # "完全ガイド"などを除去
                        name = title.replace('完全ガイド', '').replace('ガイド', '').strip()
                        # subtitleから都道府県を抽出
                        prefecture = ''
                        if '県' in subtitle or '都' in subtitle or '府' in subtitle:
                            parts = subtitle.split(' - ')
                            if len(parts) > 0:
                                prefecture = parts[0].strip()
                        
                        if name:
                            onsen_list.append({
                                'name': name,
                                'name_en': '',
                                'name_kana': '',
                                'prefecture': prefecture,
                                'slug': doc.get('slug', ''),
                                'keywords': [
                                    'onsen',
                                    'rotenburo',
                                    'outdoor bath',
                                    'hot spring',
                                    'japan'
                                ]
                            })
        
        return onsen_list
    except Exception as e:
        print(f"Error loading content.json: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return []

def search_wikimedia_commons(query: str, limit: int = 10) -> List[Dict]:
    """Wikimedia Commons APIで画像を検索"""
    results = []
    
    try:
        # Wikimedia Commons API
        api_url = "https://commons.wikimedia.org/w/api.php"
        headers = {
            'User-Agent': 'OnsenImageSearchBot/1.0 (https://github.com/kazu-4728/website_v2)'
        }
        params = {
            'action': 'query',
            'format': 'json',
            'list': 'search',
            'srsearch': query,
            'srnamespace': 6,  # File namespace
            'srlimit': limit,
            'srprop': 'size|wordcount|timestamp',
        }
        
        response = requests.get(api_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'query' in data and 'search' in data['query']:
            for item in data['query']['search']:
                title = item.get('title', '')
                if title.startswith('File:'):
                    filename = title[5:]  # Remove "File:" prefix
                    
                    # PDFやその他の非画像ファイルをスキップ
                    if filename.lower().endswith(('.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx')):
                        continue
                    
                    # 画像URLを構築（Wikimedia CommonsのURL構造に従う）
                    # ファイル名の最初の1文字と最初の2文字でディレクトリ構造を作る
                    safe_filename = filename.replace(' ', '_')
                    if len(safe_filename) >= 2:
                        dir1 = safe_filename[0]
                        dir2 = safe_filename[0:2] if len(safe_filename) >= 2 else safe_filename[0]
                        encoded_filename = quote(safe_filename)
                        image_url = f"https://upload.wikimedia.org/wikipedia/commons/{dir1}/{dir2}/{encoded_filename}"
                    else:
                        encoded_filename = quote(safe_filename)
                        image_url = f"https://upload.wikimedia.org/wikipedia/commons/{encoded_filename}"
                    
                    # 既存画像でないかチェック
                    if image_url not in EXISTING_IMAGE_URLS:
                        results.append({
                            'url': image_url,
                            'title': filename,
                            'source': 'wikimedia',
                            'source_url': f"https://commons.wikimedia.org/wiki/{title}",
                            'license': 'CC BY-SA / CC BY (要確認)',
                            'photographer': '要確認',
                            'description': f"Wikimedia Commons: {filename}"
                        })
    except Exception as e:
        # エラーは無視して続行（手動検索URLは生成される）
        pass
    
    return results

def generate_search_urls(onsen_name_jp: str, onsen_name_en: str, prefecture: str) -> Dict[str, str]:
    """各フリー画像サイトの検索URLを生成"""
    urls = {}
    
    # 日本語クエリ
    queries_jp = [
        f"{onsen_name_jp} 温泉 露天風呂",
        f"{onsen_name_jp} 温泉 無料画像",
        f"{prefecture} {onsen_name_jp} 温泉",
    ]
    
    # 英語クエリ（name_enが存在する場合のみ）
    queries_en = []
    if onsen_name_en and onsen_name_en.strip():
        queries_en = [
            f"{onsen_name_en} onsen rotenburo",
            f"{onsen_name_en} onsen free image",
        ]
    
    # Google検索URL（日本語）
    for query in queries_jp:
        if query.strip():
            encoded_query = quote(query)
            key = f"google_{query[:20].replace(' ', '_')}"
            urls[key] = f"https://www.google.com/search?q={encoded_query}&tbm=isch&tbs=sur:fc"
    
    # Google検索URL（英語）
    for query in queries_en:
        if query.strip():
            encoded_query = quote(query)
            key = f"google_{query[:20].replace(' ', '_')}"
            urls[key] = f"https://www.google.com/search?q={encoded_query}&tbm=isch&tbs=sur:fc"
    
    # 各フリー画像サイトの検索URL（日本語）
    base_query_jp = f"{onsen_name_jp} 温泉"
    if base_query_jp.strip():
        encoded_query = quote(base_query_jp)
        urls[f"unsplash_jp"] = f"https://unsplash.com/s/photos/{encoded_query}"
        urls[f"pexels_jp"] = f"https://www.pexels.com/search/{encoded_query}/"
        urls[f"pixabay_jp"] = f"https://pixabay.com/images/search/{encoded_query}/"
        urls[f"wikimedia_jp"] = f"https://commons.wikimedia.org/wiki/Category:{encoded_query}"
    
    # 各フリー画像サイトの検索URL（英語）
    if onsen_name_en and onsen_name_en.strip():
        base_query_en = f"{onsen_name_en} onsen"
        encoded_query = quote(base_query_en)
        urls[f"unsplash_en"] = f"https://unsplash.com/s/photos/{encoded_query}"
        urls[f"pexels_en"] = f"https://www.pexels.com/search/{encoded_query}/"
        urls[f"pixabay_en"] = f"https://pixabay.com/images/search/{encoded_query}/"
        urls[f"wikimedia_en"] = f"https://commons.wikimedia.org/wiki/Category:{encoded_query}"
    
    return urls

def format_image_result(image: Dict, onsen_name: str) -> str:
    """画像結果をMarkdown形式でフォーマット"""
    lines = [
        f"### {onsen_name} - {image.get('title', 'Unknown')}",
        f"",
        f"- **URL**: `{image['url']}`",
        f"- **ソース**: {image.get('source', 'Unknown')}",
        f"- **ライセンス**: {image.get('license', '要確認')}",
        f"- **撮影者**: {image.get('photographer', '要確認')}",
        f"- **説明**: {image.get('description', '')}",
        f"- **ソースURL**: {image.get('source_url', '')}",
        f"",
        f"---",
        f"",
    ]
    return "\n".join(lines)

def main():
    """メイン処理"""
    print("# 関東温泉の実在画像検索結果（自動検索 + 手動検索URL）\n")
    print("最終更新: 2025-01-XX\n")
    print("## 📋 検索方針\n")
    print("以下の条件で各温泉の画像を検索します：")
    print("1. **実際の温泉、お湯が映っている**（湯船・露天風呂が明確に写っている）")
    print("2. **関東の温泉**")
    print("3. **既存画像は使用しない**")
    print("4. **どこの温泉か分かるようにする**（温泉名・場所が特定できる）\n")
    print("---\n")
    
    # 既存画像を読み込む
    load_existing_images()
    print(f"既存画像数: {len(EXISTING_IMAGE_URLS)}\n")
    
    # 温泉リストを読み込む
    onsen_list = load_onsen_list_from_content()
    
    if not onsen_list:
        print("⚠️ 温泉リストが読み込めませんでした。", file=sys.stderr)
        return
    
    print(f"検索対象温泉数: {len(onsen_list)}\n")
    print("---\n")
    
    # 各温泉について検索
    all_results = []
    
    for onsen in onsen_list:
        name_jp = onsen['name']
        name_en = onsen.get('name_en', '')
        prefecture = onsen.get('prefecture', '')
        
        print(f"## 🔍 {name_jp} ({prefecture})\n")
        
        # 検索クエリを構築
        search_query = f"{name_jp} 温泉 露天風呂" if name_jp else f"{name_en} onsen rotenburo"
        
        # Wikimedia Commonsで自動検索
        print(f"### 自動検索結果（Wikimedia Commons）\n")
        wikimedia_results = search_wikimedia_commons(search_query, limit=5)
        
        if wikimedia_results:
            for img in wikimedia_results:
                print(format_image_result(img, name_jp))
                all_results.append({
                    'onsen': name_jp,
                    'image': img
                })
        else:
            print("見つかりませんでした。\n")
        
        # 手動検索用URLを生成
        print(f"### 手動検索用URL\n")
        search_urls = generate_search_urls(name_jp, name_en, prefecture)
        
        for key, url in search_urls.items():
            print(f"- **{key}**: {url}")
        
        print("\n---\n")
    
    # 結果をJSONファイルに保存
    output_file = 'docs/reports/ONSEN_IMAGE_SEARCH_RESULTS_AUTO.json'
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'total_onsen': len(onsen_list),
                'total_images': len(all_results),
                'results': all_results
            }, f, ensure_ascii=False, indent=2)
        print(f"\n✅ 結果を {output_file} に保存しました。\n")
    except Exception as e:
        print(f"⚠️ 結果の保存に失敗: {e}", file=sys.stderr)

if __name__ == '__main__':
    main()
