#!/bin/bash
# 環境変数GEMINI_API_KEYまたはGOOGLE_API_KEYを使用してGemini APIをテスト

cd /workspace

# .envファイルがあれば読み込む
if [ -f .env ]; then
    echo "Loading .env file..."
    set -a
    source .env
    set +a
fi

# APIキーを確認
API_KEY="${GEMINI_API_KEY:-$GOOGLE_API_KEY}"

if [ -z "$API_KEY" ]; then
    echo "❌ Error: GEMINI_API_KEY or GOOGLE_API_KEY is not set"
    echo ""
    echo "Please set the API key:"
    echo "  export GEMINI_API_KEY=your_api_key_here"
    echo ""
    echo "Or create .env file:"
    echo "  echo 'GEMINI_API_KEY=your_api_key_here' >> .env"
    exit 1
fi

echo "✓ API key found (length: ${#API_KEY} characters)"
echo "Testing Gemini API..."
echo ""

# 環境変数を明示的に設定してPythonスクリプトを実行
GEMINI_API_KEY="$API_KEY" \
GOOGLE_API_KEY="$API_KEY" \
PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/test-gemini-api.py
