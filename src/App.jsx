import React, { useState } from 'react';

// 漢検10級 全80文字
const KANJI_80 = "一二三四五六七八九十百千上下左右中大小月日火水木金土山川田石花草林森竹虫貝犬足手目耳口力人子女男名正生立休出入見音学校文字早夕空気天赤青白糸車町村王玉円先年雨".split("");

// 読みデータ（音読み・訓読み）
const YOMI_DATA = {
  "一": ["いち", "ひと"], "二": ["に", "ふた"], "三": ["さん", "み"], "四": ["よん", "し"], "五": ["ご", "いつ"],
  "六": ["ろく", "む"], "七": ["なな", "しち"], "八": ["はち", "や"], "九": ["きゅう", "ここの"], "十": ["じゅう", "とお"],
  "百": ["ひゃく", "もも"], "千": ["せん", "ち"], "上": ["うえ", "じょう"], "下": ["した", "か"], "左": ["ひだり", "さ"],
  "右": ["みぎ", "ゆう"], "中": ["なか", "ちゅう"], "大": ["おお", "だい"], "小": ["ちい", "しょう"], "月": ["つき", "げつ"],
  "日": ["ひ", "にち"], "火": ["ひ", "か"], "水": ["みず", "すい"], "木": ["き", "もく"], "金": ["かね", "きん"],
  "土": ["つち", "ど"], "山": ["やま", "さん"], "川": ["かわ", "せん"], "田": ["た", "でん"], "石": ["いし", "せき"],
  "花": ["はな", "か"], "草": ["くさ", "そう"], "林": ["はやし", "りん"], "森": ["もり", "しん"], "竹": ["たけ", "ちく"],
  "虫": ["むし", "ちゅう"], "貝": ["かい", "ばい"], "犬": ["いぬ", "けん"], "足": ["あし", "そく"], "手": ["て", "しゅ"],
  "目": ["め", "もく"], "耳": ["みみ", "じ"], "口": ["くち", "こう"], "力": ["ちから", "りょく"], "人": ["ひと", "じん"],
  "子": ["こ", "し"], "女": ["おんな", "じょ"], "男": ["おとこ", "だん"], "名": ["な", "めい"], "正": ["ただ", "せい"],
  "生": ["いき", "せい"], "立": ["た", "りつ"], "休": ["やす", "きゅう"], "出": ["で", "しゅつ"], "入": ["はい", "にゅう"],
  "見": ["み", "けん"], "音": ["おと", "おん"], "学": ["まな", "がく"], "校": ["こう", "かせ"], "文": ["ふみ", "ぶん"],
  "字": ["じ", "あざ"], "早": ["はや", "そう"], "夕": ["ゆう", "せき"], "空": ["そら", "くう"], "気": ["き", "け"],
  "天": ["あま", "てん"], "赤": ["あか", "せき"], "青": ["あお", "せい"], "白": ["しろ", "はく"], "糸": ["いと", "し"],
  "車": ["くるま", "しゃ"], "町": ["まち", "ちょう"], "村": ["むら", "そん"], "王": ["おう", "のう"], "玉": ["たま", "ぎょく"],
  "円": ["えん", "まる"], "先": ["さき", "せん"], "年": ["とし", "ねん"], "雨": ["あめ", "う"]
};

function App() {
  const [view, setView] = useState('mainMenu');
  const [stage, setStage] = useState(1);
  const [subStage, setSubStage] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  // 問題作成ロジック（読み・書きのみ）
  const startQuiz = (m, s) => {
    const startIdx = s * 10;
    const chars = KANJI_80.slice(startIdx, startIdx + 10);
    
    const newQuestions = chars.map((k) => {
      // 読みデータを取得（なければデフォルト）
      const yomis = YOMI_DATA[k] || ["よみ"];
      const correctYomi = yomis[0]; // メインの読みを正解とする

      return {
        kanji: k,
        yomi: correctYomi,
        // ステージ1: 漢字を見て読みを答える
        // ステージ2: 読みを見て漢字を答える
        ans: m === 1 ? correctYomi : k, 
        questionText: m === 1 ? `「${k}」 の よみかたは？` : `「${correctYomi}」 と よむ かんじは？`
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
    if (m === 1) { 
      // 読み問題：他の漢字の読みを混ぜる
      const allYomis = Object.values(YOMI_DATA).map(v => v[0]);
      c = allYomis.filter(y => y !== q.yomi).sort(() => Math.random() - 0.5).slice(0, 2);
    } else { 
      // 書き問題：他の漢字を混ぜる
      c = KANJI_80.filter(k => k !== q.kanji).sort(() => Math.random() - 0.5).slice(0, 2);
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
          <div className="title">🌸 漢検10級　よみかき 🌸</div>
          <div className="grid">
            <button onClick={() => {setStage(1); setView('subMenu');}}>1. かんじの よみ</button>
            <button onClick={() => {setStage(2); setView('subMenu');}}>2. かんじの かき</button>
          </div>
        </div>
      )}

      {view === 'subMenu' && (
        <div className="card">
          <div className="title">ステージ {stage === 1 ? "よみ" : "かき"}</div>
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
            {/* 漢字、または読みを表示 */}
            <div className="main-text">
              {stage === 1 ? questions[idx].kanji : questions[idx].yomi}
            </div>
          </div>

          <div className="sentence">{questions[idx].questionText}</div>
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
          width: 220px; height: 180px; 
          display: flex; justify-content: center; align-items: center;
        }
        
        .main-text { font-size: 5rem; color: #ff8c00; font-weight: bold; }
        
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