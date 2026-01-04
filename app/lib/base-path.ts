/**
 * basePath ユーティリティ
 * 
 * publicアセット参照時にbasePathを付与する。
 * GitHub Pages配下でも正しくアセットを参照できるようにする。
 */

/**
 * パスにbasePathを付与する
 * @param path - /で始まるパス（例: /images/placeholder/onsen.svg）
 * @returns basePathが付与されたパス
 */
export function withBasePath(path: string): string {
    // 開発時は空、本番時は /website_v2
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

    // すでにbasePathが付いている場合は二重付与を防ぐ
    if (basePath && path.startsWith(basePath)) {
        return path;
    }

    // http(s)で始まるURLはそのまま返す
    if (path.startsWith('http')) {
        return path;
    }

    return `${basePath}${path}`;
}
