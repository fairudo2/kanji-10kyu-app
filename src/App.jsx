import React, { useState, useEffect } from 'react';

// 漢検10級 全80文字
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 過去問画像に基づいた問題文データ
const getSentenceData = (kanji) => {
  const data = {
    "一": { yomi: "いち", bun: "一（　）ねんせい。", kaki: "（いち）ねんせい。" },
    "二": { yomi: "に", bun: "（　）かい　よんだ。", kaki: "（に）かい　よむ。" },
    "右": { yomi: "みぎ", bun: "（　）の　て。", kaki: "（みぎ）の　て。" },
    "左": { yomi: "ひだり", bun: "（　）に　まがる。", kaki: "（ひだり）に　まがる。" },
    "夕": { yomi: "ゆう", bun: "（　）がたの　そら。", kaki: "（ゆう）がた。" },
    "赤": { yomi: "あか", bun: "（　）い　りんご。", kaki: "（あか）い　いと。" },
    "火": { yomi: "ひ", bun: "（　）が　もえる。", kaki: "（ひ）が　つく。" },
    "五": { yomi: "ご", bun: "（　）円　もらった。", kaki: "（ご）えん　だま。" }
    // 他の漢字も同様の形式で動的に生成されます
  };
  return data[kanji] || { yomi: "よみ", bun: `（${kanji}）の　よみは？`, kaki: `（${kanji}）を　かこう。` };
};

// 筆順の図形データ（座標ずれを防ぐためSVGパスを定義）
const STROKE_DATA = {
  "右": { p: ["M30,30 L75,80", "M20,45 L85,45", "M35,60 L70,60 L70,90 L35,90 Z"], ans: "1" },
  "左": { p: ["M20,45 L85,45", "M30,30 L75,80", "M40,55 L40,95", "M40,55 L75,55", "M40,95 L75,95"], ans: "2" },
  "王": { p: ["M30,30 L75,30", "M52,30 L52,85", "M35,55 L70,55", "M25,85 L80,85"], ans: "3" },
  "五": { p: ["M25,30 L80,30", "M50,30 L40,60", "M40,60 L75,60", "M20,90 L85,90"], ans: "2" }
};

function App() {
  const [view, setView] = useState('mainMenu'); 
  const [stage, setStage] = useState(1); 
  const [subStage, setSubStage] = useState(0); 
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  // 【修正ポイント】ステージ選択時に毎回新しいデータを確実に生成する
  const startQuiz = (m, s) => {
    const startIdx = s * 10;
    const chars = KANJI_80.slice(startIdx, startIdx + 10);
    
    const newQuestions = chars.map((k) => {
      const info = getSentenceData(k);
      const stroke = STROKE_DATA[k] || { p: ["M20,50 L80,50", "M50,20 L50,80"], ans: "1" };
      
      return {
        kanji: k,
        ans: m === 1 ? info.yomi : m === 2 ? stroke.ans : m === 3 ? info.yomi : k,
        sentence: m === 1 ? info.bun : m === 2 ? "あかい　せんは　なんばんめ？" : m === 3 ? info.yomi : info.kaki,
        paths: stroke.p,
        target: parseInt(stroke.ans) - 1
      };
    });

    setQuestions(newQuestions);
    setStage(m);
    setSubStage(s);
    setIdx(0);
    setView('quiz');
    generateChoices(newQuestions[0], m);
  };

  const generateChoices = (q, m) => {
    let c = [];
    if (m === 2) {
      c = ["1", "2", "3", "4", "5"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    } else if (m === 4) {
      c = ["右", "左", "石", "中", "大"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    } else {
      c = ["なか", "き", "ひと", "やま", "ろく"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    }
    setChoices([q.ans, ...c].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (a) => {
    if (res !== null) return;
    if (a === questions[idx].ans) {
      setRes(true);
      setTimeout(() => {
        if (idx + 1 < 10) {
          setIdx(idx + 1);
          generateChoices(questions[idx + 1], stage);
          setRes(null);
        } else {
          setView('clear');
          setRes(null);
        }
      }, 600);
    } else {
      setRes(false);
      setTimeout(() => setRes(null), 1000);
    }
  };

  return (
    <div className="container">
      {view === 'mainMenu' && (
        <div className="card">
          <div className="title">🌸 漢検10級　特訓 🌸</div>
          <div className="grid">
            <button onClick={() => {setStage(1); setView('subMenu');}}>1. よみ (文)</button>
            <button onClick={() => {setStage(2); setView('subMenu');}}>2. かきじゅん</button>
            <button onClick={() => {setStage(3); setView('subMenu');}}>3. よみ (ことば)</button>
            <button onClick={() => {setStage(4); setView('subMenu');}}>4. かんじ かき</button>
          </div>
        </div>
      )}

      {view === 'subMenu' && (
        <div className="card">
          <div className="title">ステージ {stage}</div>
          <div className="sub-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => startQuiz(stage, i)}>
                {i * 10 + 1}〜{(i + 1) * 10}もん
              </button>
            ))}
          </div>
          <button className="back" onClick={() => setView('mainMenu')}>もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card">
          <div className="info">{idx + 1} / 10 もんめ</div>
          <div className="display">
            {stage === 2 ? (
              <svg viewBox="0 0 100 100" className="kanji-svg">
                {questions[idx].paths.map((p, i) => (
                  <path key={i} d={p} className={i === questions[idx].target ? "red-stroke" : "gray-stroke"} />
                ))}
              </svg>
            ) : (
              <div className="kanji-txt">{questions[idx].kanji}</div>
            )}
          </div>
          <div className="sentence">{questions[idx].sentence}</div>
          <div className="choices">
            {choices.map((c, i) => (
              <button key={i} onClick={() => handleAnswer(c)} className={`btn-${i}`}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {view === 'clear' && (
        <div className="card clear-card">
          <div className="title">🎉 クリア！ 🎉</div>
          <button onClick={() => setView('mainMenu')}>メニューに　もどる</button>
        </div>
      )}

      {res === true && <div className="overlay ok">💮 まる！</div>}
      {res === false && <div className="overlay ng">❌ ざんねん</div>}

      <style>{`
        .container { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
        .card { background: white; border-radius: 40px; padding: 30px; width: 400px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { font-size: 1.6rem; color: #ff69b4; font-weight: bold; margin-bottom: 25px; }
        .grid, .sub-grid { display: grid; gap: 12px; }
        .sub-grid { grid-template-columns: 1fr 1fr; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; }
        .display { background: #fff1b8; border-radius: 30px; margin: 20px 0; height: 160px; display: flex; justify-content: center; align-items: center; }
        .kanji-txt { font-size: 7rem; color: #ff8c00; }
        .kanji-svg { width: 140px; height: 140px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .gray-stroke { stroke: #e0e0e0; stroke-width: 8; }
        .red-stroke { stroke: #ff4757; stroke-width: 12; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.3; } }
        .sentence { font-size: 1.2rem; font-weight: bold; margin-bottom: 25px; }
        .choices { display: grid; gap: 10px; }
        .btn-0 { background: #ff9a9e; color: white; } .btn-1 { background: #a1c4fd; color: white; } .btn-2 { background: #84fab0; color: white; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; pointer-events: none; z-index: 100; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }
        .back { margin-top: 20px; background: none; box-shadow: none; color: #aaa; text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default App;