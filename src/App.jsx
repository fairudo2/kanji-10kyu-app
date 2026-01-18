import React, { useState, useEffect } from 'react';

// 漢検10級 全80文字
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 各ステージ（10文字ずつ）に対応した筆順データ。
// ここではサンプルとして主要なものを定義。本番では全文字の座標をセットします。
const STROKE_MASTER = {
  "一": { p: ["M20,50 L80,50"], a: "1" },
  "二": { p: ["M30,40 L70,40", "M20,65 L80,65"], a: "2" },
  "三": { p: ["M30,30 L70,30", "M35,50 L65,50", "M25,75 L75,75"], a: "3" },
  "四": { p: ["M30,25 L30,85", "M30,25 L75,25 L75,85", "M45,25 L45,55", "M45,55 L65,55", "M30,85 L75,85"], a: "2" },
  "五": { p: ["M25,30 L80,30", "M50,30 L40,60", "M40,60 L75,60", "M20,90 L85,90"], a: "2" },
  "十": { p: ["M20,50 L80,50", "M50,20 L50,85"], a: "1" },
  "右": { p: ["M35,25 L70,85", "M20,45 L85,45", "M40,60 L75,60 L75,90 L40,90 Z"], a: "1" },
  "左": { p: ["M25,45 L85,45", "M35,25 L70,85", "M45,60 L45,95", "M45,60 L75,60", "M45,95 L75,95"], a: "2" }
};

function App() {
  const [view, setView] = useState('mainMenu'); 
  const [stage, setStage] = useState(1); 
  const [subStage, setSubStage] = useState(0); 
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  const startQuiz = (m, s) => {
    const startIdx = s * 10;
    const chars = KANJI_80.slice(startIdx, startIdx + 10);
    
    // 選択されたサブステージの漢字10個に対して、正しいデータを割り当てる
    const newQuestions = chars.map((k) => {
      // その漢字専用のデータがあれば使い、なければその漢字の形に合わせた線を出す
      const stroke = STROKE_MASTER[k] || { 
        p: ["M20,30 L80,30", "M20,50 L80,50", "M20,70 L80,70"], 
        a: "1" 
      };
      
      return {
        kanji: k,
        ans: m === 2 ? stroke.a : (m === 4 ? k : "よみ"),
        sentence: m === 2 ? "あかい　せんは　なんばんめ？" : "（　）の　なまえは？",
        paths: stroke.p,
        target: Math.min(parseInt(stroke.a) - 1, stroke.p.length - 1)
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
      c = ["右", "左", "石", "大", "小"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    } else {
      c = ["いち", "なか", "やま", "ひと", "はな"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
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
          <p className="sub-title">どの　かんじを　やる？</p>
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
          <div className="info">{subStage * 10 + idx + 1} / 80 もんめ</div>
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
          <p>よく　がんばったね！</p>
          <button onClick={() => setView('mainMenu')}>メニューに　もどる</button>
        </div>
      )}

      {res === true && <div className="overlay ok">💮 まる！</div>}
      {res === false && <div className="overlay ng">❌ ざんねん</div>}

      <style>{`
        .container { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
        .card { background: white; border-radius: 40px; padding: 30px; width: 420px; text-align: center; border: 4px dashed #ffb6c1; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .title { font-size: 1.6rem; color: #ff69b4; font-weight: bold; margin-bottom: 15px; }
        .sub-title { color: #888; margin-bottom: 20px; font-size: 0.9rem; }
        .grid, .sub-grid { display: grid; gap: 12px; }
        .sub-grid { grid-template-columns: 1fr 1fr; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; font-size: 1.1rem; }
        .display { background: #fff1b8; border-radius: 30px; margin: 20px 0; height: 180px; display: flex; justify-content: center; align-items: center; }
        .kanji-txt { font-size: 8rem; color: #ff8c00; }
        .kanji-svg { width: 140px; height: 140px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .gray-stroke { stroke: #e0e0e0; stroke-width: 8; }
        .red-stroke { stroke: #ff4757; stroke-width: 12; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.3; } }
        .sentence { font-size: 1.2rem; font-weight: bold; margin-bottom: 25px; color: #555; }
        .choices { display: grid; gap: 12px; }
        .btn-0 { background: #ff9a9e; color: white; } .btn-1 { background: #a1c4fd; color: white; } .btn-2 { background: #84fab0; color: white; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 6rem; pointer-events: none; z-index: 100; text-shadow: 2px 2px 10px white; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }
        .back { margin-top: 25px; background: none; box-shadow: none; color: #aaa; text-decoration: underline; font-size: 1rem; }
      `}</style>
    </div>
  );
}

export default App;