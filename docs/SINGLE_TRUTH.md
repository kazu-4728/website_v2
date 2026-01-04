# SINGLE_TRUTH.md - プロジェクト唯一の公式ドキュメント

## 目的
GitHub Pages + Next.js static export による温泉紹介サイト（関東）

## データソース（SSOT）
| ファイル                       | 役割                                                          |
| ------------------------------ | ------------------------------------------------------------- |
| `data/onsen-catalog.json`      | 温泉マスターデータ                                            |
| `data/onsen-image-stock.json`  | **Strict**: ローカル画像パスのみ（外部URL禁止）               |
| `data/onsen-image-master.json` | **Warn**: 参照用レガシー台帳（外部URL許容、UIでは使用しない） |
| `data/raw/`                    | 候補収集データ（開発用）                                      |

## 画像ポリシー
- **Stock**: 外部URL（http/https）は禁止。ローカルパス `/images/...` のみ許可
- **Master**: 外部URLは警告のみ（ビルド失敗させない）
- **UI層**: `http`で始まるURLは `FALLBACK_IMAGE` へ強制フォールバック

## コマンド
```bash
npm ci                      # 依存関係インストール
npm run dev                 # 開発サーバー
npm run build               # 本番ビルド
npm run verify:assets-policy # 資産ポリシーチェック
```
