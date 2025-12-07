#!/usr/bin/env python3
"""
環境変数のAPIキーを確認するスクリプト（キー自体は出力しない）
"""

import os
import sys

# 環境変数からAPIキーを取得
google_key = os.getenv('GOOGLE_API_KEY')
gemini_key = os.getenv('GEMINI_API_KEY')

print("Checking for API keys in environment variables...")
print()

if google_key:
    print(f"✓ GOOGLE_API_KEY is set (length: {len(google_key)} characters)")
    print(f"  First 4 chars: {google_key[:4]}...")
    print(f"  Last 4 chars: ...{google_key[-4:]}")
elif gemini_key:
    print(f"✓ GEMINI_API_KEY is set (length: {len(gemini_key)} characters)")
    print(f"  First 4 chars: {gemini_key[:4]}...")
    print(f"  Last 4 chars: ...{gemini_key[-4:]}")
else:
    print("❌ No API key found in environment variables")
    print()
    print("Available environment variables containing 'API' or 'KEY':")
    for key, value in os.environ.items():
        if 'API' in key.upper() or 'KEY' in key.upper():
            print(f"  {key}=***HIDDEN***")
    print()
    print("Please set the API key:")
    print("  export GOOGLE_API_KEY=your_api_key_here")
    print("  or")
    print("  export GEMINI_API_KEY=your_api_key_here")
    sys.exit(1)

print()
print("Testing Gemini API import...")
try:
    import google.generativeai as genai
    print("✓ google.generativeai imported successfully")
except ImportError as e:
    print(f"❌ Failed to import google.generativeai: {e}")
    print("Please install: pip3 install google-generativeai")
    sys.exit(1)

print()
print("Testing Gemini API connection...")
try:
    api_key = google_key or gemini_key
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say 'API test successful' if you can read this.")
    print("✓ Gemini API connection successful")
    print(f"  Response: {response.text.strip()}")
except Exception as e:
    print(f"❌ Gemini API connection failed: {e}")
    sys.exit(1)

print()
print("✅ All checks passed! Gemini API is ready to use.")
