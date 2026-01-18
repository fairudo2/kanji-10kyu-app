import React, { useState, useEffect } from 'react';

// 過去問の傾向に基づき、1年生が間違いやすい筆順を重点的に追加
const stageData = {
  1: [ // 大問1&3: よみ（文章題）
    { k: "夕", a: "ゆう", s: "（　）がたに　なった。" },
    { k: "赤", a: "あか", s: "（　）い　りんご。" },
    { k: "一", a: "いち", s: "（　）ねんせい。" },
    { k: "中", a: "なか", s: "バスの（　）。" },
    { k: "花", a: "はな", s: "（　）の　なまえ。" },
    { k: "月", a: "つき", s: "お（　）さまが　出る。" },
    { k: "金", a: "かね", s: "お（　）を　ためる。" },
    { k: "男", a: "おとこ", s: "（　）の　こ。" },
    { k: "白", a: "しろ", s: "（　）い　くも。" },
    { k: "入", a: "い", s: "おふろに（　）れる。" }
  ],
  2: [ // 大問2: かきじゅん（筆順） ※間違いやすい漢字を網羅
    { k: "右", a: "1", s: "「右」の 最初（1画目）は どれ？（ななめだよ）" },
    { k: "左", a: "1", s: "「左」の 最初（1画目）は どれ？（よこ棒だよ）" },
    { k: "五", a: "2", s: "「五」の 2画目は どこ？（たて棒だよ）" },
    { k: "王", a: "3", s: "「王」の 3画目は どこ？（3本目のよこ棒だよ）" },
    { k: "田", a: "3", s: "「田」の 3画目は どこ？（なかの よこ棒だよ）" },
    { k: "女", a: "1", s: "「女」の 最初（1画目）は どれ？（くの字だよ）" },
    { k: "子", a: "2", s: "「子」の 2画目は どこ？（カギの形だよ）" },
    { k: "九", a: "1", s: "「九」の 最初（1画目）は どれ？（はらいだよ）" },
    { k: "車", a: "5", s: "「車」の まん中の長い たて棒は 何画目？" },
    { k: "上", a: "1", s: "「上」の 最初（1画目）は どれ？（たて棒だよ）" }
  ],
  3: [ // 大問4&5: ことばのよみ（熟語・送り仮名）
    { k: "王女", a: "おうじょ", s: "「王女」の よみかたは？" },
    { k: "先生", a: "せんせい", s: "「先生」の よみかたは？" },
    { k: "力もち", a: "ら", s: "ちか（　）もち" },
    { k: "六年", a: "ね", s: "ろく（　）ん" },
    { k: "学ぶ", a: "な", s: "ま（　）ぶ" },
    { k: "出す", a: "だ", s: "（　）す" },
    { k: "休む", a: "やす", s: "（　）む" }
  ],
  4: [ // 大問6&7: かんじ書き（書き取り）
    { k: "雨", a: "雨", s: "（あめ）が ふる。" },
    { k: "石", a: "石", s: "（いし）を なげる。" },
    { k: "森", a: "森", s: "（もり）の なか。" },
    { k: "右", a: "右", s: "（みぎ）の 手。" },
    { k: "百", a: "百", s: "（ひゃく）えん だま。" },
    { k: "目", a: "目", s: "（め）を あける。" },
    { k: "足", a: "足", s: "（あし）が はやい。" }
  ]
};

function App() {
  const [view, setView] = useState('menu');
  const [stage, setStage] = useState(1);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);

  const start = (s) => {
    const list = [...stageData[s]].sort(() => Math.random() - 0.5);
    setStage(s); setIdx(0); setView('play'); make(list[0], s);
  };

  const make = (q, s) => {
    let others = [];
    if (s === 2) others = ["1", "2", "3", "4", "5", "6"].filter(v => v !== q.a);
    else if (s === 4) others = ["左", "白", "木", "田", "王", "目"];
    else others = ["き", "なか", "ひと", "やま", "みず", "おん"];
    
    let c = [q.a, ...others.sort(() => Math.random() - 0.5).slice(0, 2)];
    setChoices(c.sort(() => Math.random() - 0.5));
  };

  const check = (a) => {
    if (res !== null) return;
    const currentList = stageData[stage];
    if (a === currentList[idx].a) {
      setRes(true);
      setTimeout(() => {
        if (idx + 1 < currentList.length) {
          setIdx(idx + 1); make(currentList[idx + 1], stage); setRes(null);
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
          <div className="title">🌸 10きゅう ごうかく 特訓 🌸</div>
          <p className="sub">がんばる ステージを えらんでね！</p>
          <div className="grid">
            <button onClick={() => start(1)}>1. よみ (ぶん)</button>
            <button onClick={() => start(2)}>2. かきじゅん</button>
            <button onClick={() => start(3)}>3. よみ (ことば)</button>
            <button onClick={() => start(4)}>4. かんじ かき</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="q-idx">ステージ {stage} : {idx + 1} / {stageData[stage].length}</div>
          <div className="kanji-display">{stageData[stage][idx].k}</div>
          <div className="sentence-box">{stageData[stage][idx].s}</div>
          <div className="choices-grid">
            {choices.map((c, i) => <button key={i} onClick={() => check(c)} className={`choice-btn color-${i}`}>{c}</button>)}
          </div>
          <button onClick={() => setView('menu')} className="back-btn">メニューへ</button>
        </div>
      )}
      {res === true && <div className="overlay ok">✨ 💮 まる！ ✨</div>}
      {res === false && <div className="overlay ng">💧 ❌ ざんねん</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .app { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8); min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; padding: 15px; }
        .card { background: rgba(255,255,255,0.9); border-radius: 40px; padding: 30px; width: 100%; max-width: 420px; text-align: center; border: 4px dashed #ffb6c1; box-shadow: 0 10px 25px rgba(255,105,180,0.2); }
        .title { font-size: 1.6rem; color: #ff69b4; font-weight: bold; margin-bottom: 5px; }
        .sub { font-size: 0.9rem; color: #888; margin-bottom: 25px; }
        .grid { display: grid; gap: 15px; }
        button { padding: 18px; border-radius: 35px; border: none; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; box-shadow: 0 6px 0 #ffb6c1; font-size: 1.1rem; }
        button:active { transform: translateY(6px); box-shadow: none; }
        .kanji-display { font-size: 7rem; color: #ff8c00; margin: 15px 0; background: #fff1b8; border-radius: 30px; line-height: 1.2; }
        .sentence-box { font-size: 1.3rem; font-weight: bold; margin-bottom: 25px; min-height: 3.5rem; display: flex; align-items: center; justify-content: center; }
        .choices-grid { display: grid; gap: 12px; }
        .choice-btn { color: white; font-size: 1.6rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
        .color-0 { background: #ff9a9e; box-shadow: 0 6px 0 #e68a8e; }
        .color-1 { background: #a1c4fd; box-shadow: 0 6px 0 #89b0e5; }
        .color-2 { background: #84fab0; box-shadow: 0 6px 0 #72d998; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; z-index: 100; pointer-events: none; }
        .ok { color: #ff69b4; text-shadow: 3px 3px 0 #fff; } .ng { color: #5c9eff; text-shadow: 3px 3px 0 #fff; }
        .back-btn { margin-top: 25px; background: none; color: #aaa; text-decoration: underline; box-shadow: none; font-size: 0.9rem; }
      `}</style>
    </div>
  );
}

export default App;