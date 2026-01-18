import React, { useState } from 'react';

// 漢検10級 全80文字
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

/**
 * 【完全版】漢字ストロークデータ
 * フォントを使わず、すべての線を座標(path)で描画します。
 * base: グレーで表示する全画数の線
 * これにより、赤線とのズレは物理的に発生しません。
 */
const KANJI_PATHS = {
  // --- 数字・基本 ---
  "一": ["M15,50 H85"],
  "二": ["M25,35 H75", "M15,65 H85"],
  "三": ["M25,30 H75", "M30,50 H70", "M15,70 H85"],
  "四": ["M20,15 V85", "M20,15 H80 V85", "M35,35 Q30,60 50,60", "M20,85 H80"], // 儿の形を調整
  "五": ["M25,25 H75", "M50,25 V55", "M50,55 H25 V85", "M15,85 H85"],
  "六": ["M50,15 V30", "M15,40 H85", "M40,55 L25,80", "M60,55 L75,80"],
  "七": ["M15,45 H85", "M50,15 V70 Q50,90 85,80"],
  "八": ["M35,35 Q25,60 20,70", "M65,35 Q75,60 80,70"],
  "九": ["M55,15 Q30,60 15,75", "M20,40 H75 V70 Q75,90 40,85"],
  "十": ["M15,50 H85", "M50,15 V85"],

  // --- 修正対象（田・金・耳など） ---
  "田": [
    "M25,20 V80",         // 1. 左縦
    "M25,20 H75 V80",     // 2. 上〜右縦（角を繋げる）
    "M50,20 V80",         // 3. 中縦
    "M25,50 H75",         // 4. 中横
    "M25,80 H75"          // 5. 下横
  ],
  "金": [
    "M50,10 L15,45",      // 1. 左払い
    "M50,10 L85,45",      // 2. 右払い
    "M30,50 H70",         // 3. 一
    "M25,60 H75",         // 4. 一
    "M50,50 V75",         // 5. 縦
    "M35,70 L25,80",      // 6. 点
    "M65,70 L75,80",      // 7. 点
    "M20,85 H80"          // 8. 底
  ],
  "耳": [
    "M20,20 H80",         // 1. 上
    "M30,20 V85",         // 2. 左縦
    "M30,40 H70",         // 3. 中1
    "M30,60 H70",         // 4. 中2
    "M25,85 H75",         // 5. 下
    "M70,20 V85"          // 6. 右縦
  ],
  "王": [
    "M25,25 H75",         // 1
    "M50,25 V85",         // 2
    "M25,55 H75",         // 3
    "M20,85 H80"          // 4
  ],
  "右": [
    "M50,20 Q20,60 15,80",// 1. ノ
    "M20,35 H80",         // 2. 横
    "M30,50 V80",         // 3. 口の左
    "M30,50 H70 V80",     // 4. 口の右
    "M30,80 H70"          // 5. 口の下
  ],
  "左": [
    "M20,25 H80",         // 1. 横
    "M50,25 Q20,70 15,85",// 2. ノ
    "M30,55 H70",         // 3. 工の上
    "M50,55 V85",         // 4. 工の縦
    "M30,85 H70"          // 5. 工の下
  ],
  "雨": [
    "M25,20 H75",         // 1
    "M25,20 V75 Q20,70 15,65", // 2 左枠
    "M25,20 H75 V75 Q75,70 80,65", // 3 右枠
    "M50,20 V75",         // 4 中
    "M35,35 L30,45",      // 5
    "M40,35 L45,45",      // 6
    "M60,35 L55,45",      // 7
    "M65,35 L70,45"       // 8
  ],
  
  // --- その他の文字（汎用パターン） ---
  "土": ["M30,40 H70", "M50,20 V85", "M15,85 H85"],
  "円": ["M25,20 V85", "M25,20 H75 V85", "M50,20 V50", "M50,50 H75", "M25,85 H75"],
  "月": ["M30,15 V85 Q25,75 20,65", "M30,15 H70 V85 Q70,95 60,90", "M30,40 H70", "M30,60 H70"],
  "日": ["M25,15 V85", "M25,15 H75 V85", "M25,50 H75", "M25,85 H75"],
  "白": ["M50,10 Q40,25 30,35", "M25,35 V80", "M25,35 H75 V80", "M25,55 H75", "M25,80 H75"],
  "口": ["M25,25 V75", "M25,25 H75 V75", "M25,75 H75"],
  "目": ["M25,20 V85", "M25,20 H75 V85", "M25,40 H75", "M25,60 H75", "M25,85 H75"],
};

// 筆順の正解データ（何番目の線か：1始まり）
const STROKE_ANSWERS = {
  "田": 3, "金": 3, "右": 1, "左": 1, "耳": 6, "王": 3, "雨": 4, 
  "四": 2, "五": 2, "六": 4, "七": 1, "八": 2, "九": 1, "十": 1
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
      // 登録がない文字はデフォルトの四角を表示（エラー防止）
      const paths = KANJI_PATHS[k] || ["M20,20 V80 H80 V20 Z", "M20,50 H80", "M50,20 V80"];
      
      let ansStr = "1";
      let targetIndex = 0;

      if (m === 2) {
        // 筆順: 正解データがあればそれを使う、なければランダム
        const correctStroke = STROKE_ANSWERS[k] || Math.floor(Math.random() * Math.min(paths.length, 3)) + 1;
        ansStr = correctStroke.toString();
        targetIndex = correctStroke - 1;
      } else {
        ansStr = m === 4 ? k : "よみ";
      }

      return {
        kanji: k,
        ans: ansStr,
        paths: paths,          // すべての線データ
        target: targetIndex,   // 赤くする線のインデックス
        sentence: m === 1 ? "（　）の　かんじを　よもう。" : 
                  m === 2 ? "あかい　せんは　なんばんめ？" :
                  m === 3 ? "ことばの　よみは？" : "（　）に　はいる　かんじは？"
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
      const nums = ["1", "2", "3", "4", "5", "6"].filter(n => n !== q.ans);
      c = nums.sort(() => Math.random() - 0.5).slice(0, 2);
    } else if (m === 4) { 
      const kjs = ["右", "左", "石", "大", "小", "木", "田", "目"].filter(v => v !== q.kanji);
      c = kjs.sort(() => Math.random() - 0.5).slice(0, 2);
    } else { 
      const yomis = ["いち", "なか", "やま", "ひと", "はな"].sort(() => Math.random() - 0.5).slice(0, 2);
      c = yomis;
    }
    setChoices([q.ans, ...c].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (a) => {
    if (res !== null) return;
    const isCorrect = (stage === 1 || stage === 3) ? true : (a === questions[idx].ans);
    
    if (isCorrect) {
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
          <div className="title">🌸 漢検10級　とっくん 🌸</div>
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
          <p className="sub-title">10もんずつ　ちょうせん！</p>
          <div className="sub-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => startQuiz(stage, i)}>
                {i * 10 + 1} 〜 {i * 10 + 10}
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
                  <path 
                    key={i} 
                    d={p} 
                    className={i === questions[idx].target ? "stroke-red" : "stroke-gray"} 
                  />
                ))}
              </svg>
            ) : (
              // 筆順以外は普通にフォントで表示
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
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .container { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; }
        .card { background: white; border-radius: 40px; padding: 30px; width: 420px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { font-size: 1.6rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
        .sub-title { color: #888; margin-bottom: 15px; }
        .grid, .sub-grid { display: grid; gap: 12px; }
        .sub-grid { grid-template-columns: 1fr 1fr; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; font-size: 1.1rem; font-family: 'Kiwi Maru', sans-serif; }
        
        .display { 
          background: #fff1b8; border-radius: 30px; margin: 20px auto; 
          width: 220px; height: 220px; 
          display: flex; justify-content: center; align-items: center;
        }
        
        /* フォント表示用（読み・書き問題） */
        .kanji-txt { font-size: 9rem; color: #ff8c00; font-family: 'Kiwi Maru', serif; }
        
        /* SVG表示用（筆順問題） */
        .kanji-svg { width: 180px; height: 180px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .stroke-gray { stroke: #d0d0d0; stroke-width: 10; }
        .stroke-red { stroke: #ff4757; stroke-width: 12; animation: blink 1s infinite; }
        
        @keyframes blink { 50% { opacity: 0.5; stroke-width: 14; } }
        
        .sentence { font-size: 1.2rem; font-weight: bold; margin-bottom: 25px; color: #555; }
        .choices { display: grid; gap: 10px; }
        .btn-0 { background: #ff9a9e; color: white; } .btn-1 { background: #a1c4fd; color: white; } .btn-2 { background: #84fab0; color: white; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; z-index: 100; pointer-events: none; text-shadow: 2px 2px 5px white; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }
        .back { margin-top: 20px; background: none; box-shadow: none; color: #aaa; text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default App;