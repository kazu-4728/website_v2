/**
 * 週替わり温泉ローテーションシステム
 * 温泉データから、週番号に基づいて自動的にピックアップする
 */

import onsenCatalogData from '../../data/onsen-catalog.json';

const onsenList = Object.values(onsenCatalogData as Record<string, any>);

/**
 * 現在の週番号を取得（ISO週番号ベースで計算）
 */
export function getCurrentWeekNumber(): number {
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayOfWeek = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayOfWeek);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const diffInDays = Math.floor((utcDate.getTime() - yearStart.getTime()) / 86400000);
  const weekNumber = Math.ceil((diffInDays + 1) / 7);
  return weekNumber;
}

/**
 * 週番号に基づいて温泉をピックアップ
 */
export function getWeeklyOnsen() {
  const weekNumber = getCurrentWeekNumber();
  const images = onsenList;
  if (!images || images.length === 0) return null;
  const index = (weekNumber - 1) % images.length;
  return images[index];
}

/**
 * 週替わりブログポストを生成
 */
export function generateWeeklyBlogPost() {
  const onsen = getWeeklyOnsen();
  if (!onsen) return null;
  const weekNumber = getCurrentWeekNumber();

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
    excerpt: `${onsen.description} 今週は${onsen.location}の秘湯へ。`,
    date: new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.'),
    readTime: '4 min',
    category: '今週の推し湯',
    image: onsen.images?.[0]?.url || 'https://images.unsplash.com/photo-1596205838031-643501178619?auto=format&fit=crop&q=80&w=1000', // ignore-hardcode
    content: `## 今週のベストスポット：${onsen.name}\n\n${season}も本格化し、関東近郊で今最もおすすめなのが${onsen.location}の${onsen.name}です。\n\n### なぜ今週なのか？\n\n${onsen.description}\n\nこの時期ならではの${seasonalTip}をお楽しみいただけます。\n\n### 楽しみ方のコツ\n\n- **ベストタイミング**: 週末の早朝または平日の午後が比較的空いています\n- **入浴法**: 分割入浴（5〜10分入浴→休憩）で、湯あたりを防ぎましょう\n\n### アクセス\n\n${onsen.location}${onsen.name}は、都心からのアクセスも良好。日帰りでも十分に楽しめます。\n\n---\n\n**※ このおすすめは毎週自動更新されます。来週は別の温泉地をご紹介します！**`,
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
      const weeklyPost = generateWeeklyBlogPost();
      return weeklyPost || post;
    }
    return post;
  });
}
