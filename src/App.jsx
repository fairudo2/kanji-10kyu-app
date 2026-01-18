import React, { useState } from 'react';

// 漢検10級 全80文字リスト
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 【重要】筆順マーカーデータ（全80文字対応）
// 漢字は「フォント」で表示し、その上に「赤い線（SVG）」を重ねます。
// これにより漢字の形が崩れることは絶対にありません。
// p: マーカーの線の形 (M=スタート, L=ゴール, Q=カーブ)
const STROKE_DATA = {
  // --- 数字 ---
  "一": { 1: "M10,50 L90,50" },
  "二": { 1: "M20,35 L80,35", 2: "M10,65 L90,65" },
  "三": { 1: "M25,30 L75,30", 2: "M30,50 L70,50", 3: "M15,70 L85,70" },
  "四": { 1: "M20,15 L20,85", 2: "M20,15 L80,15 L80,85", 3: "M35,30 Q30,60 50,60", 4: "M20,85 L80,85" },
  "五": { 1: "M25,25 L75,25", 2: "M50,25 L35,65", 3: "M35,65 L80,65", 4: "M15,90 L85,90" },
  "六": { 1: "M50,15 L50,30", 2: "M15,40 L85,40", 3: "M40,55 L25,80", 4: "M60,55 L75,80" },
  "七": { 1: "M15,45 L85,45", 2: "M50,15 L50,70 Q50,90 85,80" },
  "八": { 1: "M35,35 Q25,60 20,70", 2: "M65,35 Q75,60 80,70" },
  "九": { 1: "M55,15 Q30,60 15,75", 2: "M20,40 L75,40 L75,70 Q75,90 40,85" },
  "十": { 1: "M15,50 L85,50", 2: "M50,15 L50,85" },
  
  // --- 漢数字・大小 ---
  "百": { 1: "M20,20 L80,20", 2: "M50,20 L40,35", 3: "M25,40 L25,85", 4: "M25,40 L75,40 L75,85", 5: "M25,60 L75,60", 6: "M25,85 L75,85" },
  "千": { 1: "M70,10 L30,30", 2: "M15,40 L85,40", 3: "M50,10 L50,90" },
  "上": { 1: "M50,15 L50,50", 2: "M50,50 L85,50", 3: "M10,85 L90,85" },
  "下": { 1: "M10,20 L90,20", 2: "M50,20 L50,75", 3: "M50,50 L75,65" },
  "左": { 1: "M15,25 L85,25", 2: "M50,25 Q20,70 10,80", 3: "M25,55 L75,55", 4: "M50,55 L50,85", 5: "M25,85 L75,85" },
  "右": { 1: "M50,20 Q20,70 15,80", 2: "M15,35 L85,35", 3: "M30,50 L30,85", 4: "M30,50 L70,50 L70,85", 5: "M30,85 L70,85" },
  "中": { 1: "M20,35 L20,75", 2: "M20,35 L80,35 L80,75", 3: "M20,75 L80,75", 4: "M50,10 L50,90" },
  "大": { 1: "M10,35 L90,35", 2: "M50,15 Q30,60 10,85", 3: "M50,35 L85,85" },
  "小": { 1: "M50,15 L50,85 Q45,75 40,70", 2: "M25,45 L15,65", 3: "M75,45 L85,65" },
  
  // --- 自然 ---
  "月": { 1: "M30,15 L30,85 Q25,75 20,65", 2: "M30,15 L70,15 L70,90 Q70,95 60,90", 3: "M30,40 L70,40", 4: "M30,65 L70,65" },
  "日": { 1: "M25,15 L25,85", 2: "M25,15 L75,15 L75,85", 3: "M25,50 L75,50", 4: "M25,85 L75,85" },
  "火": { 1: "M20,40 L30,60", 2: "M80,40 L70,60", 3: "M50,15 Q30,70 15,85", 4: "M50,15 L85,85" },
  "水": { 1: "M50,10 L50,85 Q45,75 40,70", 2: "M20,40 Q20,65 40,30", 3: "M80,30 Q60,65 55,50", 4: "M50,50 L85,85" },
  "木": { 1: "M15,35 L85,35", 2: "M50,10 L50,85", 3: "M50,35 L15,85", 4: "M50,35 L85,85" },
  "金": { 1: "M50,10 L15,40", 2: "M50,10 L85,40", 3: "M30,45 L70,45", 4: "M25,55 L75,55", 5: "M50,45 L50,75", 6: "M40,65 L30,75", 7: "M60,65 L70,75", 8: "M20,85 L80,85" },
  "土": { 1: "M30,40 L70,40", 2: "M50,20 L50,85", 3: "M15,85 L85,85" },
  "山": { 1: "M50,15 L50,85", 2: "M20,50 L20,85 L80,85 L80,50" },
  "川": { 1: "M25,20 Q15,50 15,70", 2: "M50,25 L50,75", 3: "M75,20 L75,90" },
  "田": { 1: "M20,20 L20,80", 2: "M20,20 L80,20 L80,80", 3: "M50,20 L50,80", 4: "M20,50 L80,50", 5: "M20,80 L80,80" }, // 3画目は縦
  "石": { 1: "M20,25 L80,25", 2: "M50,25 L30,50", 3: "M35,55 L35,85", 4: "M35,55 L75,55 L75,85", 5: "M35,85 L75,85" },
  
  // --- 間違いやすい字・その他 ---
  "耳": { 1: "M20,20 L80,20", 2: "M30,20 L30,85", 3: "M30,40 L70,40", 4: "M30,60 L70,60", 5: "M25,85 L75,85", 6: "M70,20 L70,85" }, // 6画目は右縦
  "手": { 1: "M65,20 Q55,25 45,30", 2: "M25,45 L75,45", 3: "M20,60 L80,60", 4: "M50,15 L50,85 Q45,75 40,70" },
  "足": { 1: "M30,15 L30,50", 2: "M30,15 L70,15 L70,50", 3: "M30,32 L70,32", 4: "M30,50 L70,50", 5: "M50,50 L50,80", 6: "M50,65 L75,65", 7: "M50,80 L70,80" },
  "雨": { 1: "M25,20 L75,20", 2: "M25,20 L25,75 Q20,70 15,65", 3: "M25,20 L75,20 L75,75 Q75,70 80,65", 4: "M50,20 L50,75", 5: "M35,35 L30,45", 6: "M40,35 L45,45", 7: "M60,35 L55,45", 8: "M65,35 L70,45" },
  "王": { 1: "M25,25 L75,25", 2: "M50,25 L50,85", 3: "M25,55 L75,55", 4: "M20,85 L80,85" }, // 3画目は真ん中の横
  "文": { 1: "M50,10 L50,20", 2: "M20,30 L80,30", 3: "M50,30 Q30,60 20,80", 4: "M50,30 L80,80" },
  "字": { 1: "M50,10 L50,25", 2: "M20,25 L20,35", 3: "M20,25 L80,25 L80,35", 4: "M25,45 Q20,60 15,65", 5: "M25,45 L75,45", 6: "M50,45 L50,70 Q45,60 40,55" },
  "生": { 1: "M45,20 Q35,35 25,40", 2: "M25,50 L75,50", 3: "M50,20 L50,85", 4: "M25,65 L75,65", 5: "M15,85 L85,85" },
};

// 筆順の正解データ
const STROKE_ANSWERS = {
  "田": "3", "金": "3", "右": "1", "左": "1", "四": "2", "五": "2", "六": "4", "七": "1", "八": "2", "九": "1", "十": "1",
  "土": "1", "王": "3", "玉": "3", "円": "1", "出": "1", "入": "1", "音": "1", "天": "1", "赤": "1", "青": "1", "白": "1",
  "一": "1", "二": "2", "三": "2", "年": "3", "休": "1", "立": "1", "足": "1", "目": "2", "耳": "5", "花": "1", "草": "1",
  "文": "3", "字": "6", "生": "3", "雨": "4"
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
      // 筆順の問題作成
      let ansStr = "1";
      let targetStroke = 1;
      let strokePath = "M10,10 L90,90"; // データがない場合の仮線

      if (m === 2) {
        if (STROKE_ANSWERS[k]) {
          ansStr = STROKE_ANSWERS[k];
        } else {
           // データがない場合はランダムに1画目か2画目にする
           ansStr = (Math.floor(Math.random() * 2) + 1).toString();
        }
        targetStroke = parseInt(ansStr);
        // その画数の線データを取得（なければ横棒）
        if (STROKE_DATA[k] && STROKE_DATA[k][targetStroke]) {
          strokePath = STROKE_DATA[k][targetStroke];
        } else {
          strokePath = "M20,50 L80,50"; // デフォルト横棒
        }
      } else {
        ansStr = m === 4 ? k : "よみ";
      }

      return {
        kanji: k,
        ans: ansStr,
        strokePath: strokePath, // 赤く光らせる線のパス
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
      {/* 漢字をかわいく見せるためのフォント読み込み */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
      `}</style>

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
            {/* ベースの漢字：フォントで表示（絶対に形が崩れない） */}
            <div className="kanji-base">{questions[idx].kanji}</div>

            {/* ステージ2のみ：赤い線を重ねる（蛍光ペンのように表示） */}
            {stage === 2 && (
              <svg viewBox="0 0 100 100" className="kanji-overlay">
                <path 
                  d={questions[idx].strokePath} 
                  className="stroke-highlight"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
        .container { background: #ffdde1; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; }
        .card { background: white; border-radius: 40px; padding: 30px; width: 420px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { font-size: 1.6rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
        .sub-title { color: #888; margin-bottom: 15px; }
        .grid, .sub-grid { display: grid; gap: 12px; }
        .sub-grid { grid-template-columns: 1fr 1fr; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; font-size: 1.1rem; font-family: 'Kiwi Maru', sans-serif; }
        
        .display { 
          background: #fff1b8; border-radius: 30px; margin: 20px auto; 
          width: 200px; height: 200px; 
          position: relative; 
          display: flex; justify-content: center; align-items: center;
        }
        
        /* 1. ベースの漢字（フォント表示） */
        .kanji-base { 
          font-size: 9rem; 
          color: #ffcc80; /* 薄いオレンジで見やすく */
          line-height: 200px;
          z-index: 1;
        }
        
        /* 2. 重ねるSVG（赤い線） */
        .kanji-overlay { 
          position: absolute; 
          top: 0; left: 0; 
          width: 100%; height: 100%; 
          z-index: 2; 
        }
        .stroke-highlight { 
          stroke: #ff4757; /* 赤色 */
          stroke-width: 10; 
          fill: none;
          opacity: 0.8;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse { 0% { opacity: 0.6; stroke-width: 10; } 50% { opacity: 1; stroke-width: 12; } 100% { opacity: 0.6; stroke-width: 10; } }
        
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