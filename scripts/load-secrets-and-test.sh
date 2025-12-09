#!/bin/bash
# CursorのマイシークレッツからAPIキーを読み込んでGemini APIをテストするスクリプト

cd /workspace

echo "Checking for API keys in various sources..."
echo ""

# 1. 環境変数から確認
if [ -n "$GOOGLE_API_KEY" ]; then
    echo "✓ GOOGLE_API_KEY found in environment variables"
    API_KEY="$GOOGLE_API_KEY"
elif [ -n "$GEMINI_API_KEY" ]; then
    echo "✓ GEMINI_API_KEY found in environment variables"
    API_KEY="$GEMINI_API_KEY"
else
    echo "❌ No API key found in environment variables"
    echo ""
    echo "Please set the API key using one of the following methods:"
    echo ""
    echo "1. In your current shell session:"
    echo "   export GOOGLE_API_KEY=your_api_key_here"
    echo ""
    echo "2. Create .env file:"
    echo "   echo 'GOOGLE_API_KEY=your_api_key_here' >> .env"
    echo "   source .env"
    echo ""
    echo "3. If using Cursor's secrets management:"
    echo "   - Make sure the secret is accessible in your environment"
    echo "   - Or export it manually: export GOOGLE_API_KEY=\$(cursor-secrets get GOOGLE_API_KEY)"
    echo ""
    exit 1
fi

echo ""
echo "Testing Gemini API with the API key..."
echo ""

# Pythonスクリプトに環境変数を渡してテスト
GOOGLE_API_KEY="$API_KEY" \
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/test-gemini-api.py
