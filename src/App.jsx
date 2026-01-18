import React, { useState, useEffect } from 'react';

// 1年生の漢字80文字データ
const kanjiList = [
  { kanji: "一", yomi: "いち", sentence: "りんごが（一）ごある。" },
  { kanji: "右", yomi: "みぎ", sentence: "（右）の手をあげる。" },
  { kanji: "雨", yomi: "あめ", sentence: "（雨）がふってきた。" },
  { kanji: "円", yomi: "えん", sentence: "百（円）だまをひろう。" },
  { kanji: "王", yomi: "おう", sentence: "ライオンは百じゅうの（王）。" },
  { kanji: "音", yomi: "おと", sentence: "大きな（音）がする。" },
  { kanji: "下", yomi: "した", sentence: "つくえの（下）を見る。" },
  { kanji: "火", yomi: "ひ", sentence: "（火）がもえている。" },
  { kanji: "花", yomi: "はな", sentence: "きれいな（花）がさく。" },
  { kanji: "貝", yomi: "かい", sentence: "海で（貝）をひろう。" },
  { kanji: "学", yomi: "がく", sentence: "（学）こうにいく。" },
  { kanji: "気", yomi: "き", sentence: "（気）もちがいい。" },
  { kanji: "休", yomi: "きゅう", sentence: "（休）みのひ。" },
  { kanji: "玉", yomi: "たま", sentence: "（玉）入れをする。" },
  { kanji: "金", yomi: "きん", sentence: "（金）メダルをとる。" },
  { kanji: "九", yomi: "きゅう", sentence: "（九）がつになる。" },
  { kanji: "空", yomi: "そら", sentence: "（空）が青い。" },
  { kanji: "月", yomi: "つき", sentence: "お（月）さまが出る。" },
  { kanji: "犬", yomi: "いぬ", sentence: "（犬）がほえる。" },
  { kanji: "見", yomi: "み", sentence: "ゆめを（見）る。" }
  // ※文字数はいつでも増やせます
];

function App() {
  const [q, setQ] = useState(null);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);

  const nextQuestion = () => {
    const nextQ = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    setQ(nextQ);
    // 間違いの選択肢をランダムに作る
    const wrong = kanjiList
      .filter(item => item.yomi !== nextQ.yomi)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(item => item.yomi);
    setChoices([nextQ.yomi, ...wrong].sort(() => 0.5 - Math.random()));
    setIsCorrect(null);
  };

  useEffect(() => { nextQuestion(); }, []);

  const handleAnswer = (ans) => {
    if (ans === q.yomi) {
      setIsCorrect(true);
      setScore(s => s + 1);
      setTimeout(nextQuestion, 500); // 0.5秒で次へ
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  if (!q) return null;

  return (
    <div className="kanji-container">
      <div className="card">
        <div className="header">かんけん10きゅう きあい！</div>
        <div className="score">げんざい {score}問せいかい！</div>
        <div className="kanji-box">{q.kanji}</div>
        <div className="sentence">{q.sentence}</div>
        <div className="choices">
          {choices.map((c, i) => (
            <button key={i} onClick={() => handleAnswer(c)} className={`btn-${i}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {isCorrect === true && <div className="overlay ok">まる！ ⭕</div>}
      {isCorrect === false && <div className="overlay ng">ざんねん！ ❌</div>}

      <style>{`
        .kanji-container { background: #fffae6; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: sans-serif; }
        .card { background: white; border-radius: 25px; padding: 25px; width: 100%; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; border: 4px solid #ffd666; }
        .header { color: #d48806; font-weight: bold; margin-bottom: 10px; }
        .score { font-size: 1.1rem; color: #666; margin-bottom: 20px; }
        .kanji-box { font-size: 8rem; font-weight: bold; background: #fff1b8; border-radius: 20px; margin-bottom: 20px; color: #333; }
        .sentence { font-size: 1.4rem; color: #555; margin-bottom: 30px; min-height: 3rem; }
        .choices { display: grid; gap: 15px; }
        button { padding: 18px; font-size: 1.6rem; border: none; border-radius: 50px; color: white; font-weight: bold; box-shadow: 0 4px 0 rgba(0,0,0,0.1); }
        .btn-0 { background: #ff7875; } .btn-1 { background: #69c0ff; } .btn-2 { background: #95de64; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; font-weight: bold; z-index: 100; pointer-events: none; }
        .ok { color: #f5222d; } .ng { color: #2f54eb; }
      `}</style>
    </div>
  );
}

export default App;