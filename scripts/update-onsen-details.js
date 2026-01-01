/**
 * 主要5温泉地の詳細データを onsen-catalog.json に追記するスクリプト
 * 
 * 使用方法: node scripts/update-onsen-details.js
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../data/onsen-catalog.json');

// 詳細データ定義（主要5温泉地）
const DETAILS = {
    kusatsu: {
        region: {
            prefecture: '群馬県',
            area: '草津',
            coordinates: { lat: 36.6228, lng: 138.5961 }
        },
        onsen: {
            springTypes: ['酸性泉', '硫黄泉'],
            ph: 2.1,
            temperature: 51, // 源泉温度平均
            flowRate: '32,300L/分（日本一）',
            effects: ['皮膚病', '神経痛', '糖尿病', '高血圧症'],
            characteristics: ['日本三名泉', '湯もみ', '時間湯', '強酸性'],
            waterQuality: '無色透明または白濁'
        },
        access: {
            nearestStation: {
                name: '長野原草津口駅',
                line: 'JR吾妻線',
                busTime: 25,
                busName: 'JRバス関東'
            },
            fromTokyo: {
                byTrain: {
                    time: 150,
                    route: ['上野駅', '長野原草津口駅'],
                    description: '特急草津・四万号で直通'
                },
                byCar: {
                    time: 180,
                    distance: 160,
                    icName: '渋川伊香保IC',
                    description: '関越自動車道経由'
                },
                byBus: {
                    time: 240,
                    terminal: 'バスタ新宿',
                    description: '上州ゆめぐり号'
                }
            }
        },
        accommodation: {
            dayTripAvailable: true,
            dayTripFacilities: ['大滝乃湯', '西の河原露天風呂', '御座之湯'],
            features: ['湯畑周辺', 'ベルツ通り', '西の河原公園']
        },
        content: {
            shortDescription: '自然湧出量日本一を誇る、日本を代表する名湯。強酸性のお湯は殺菌力が高く、古くから「恋の病以外効かない」と言われてきました。',
            longDescription: '## 圧倒的な湯量を誇る日本三名泉\n\n草津温泉のシンボル「湯畑」からは、毎分4000リットルもの温泉が湧き出ています。もう一つの源泉「万代鉱」などを合わせると毎分3万2300リットル以上と、自然湧出量は日本一を誇ります。\n\n### 伝統の「湯もみ」\n\n源泉温度が高いため、水を加えずに温度を下げる伝統的な方法が「湯もみ」です。「草津よいとこ一度はおいで」の草津節に合わせて木の板でお湯をかき混ぜる光景は、草津ならではの文化です。',
            highlights: ['夜の湯畑ライトアップ', '西の河原公園の巨大露天風呂', '湯もみショー']
        }
    },
    hakone: {
        region: {
            prefecture: '神奈川県',
            area: '箱根',
            coordinates: { lat: 35.2333, lng: 139.1039 }
        },
        onsen: {
            springTypes: ['単純温泉', '硫黄泉', '塩化物泉', '硫酸塩泉'],
            ph: 8.2, // 場所により大きく異なるが代表値
            effects: ['神経痛', '関節痛', '冷え性', '疲労回復'],
            characteristics: ['箱根十七湯', '多彩な泉質', '観光地へのアクセス良'],
            waterQuality: 'エリアにより透明、白濁など様々'
        },
        access: {
            nearestStation: {
                name: '箱根湯本駅',
                line: '小田急線',
                walkingTime: 0
            },
            fromTokyo: {
                byTrain: {
                    time: 85,
                    route: ['新宿駅', '箱根湯本駅'],
                    description: '小田急ロマンスカー'
                },
                byCar: {
                    time: 90,
                    distance: 85,
                    icName: '箱根口IC',
                    description: '小田原厚木道路経由'
                }
            }
        },
        accommodation: {
            dayTripAvailable: true,
            features: ['高級旅館', 'リゾートホテル', 'オーベルジュ']
        },
        content: {
            shortDescription: '都心から最も近い温泉リゾート。箱根十七湯と呼ばれる多彩な温泉地があり、美術館や自然アクティビティも充実しています。',
            longDescription: '## 多彩な魅力を持つ「箱根十七湯」\n\n箱根への玄関口である「箱根湯本」、レトロな雰囲気の「宮ノ下」、高級別荘地「強羅」、白濁湯の「仙石原」、芦ノ湖畔の「元箱根」など、エリアごとに全く異なる表情を見せます。\n\n### 観光と温泉の融合\n\n登山鉄道、ケーブルカー、ロープウェイ、海賊船と乗り物を乗り継ぐ「箱根ゴールデンコース」を巡りながら、各地で温泉を楽しむのが定番のスタイルです。',
            highlights: ['芦ノ湖と富士山の絶景', '大涌谷の黒たまご', '箱根彫刻の森美術館']
        }
    },
    kinugawa: {
        region: {
            prefecture: '栃木県',
            area: '日光・鬼怒川',
            coordinates: { lat: 36.8373, lng: 139.7155 }
        },
        onsen: {
            springTypes: ['アルカリ性単純温泉'],
            ph: 8.6,
            temperature: 41,
            effects: ['神経痛', '五十肩', '疲労回復', '健康増進'],
            characteristics: ['渓谷美', '美肌の湯', '大型ホテル'],
            waterQuality: '無色透明'
        },
        access: {
            nearestStation: {
                name: '鬼怒川温泉駅',
                line: '東武鬼怒川線',
                walkingTime: 5
            },
            fromTokyo: {
                byTrain: {
                    time: 120,
                    route: ['浅草駅/新宿駅', '鬼怒川温泉駅'],
                    description: '特急スペーシア・リバティ'
                }
            }
        },
        accommodation: {
            dayTripAvailable: true,
            features: ['渓谷沿いの客室', '大型温泉ホテル']
        },
        content: {
            shortDescription: '鬼怒川の渓谷美を望む、関東有数の温泉地。アルカリ性の単純温泉は肌に優しく、「傷は川治、火傷は滝（鬼怒川）」と称されてきました。',
            longDescription: '## 渓谷と一体化した温泉地\n\n鬼怒川の両岸に大型ホテルや旅館が立ち並ぶ景観が特徴的です。客室や露天風呂からは、四季折々の渓谷美を眺めることができます。\n\n### 周辺アクティビティ\n\n鬼怒川ライン下りや、日光江戸村、東武ワールドスクウェアなどのテーマパークも近く、家族連れにも人気のエリアです。',
            highlights: ['鬼怒川ライン下り', '鬼怒楯岩大吊橋', 'SL大樹']
        }
    },
    nasu: {
        region: {
            prefecture: '栃木県',
            area: '那須',
            coordinates: { lat: 37.0934, lng: 139.9984 }
        },
        onsen: {
            springTypes: ['硫黄泉', '単純酸性泉', '弱アルカリ性単純泉'],
            effects: ['皮膚病', '胃腸病', '婦人病', '疲労回復'],
            characteristics: ['那須七湯', '高原リゾート', '歴史ある鹿の湯'],
            waterQuality: '白濁（鹿の湯）など多彩'
        },
        access: {
            nearestStation: {
                name: '那須塩原駅',
                line: '東北新幹線',
                busTime: 40
            },
            fromTokyo: {
                byTrain: {
                    time: 75,
                    route: ['東京駅', '那須塩原駅'],
                    description: '東北新幹線 なすの'
                }
            }
        },
        accommodation: {
            dayTripAvailable: true,
            features: ['高原ペンション', 'リゾートホテル', '貸別荘']
        },
        content: {
            shortDescription: '那須御用邸もあるロイヤルリゾート。開湯1380年の歴史を持つ「鹿の湯」を中心に、那須七湯と呼ばれる異なる源泉が点在しています。',
            longDescription: '## 1380年の歴史「鹿の湯」\n\n那須温泉のシンボルであり、栃木県最古の温泉です。41度から48度まで温度の異なる浴槽を選んで入浴する独特のスタイル（かぶり湯）が有名です。\n\n### 那須七湯めぐり\n\n鹿の湯（那須湯本）、大丸、北、弁天、高雄、八幡、三斗小屋と、標高や泉質の異なる7つの温泉があり、湯めぐりが楽しめます。',
            highlights: ['鹿の湯', '殺生石', '那須ロープウェイ']
        }
    },
    ikaho: {
        region: {
            prefecture: '群馬県',
            area: '伊香保',
            coordinates: { lat: 36.4988, lng: 138.9221 }
        },
        onsen: {
            springTypes: ['硫酸塩泉（黄金の湯）', '単純温泉（白銀の湯）'],
            ph: 6.4,
            effects: ['貧血', '神経痛', '美肌', '疲労回復'],
            characteristics: ['石段街', '黄金の湯', '白銀の湯'],
            waterQuality: '茶褐色（黄金）と無色透明（白銀）'
        },
        access: {
            nearestStation: {
                name: '渋川駅',
                line: 'JR上越線',
                busTime: 25
            },
            fromTokyo: {
                byBus: {
                    time: 150,
                    terminal: 'バスタ新宿',
                    description: '上州ゆめぐり号'
                }
            }
        },
        accommodation: {
            dayTripAvailable: true,
            features: ['石段街沿いの宿', '老舗旅館']
        },
        content: {
            shortDescription: '365段の石段街がシンボルの情緒ある温泉地。鉄分を含み茶褐色をした「黄金の湯」と、近年湧出した無色透明の「白銀の湯」の2種類が楽しめます。',
            longDescription: '## 石段街の風情\n\n戦国時代に整備されたといわれる石段の両脇には、土産物屋や射的場、温泉饅頭屋が並び、浴衣姿での散策が絵になります。\n\n### 黄金の湯と白銀の湯\n\n古くから親しまれてきた茶褐色の「黄金の湯」は子宝の湯としても知られます。一方「白銀の湯」は1996年に確認された新しい源泉で、美肌効果があるとされています。',
            highlights: ['伊香保石段街', '河鹿橋（紅葉の名所）', '伊香保露天風呂']
        }
    }
};

async function main() {
    console.log('Updating onsen details...');

    // カタログ読み込み
    let catalog;
    try {
        const rawData = fs.readFileSync(CATALOG_PATH, 'utf8');
        catalog = JSON.parse(rawData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Data file not found, waiting for the first script to finish might clear this up if file is locked.');
        }
        console.error('Failed to read onsen-catalog.json:', error);
        process.exit(1);
    }

    let updatedCount = 0;

    for (const [id, details] of Object.entries(DETAILS)) {
        if (catalog[id]) {
            // 既存データを保持しつつ、詳細データをマージ
            // imagesやnameなどの既存フィールドは上書きされないよう注意
            catalog[id] = {
                ...catalog[id],
                ...details,
                // ネストされたオブジェクトのマージが必要な場合、本来はdeep mergeすべきだが、
                // 今回はcatalog[id]にはトップレベルのプリミティブとimages配列しかない前提なので、
                // detailsのregion, onsenなどがそのまま入ればOK
                // ただし、content.jsonから持ってきた既存のdescriptionがある場合は、
                // details.content.shortDescription として活用するか、上書きするか検討
                // 今回は実装計画に基づき、新しい詳細データ(details)を優先する
            };

            // 既存のdescriptionがあれば、shortDescriptionとして確保（もし無ければ）
            if (!catalog[id].content.shortDescription && catalog[id].description) {
                catalog[id].content.shortDescription = catalog[id].description;
            }

            updatedCount++;
            console.log(`Updated details for ${id}`);
        } else {
            console.warn(`Onsen ID ${id} not found in catalog.`);
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
        console.log(`Successfully updated details for ${updatedCount} locations.`);
    } else {
        console.log('No updates made.');
    }
}

main();
