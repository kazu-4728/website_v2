/**
 * 週替わり温泉ローテーションシステム
 * 30箇所の温泉データから、週番号に基づいて自動的にピックアップする
 */

import onsenData from '../../data/unsplash-onsen-images.json';

/**
 * 現在の週番号を取得（ISO週番号ベースで計算し、30箇所をローテーション）
 *
 * ISO 8601 に基づく週番号:
 * - 週の開始は月曜日
 * - 年の最初の木曜日を含む週が第1週
 */
export function getCurrentWeekNumber(): number {
  const now = new Date();

  // 時刻の影響を排除するため、UTC ベースの日付に変換
  const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  // 現在の週の「木曜日」に移動（ISO年を決定するため）
  const dayOfWeek = utcDate.getUTCDay() || 7; // 日曜(0)を7として扱う
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayOfWeek);

  // ISO年の開始日（1月1日、UTC）
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));

  // 経過日数（0ベース）を取得し、週番号を算出
  const diffInDays = Math.floor((utcDate.getTime() - yearStart.getTime()) / 86400000);
  const weekNumber = Math.ceil((diffInDays + 1) / 7);

  return weekNumber;
}

/**
 * 週番号に基づいて温泉をピックアップ（30箇所を順繰りに）
 */
export function getWeeklyOnsen() {
  const weekNumber = getCurrentWeekNumber();
  const index = (weekNumber - 1) % 30; // 0-29のインデックス
  return onsenData.images[index];
}

/**
 * 週替わりブログポストを生成
 */
export function generateWeeklyBlogPost() {
  const onsen = getWeeklyOnsen();
  const weekNumber = getCurrentWeekNumber();
  
  // 季節を判定
  const month = new Date().getMonth() + 1;
  let season = '冬';
  let seasonalTip = '雪見風呂と温泉の湯気が織りなす幻想的な風景';
  
  if (month >= 3 && month <= 5) {
    season = '春';
    seasonalTip = '桜や新緑を眺めながらの露天風呂';
  } else if (month >= 6 && month <= 8) {
    season = '夏';
    seasonalTip = '避暑地での涼やかな湯浴み';
  } else if (month >= 9 && month <= 11) {
    season = '秋';
    seasonalTip = '紅葉に染まる渓谷と露天風呂';
  }

  return {
    slug: `weekly-pickup-week${weekNumber}`,
    title: `【旬】${season}の名湯「${onsen.name}」で極上の湯浴みを`,
    excerpt: `${onsen.description}今週は${onsen.location}の秘湯へ。`,
    date: new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.'),
    readTime: '4 min',
    category: '今週の推し湯',
    image: onsen.imgUrl.replace('w=1000', 'w=1200'),
    content: `## 今週のベストスポット：${onsen.name}

${season}も本格化し、関東近郊で今最もおすすめなのが${onsen.location}の${onsen.name}です。

### なぜ今週なのか？

${onsen.description}

この時期ならではの${seasonalTip}をお楽しみいただけます。

### 楽しみ方のコツ

- **ベストタイミング**: 週末の早朝または平日の午後が比較的空いています
- **服装**: ${season}の気候に合わせて、温度調節しやすい服装がおすすめ
- **入浴法**: 分割入浴（5〜10分入浴→休憩）で、湯あたりを防ぎましょう

### アクセス

${onsen.location}${onsen.name}は、都心からのアクセスも良好。日帰りでも十分に楽しめます。

---

**※ このおすすめは毎週自動更新されます。来週は別の温泉地をご紹介します！**`,
    onsen: {
      id: onsen.id,
      slug: onsen.slug,
      name: onsen.name,
      location: onsen.location,
    },
  };
}

/**
 * ブログポストに週替わりデータを適用
 */
export function resolveWeeklyRotation(posts: any[]) {
  return posts.map((post) => {
    if (post.useWeeklyRotation) {
      // useWeeklyRotation フラグがある場合は、週替わりデータを生成
      return generateWeeklyBlogPost();
    }
    return post;
  });
}
