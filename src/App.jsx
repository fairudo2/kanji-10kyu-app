import React, { useState, useEffect } from 'react';

// 漢検10級全80文字データ
const kanji80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// ステージごとの詳細データ
const getQuestions = (type, subIdx) => {
  const start = subIdx * 10;
  const chars = kanji80.slice(start, start + 10);
  
  return chars.map((k, i) => {
    switch(type) {
      case 1: // よみ（文）
        return { k, a: "よみ", s: "（　）の　かんじを　よもう。" };
      case 2: // かきじゅん（筆順）
        // 問題とする画の「書き始め」の位置に赤い丸を表示するための座標データ
        // ※本来は全漢字・全画数分の正確な座標データが必要です。ここではサンプルとして中央付近に表示します。
        const targetPoint = { x: 50 + (i % 3 - 1) * 20, y: 30 + (i % 3) * 20 };
        
        return { 
          k, 
          a: (i % 3 + 1).toString(), // 暫定的な正解（実際は漢字データに基づく）
          s: "あかい　まるの　ところから　かく　せんは　なんばんめ？", 
          targetPoint // 赤い丸の座標データ
        };
      case 3: // ことば（熟語）
        return { k, a: "よみ", s: "ことばの　よみを　えらぼう。" };
      case 4: // かき（書き取り）
        return { k, a: k, s: "（　）に　あてはまる　かんじは？" };
      default: return {};
    }
  });
};

function App() {
  const [view, setView] = useState('menu');
  const [mainStage, setMainStage] = useState(1);
  const [subStage, setSubStage] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  const startStage = (m, s) => {
    const qList = getQuestions(m, s);
    setQuestions(qList);
    setMainStage(m);
    setSubStage(s);
    setIdx(0);
    setView('quiz');
    makeChoices(qList[0], m);
  };

  const makeChoices = (q, m) => {
    let others = [];
    if (m === 2) others = ["1", "2", "3", "4", "5", "6"];
    else if (m === 4) others = ["右", "左", "白", "田", "木", "石"];
    else others = ["なか", "き", "ひと", "やま", "いち", "ろく"];
    
    let c = [q.a, ...others.filter(v => v !== q.a).sort(() => Math.random() - 0.5).slice(0, 2)];
    setChoices(c.sort(() => Math.random() - 0.5));
  };

  const check = (ans) => {
    if (res !== null) return;
    if (ans === questions[idx].a) {
      setRes(true);
      setTimeout(() => {
        if (idx + 1 < 10) {
          setIdx(idx + 1);
          makeChoices(questions[idx + 1], mainStage);
          setRes(null);
        } else { setView('clear'); setRes(null); }
      }, 600);
    } else {
      setRes(false); setTimeout(() => setRes(null), 1000);
    }
  };

  return (
    <div className="app">
      {view === 'menu' && (
        <div className="card menu-card">
          <div className="title">🌸 漢検10級　とっくん 🌸</div>
          <div className="grid">
            <button onClick={() => {setMainStage(1); setView('sub');}}>1. よみ (ぶん)</button>
            <button onClick={() => {setMainStage(2); setView('sub');}}>2. かきじゅん</button>
            <button onClick={() => {setMainStage(3); setView('sub');}}>3. よみ (ことば)</button>
            <button onClick={() => {setMainStage(4); setView('sub');}}>4. かんじ かき</button>
          </div>
        </div>
      )}

      {view === 'sub' && (
        <div className="card menu-card">
          <div className="title">ステージ {mainStage}</div>
          <div className="sub-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => startStage(mainStage, i)}>
                {i + 1}番 ({i * 10 + 1}〜)
              </button>
            ))}
          </div>
          <button className="back" onClick={() => setView('menu')}>もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card">
          <div className="info">{mainStage}-{subStage + 1} : {idx + 1}/10</div>
          
          <div className="display-area">
            {mainStage === 2 ? (
              <div className="kanji-stack">
                <div className="kanji-base">{questions[idx].k}</div>
                <svg viewBox="0 0 100 100" className="kanji-overlay">
                  {/* 赤い線ではなく、赤い丸印（ポインター）を表示 */}
                  <circle 
                    cx={questions[idx].targetPoint.x} 
                    cy={questions[idx].targetPoint.y} 
                    r="6" 
                    className="red-pointer" 
                  />
                </svg>
              </div>
            ) : (
              <div className="kanji-text">{questions[idx].k}</div>
            )}
          </div>

          <div className="sentence">{questions[idx].s}</div>
          <div className="choices">
            {choices.map((c, i) => <button key={i} onClick={() => check(c)} className={`c-${i}`}>{c}</button>)}
          </div>
        </div>
      )}

      {view === 'clear' && (
        <div className="card clear-card">
          <div className="title">✨ クリア！ ✨</div>
          <button onClick={() => setView('menu')}>メニューへ</button>
        </div>
      )}

      {res === true && <div className="overlay ok">💮 まる！</div>}
      {res === false && <div className="overlay ng">❌ ざんねん</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .app { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; padding: 10px; }
        .card { background: white; border-radius: 40px; padding: 25px; width: 100%; max-width: 420px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { font-size: 1.5rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
        .grid, .sub-grid { display: grid; gap: 10px; }
        .sub-grid { grid-template-columns: 1fr 1fr; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; }
        
        .display-area { background: #fff1b8; border-radius: 30px; margin: 15px 0; padding: 15px; height: 180px; display: flex; justify-content: center; align-items: center; position: relative; }
        .kanji-text { font-size: 7rem; color: #ff8c00; }
        
        .kanji-stack { position: relative; width: 150px; height: 150px; }
        .kanji-base { font-size: 7rem; color: #ffe0b2; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; font-family: serif; /* フォントを明朝体などに固定すると位置が安定しやすい */ }
        .kanji-overlay { position: absolute; top: 0; left: 0; width: 150px; height: 150px; z-index: 2; }
        
        /* 赤い丸印（ポインター）のスタイル */
        .red-pointer { fill: #ff4757; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { r: 6; opacity: 0.8; } 50% { r: 9; opacity: 0.4; } 100% { r: 6; opacity: 0.8; } }

        .sentence { font-size: 1.2rem; margin-bottom: 20px; font-weight: bold; height: 3rem; }
        .choices { display: grid; gap: 10px; }
        .c-0 { background: #ff9a9e; color: white; } .c-1 { background: #a1c4fd; color: white; } .c-2 { background: #84fab0; color: white; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; pointer-events: none; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }
        .back { margin-top: 20px; background: none; box-shadow: none; color: #aaa; text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default App;