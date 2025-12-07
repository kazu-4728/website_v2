#!/bin/bash
# .envファイルから環境変数を読み込んでスクリプトを実行

cd /workspace

# .envファイルがあれば読み込む
if [ -f .env ]; then
    echo "Loading .env file..."
    set -a
    source .env
    set +a
    echo "✓ .env file loaded"
else
    echo "⚠ .env file not found"
fi

# 環境変数を確認
if [ -n "$GEMINI_API_KEY" ]; then
    echo "✓ GEMINI_API_KEY found in environment"
elif [ -n "$GOOGLE_API_KEY" ]; then
    echo "✓ GOOGLE_API_KEY found in environment"
else
    echo "❌ No API key found"
    echo ""
    echo "Please create .env file:"
    echo "  echo 'GEMINI_API_KEY=your_key_here' >> .env"
    echo ""
    echo "Or set environment variable:"
    echo "  export GEMINI_API_KEY=your_key_here"
    exit 1
fi

echo ""
echo "Running check-api-key.py..."
echo ""

PYTHONPATH=$HOME/.local/lib/python3.12/site-packages:$PYTHONPATH \
  python3 scripts/check-api-key.py
