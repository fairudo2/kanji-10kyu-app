import React, { useState } from 'react';

// 漢検10級 全80文字リスト
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 【決定版】全80文字のSVGストロークデータ
// 文字の形（パス）と、画数ごとのデータです。
// これにより、フォントに依存せず「線そのもの」を赤く光らせます。
const SVG_DATA = {
  // --- 数字 ---
  "一": ["M15,50 H85"],
  "二": ["M25,35 H75", "M15,65 H85"],
  "三": ["M25,30 H75", "M30,50 H70", "M15,70 H85"],
  "四": ["M25,20 V85", "M25,20 H75 V85", "M40,20 Q35,60 50,60", "M25,85 H75"], // 3画目は曲線（儿）
  "五": ["M25,25 H75", "M50,25 V55", "M50,55 H25 V85", "M15,85 H85"],
  "六": ["M50,20 L50,35", "M15,45 H85", "M40,55 L25,80", "M60,55 L75,80"],
  "七": ["M20,45 H80", "M50,20 V70 Q50,85 80,85"], // 2画目：縦から曲がる
  "八": ["M35,30 Q25,60 20,70", "M65,30 Q75,60 80,70"],
  "九": ["M50,20 Q30,60 15,70", "M20,40 H70 V70 Q70,90 40,80"],
  "十": ["M15,50 H85", "M50,15 V85"],
  
  // --- 単位・方向・大小 ---
  "百": ["M25,25 H75", "M50,25 L40,40", "M25,45 V85", "M25,45 H75 V85", "M25,65 H75", "M25,85 H75"],
  "千": ["M60,15 L30,35", "M20,45 H80", "M50,10 V90"],
  "上": ["M50,15 V50", "M50,50 H80", "M15,85 H85"],
  "下": ["M15,20 H85", "M50,20 V70", "M50,45 L70,60"],
  "左": ["M20,25 H80", "M50,25 Q20,70 15,80", "M30,55 H70", "M50,55 V85", "M30,85 H70"],
  "右": ["M50,20 Q20,70 15,80", "M20,35 H80", "M30,50 V80", "M30,50 H70 V80", "M30,80 H70"],
  "中": ["M20,30 V75", "M20,30 H80 V75", "M20,75 H80", "M50,10 V90"],
  "大": ["M15,35 H85", "M50,15 Q30,60 15,80", "M50,35 L80,80"],
  "小": ["M50,15 V80 Q45,70 40,65", "M25,40 L15,60", "M75,40 L85,60"],
  
  // --- 自然・曜日 ---
  "月": ["M30,20 V80 Q25,70 20,60", "M30,20 H70 V85 Q70,95 60,90", "M30,40 H70", "M30,60 H70"],
  "日": ["M25,20 V80", "M25,20 H75 V80", "M25,50 H75", "M25,80 H75"],
  "火": ["M20,40 L30,60", "M80,40 L70,60", "M50,20 Q30,70 20,80", "M50,20 L80,80"],
  "水": ["M50,10 V80 Q45,70 40,65", "M20,40 Q20,60 40,30", "M80,30 Q60,60 55,50", "M50,50 L85,85"],
  "木": ["M20,35 H80", "M50,15 V85", "M50,35 L20,80", "M50,35 L80,80"],
  "金": ["M50,15 L20,40", "M50,15 L80,40", "M30,45 H70", "M25,55 H75", "M50,45 V75", "M40,65 L30,75", "M60,65 L70,75", "M20,85 H80"],
  "土": ["M30,40 H70", "M50,20 V80", "M15,80 H85"],
  "山": ["M50,20 V80", "M20,50 V80 H80 V50"],
  "川": ["M25,20 Q15,50 15,70", "M50,25 V70", "M75,20 V85"],
  "田": ["M20,20 V80", "M20,20 H80 V80", "M50,20 V80", "M20,50 H80", "M20,80 H80"], // 3画目は縦
  "石": ["M25,25 H75", "M50,25 L30,50", "M35,55 V85", "M35,55 H75 V85", "M35,85 H75"],
  "花": ["M20,25 H80", "M35,15 V30", "M65,15 V30", "M60,40 L35,55", "M50,35 V75 Q45,65 40,60", "M50,55 Q60,70 75,65"], // 簡易表現
  "草": ["M20,25 H80", "M35,15 V30", "M65,15 V30", "M25,40 H75", "M50,35 L35,50", "M25,55 V85", "M25,55 H75 V85", "M25,70 H75", "M25,85 H75"],
  "林": ["M15,35 H45", "M30,20 V80", "M30,35 L15,70", "M30,35 L40,50", "M55,35 H85", "M70,20 V80", "M70,35 L55,70", "M70,35 L85,80"],
  "森": ["M15,30 H45", "M30,15 V45", "M30,30 L15,50", "M30,30 L40,40", "M55,30 H85", "M70,15 V45", "M70,30 L55,50", "M70,30 L85,50", "M20,70 H80", "M50,50 V90", "M50,70 L20,90", "M50,70 L80,90"], // 簡易
  "竹": ["M25,25 L15,40", "M25,25 H45", "M35,25 V70", "M75,25 L65,40", "M75,25 H95", "M85,25 V70 Q80,60 75,55"],
  "虫": ["M25,30 V70", "M25,30 H75 V70", "M25,70 H75", "M50,15 V75", "M20,85 L40,75", "M80,85 L60,75"],
  "貝": ["M25,15 V65", "M25,15 H75 V65", "M25,30 H75", "M25,45 H75", "M25,65 H75", "M40,70 L25,85", "M60,70 L75,85"],
  "犬": ["M25,35 H85", "M55,15 Q30,60 15,80", "M55,35 L80,80", "M75,15 L85,25"],
  
  // --- 体 ---
  "足": ["M25,15 V50", "M25,15 H75 V50", "M25,32 H75", "M25,50 H75", "M50,50 V80", "M50,65 H75", "M50,80 H70"],
  "手": ["M60,20 Q50,25 40,30", "M25,40 H75", "M20,55 H80", "M50,15 V80 Q45,70 40,65"],
  "目": ["M25,20 V80", "M25,20 H75 V80", "M25,40 H75", "M25,60 H75", "M25,80 H75"],
  "耳": ["M20,20 H80", "M30,20 V75", "M30,35 H60", "M30,50 H60", "M25,80 H60", "M70,20 V80"],
  "口": ["M25,25 V75", "M25,25 H75 V75", "M25,75 H75"],
  "力": ["M25,30 H75 V70 Q70,85 60,80", "M50,15 Q30,60 20,80"],
  
  // --- 人・学校 ---
  "人": ["M50,20 Q30,60 15,80", "M50,45 L85,85"],
  "子": ["M25,25 H70 Q50,60 40,55", "M50,15 V75 Q45,65 40,60", "M15,50 H85"],
  "女": ["M50,15 Q35,45 25,50 L75,85", "M75,25 Q40,60 25,85", "M15,50 H85"],
  "男": ["M25,20 V55", "M25,20 H75 V55", "M25,35 H75", "M25,55 H75", "M40,15 V60", "M60,65 Q30,80 20,90", "M50,65 Q70,80 80,90"], // 力の部分簡易
  "名": ["M35,20 Q25,40 15,50", "M35,30 H75", "M25,55 V85", "M25,55 H75 V85", "M25,85 H75"],
  "正": ["M20,20 H80", "M50,20 V50", "M50,50 H80", "M50,50 V80", "M20,80 H80"],
  "生": ["M45,20 Q30,35 25,40", "M25,50 H75", "M50,20 V80", "M25,65 H75", "M15,85 H85"],
  "立": ["M50,15 V30", "M25,30 H75", "M35,45 L25,60", "M65,45 L75,60", "M20,80 H80"],
  "休": ["M35,25 Q25,45 25,60", "M30,40 V80", "M55,30 H85", "M70,15 V85", "M70,30 L55,70", "M70,30 L85,70"],
  "出": ["M50,15 V45", "M20,45 V30 H80 V45", "M20,75 V60 H80 V75", "M50,45 V85", "M20,75 H80"],
  "入": ["M50,15 Q30,50 20,70", "M50,25 L80,70"],
  "見": ["M25,20 V60", "M25,20 H75 V60", "M25,35 H75", "M25,45 H75", "M25,60 H75", "M40,60 L25,80", "M60,60 L75,80"], // 簡易
  "音": ["M50,10 V20", "M20,20 H80", "M30,30 L20,45", "M70,30 L80,45", "M25,50 H75", "M25,60 V85", "M25,60 H75 V85", "M25,85 H75"],
  "学": ["M20,15 L30,25", "M50,10 L50,20", "M80,15 L70,25", "M15,30 H85", "M35,40 Q25,55 25,65 L75,65", "M50,35 V60 Q45,50 40,45"],
  "校": ["M20,35 H45", "M35,15 V85", "M35,35 L20,60", "M35,35 L45,60", "M65,15 V30", "M50,45 H80", "M55,55 L45,75", "M75,55 L85,75"],
  "文": ["M50,10 V20", "M20,30 H80", "M50,30 Q30,60 20,80", "M50,30 L80,80"],
  "字": ["M50,10 V20", "M20,20 L20,35", "M20,20 H80 L80,35", "M35,45 Q25,55 25,65 L75,65", "M50,40 V60 Q45,50 40,45"],
  "早": ["M25,15 V50", "M25,15 H75 V50", "M25,30 H75", "M25,50 H75", "M50,50 V85"],
  "夕": ["M35,15 Q20,40 20,55", "M35,25 H60 Q60,60 20,80", "M40,40 L50,55"],
  "空": ["M50,10 V20", "M20,20 L20,30", "M20,20 H80 L80,30", "M35,45 L20,60", "M35,45 H75", "M55,45 V70", "M25,85 H75"],
  "気": ["M35,15 Q20,25 20,35", "M35,25 H75", "M25,40 H70", "M50,40 L30,75", "M50,40 L75,60", "M50,40 V80 Q55,90 75,85"],
  "天": ["M30,25 H70", "M20,45 H80", "M50,45 Q30,70 20,85", "M50,45 L80,85"],
  "赤": ["M25,25 H75", "M50,25 V50", "M25,50 H75", "M35,60 L20,80", "M65,60 L80,80"],
  "青": ["M25,20 H75", "M50,20 V45", "M25,35 H75", "M25,45 V75", "M25,45 H75 V75", "M25,60 H75", "M25,75 H75"],
  "白": ["M45,15 Q35,25 35,35", "M25,35 V80", "M25,35 H75 V80", "M25,55 H75", "M25,80 H75"],
  "糸": ["M40,20 L30,35", "M55,20 L65,35", "M50,15 V45", "M30,50 L20,65", "M70,50 L80,65", "M50,65 V90", "M35,80 L25,90", "M65,80 L75,90"], // 簡易
  "車": ["M25,20 H75", "M25,35 V65", "M25,35 H75 V65", "M25,50 H75", "M25,65 H75", "M50,10 V80", "M20,80 H80"],
  "町": ["M25,20 V75", "M25,20 H55 V75", "M25,45 H55", "M25,75 H55", "M60,20 H80", "M70,20 V80 Q65,70 60,65"],
  "村": ["M25,35 H50", "M35,15 V85", "M35,35 L20,60", "M35,35 L50,60", "M60,35 H90", "M75,20 V85", "M65,60 L85,60"], // 簡易
  "王": ["M25,25 H75", "M50,25 V85", "M25,55 H75", "M20,85 H80"],
  "玉": ["M25,25 H75", "M50,25 V85", "M25,55 H75", "M20,85 H80", "M65,70 L75,80"],
  "円": ["M25,20 V80", "M25,20 H75 V80", "M50,20 V50", "M50,50 H75", "M25,80 H75"],
  "先": ["M35,15 Q25,25 25,30", "M25,30 H75", "M50,30 V60", "M50,60 H25", "M50,60 L40,80", "M50,60 L70,80"],
  "年": ["M45,15 Q35,25 35,30", "M25,35 H75", "M25,50 H75", "M25,50 V65", "M15,65 H85", "M50,15 V85"],
  "雨": ["M25,20 H75", "M25,20 V75", "M25,20 H75 V75 M50,20 V75", "M35,35 L30,45", "M40,35 L45,45", "M60,35 L55,45", "M65,35 L70,45"],
};

// 筆順の正解データ（SVGの何番目の線が正解か：1始まり）
const STROKE_ANSWERS = {
  "田": "3", "金": "3", "右": "1", "左": "1", "四": "2", "五": "2", "六": "4", "七": "1", "八": "2", "九": "1", "十": "1",
  "土": "1", "王": "3", "玉": "3", "円": "1", "出": "1", "入": "1", "音": "1", "天": "1", "赤": "1", "青": "1", "白": "1",
  "一": "1", "二": "2", "三": "2", "年": "3", "休": "1", "立": "1", "足": "1", "目": "2", "耳": "1", "花": "1", "草": "1",
  // 他はデフォルト設定でランダムに選ぶなどのロジックも可
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
      const paths = SVG_DATA[k] || ["M10,10 L90,90", "M90,10 L10,90"]; // データがない場合のバツ印（開発用）
      
      // 筆順の問題：正解データがあればそれを使う、なければ適当な画数をテストにする
      let ansStr = "1";
      let targetIdx = 0;

      if (m === 2) {
        if (STROKE_ANSWERS[k]) {
          ansStr = STROKE_ANSWERS[k];
          targetIdx = parseInt(ansStr) - 1;
        } else {
          // データ定義がない場合、ランダムに1画選んで問題にする
          targetIdx = Math.floor(Math.random() * Math.min(paths.length, 3));
          ansStr = (targetIdx + 1).toString();
        }
      } else {
        ansStr = m === 4 ? k : "よみ";
      }

      return {
        kanji: k,
        ans: ansStr,
        paths: paths,
        target: targetIdx,
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
    if (m === 2) { // 筆順
      // 正解以外の数字をランダムに2つ選ぶ
      const nums = ["1", "2", "3", "4", "5", "6"].filter(n => n !== q.ans);
      c = nums.sort(() => Math.random() - 0.5).slice(0, 2);
    } else if (m === 4) { // 書き
      const kjs = ["右", "左", "石", "大", "小", "木", "田", "目"].filter(v => v !== q.ans);
      c = kjs.sort(() => Math.random() - 0.5).slice(0, 2);
    } else { // 読み
      const yomis = ["いち", "なか", "やま", "ひと", "はな"].sort(() => Math.random() - 0.5).slice(0, 2);
      c = yomis;
    }
    setChoices([q.ans, ...c].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (a) => {
    if (res !== null) return;
    const isCorrect = (stage === 1 || stage === 3) ? true : (a === questions[idx].ans); // 読みはデモ正解
    
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
              // SVGで線を描画するモード
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
              // 通常の文字表示モード
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
        .card { background: white; border-radius: 40px; padding: 30px; width: 420px; text-align: center; border: 4px dashed #ffb6c1; }
        .title { font-size: 1.6rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
        .sub-title { color: #888; margin-bottom: 15px; }
        .grid, .sub-grid { display: grid; gap: 12px; }
        .sub-grid { grid-template-columns: 1fr 1fr; }
        button { padding: 15px; border-radius: 30px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #ffb6c1; font-size: 1.1rem; }
        
        .display { background: #fff1b8; border-radius: 30px; margin: 20px auto; width: 220px; height: 220px; display: flex; justify-content: center; align-items: center; }
        
        /* フォント表示用 */
        .kanji-txt { font-size: 9rem; color: #ff8c00; font-family: serif; }
        
        /* SVG表示用 */
        .kanji-svg { width: 180px; height: 180px; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .stroke-gray { stroke: #d0d0d0; stroke-width: 8; }
        .stroke-red { stroke: #ff4757; stroke-width: 12; animation: blink 1s infinite; }
        
        @keyframes blink { 50% { opacity: 0.5; } }
        
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