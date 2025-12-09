#!/bin/bash
# CursorのマイシークレッツからAPIキーを読み込んで使用するスクリプト

cd /workspace

echo "Attempting to use Cursor secrets..."
echo ""

# Cursorのシークレット管理機能からAPIキーを取得を試みる
# 注意: Cursorの実装によって方法が異なる可能性があります

# 方法1: 環境変数から直接取得（Cursorが自動的に設定している場合）
if [ -n "$GOOGLE_API_KEY" ]; then
    echo "✓ GOOGLE_API_KEY found in environment (from Cursor secrets)"
    API_KEY="$GOOGLE_API_KEY"
elif [ -n "$GEMINI_API_KEY" ]; then
    echo "✓ GEMINI_API_KEY found in environment (from Cursor secrets)"
    API_KEY="$GEMINI_API_KEY"
else
    echo "❌ API key not found in environment variables"
    echo ""
    echo "Cursor secrets may not be automatically loaded into this shell session."
    echo ""
    echo "Please try one of the following:"
    echo ""
    echo "1. Export the secret manually in your current shell:"
    echo "   export GOOGLE_API_KEY=your_api_key_from_cursor_secrets"
    echo ""
    echo "2. Create .env file and load it:"
    echo "   echo 'GOOGLE_API_KEY=your_api_key_from_cursor_secrets' >> .env"
    echo "   source .env"
    echo ""
    echo "3. Check if Cursor provides a way to access secrets:"
    echo "   - Check Cursor's settings for secrets management"
    echo "   - Look for 'Secrets' or 'Environment Variables' in Cursor settings"
    echo ""
    exit 1
fi

echo ""
echo "Testing Gemini API..."
echo ""

GOOGLE_API_KEY="$API_KEY" \
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/test-gemini-api.py
