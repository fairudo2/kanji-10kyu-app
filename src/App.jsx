import React, { useState, useEffect } from 'react';

// 漢検10級 全80文字リスト
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 筆順の図形データ（代表的な間違いやすい漢字）
// 他の漢字は基本構造（M=始点 L=終点）で自動生成
const STROKE_PATHS = {
  "右": { p: ["M30,40 L80,90", "M20,50 L90,50", "M40,65 L70,65 L70,90 L40,90 Z"], a: "1" },
  "左": { p: ["M20,50 L90,50", "M30,40 L80,90", "M45,60 L45,95", "M45,60 L75,60", "M45,95 L75,95"], a: "2" },
  "五": { p: ["M25,30 L85,30", "M45,30 L35,65", "M35,65 L80,65", "M20,90 L90,90"], a: "2" },
  "王": { p: ["M30,35 L80,35", "M55,35 L55,85", "M35,60 L75,60", "M25,85 L85,85"], a: "3" },
  "火": { p: ["M30,40 L40,55", "M80,40 L70,55", "M55,20 Q30,90 20,90", "M55,20 Q80,90 90,90"], a: "2" }
};

function App() {
  const [view, setView] = useState('mainMenu'); // mainMenu, subMenu, quiz, clear
  const [stage, setStage] = useState(1); // 大問1〜4
  const [subStage, setSubStage] = useState(0); // 1〜8ステージ
  const [qList, setQList] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  // ステージ選択時の初期化
  const initStage = (m, s) => {
    const start = s * 10;
    const chars = KANJI_80.slice(start, start + 10);
    const questions = chars.map((k, i) => {
      let q = { k, id: start + i };
      if (m === 2) { // 筆順
        const data = STROKE_PATHS[k] || { p: ["M20,50 L80,50", "M50,20 L50,80"], a: "1" };
        q.paths = data.p; q.ans = data.a; q.target = parseInt(data.a) - 1;
      } else if (m === 4) { // 書き
        q.ans = k;
      } else { // 読み（文・言葉）
        q.ans = "読み"; // 本来は辞書データから取得
      }
      return q;
    });
    setQList(questions);
    setStage(m); setSubStage(s); setIdx(0); setView('quiz');
    makeChoices(questions[0], m);
  };

  const makeChoices = (q, m) => {
    let c = [];
    if (m === 2) {
      c = [q.ans, "2", "3", "4"].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
    } else if (m === 4) {
      c = [q.ans, "左", "石", "白"];
    } else {
      c = ["よみ", "なか", "き"];
    }
    setChoices(c.sort(() => Math.random() - 0.5));
  };

  const check = (a) => {
    if (res !== null) return;
    if (a === qList[idx].ans || stage === 1 || stage === 3) { // 読みはデモ用正解
      setRes(true);
      setTimeout(() => {
        if (idx + 1 < 10) {
          setIdx(idx + 1); makeChoices(qList[idx + 1], stage); setRes(null);
        } else { setView('clear'); setRes(null); }
      }, 600);
    } else {
      setRes(false); setTimeout(() => setRes(null), 1000);
    }
  };

  return (
    <div className="container">
      {view === 'mainMenu' && (
        <div className="card">
          <div className="title">🌸 漢検10級 特訓 🌸</div>
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
              <button key={i} onClick={() => initStage(stage, i)}>{i + 1}ステージ</button>
            ))}
          </div>
          <button className="back" onClick={() => setView('mainMenu')}>もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card">
          <div className="info">{stage}-{subStage+1} : {idx+1}/10</div>
          <div className="display">
            {stage === 2 ? (
              <svg viewBox="0 0 100 100" className="kanji-svg">
                {qList[idx].paths.map((p, i) => (
                  <path key={i} d={p} className={i === qList[idx].target ? "red-stroke" : "gray-stroke"} />
                ))}
              </svg>
            ) : (
              <div className="kanji-txt">{qList[idx].k}</div>
            )}
          </div>
          <div className="sentence">
            {stage === 2 ? "あかい　せんは　なんばんめ？" : "（　）の　よみ/かんじは？"}
          </div>
          <div className="choices">
            {choices.map((c, i) => <button key={i} onClick={() => check(c)} className={`c-${i}`}>{c}</button>)}
          </div>
        </div>
      )}

      {view === 'clear' && (
        <div className="card">
          <div className="title">✨ ステージクリア！ ✨</div>
          <button onClick={() => setView('mainMenu')}>メニューへ</button>
        </div>
      )}

      {res === true && <div className="overlay ok">💮 まる！</div>}
      {res === false && <div className="overlay ng">❌ ざんねん</div>}

      <style>{`
        .container { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
        .card { background: white; border-radius: 40px; padding: 25px; width: 380px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { font-size: 1.5rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
        .grid, .sub-grid { display: grid; gap: 12px; }
        .sub-grid { grid-template-columns: 1fr 1fr; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; }
        .display { background: #fff1b8; border-radius: 30px; margin: 15px 0; height: 160px; display: flex; justify-content: center; align-items: center; }
        .kanji-txt { font-size: 6rem; color: #ff8c00; }
        .kanji-svg { width: 130px; height: 130px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .gray-stroke { stroke: #e0e0e0; stroke-width: 8; }
        .red-stroke { stroke: #ff4757; stroke-width: 12; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.3; } }
        .sentence { font-size: 1.1rem; font-weight: bold; margin-bottom: 20px; }
        .choices { display: grid; gap: 10px; }
        .c-0 { background: #ff9a9e; color: white; } .c-1 { background: #a1c4fd; color: white; } .c-2 { background: #84fab0; color: white; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; z-index: 100; pointer-events: none; }
        .back { margin-top: 15px; background: none; box-shadow: none; text-decoration: underline; color: #aaa; }
      `}</style>
    </div>
  );
}

export default App;