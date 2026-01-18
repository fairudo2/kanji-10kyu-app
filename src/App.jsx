import React, { useState } from 'react';

// 漢検10級 全80文字データ
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 【本番形式データ】過去問の傾向に合わせた問題文と正解
// type 1: 文章の読み (大問1,3)
// type 2: ことばの読み・正誤 (大問4,5)
// type 3: 文章の書き (大問7)
// type 4: 漢字の穴埋め (大問6)
const EXAM_DATA = [
  // --- 読み対策 ---
  { k: "一", type: 1, q: "あめ玉を　【一】つ　口に　いれる。", a: "ひと", choices: ["いち", "いつ", "ひと"] },
  { k: "七", type: 1, q: "きょうは　【七】夕　です。", a: "たな", choices: ["しち", "なな", "たな"] }, // 難問
  { k: "日", type: 1, q: "【日】よう【日】に　あそぶ。", a: "にち", choices: ["ひ", "か", "にち"] },
  { k: "木", type: 2, q: "【木】　の　ただしい　よみは？", a: "き", choices: ["もく", "ぼく", "き"] },
  { k: "王", type: 2, q: "【王】じょ　（ただしい　かなづかいは？）", a: "おう", choices: ["おお", "おう", "おの"] },
  { k: "円", type: 1, q: "【円】い　テーブル。", a: "まる", choices: ["えん", "まる", "まど"] },
  { k: "気", type: 1, q: "元【気】な　こえ。", a: "き", choices: ["け", "き", "ぎ"] },
  { k: "空", type: 1, q: "【空】が　あおい。", a: "そら", choices: ["くう", "から", "そら"] },
  { k: "月", type: 1, q: "お【月】さまが　でている。", a: "つき", choices: ["げつ", "がつ", "つき"] },
  { k: "水", type: 2, q: "【水】　の　ただしい　よみは？", a: "みず", choices: ["すい", "みず", "うみ"] },

  // --- 書き対策 ---
  { k: "右", type: 3, q: "【みぎ】　の　手を　あげる。", a: "右", choices: ["左", "右", "石"] },
  { k: "雨", type: 3, q: "【あめ】　が　ふってきた。", a: "雨", choices: ["天", "雨", "雪"] },
  { k: "音", type: 3, q: "ピアノの　【おと】。", a: "音", choices: ["立", "音", "足"] },
  { k: "貝", type: 4, q: "うみで　【かい】　を　ひろう。", a: "貝", choices: ["見", "貝", "目"] },
  { k: "学", type: 3, q: "【がっ】こう　へ　いく。", a: "学", choices: ["字", "学", "子"] },
  { k: "森", type: 4, q: "【もり】　の　なかの　くま。", a: "森", choices: ["林", "森", "木"] },
  { k: "休", type: 3, q: "【やす】み　じかん。", a: "休", choices: ["体", "休", "本"] },
  { k: "虫", type: 4, q: "【むし】　を　つかまえる。", a: "虫", choices: ["中", "虫", "足"] },
  { k: "早", type: 3, q: "【はや】く　おきる。", a: "早", choices: ["草", "早", "白"] },
  { k: "田", type: 4, q: "【た】んぼ　の　かえる。", a: "田", choices: ["町", "田", "口"] }
];

// 他の漢字もランダム出題用に補完
const FILLER_DATA = KANJI_80.map(k => ({
  k, type: Math.random() > 0.5 ? 1 : 3, // 読みか書きかランダム
  q: Math.random() > 0.5 ? `【${k}】の　よみは？` : `【　】（${k}とよむ）かんじは？`,
  a: k, choices: [] // 後で生成
}));

function App() {
  const [view, setView] = useState('menu');
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [res, setRes] = useState(null);
  const [score, setScore] = useState(0);

  // 問題セット作成
  const startExam = (mode) => {
    // 過去問データ + ランダムデータから10問選出
    let baseData = EXAM_DATA.filter(d => 
      mode === 'read' ? (d.type === 1 || d.type === 2) : (d.type === 3 || d.type === 4)
    );
    
    // 足りない分を補完
    while(baseData.length < 10) {
      const rnd = EXAM_DATA[Math.floor(Math.random() * EXAM_DATA.length)];
      if(mode === 'read' && (rnd.type === 1 || rnd.type === 2)) baseData.push(rnd);
      if(mode === 'write' && (rnd.type === 3 || rnd.type === 4)) baseData.push(rnd);
    }

    // シャッフルしてセット
    const finalQ = baseData.sort(() => Math.random() - 0.5).slice(0, 10).map(q => {
      // 選択肢が未定義（FILLER）の場合は生成
      if (q.choices.length === 0) {
        // 簡易生成ロジック（実際は省略）
        q.choices = [q.a, "誤", "誤"].sort(() => Math.random() - 0.5);
      }
      return {
        ...q,
        // 選択肢のシャッフル
        choices: q.choices.sort(() => Math.random() - 0.5)
      };
    });

    setQuestions(finalQ);
    setIdx(0);
    setScore(0);
    setView('quiz');
  };

  const checkAnswer = (choice) => {
    if (res) return;
    const isCorrect = choice === questions[idx].a;
    setRes(isCorrect ? 'ok' : 'ng');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (idx + 1 < 10) {
        setIdx(i => i + 1);
        setRes(null);
      } else {
        setView('result');
        setRes(null);
      }
    }, 800);
  };

  return (
    <div className="container">
      {/* メニュー画面 */}
      {view === 'menu' && (
        <div className="card menu">
          <h1 className="title">🌸 漢検10級 もぎしけん 🌸</h1>
          <p className="subtitle">ほんばん　そっくりの　もんだいだよ！</p>
          <div className="btn-group">
            <button className="btn pink" onClick={() => startExam('read')}>
              📖 よみの もんだい
              <small>（ぶんしょう・ことば）</small>
            </button>
            <button className="btn blue" onClick={() => startExam('write')}>
              ✏️ かきの もんだい
              <small>（あなうめ・えらぶ）</small>
            </button>
          </div>
        </div>
      )}

      {/* クイズ画面 */}
      {view === 'quiz' && (
        <div className="card quiz">
          <div className="progress">だい {idx + 1}もん / 10もん</div>
          
          <div className="question-box">
            {/* 問題文の強調表示 */}
            {questions[idx].q.split(/【|】/).map((part, i) => 
              i % 2 === 1 ? <span key={i} className="highlight">{part}</span> : part
            )}
          </div>

          <div className="choices-grid">
            {questions[idx].choices.map((c, i) => (
              <button key={i} className="choice-btn" onClick={() => checkAnswer(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 結果画面 */}
      {view === 'result' && (
        <div className="card result">
          <div className="score-area">
            <div className="score-label">てんすう</div>
            <div className="score-value">{score * 10} <span className="unit">てん</span></div>
          </div>
          <div className="message">
            {score === 10 ? "✨ まんてん！ すごい！ ✨" : 
             score >= 8 ? "💮 ごうかく！ おめでとう！" : "あと すこし！ がんばろう！"}
          </div>
          <button className="btn pink" onClick={() => setView('menu')}>もういちど やる</button>
        </div>
      )}

      {/* 正解・不正解エフェクト */}
      {res === 'ok' && <div className="overlay">⭕</div>}
      {res === 'ng' && <div className="overlay">❌</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        
        .container {
          min-height: 100vh;
          background: #fff0f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Kiwi Maru', sans-serif;
          padding: 20px;
        }
        
        .card {
          background: white;
          width: 100%;
          max-width: 480px;
          border-radius: 30px;
          padding: 30px;
          box-shadow: 0 10px 25px rgba(255,182,193,0.4);
          text-align: center;
          border: 4px solid #ffb6c1;
        }

        .title { color: #ff69b4; margin: 0 0 10px; font-size: 1.8rem; }
        .subtitle { color: #888; margin-bottom: 30px; }
        
        .btn-group { display: flex; flex-direction: column; gap: 20px; }
        
        .btn {
          padding: 20px;
          border: none;
          border-radius: 20px;
          font-size: 1.4rem;
          font-family: inherit;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: transform 0.1s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .btn:active { transform: scale(0.98); }
        .btn small { font-size: 0.9rem; margin-top: 5px; opacity: 0.9; }
        .pink { background: #ff9a9e; box-shadow: 0 6px 0 #ff758c; }
        .blue { background: #8fd3f4; box-shadow: 0 6px 0 #62b6cb; }

        .progress { color: #aaa; margin-bottom: 20px; font-weight: bold; }
        
        .question-box {
          font-size: 1.8rem;
          margin-bottom: 40px;
          line-height: 1.6;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .highlight {
          color: #ff4757;
          border-bottom: 4px solid #ff4757;
          padding: 0 5px;
          margin: 0 5px;
        }

        .choices-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .choice-btn {
          background: #f0f8ff;
          border: 2px solid #8fd3f4;
          border-radius: 15px;
          padding: 15px 5px;
          font-size: 1.5rem;
          font-family: inherit;
          cursor: pointer;
          color: #333;
        }
        .choice-btn:hover { background: #e0f0ff; }

        .score-value { font-size: 5rem; color: #ff69b4; font-weight: bold; line-height: 1; }
        .unit { font-size: 2rem; }
        .message { font-size: 1.5rem; margin: 20px 0 30px; color: #555; }

        .overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10rem;
          background: rgba(255,255,255,0.5);
          animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: none;
        }
        @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default App;