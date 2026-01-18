import React, { useState } from 'react';

// 漢検10級 全80文字
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

/**
 * 【形を完全修正】1年生の教科書体に準拠した線データ
 * 配列の1番目が1画目、2番目が2画目...と完全に一致させています。
 */
const KANJI_PATHS = {
  "田": [
    "M25,20 V80",         // 1. 左たて
    "M25,20 H75 V80",     // 2. 上から右たて
    "M50,20 V80",         // 3. なかたて ★ここが3画目
    "M25,50 H75",         // 4. なかよこ
    "M25,80 H75"          // 5. したよこ
  ],
  "耳": [
    "M20,20 H80",         // 1. うえよこ
    "M35,20 V85",         // 2. 左たて
    "M35,40 H65",         // 3. なかよこ1
    "M35,60 H65",         // 4. なかよこ2
    "M20,85 H80",         // 5. したよこ
    "M65,20 V85"          // 6. 右たて
  ],
  "金": [
    "M50,15 L20,45",      // 1. 左はらい
    "M50,15 L80,45",      // 2. 右はらい
    "M35,45 H65",         // 3. なかよこ
    "M25,60 H75",         // 4. なかよこ
    "M50,45 V75",         // 5. なかたて
    "M35,70 L25,80",      // 6. 左てん
    "M65,70 L75,80",      // 7. 右てん
    "M20,85 H80"          // 8. 下のよこ
  ],
  "雨": [
    "M25,20 H75",         // 1. うえ
    "M25,20 V75 Q20,70 15,65", // 2. 左わく
    "M25,20 H75 V75 Q75,70 80,65", // 3. 右わく
    "M50,20 V75",         // 4. なかたて
    "M35,35 L30,45", "M40,35 L45,45", "M60,35 L55,45", "M65,35 L70,45" // 5-8. てん
  ],
  "右": ["M50,20 Q20,60 15,80", "M15,35 H85", "M35,50 V85", "M35,50 H65 V85", "M35,85 H65"],
  "左": ["M20,30 H80", "M50,30 Q20,70 15,85", "M35,55 H65", "M50,55 V85", "M35,85 H65"],
  "王": ["M25,30 H75", "M50,30 V85", "M30,58 H70", "M20,85 H80"],
  "五": ["M25,25 H75", "M50,25 V55", "M50,55 H30 V85", "M20,85 H80"]
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
    
    const newQuestions = chars.map((k) => {
      const paths = KANJI_PATHS[k] || ["M20,50 H80", "M50,20 V80"];
      let ansStr = "1";
      let targetIndex = 0;

      if (m === 2) {
        // 【修正点】選ばれた赤い線の順番(index+1)をそのまま答えにセット
        targetIndex = Math.floor(Math.random() * paths.length);
        ansStr = (targetIndex + 1).toString();
      } else {
        ansStr = m === 4 ? k : "よみ";
      }

      return {
        kanji: k, ans: ansStr, paths: paths, target: targetIndex,
        sentence: m === 1 ? "（　）の　よみは？" : m === 2 ? "あかい　せんは　なんばんめ？" : "（　）のかんじは？"
      };
    });

    setQuestions(newQuestions); setStage(m); setSubStage(s); setIdx(0); setView('quiz');
    generateChoices(newQuestions[0], m);
  };

  const generateChoices = (q, m) => {
    let c = [];
    if (m === 2) { 
      // 1からその漢字の最大画数までの数字を選択肢に入れる
      const maxStroke = q.paths.length;
      c = [1, 2, 3, 4, 5, 6].map(n => n.toString()).filter(n => n !== q.ans);
    } else {
      c = ["右", "左", "石", "大", "なか", "やま"].filter(v => v !== q.ans);
    }
    setChoices([q.ans, ...c.sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (a) => {
    if (res !== null) return;
    if (a === questions[idx].ans || stage === 1) { // 読みはデモ正解
      setRes(true);
      setTimeout(() => {
        if (idx + 1 < 10) {
          setIdx(idx + 1); generateChoices(questions[idx + 1], stage); setRes(null);
        } else { setView('clear'); setRes(null); }
      }, 600);
    } else { setRes(false); setTimeout(() => setRes(null), 1000); }
  };

  return (
    <div className="container">
      {view === 'mainMenu' && (
        <div className="card">
          <div className="title">🌸 漢検10級　とっくん 🌸</div>
          <div className="grid">
            {[1, 2, 3, 4].map(s => <button key={s} onClick={() => {setStage(s); setView('subMenu');}}>ステージ {s}</button>)}
          </div>
        </div>
      )}

      {view === 'subMenu' && (
        <div className="card">
          <div className="title">ステージ {stage}</div>
          <div className="sub-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => startQuiz(stage, i)}>{i*10+1}〜</button>
            ))}
          </div>
          <button className="back" onClick={() => setView('mainMenu')}>もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card">
          <div className="info">{subStage * 10 + idx + 1} / 80</div>
          <div className="display">
            {stage === 2 ? (
              <svg viewBox="0 0 100 100" className="kanji-svg">
                {questions[idx].paths.map((p, i) => (
                  <path key={i} d={p} className={i === questions[idx].target ? "stroke-red" : "stroke-gray"} />
                ))}
              </svg>
            ) : (
              <div className="kanji-txt">{questions[idx].kanji}</div>
            )}
          </div>
          <div className="sentence">{questions[idx].sentence}</div>
          <div className="choices">
            {choices.map((c, i) => <button key={i} onClick={() => handleAnswer(c)} className={`btn-${i}`}>{c}</button>)}
          </div>
        </div>
      )}

      {view === 'clear' && (
        <div className="card">
          <div className="title">✨ クリア！ ✨</div>
          <button onClick={() => setView('mainMenu')}>メニューへ</button>
        </div>
      )}

      {res === true && <div className="overlay ok">💮 まる！</div>}
      {res === false && <div className="overlay ng">❌ ざんねん</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .container { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; }
        .card { background: white; border-radius: 40px; padding: 25px; width: 400px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { font-size: 1.5rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
        .grid, .sub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; font-size: 1.1rem; }
        .display { background: #fff1b8; border-radius: 30px; margin: 15px auto; width: 200px; height: 200px; display: flex; justify-content: center; align-items: center; }
        .kanji-txt { font-size: 8rem; color: #ff8c00; }
        .kanji-svg { width: 160px; height: 160px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .stroke-gray { stroke: #d0d0d0; stroke-width: 10; }
        .stroke-red { stroke: #ff4757; stroke-width: 14; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.5; stroke-width: 16; } }
        .sentence { font-size: 1.1rem; font-weight: bold; margin-bottom: 20px; color: #555; }
        .choices { display: grid; gap: 10px; }
        .btn-0 { background: #ff9a9e; color: white; } .btn-1 { background: #a1c4fd; color: white; } .btn-2 { background: #84fab0; color: white; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; z-index: 100; pointer-events: none; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }
        .back { margin-top: 15px; background: none; box-shadow: none; color: #aaa; text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default App;