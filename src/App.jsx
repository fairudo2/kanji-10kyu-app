import React, { useState, useEffect } from 'react';

// 【筆順データ】漢字をパーツごとに分けて、どれを赤くするか指定します
// 10級で特に間違いやすい漢字を正確なパスで作成しました
const strokeData = {
  "右": { paths: ["M20,40 Q50,80 80,90", "M10,45 L90,45", "M35,60 L70,60 L70,90 L35,90 Z"], target: 0, ans: "1" },
  "左": { paths: ["M20,40 Q50,80 80,90", "M10,45 L90,45", "M40,55 L40,95", "M40,55 L75,55", "M40,95 L75,95"], target: 1, ans: "1" },
  "五": { paths: ["M20,25 L80,25", "M50,25 L35,60", "M35,60 L85,60", "M15,90 L90,90"], target: 1, ans: "2" },
  "王": { paths: ["M25,25 L75,25", "M50,25 L50,85", "M30,55 L70,55", "M20,85 L85,85"], target: 2, ans: "3" },
  "目": { paths: ["M30,20 L30,90", "M30,20 L80,20 L80,90", "M30,45 L80,45", "M30,68 L80,68", "M30,90 L80,90"], target: 0, ans: "1" },
  "女": { paths: ["M50,20 L25,60 L75,80", "M75,30 L30,90", "M10,55 L90,55"], target: 0, ans: "1" },
  "九": { paths: ["M35,20 Q20,80 15,90", "M30,40 L65,40 Q80,40 80,90"], target: 0, ans: "1" }
};

const kanji80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

const getQuestions = (type, subIdx) => {
  const start = subIdx * 10;
  const chars = kanji80.slice(start, start + 10);
  
  return chars.map((k, i) => {
    if (type === 2) {
      // 筆順ステージ：個別データがあればそれを使用、なければ共通形式
      const d = strokeData[k] || { paths: ["M20,50 L80,50", "M50,20 L50,80"], target: 0, ans: "1" };
      return { k, a: d.ans, s: "あかい　せんは　なんばんめ？", paths: d.paths, target: d.target };
    }
    // その他のステージ
    const types = { 1: "よみ", 3: "よみ", 4: k };
    const sentences = { 1: "（　）の　かんじを　よもう。", 3: "ことばの　よみを　えらぼう。", 4: "（　）に　あてはまる　かんじは？" };
    return { k, a: types[type], s: sentences[type] };
  });
};

function App() {
  const [view, setView] = useState('menu');
  const [mainStage, setMainStage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  const startStage = (m, s) => {
    const qList = getQuestions(m, s);
    setQuestions(qList);
    setMainStage(m);
    setIdx(0);
    setView('quiz');
    makeChoices(qList[0], m);
  };

  const makeChoices = (q, m) => {
    let others = m === 2 ? ["1", "2", "3", "4", "5"] : m === 4 ? ["右", "左", "白", "田", "木"] : ["なか", "き", "ひと", "やま"];
    let c = [q.a, ...others.filter(v => v !== q.a).sort(() => Math.random() - 0.5).slice(0, 2)];
    setChoices(c.sort(() => Math.random() - 0.5));
  };

  const check = (ans) => {
    if (res !== null) return;
    if (ans === questions[idx].a) {
      setRes(true);
      setTimeout(() => {
        if (idx + 1 < 10) {
          setIdx(idx + 1); makeChoices(questions[idx + 1], mainStage); setRes(null);
        } else { setView('menu'); setRes(null); }
      }, 600);
    } else {
      setRes(false); setTimeout(() => setRes(null), 1000);
    }
  };

  return (
    <div className="app">
      {view === 'menu' ? (
        <div className="card">
          <div className="title">🌸 漢検10級　特訓 🌸</div>
          <div className="grid">
            <button onClick={() => {setMainStage(1); setView('sub');}}>1. よみ (文)</button>
            <button onClick={() => {setMainStage(2); setView('sub');}}>2. かきじゅん</button>
            <button onClick={() => {setMainStage(3); setView('sub');}}>3. よみ (ことば)</button>
            <button onClick={() => {setMainStage(4); setView('sub');}}>4. かんじ かき</button>
          </div>
        </div>
      ) : view === 'sub' ? (
        <div className="card">
          <div className="title">ステージ {mainStage}</div>
          <div className="sub-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => startStage(mainStage, i)}>{i*10+1}〜</button>
            ))}
          </div>
          <button className="back" onClick={() => setView('menu')}>もどる</button>
        </div>
      ) : (
        <div className="card">
          <div className="info">{idx + 1}/10</div>
          <div className="display-area">
            {mainStage === 2 ? (
              <svg viewBox="0 0 100 100" className="kanji-svg">
                {questions[idx].paths.map((p, i) => (
                  <path key={i} d={p} className={i === questions[idx].target ? "target" : "base"} />
                ))}
              </svg>
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
      {res === true && <div className="overlay ok">💮 まる！</div>}
      {res === false && <div className="overlay ng">❌ ざんねん</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .app { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; padding: 10px; }
        .card { background: white; border-radius: 40px; padding: 30px; width: 400px; text-align: center; border: 4px dashed #ffb6c1; }
        .grid, .sub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; }
        .display-area { background: #fff1b8; border-radius: 30px; margin: 20px 0; height: 180px; display: flex; justify-content: center; align-items: center; }
        .kanji-text { font-size: 7rem; color: #ff8c00; }
        .kanji-svg { width: 140px; height: 140px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .base { stroke: #e0e0e0; stroke-width: 8; }
        .target { stroke: #ff4757; stroke-width: 12; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.3; } }
        .sentence { font-size: 1.2rem; font-weight: bold; margin-bottom: 20px; }
        .choices { display: grid; gap: 10px; }
        .c-0 { background: #ff9a9e; color: white; } .c-1 { background: #a1c4fd; color: white; } .c-2 { background: #84fab0; color: white; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; pointer-events: none; }
      `}</style>
    </div>
  );
}

export default App;