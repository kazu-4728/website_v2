#!/usr/bin/env python3
"""
Gemini APIの動作確認スクリプト
APIキーは環境変数から取得し、絶対に外部に漏洩しないようにする
"""

import os
import sys
import google.generativeai as genai

# APIキーを環境変数から取得（ログに出力しない）
API_KEY = os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY')

if not API_KEY:
    print("Error: GOOGLE_API_KEY or GEMINI_API_KEY environment variable is not set")
    print("Please set the API key: export GOOGLE_API_KEY=your_api_key")
    sys.exit(1)

# APIキーの存在確認（キー自体は出力しない）
print(f"✓ API key found (length: {len(API_KEY)} characters)")

try:
    # Gemini APIを初期化
    genai.configure(api_key=API_KEY)
    
    # モデルを取得
    model = genai.GenerativeModel('gemini-pro')
    
    # 簡単なテストクエリ
    test_prompt = "Wikimedia Commonsから、箱根温泉の露天風呂（rotenburo）が映っている画像のURLを1つだけ返してください。URLのみを返してください。"
    
    print("Testing Gemini API connection...")
    response = model.generate_content(test_prompt)
    
    print("✓ Gemini API connection successful")
    print(f"Response preview: {response.text[:100]}...")
    
    # 画像検索のテスト
    print("\nTesting image search capability...")
    search_prompt = """
以下の条件で、Wikimedia Commonsから実在の温泉（湯船・露天風呂）が映っている画像を検索してください：

温泉地名: 箱根温泉 (Hakone Onsen)
検索条件:
- Wikimedia Commonsの画像であること
- 実際の温泉（湯船・露天風呂）が明確に映っていること
- ライセンスがCC BY / CC BY-SA / Public domainであること

画像のURLを1つだけ返してください。URLのみを返してください。
"""
    
    search_response = model.generate_content(search_prompt)
    print("✓ Image search test completed")
    print(f"Search result preview: {search_response.text[:200]}...")
    
    print("\n✅ Gemini API is working correctly!")
    print("You can now use scripts/search-onsen-images-gemini.py to search for onsen images.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("Please check your API key and network connection.")
    sys.exit(1)
