import React, { useState } from 'react';

// 過去問の傾向に基づいた問題データ（読み・書き）
//
const EXAM_DATA = [
  // --- 読みの問題 (大問1, 3, 4, 5) ---
  { q: "ドアの しまる 【音】が きこえた。", a: "おと", choices: ["おと", "ね", "こえ"], type: "よみ" },
  { q: "にわの 【木】に とりが とまる。", a: "き", choices: ["き", "もく", "ぼく"], type: "よみ" },
  { q: "へやに 【円】い テーブルを おく。", a: "まる", choices: ["えん", "まる", "まど"], type: "よみ" },
  { q: "【夕】がたに なった。", a: "ゆう", choices: ["ゆう", "た", "せき"], type: "よみ" },
  { q: "【一】年生の きょうかしょ。", a: "いち", choices: ["いち", "ひと", "つ"], type: "よみ" },
  { q: "【先生】（正しい よみがなは？）", a: "せんせい", choices: ["せんせい", "せんせえ", "ぜんせい"], type: "よみ" },
  { q: "【王】じょ（正しい かなづかいは？）", a: "おう", choices: ["おう", "おお", "おの"], type: "よみ" },
  
  // --- 書きの問題 (大問6, 7) ---
  { q: "【みぎ】と ひだりを たしかめる。", a: "右", choices: ["右", "左", "石"], type: "かき" },
  { q: "【なな】さいの たんじょうび。", a: "七", choices: ["七", "九", "八"], type: "かき" },
  { q: "【あめ】が たくさん ふる。", a: "雨", choices: ["雨", "天", "雪"], type: "かき" },
  { q: "【もり】の なかの みち。", a: "森", choices: ["森", "林", "木"], type: "かき" },
  { q: "【おとこ】の こが はしる。", a: "男", choices: ["男", "女", "力"], type: "かき" },
  { q: "【むし】を つかまえる。", a: "虫", choices: ["虫", "中", "足"], type: "かき" },
  { q: "がっ【こう】へ いく。", a: "校", choices: ["校", "学", "交"], type: "かき" }
];

function App() {
  const [view, setView] = useState('menu');
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [res, setRes] = useState(null);
  const [score, setScore] = useState(0);

  const startExam = (type) => {
    // 選択したタイプ（よみ・かき）に合わせて10問選出
    const filtered = EXAM_DATA.filter(d => d.type === type).sort(() => Math.random() - 0.5);
    setQuestions(filtered.slice(0, 10));
    setIdx(0);
    setScore(0);
    setView('quiz');
  };

  const handleAnswer = (choice) => {
    if (res) return;
    const isCorrect = choice === questions[idx].a;
    setRes(isCorrect ? 'ok' : 'ng');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(i => i + 1);
        setRes(null);
      } else {
        setView('result');
        setRes(null);
      }
    }, 800);
  };

  return (
    <div className="app-container">
      {view === 'menu' && (
        <div className="card">
          <h1 className="title">🌸 漢検10級 ごうかく特訓 🌸</h1>
          <div className="menu-buttons">
            <button className="btn read" onClick={() => startExam('よみ')}>
              📖 よみの もんだい <br/> <small>(大問1・3・4・5)</small>
            </button>
            <button className="btn write" onClick={() => startExam('かき')}>
              ✏️ かきの もんだい <br/> <small>(大問6・7)</small>
            </button>
          </div>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card quiz-card">
          <div className="header">{idx + 1} / {questions.length} もんめ</div>
          <div className="question-text">
            {questions[idx].q.split(/【|】/).map((part, i) => 
              i % 2 === 1 ? <span key={i} className="highlight">{part}</span> : part
            )}
          </div>
          <div className="choices">
            {questions[idx].choices.sort(() => Math.random() - 0.5).map((c, i) => (
              <button key={i} className="choice-btn" onClick={() => handleAnswer(c)}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {view === 'result' && (
        <div className="card result-card">
          <h2 className="title">おわり！</h2>
          <div className="score">{score * 10} 点</div>
          <button className="btn menu-btn" onClick={() => setView('menu')}>メニューにもどる</button>
        </div>
      )}

      {res === 'ok' && <div className="effect ok">⭕</div>}
      {res === 'ng' && <div className="effect ng">❌</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .app-container { min-height: 100vh; background: #fff0f5; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; }
        .card { background: white; border-radius: 30px; padding: 40px; width: 400px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { color: #ff69b4; margin-bottom: 30px; }
        .btn { width: 100%; padding: 20px; border-radius: 20px; border: none; font-size: 1.2rem; font-weight: bold; color: white; cursor: pointer; margin-bottom: 15px; }
        .read { background: #ff9a9e; box-shadow: 0 5px 0 #ff7a8e; }
        .write { background: #a1c4fd; box-shadow: 0 5px 0 #81a4ed; }
        .question-text { font-size: 1.5rem; line-height: 2; margin-bottom: 40px; text-align: left; }
        .highlight { color: #ff4757; text-decoration: underline; font-weight: bold; }
        .choices { display: grid; gap: 15px; }
        .choice-btn { padding: 15px; font-size: 1.4rem; border-radius: 15px; border: 2px solid #ffb6c1; background: #fffafb; cursor: pointer; font-family: inherit; }
        .score { font-size: 4rem; color: #ff69b4; font-weight: bold; margin: 20px 0; }
        .effect { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; pointer-events: none; z-index: 100; }
      `}</style>
    </div>
  );
}

export default App;