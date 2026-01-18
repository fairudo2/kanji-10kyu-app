import React, { useState } from 'react';

// 漢検10級 全80文字リスト
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 【重要】80文字すべての「筆順問題（赤マーカーの位置）」データ
// x, y: マーカーの位置(%), type: 線の形 (yoko:横, tate:縦, naname:斜め, ten:点)
const STROKE_MAP = {
  "一": { a: "1", x: 50, y: 50, type: "yoko" },
  "二": { a: "2", x: 50, y: 70, type: "yoko" }, // 2画目（下の横棒）
  "三": { a: "2", x: 50, y: 50, type: "yoko" }, // 2画目（中の横棒）
  "四": { a: "2", x: 25, y: 50, type: "tate" }, // 2画目（L字の縦）
  "五": { a: "2", x: 25, y: 50, type: "tate" }, // 2画目（縦棒）
  "六": { a: "4", x: 65, y: 70, type: "ten" }, // 4画目（右の点）
  "七": { a: "1", x: 30, y: 45, type: "yoko" }, // 1画目（横）
  "八": { a: "2", x: 70, y: 60, type: "naname" }, // 2画目（右払い）
  "九": { a: "1", x: 35, y: 40, type: "naname" }, // 1画目（左払い）
  "十": { a: "1", x: 50, y: 50, type: "yoko" }, // 1画目（横）
  "百": { a: "2", x: 30, y: 40, type: "naname" }, // 2画目（左払い）
  "千": { a: "1", x: 50, y: 40, type: "naname" }, // 1画目（左払い）
  "上": { a: "1", x: 50, y: 30, type: "tate" }, // 1画目（縦）
  "下": { a: "3", x: 70, y: 60, type: "ten" }, // 3画目（点）
  "左": { a: "1", x: 50, y: 35, type: "yoko" }, // 1画目（横）★重要
  "右": { a: "1", x: 35, y: 35, type: "naname" }, // 1画目（払い）★重要
  "中": { a: "4", x: 50, y: 50, type: "tate" }, // 4画目（真ん中）
  "大": { a: "2", x: 30, y: 60, type: "naname" }, // 2画目（左払い）
  "小": { a: "1", x: 50, y: 50, type: "tate" }, // 1画目（真ん中）
  "月": { a: "1", x: 30, y: 50, type: "naname" }, // 1画目（左払い）
  "日": { a: "2", x: 70, y: 50, type: "tate" }, // 2画目（右縦）
  "火": { a: "2", x: 80, y: 40, type: "ten" }, // 2画目（右点）
  "水": { a: "1", x: 50, y: 50, type: "tate" }, // 1画目（縦ハネ）
  "木": { a: "2", x: 50, y: 30, type: "tate" }, // 2画目（縦）
  "金": { a: "1", x: 40, y: 25, type: "naname" }, // 1画目（左払い）
  "土": { a: "1", x: 50, y: 35, type: "yoko" }, // 1画目（横）
  "山": { a: "1", x: 50, y: 50, type: "tate" }, // 1画目（真ん中）
  "川": { a: "2", x: 50, y: 40, type: "tate" }, // 2画目（真ん中）
  "田": { a: "3", x: 50, y: 50, type: "yoko" }, // 3画目（中の横）★重要
  "石": { a: "1", x: 50, y: 25, type: "yoko" }, // 1画目（横）
  "花": { a: "1", x: 30, y: 20, type: "yoko" },
  "草": { a: "1", x: 30, y: 20, type: "yoko" },
  "林": { a: "4", x: 40, y: 60, type: "naname" },
  "森": { a: "12", x: 80, y: 80, type: "naname" }, // ※画数が多いので最後の払い
  "竹": { a: "1", x: 30, y: 30, type: "naname" },
  "虫": { a: "5", x: 50, y: 80, type: "yoko" }, // 最後の点
  "貝": { a: "7", x: 70, y: 80, type: "ten" },
  "犬": { a: "4", x: 75, y: 25, type: "ten" }, // 右上の点
  "足": { a: "1", x: 50, y: 30, type: "tate" },
  "手": { a: "4", x: 50, y: 50, type: "tate" }, // 最後のハネ
  "目": { a: "2", x: 70, y: 50, type: "tate" },
  "耳": { a: "1", x: 50, y: 20, type: "yoko" },
  "口": { a: "2", x: 70, y: 50, type: "tate" },
  "力": { a: "1", x: 50, y: 40, type: "tate" },
  "人": { a: "1", x: 40, y: 40, type: "naname" },
  "子": { a: "2", x: 50, y: 40, type: "tate" }, // カギ
  "女": { a: "1", x: 40, y: 40, type: "naname" }, // くの字
  "男": { a: "1", x: 30, y: 30, type: "tate" },
  "名": { a: "1", x: 35, y: 25, type: "naname" },
  "正": { a: "1", x: 50, y: 20, type: "yoko" },
  "生": { a: "3", x: 50, y: 50, type: "yoko" },
  "立": { a: "1", x: 50, y: 20, type: "tate" },
  "休": { a: "1", x: 30, y: 40, type: "naname" },
  "出": { a: "1", x: 50, y: 50, type: "tate" },
  "入": { a: "1", x: 40, y: 30, type: "naname" },
  "見": { a: "4", x: 30, y: 50, type: "tate" },
  "音": { a: "1", x: 50, y: 20, type: "tate" },
  "学": { a: "1", x: 30, y: 20, type: "ten" },
  "校": { a: "3", x: 40, y: 60, type: "naname" },
  "文": { a: "1", x: 50, y: 20, type: "ten" },
  "字": { a: "1", x: 50, y: 20, type: "ten" },
  "早": { a: "1", x: 50, y: 20, type: "tate" },
  "夕": { a: "1", x: 40, y: 30, type: "naname" },
  "空": { a: "1", x: 50, y: 20, type: "ten" },
  "気": { a: "1", x: 40, y: 25, type: "naname" },
  "天": { a: "1", x: 50, y: 30, type: "yoko" },
  "赤": { a: "1", x: 50, y: 20, type: "yoko" },
  "青": { a: "1", x: 50, y: 20, type: "yoko" },
  "白": { a: "1", x: 40, y: 30, type: "naname" },
  "糸": { a: "1", x: 35, y: 30, type: "naname" },
  "車": { a: "5", x: 50, y: 50, type: "tate" }, // 中の縦
  "町": { a: "1", x: 30, y: 30, type: "tate" },
  "村": { a: "1", x: 30, y: 40, type: "yoko" },
  "王": { a: "3", x: 50, y: 50, type: "yoko" }, // 中の横 ★重要
  "玉": { a: "3", x: 50, y: 50, type: "yoko" },
  "円": { a: "1", x: 25, y: 50, type: "tate" },
  "先": { a: "1", x: 40, y: 25, type: "naname" }, // 左払い ★重要
  "年": { a: "3", x: 50, y: 50, type: "yoko" },
  "雨": { a: "1", x: 50, y: 20, type: "yoko" },
};

// マーカーがない場合のデフォルト
const DEFAULT_STROKE = { a: "1", x: 50, y: 50, type: "yoko" };

function App() {
  const [view, setView] = useState('mainMenu');
  const [stage, setStage] = useState(1);
  const [subStage, setSubStage] = useState(0);
  const [qList, setQList] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  const startQuiz = (m, s) => {
    const startIdx = s * 10;
    const chars = KANJI_80.slice(startIdx, startIdx + 10);
    
    // データ作成
    const newQuestions = chars.map((k) => {
      // 筆順マップからデータを取得、なければデフォルト
      const sData = STROKE_MAP[k] || DEFAULT_STROKE;
      
      return {
        kanji: k,
        // ステージによって正解を変える
        ans: m === 2 ? sData.a : (m === 4 ? k : "よみ"), 
        // 筆順用のデータ
        sx: sData.x, sy: sData.y, stype: sData.type,
        // ステージ1,3,4用のダミー文
        sentence: m === 1 ? "（　）の　かんじを　よもう。" : 
                  m === 2 ? "あかい　ところの　せんは　なんばんめ？" :
                  m === 3 ? "ことばの　よみは？" : "（　）に　はいる　かんじは？"
      };
    });

    setQList(newQuestions);
    setStage(m);
    setSubStage(s);
    setIdx(0);
    setView('quiz');
    generateChoices(newQuestions[0], m);
  };

  const generateChoices = (q, m) => {
    let c = [];
    if (m === 2) { // 筆順は数字
      c = ["1", "2", "3", "4", "5", "6"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    } else if (m === 4) { // 書きは漢字
      c = ["右", "左", "石", "大", "小", "木"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    } else { // 読みはひらがな
      c = ["いち", "なか", "やま", "ひと", "はな"].filter(v => v !== q.ans).sort(() => Math.random() - 0.5).slice(0, 2);
    }
    setChoices([q.ans, ...c].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (a) => {
    if (res !== null) return;
    // ステージ1,3は読み問題だが、ここではデモとして正解を固定（本来は読みデータが必要）
    // 筆順(2)と書き(4)は正確に判定
    const isCorrect = (stage === 1 || stage === 3) ? true : (a === qList[idx].ans);
    
    if (isCorrect) {
      setRes(true);
      setTimeout(() => {
        if (idx + 1 < 10) {
          setIdx(idx + 1);
          generateChoices(qList[idx + 1], stage);
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
            {/* 漢字を表示 */}
            <div className="kanji-base">{qList[idx].kanji}</div>
            
            {/* 筆順ステージのみ、赤いマーカーを重ねる */}
            {stage === 2 && (
              <div 
                className={`marker ${qList[idx].stype}`} 
                style={{ left: `${qList[idx].sx}%`, top: `${qList[idx].sy}%` }}
              ></div>
            )}
          </div>
          <div className="sentence">{qList[idx].sentence}</div>
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
        
        .display { background: #fff1b8; border-radius: 30px; margin: 20px auto; width: 200px; height: 200px; position: relative; overflow: hidden; }
        .kanji-base { font-size: 9rem; color: #ff8c00; line-height: 200px; font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif; position: absolute; width: 100%; text-align: center; top: 0; left: 0; z-index: 1; }
        
        /* マーカーの設定：絶対配置で漢字の上に置く */
        .marker { position: absolute; background: rgba(255, 0, 0, 0.7); z-index: 2; transform: translate(-50%, -50%); border-radius: 5px; animation: blink 1s infinite; }
        .marker.yoko { width: 60px; height: 10px; }
        .marker.tate { width: 10px; height: 60px; }
        .marker.naname { width: 40px; height: 10px; transform: translate(-50%, -50%) rotate(45deg); }
        .marker.ten { width: 20px; height: 20px; border-radius: 50%; }
        
        @keyframes blink { 50% { opacity: 0.3; } }
        
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