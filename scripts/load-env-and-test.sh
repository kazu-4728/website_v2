#!/bin/bash
# .envファイルから環境変数を読み込んでGemini APIをテストするスクリプト

cd /workspace

# .envファイルが存在する場合は読み込む
if [ -f .env ]; then
    echo "Loading .env file..."
    set -a
    source .env
    set +a
fi

# 環境変数を確認
if [ -n "$GOOGLE_API_KEY" ] || [ -n "$GEMINI_API_KEY" ]; then
    echo "✓ API key found (length: $(echo ${GOOGLE_API_KEY:-$GEMINI_API_KEY} | wc -c) characters)"
    echo "Testing Gemini API..."
    echo ""
    
    PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
      python3 scripts/test-gemini-api.py
else
    echo "❌ API key is not set"
    echo ""
    echo "Please set the API key using one of the following methods:"
    echo ""
    echo "1. Environment variable:"
    echo "   export GOOGLE_API_KEY=your_api_key_here"
    echo ""
    echo "2. .env file:"
    echo "   echo 'GOOGLE_API_KEY=your_api_key_here' >> .env"
    echo ""
    echo "Then run this script again."
    exit 1
fi
