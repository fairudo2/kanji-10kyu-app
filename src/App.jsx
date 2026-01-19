// 漢検8級（小3）サンプルデータ（最初の10問）
const kanjiList = [
  // --- ステージ1 (ア行〜カ行) ---
  { kanji: "悪", yomi: "わる", sentence: "きぶんが　【悪】い。", isMulti: true, q2: { s: "【悪】いにんを　つかまえる。", a: "あく" } },
  { kanji: "安", yomi: "やす", sentence: "【安】い　ねだん。", isMulti: true, q2: { s: "【安】しんする。", a: "あん" } },
  { kanji: "暗", yomi: "くら", sentence: "へやが　【暗】い。", isMulti: true, q2: { s: "【暗】ざんを　する。", a: "あん" } },
  { kanji: "医", yomi: "い", sentence: "【医】しゃに　みてもらう。", isMulti: false },
  { kanji: "委", yomi: "い", sentence: "学級【委】いん。", isMulti: false },
  { kanji: "意", yomi: "い", sentence: "【意】けんを　いう。", isMulti: true, q2: { s: "【意】地（いじ）が　わるい。", a: "い" } },
  { kanji: "育", yomi: "そだ", sentence: "花を　【育】てる。", isMulti: true, q2: { s: "体【育】の　じかん。", a: "いく" } },
  { kanji: "員", yomi: "いん", sentence: "かい【員】証（しょう）。", isMulti: false },
  { kanji: "院", yomi: "いん", sentence: "病【院】へ　いく。", isMulti: false },
  { kanji: "飲", yomi: "の", sentence: "ジュースを　【飲】む。", isMulti: true, q2: { s: "【飲】食（いんしょく）店。", a: "いん" } },
  // 本番ではここに残り190問を追加します
];