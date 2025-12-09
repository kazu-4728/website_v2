#!/usr/bin/env python3
"""
Gemini APIを使用して、各温泉地の実在の温泉（湯船・露天風呂）が映っている画像を検索するスクリプト
"""

import os
import json
import google.generativeai as genai
from typing import List, Dict, Optional

# Gemini APIキーを環境変数から取得
API_KEY = os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY')

if not API_KEY:
    print("Error: GOOGLE_API_KEY or GEMINI_API_KEY environment variable is not set")
    print("Please set the API key: export GOOGLE_API_KEY=your_api_key")
    exit(1)

# Gemini APIを初期化
genai.configure(api_key=API_KEY)

def search_onsen_image(onsen_name: str, onsen_name_en: str) -> Optional[Dict]:
    """
    温泉地の実在の温泉（湯船・露天風呂）が映っている画像を検索
    
    Args:
        onsen_name: 温泉地名（日本語）
        onsen_name_en: 温泉地名（英語）
    
    Returns:
        画像情報の辞書（URL、撮影者、ライセンスなど）
    """
    prompt = f"""
以下の条件で、Wikimedia Commonsから実在の温泉（湯船・露天風呂）が映っている画像を検索してください：

温泉地名: {onsen_name} ({onsen_name_en})
検索条件:
- Wikimedia Commonsの画像であること
- 実際の温泉（湯船・露天風呂）が明確に映っていること
- その温泉地の実際の温泉であること
- ライセンスがCC BY / CC BY-SA / Public domainであること

以下の形式でJSONを返してください：
{{
  "url": "画像のURL",
  "title": "画像のタイトル",
  "author": "撮影者名",
  "license": "ライセンス",
  "licenseUrl": "ライセンスURL",
  "description": "画像の説明"
}}

見つからない場合は、nullを返してください。
"""
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        # レスポンスからJSONを抽出
        response_text = response.text.strip()
        
        # JSON部分を抽出（```json で囲まれている場合がある）
        if '```json' in response_text:
            json_start = response_text.find('```json') + 7
            json_end = response_text.find('```', json_start)
            response_text = response_text[json_start:json_end].strip()
        elif '```' in response_text:
            json_start = response_text.find('```') + 3
            json_end = response_text.find('```', json_start)
            response_text = response_text[json_start:json_end].strip()
        
        if response_text.lower() == 'null' or not response_text:
            return None
        
        result = json.loads(response_text)
        return result
    except Exception as e:
        print(f"Error searching for {onsen_name}: {e}")
        return None

def main():
    """メイン処理"""
    # 検索対象の温泉地リスト
    onsen_list = [
        {"name": "那須温泉", "name_en": "Nasu Onsen", "slug": "nasu"},
        {"name": "水上温泉", "name_en": "Minakami Onsen", "slug": "minakami"},
        {"name": "伊東温泉", "name_en": "Ito Onsen", "slug": "ito"},
        {"name": "修善寺温泉", "name_en": "Shuzenji Onsen", "slug": "shuzenji"},
        {"name": "下田温泉", "name_en": "Shimoda Onsen", "slug": "shimoda"},
        {"name": "湯河原温泉", "name_en": "Yugawara Onsen", "slug": "yugawara"},
    ]
    
    results = {}
    
    for onsen in onsen_list:
        print(f"Searching for {onsen['name']} ({onsen['name_en']})...")
        result = search_onsen_image(onsen['name'], onsen['name_en'])
        
        if result:
            results[onsen['slug']] = result
            print(f"  ✓ Found: {result.get('url', 'N/A')}")
        else:
            print(f"  ✗ Not found")
        print()
    
    # 結果をJSONファイルに保存
    output_file = 'data/gemini-image-search-results.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"Results saved to {output_file}")
    print(f"Found {len(results)} images out of {len(onsen_list)} onsen locations")

if __name__ == '__main__':
    main()
