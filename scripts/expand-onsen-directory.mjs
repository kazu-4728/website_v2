import fs from 'node:fs';

const path = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const area = (id) => data.areas.find((item) => item.id === id);
const imageFor = (areaId, name) => {
  const source = area(areaId)?.image ?? data.areas[0].image;
  return { ...source, alt: `${name}の温泉イメージ` };
};

const newAreas = [
  {
    id: 'tokyo-islands', slug: 'tokyo-islands', name: '東京の島しょ温泉', prefectures: ['東京都'],
    summary: '火山島の海景色と素朴な共同浴場を楽しめる、東京の島しょ部に広がる温泉エリア。',
    image: { ...data.areas[0].image, alt: '東京の島しょ温泉のイメージ' }, onsenSlugs: ['oshima', 'shikinejima', 'hachijojima'],
  },
  {
    id: 'chiba-boso', slug: 'chiba-boso', name: '房総・九十九里', prefectures: ['千葉県'],
    summary: '海辺の夕景、黒湯、房総の里山を一度に楽しめる千葉県の温泉エリア。',
    image: { ...data.areas[0].image, alt: '房総の温泉のイメージ' }, onsenSlugs: ['tateyama', 'shirahama', 'chikura', 'iwaionsen', 'kamogawa', 'kominato', 'katsuura', 'shirako', 'yoro', 'kisarazu', 'kameyama', 'inubosaki'],
  },
  {
    id: 'saitama-west', slug: 'saitama-west', name: '埼玉・奥武蔵秩父', prefectures: ['埼玉県'],
    summary: '都心から日帰りでも訪ねやすい、秩父盆地と奥武蔵の山あいの温泉地。',
    image: { ...data.areas[4].image, alt: '埼玉の山あいの温泉イメージ' }, onsenSlugs: ['naguri', 'ryokami', 'wado', 'ogano', 'shibahara', 'arakikosen'],
  },
  {
    id: 'gunma-minakami', slug: 'gunma-minakami', name: '群馬・みなかみ', prefectures: ['群馬県'],
    summary: '谷川岳と利根川源流の自然に囲まれた、複数の温泉地を巡れる山岳エリア。',
    image: { ...data.areas[1].image, alt: 'みなかみの温泉イメージ' }, onsenSlugs: ['minakami', 'sarugakyo', 'hoshi'],
  },
  {
    id: 'tochigi-nasu', slug: 'tochigi-nasu', name: '那須・板室', prefectures: ['栃木県'],
    summary: '那須高原の自然と、古くから薬湯として親しまれる山あいの温泉を楽しむエリア。',
    image: { ...data.areas[2].image, alt: '那須・板室の温泉イメージ' }, onsenSlugs: ['nasu', 'itamuro', 'yunishigawa'],
  },
  {
    id: 'ibaraki-onsen', slug: 'ibaraki-onsen', name: '茨城・奥久慈', prefectures: ['茨城県'],
    summary: '袋田の滝や久慈川の自然と、奥久慈・県北の温泉を組み合わせる旅のエリア。',
    image: { ...data.areas[2].image, alt: '茨城・奥久慈の温泉イメージ' }, onsenSlugs: ['daigo', 'fukuroda', 'kitaibaraki', 'isohara', 'oarai', 'tsukuba'],
  },
];

const additions = [
  // 東京都：GO TOKYOが案内する島しょ部の温泉地を中心に掲載
  ['oshima', '大島温泉郷', '温泉郷', 'tokyo-islands', '東京都', '大島町観光協会', 'https://www.izu-oshima.or.jp/', '海と火山の島で、三原山の自然と温泉を組み合わせやすい島旅の温泉郷。', '火山島の景色と温泉を楽しむ大島の湯。', ['宿泊', '自然', '島旅'], ['stay', 'quiet'], '竹芝桟橋から高速ジェット船などで大島へ。島内交通と宿の送迎を確認する。'],
  ['shikinejima', '式根島温泉郷', '温泉郷', 'tokyo-islands', '東京都', '式根島観光協会', 'https://www.shikinejima.com/', '海沿いの露天風呂と島の散策を楽しめる、伊豆諸島ならではの温泉地。', '海を眺める野趣ある湯めぐり。', ['日帰り', '島旅', '海'], ['stay', 'quiet'], '竹芝桟橋または下田港から船で式根島へ。船便と入浴施設の営業状況を確認する。'],
  ['hachijojima', '八丈島温泉郷', '温泉郷', 'tokyo-islands', '東京都', '八丈島観光協会', 'https://www.hachijo.gr.jp/', '南国の植生と海景色に囲まれた、島の複数の温泉施設を楽しむエリア。', '東京から行く、海と火山の島温泉。', ['宿泊', '島旅', '自然'], ['stay', 'quiet'], '羽田空港から飛行機、または竹芝桟橋から船で八丈島へ。'],

  // 神奈川県：県観光協会の温泉特集に掲載された温泉地を追加
  ['tsurumaki', '鶴巻温泉', '温泉地', 'hakone-yugawara', '神奈川県', '秦野市観光協会', 'https://www.kanagawa-kankou.or.jp/features/onsen', '駅から歩いて楽しみやすく、都内からの日帰りにも向く温泉地。', '駅近で自然も歩ける丹沢の温泉。', ['日帰り', '駅近', 'ハイキング'], ['day-trip', 'family'], '小田急線鶴巻温泉駅から徒歩圏。周辺の旅館・日帰り施設の公式情報を確認する。'],
  ['nakagawa', '中川温泉', '温泉地', 'hakone-yugawara', '神奈川県', '山北町観光協会', 'https://www.kanagawa-kankou.or.jp/features/onsen', '丹沢湖や渓谷の自然に囲まれた、静かに過ごせる県西部の温泉地。', '丹沢の緑に囲まれた、静かな湯。', ['宿泊', '自然', '渓谷'], ['stay', 'quiet'], 'JR御殿場線谷峨駅からバス利用。宿泊施設の送迎・営業状況を確認する。'],
  ['atsugi-onsen', 'あつぎ温泉郷', '温泉郷', 'hakone-yugawara', '神奈川県', '厚木市観光協会', 'https://www.kanagawa-kankou.or.jp/features/onsen', '飯山、七沢、広沢寺、かぶと湯などを含む、厚木の山里の温泉郷。', '都心から近い山里の美肌湯。', ['日帰り', '宿泊', '山里'], ['day-trip', 'stay'], '本厚木駅や厚木ICから各温泉地へ。施設ごとのアクセスを確認する。'],
  ['jinba', '陣馬の湯', '温泉地', 'hakone-yugawara', '神奈川県', '相模原市観光協会', 'https://www.kanagawa-kankou.or.jp/features/onsen', '陣馬山の麓で、ハイキングと山あいの温泉を組み合わせられる小さな温泉地。', '山歩きのあとに立ち寄る、陣馬の秘湯。', ['日帰り', '自然', 'ハイキング'], ['day-trip', 'quiet'], 'JR藤野駅からバス・徒歩などを利用。施設の営業日と送迎を確認する。'],
  ['okuyugawara', '奥湯河原温泉', '温泉地', 'hakone-yugawara', '神奈川県', '湯河原温泉観光協会', 'https://www.yugawara.or.jp/', '渓流沿いの宿が並ぶ湯河原の奥座敷。静かな宿泊を重視する旅に向く。', '文人にも愛された湯河原の奥座敷。', ['宿泊', '静養', '渓流'], ['stay', 'quiet'], '湯河原駅からバスで奥湯河原方面へ。宿の送迎と最新の運行情報を確認する。'],
  ['hakone-sengokuhara', '仙石原温泉', '温泉地', 'hakone-yugawara', '神奈川県', '箱根町観光協会', 'https://www.hakone.or.jp/', '美術館や湿生花園と温泉を組み合わせやすい箱根北部の温泉地。', '美術館と高原の時間を楽しむ箱根。', ['宿泊', '美術館', '高原'], ['stay', 'quiet'], '箱根湯本駅からバス利用。山道があるため、宿の送迎・交通情報を確認する。'],

  // 千葉県：千葉県公式観光サイト「ちば観光ナビ」の温泉特集に掲載
  ['tateyama', 'たてやま温泉郷', '温泉郷', 'chiba-boso', '千葉県', 'たてやま温泉事業組合', 'https://tateyamacity.com/onsen/', '海や夕景、天気のよい日の富士山を望める南房総の温泉郷。', '海と夕景を望む館山の温泉郷。', ['宿泊', '海', '夕景'], ['stay', 'family'], 'JR館山駅から市内各地へ。宿泊施設ごとのアクセスを確認する。'],
  ['shirahama', '白浜温泉', '温泉地', 'chiba-boso', '千葉県', '南房総市温泉組合', 'https://minamiboso-onsen.com/', '房総半島最南端で海景色と花の名所を楽しめる温泉地。', '房総最南端の海景色と温泉。', ['宿泊', '海', '花'], ['stay', 'quiet'], 'JR館山駅・千倉駅からバス利用。季節の交通と宿の営業情報を確認する。'],
  ['chikura', '千倉温泉', '温泉地', 'chiba-boso', '千葉県', '南房総市温泉組合', 'https://minamiboso-onsen.com/', '漁師町の風情と海の幸を楽しめる南房総の温泉地。', '海の幸と漁師町を楽しむ千倉の湯。', ['宿泊', '海', '食'], ['stay', 'family'], 'JR千倉駅から温泉宿へ。宿の送迎や海沿いの道路状況を確認する。'],
  ['iwaionsen', '岩井温泉', '温泉地', 'chiba-boso', '千葉県', '南房総市温泉組合', 'https://minamiboso-onsen.com/', '内房の穏やかな海と山あいの宿を組み合わせられる南房総の温泉地。', '内房の海と里山に近い温泉。', ['宿泊', '海', '静養'], ['stay', 'quiet'], 'JR岩井駅から各宿へ。宿泊施設ごとのアクセスを確認する。'],
  ['kamogawa', '鴨川温泉', '温泉地', 'chiba-boso', '千葉県', '鴨川温泉旅館業協同組合', 'https://www.kamogawa-hotel.info/', '海辺の宿から山間の宿まで選べ、鴨川観光と組み合わせやすい温泉地。', '海辺と里山、両方を選べる鴨川の湯。', ['宿泊', '海', '家族'], ['stay', 'family'], 'JR安房鴨川駅を拠点に市内各地へ。宿の送迎を確認する。'],
  ['kominato', '小湊温泉', '温泉地', 'chiba-boso', '千葉県', '鴨川温泉旅館業協同組合', 'https://www.kamonavi.jp/kominatoonsen/', '内浦湾の景色と海沿いの宿を楽しめる、鴨川南部の温泉地。', '内浦湾を眺める海辺の温泉。', ['宿泊', '海', '家族'], ['stay', 'family'], 'JR安房小湊駅から各宿へ。施設ごとの営業情報を確認する。'],
  ['katsuura', '勝浦温泉', '温泉地', 'chiba-boso', '千葉県', '勝浦市観光協会', 'https://www.katsuura-kankou.net/', '朝市や海の幸とともに、房総の海風を感じられる温泉地。', '海風と朝市を楽しむ勝浦の温泉。', ['宿泊', '海', '食'], ['stay', 'family'], 'JR勝浦駅から市内各地へ。宿泊施設のアクセスを確認する。'],
  ['shirako', '白子温泉', '温泉地', 'chiba-boso', '千葉県', '白子町温泉ホテル協同組合', 'https://www.shirako-onsen.jp/', '九十九里浜の海水浴やスポーツと組み合わせやすい温泉地。', '九十九里の海辺で温まる白子の湯。', ['日帰り', '海', 'スポーツ'], ['day-trip', 'family'], 'JR茂原駅からバス利用。季節の交通・宿泊情報を確認する。'],
  ['yoro', '養老渓谷温泉郷', '温泉郷', 'chiba-boso', '千葉県', '養老渓谷観光協会', 'https://www.youroukeikoku.com/', '渓谷、滝、紅葉と黒湯を楽しめる房総随一の山間温泉郷。', '渓谷歩きと黒湯を楽しむ房総の温泉郷。', ['日帰り', '渓谷', '紅葉'], ['day-trip', 'quiet'], '小湊鐵道養老渓谷駅を利用。ハイキングコースと営業状況を確認する。'],
  ['kisarazu', '木更津温泉', '温泉地', 'chiba-boso', '千葉県', '龍宮城スパホテル三日月', 'https://www.mikazuki.co.jp/ryugu/', '東京湾とアクアラインを望み、首都圏から車で訪れやすい温泉施設群。', '海を望む、首都圏近郊の温泉リゾート。', ['日帰り', '家族', '海'], ['day-trip', 'family'], '東京湾アクアライン木更津金田ICからアクセス。施設の営業情報を確認する。'],
  ['kameyama', '亀山温泉', '温泉地', 'chiba-boso', '千葉県', '君津市観光協会亀山支部', 'https://www.kazusakameyama.com/', '亀山湖畔の自然と茶褐色の湯を楽しめる房総中央部の温泉地。', '湖畔の自然とチョコレート色の湯。', ['宿泊', '湖', '自然'], ['stay', 'quiet'], 'JR久留里線上総亀山駅から各施設へ。営業情報を確認する。'],
  ['inubosaki', '犬吠埼温泉郷', '温泉郷', 'chiba-boso', '千葉県', '銚子市観光協会', 'https://www.choshi-ryokan.jp/', '犬吠埼灯台と太平洋の水平線を望む、海辺の温泉郷。', '水平線を望む銚子の海辺温泉。', ['宿泊', '海', '家族'], ['stay', 'family'], '銚子電鉄犬吠駅から徒歩・送迎を利用。宿泊施設の公式情報を確認する。'],

  // 埼玉県：埼玉県公式観光サイト・各施設公式サイト
  ['naguri', '名栗温泉', '温泉地', 'saitama-west', '埼玉県', '名栗温泉 大松閣', 'https://www.taishoukaku.com/', '奥武蔵の山と川に囲まれた、都心から訪ねやすい温泉地。', '木のぬくもりと川音に包まれる奥武蔵の湯。', ['宿泊', '山', '川'], ['stay', 'quiet'], '西武池袋線飯能駅からバス利用。宿の送迎を確認する。'],
  ['ryokami', '両神温泉', '温泉地', 'saitama-west', '埼玉県', '両神温泉 国民宿舎両神荘', 'https://www.ryokamiso-saitama.jp/', '両神山の麓、里山と清流に囲まれた小鹿野町の温泉地。', '里山と清流を味わう両神の温泉。', ['宿泊', '自然', '里山'], ['stay', 'quiet'], '西武秩父駅・秩父鉄道三峰口駅からバス利用。'],
  ['wado', '和銅鉱泉', '温泉地', 'saitama-west', '埼玉県', '秩父観光協会', 'https://navi.city.chichibu.lg.jp/', '和銅遺跡や秩父の歴史散策と組み合わせやすい温泉地。', '歴史と里山を歩く秩父の鉱泉。', ['宿泊', '歴史', '里山'], ['stay', 'quiet'], '秩父鉄道和銅黒谷駅周辺。宿泊施設の送迎を確認する。'],
  ['ogano', '小鹿野温泉', '温泉地', 'saitama-west', '埼玉県', '小鹿野町観光協会', 'https://www.kanko-ogano.jp/', '歌舞伎や札所巡りと里山の宿を楽しめる秩父西部の温泉地。', '文化と里山をめぐる小鹿野の湯。', ['宿泊', '文化', '里山'], ['stay', 'quiet'], '西武秩父駅からバス・車でアクセス。'],
  ['shibahara', '柴原温泉', '温泉地', 'saitama-west', '埼玉県', '秩父観光協会', 'https://navi.city.chichibu.lg.jp/', '秩父の山あいで、静かな宿時間を過ごしやすい温泉地。', '秩父の森で静かに過ごす温泉。', ['宿泊', '静養', '山'], ['stay', 'quiet'], '秩父鉄道武州日野駅から各宿へ。'],
  ['arakikosen', '新木鉱泉', '温泉地', 'saitama-west', '埼玉県', '新木鉱泉 佐久良荘', 'https://www.arakikosen.com/', '江戸時代から続く秩父の鉱泉宿で、歴史と温泉を楽しめる。', '江戸時代から続く秩父の鉱泉宿。', ['宿泊', '歴史', '静養'], ['stay', 'quiet'], '西武秩父駅から送迎・タクシーを利用。'],

  // 群馬県：県観光協会の「5大温泉」等を具体化
  ['minakami', '水上温泉', '温泉地', 'gunma-minakami', '群馬県', 'みなかみ町観光協会', 'https://www.enjoy-minakami.jp/', '谷川岳と利根川源流の自然、駅からのアクセスを組み合わせやすい温泉地。', '谷川岳の麓で過ごす水上時間。', ['宿泊', '自然', '渓谷'], ['stay', 'family'], '上越新幹線上毛高原駅またはJR水上駅を利用。'],
  ['sarugakyo', '猿ヶ京温泉', '温泉地', 'gunma-minakami', '群馬県', '猿ヶ京温泉旅館協同組合', 'https://www.sarugakyo.co.jp/', '赤谷湖を望む山あいで、宿にこもって過ごしやすい温泉地。', '赤谷湖を望む静かな山の温泉。', ['宿泊', '湖', '静養'], ['stay', 'quiet'], 'JR後閑駅・上毛高原駅からバス利用。'],
  ['hoshi', '法師温泉', '温泉地', 'gunma-minakami', '群馬県', '法師温泉 長寿館', 'https://hoshi-onsen.com/', '足元湧出の湯と歴史的建築を守る、みなかみの山あいの秘湯。', '文化財の宿で味わう足元湧出の湯。', ['宿泊', '秘湯', '歴史'], ['stay', 'quiet'], '上毛高原駅・水上駅からバスまたは宿の送迎を利用。'],
  ['oigami', '老神温泉', '温泉地', 'gunma-meito', '群馬県', '老神温泉観光協会', 'https://www.oigami.net/', '片品渓谷沿いに湧く、尾瀬や日光観光と組み合わせやすい温泉地。', '渓谷と伝説に出会う老神の湯。', ['宿泊', '渓谷', '自然'], ['stay', 'quiet'], 'JR沼田駅からバス利用。'],
  ['manza', '万座温泉', '温泉地', 'gunma-meito', '群馬県', '万座温泉観光協会', 'https://www.manzaonsen.gr.jp/', '標高の高い山岳温泉で、白濁湯と雲上の景色を楽しめる。', '標高1800mの雲上温泉。', ['宿泊', '高原', '硫黄泉'], ['stay', 'quiet'], '長野・軽井沢方面からのバスや車を利用。冬季の道路情報を確認する。'],

  // 栃木県：那須・板室・湯西川を追加
  ['nasu', '那須温泉', '温泉地', 'tochigi-nasu', '栃木県', '那須町観光協会', 'https://www.nasukogen.org/', '那須高原の自然、ロープウェイ、牧場と組み合わせやすい歴史ある温泉地。', '高原の自然と湯けむりを楽しむ那須。', ['宿泊', '高原', '自然'], ['stay', 'family'], 'JR那須塩原駅からバス、または那須ICから車で各温泉へ。'],
  ['itamuro', '板室温泉', '温泉地', 'tochigi-nasu', '栃木県', '黒磯観光協会', 'https://www.kuroiso-kankou.org/itamuro/', '那須塩原の山あいで、ぬるめの薬湯と静かな宿時間を楽しめる温泉地。', '古くから薬湯として親しまれる板室の湯。', ['宿泊', '静養', '山'], ['stay', 'quiet'], '那須塩原駅からバスまたは車を利用。'],
  ['yunishigawa', '湯西川温泉', '温泉地', 'tochigi-nasu', '栃木県', '湯西川温泉旅館協同組合', 'https://www.yunishigawa.com/', '平家落人伝説と渓谷の自然に囲まれた、日光市の山間温泉地。', '囲炉裏文化と渓谷を楽しむ秘湯。', ['宿泊', '歴史', '渓谷'], ['stay', 'quiet'], '東武鬼怒川線鬼怒川温泉駅からバス利用。冬季の道路情報を確認する。'],

  // 茨城県：大子町・県北・県央の公式観光導線
  ['daigo', '大子温泉', '温泉地', 'ibaraki-onsen', '茨城県', '大子町観光協会', 'https://www.daigo-kanko.jp/', '袋田の滝、久慈川、奥久慈の食と組み合わせやすい大子町の温泉地。', '滝と渓谷と温泉を巡る奥久慈の旅。', ['宿泊', '自然', '渓谷'], ['stay', 'family'], 'JR水郡線常陸大子駅を利用。宿泊施設の送迎を確認する。'],
  ['fukuroda', '袋田温泉', '温泉地', 'ibaraki-onsen', '茨城県', '大子町観光協会', 'https://www.daigo-kanko.jp/', '日本三名瀑の袋田の滝と組み合わせる、奥久慈を代表する温泉地。', '袋田の滝と渓流露天を楽しむ温泉。', ['宿泊', '滝', '自然'], ['stay', 'family'], 'JR袋田駅または常陸大子駅からバス・車を利用。'],
  ['kitaibaraki', '北茨城温泉郷', '温泉郷', 'ibaraki-onsen', '茨城県', '北茨城市観光協会', 'https://www.kitaibarakishi-kankokyokai.gr.jp/page/dir000005.html', '太平洋の海景色と海の幸を楽しめる県北の温泉郷。', '太平洋を望む海辺の温泉郷。', ['宿泊', '海', '食'], ['stay', 'family'], 'JR磯原駅・大津港駅周辺の宿を利用。'],
  ['isohara', '磯原温泉', '温泉地', 'ibaraki-onsen', '茨城県', '北茨城市観光協会', 'https://www.kitaibarakishi-kankokyokai.gr.jp/page/dir000005.html', '五浦海岸や岡倉天心ゆかりの文化と合わせやすい海辺の温泉地。', '海岸の景色と文化を訪ねる磯原の湯。', ['宿泊', '海', '文化'], ['stay', 'quiet'], 'JR磯原駅から市内各地へ。'],
  ['oarai', '大洗温泉', '温泉地', 'ibaraki-onsen', '茨城県', '大洗観光協会', 'https://www.oarai-info.jp/', '海水浴場、港、海鮮と組み合わせやすい県央の海辺の温泉。', '海と港町を楽しむ大洗の湯。', ['日帰り', '海', '家族'], ['day-trip', 'family'], '鹿島臨海鉄道大洗駅から各施設へ。'],
  ['tsukuba', '筑波山温泉', '温泉地', 'ibaraki-onsen', '茨城県', 'つくば観光コンベンション協会', 'https://www.ttca.jp/', '筑波山の登山・ケーブルカー・夜景と組み合わせやすい山の温泉地。', '山歩きと眺望を楽しむ筑波山の湯。', ['日帰り', '山', '家族'], ['day-trip', 'family'], 'つくば駅から直行バス、または車で筑波山方面へ。'],
];

const existingSlugs = new Set(data.onsens.map((item) => item.slug));
const areaIds = new Set(data.areas.map((item) => item.id));
for (const item of newAreas) {
  if (!areaIds.has(item.id)) data.areas.push(item);
}

for (const [slug, name, kind, areaId, prefecture, officialName, officialUrl, summary, catchcopy, tags, useCases, access] of additions) {
  if (existingSlugs.has(slug)) continue;
  data.onsens.push({
    slug, name, kind, areaId, prefecture, officialName, officialUrl,
    verifiedAt: '2026-08-14', summary, catchcopy, tags,
    springTypes: ['温泉地の詳細は公式サイトで確認'], useCases,
    access, image: imageFor(areaId, name),
  });
}

for (const item of data.areas) {
  item.onsenSlugs = item.onsenSlugs.filter((slug, index, list) => list.indexOf(slug) === index);
  for (const onsen of data.onsens.filter((entry) => entry.areaId === item.id)) {
    if (!item.onsenSlugs.includes(onsen.slug)) item.onsenSlugs.push(onsen.slug);
  }
}

for (const item of data.onsens) {
  item.officialUrl = item.officialUrl.replace(/\/$/, '') + '/';
}
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Expanded directory to ${data.areas.length} areas and ${data.onsens.length} onsen entries.`);
console.log(data.areas.map((item) => `${item.name}: ${item.onsenSlugs.length}`).join('\n'));
