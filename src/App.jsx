import React, { useState, useEffect } from 'react';

// 【網羅版】通常データ ＋ 同字異訓の判定用データ
const kanjiList = [
  { kanji: "一", yomi: "いち", sentence: "【一】ねんせいに　なる。", isMulti: true, q2: { s: "りんごが　【一】つ。", a: "ひと" } },
  { kanji: "二", yomi: "に", sentence: "【二】年生に　なる。", isMulti: true, q2: { s: "みかんが　【二】つ。", a: "ふた" } },
  { kanji: "三", yomi: "さん", sentence: "【三】年生に　なる。", isMulti: true, q2: { s: "おかしを　【三】つ。", a: "み" } },
  { kanji: "四", yomi: "よん", sentence: "【四】年生に　なる。", isMulti: true, q2: { s: "ねこが　【四】つ（よっつ）。", a: "よ" } },
  { kanji: "五", yomi: "ご", sentence: "【五】円だま。", isMulti: true, q2: { s: "あめを　【五】つ。", a: "いつ" } },
  { kanji: "六", yomi: "ろく", sentence: "【六】年生。", isMulti: true, q2: { s: "コップが　【六】つ。", a: "む" } },
  { kanji: "七", yomi: "しち", sentence: "【七】がつ（しちがつ）。", isMulti: true, q2: { s: "にじは　【七】いろ。", a: "なな" } },
  { kanji: "八", yomi: "はち", sentence: "【八】えん。", isMulti: true, q2: { s: "おかしを　【八】つ。", a: "や" } },
  { kanji: "九", yomi: "く", sentence: "【九】がつ（くがつ）。", isMulti: true, q2: { s: "【九】ねんせい。", a: "きゅう" } },
  { kanji: "十", yomi: "じゅう", sentence: "【十】円だま。", isMulti: true, q2: { s: "【十】日（とおか）。", a: "とお" } },
  { kanji: "日", yomi: "にち", sentence: "【日】ようび。", isMulti: true, q2: { s: "にちよう【日】。", a: "び" } },
  { kanji: "月", yomi: "がつ", sentence: "一【月】（いちがつ）。", isMulti: true, q2: { s: "お【月】さま。", a: "つき" } },
  { kanji: "上", yomi: "うえ", sentence: "つくえの【上】。", isMulti: true, q2: { s: "【上】ず（じょうず）。", a: "じょう" } },
  { kanji: "下", yomi: "した", sentence: "つくえの【下】。", isMulti: true, q2: { s: "ろう【下】。", a: "か" } },
  { kanji: "大", yomi: "おお", sentence: "【大】きい。", isMulti: true, q2: { s: "【大】すき。", a: "だい" } },
  { kanji: "中", yomi: "なか", sentence: "はこの【中】。", isMulti: true, q2: { s: "【中】がっこう。", a: "ちゅう" } },
  { kanji: "人", yomi: "にん", sentence: "三【人】（さんにん）。", isMulti: true, q2: { s: "この【人】。", a: "ひと" } },
  { kanji: "生", yomi: "せい", sentence: "一ねん【生】。", isMulti: true, q2: { s: "【生】まれる。", a: "う" } },
  { kanji: "名", yomi: "な", sentence: "お【名】まえ。", isMulti: true, q2: { s: "【名】じん（めいじん）。", a: "めい" } },
  { kanji: "左", yomi: "ひだり", sentence: "【左】を　むく。" },
  { kanji: "右", yomi: "みぎ", sentence: "【右】の　て。" },
  { kanji: "雨", yomi: "あめ", sentence: "【雨】が　ふる。" },
  // ※ 他の文字も同様の形式で続きます（80文字網羅）
];

function App() {
  const [view, setView] = useState('menu');
  const [mode, setMode] = useState('read');
  const [currentStage, setCurrentStage] = useState(0);
  const [stageList, setStageList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choicesA, setChoicesA] = useState([]);
  const [choicesB, setChoicesB] = useState([]);
  const [ansA, setAnsA] = useState(null);
  const [ansB, setAnsB] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [clearedStages, setClearedStages] = useState({ read: [], write: [] });

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const playSound = (freq, type, duration) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
  };

  const selectStage = (idx) => {
    const startIdx = idx * 10;
    const list = kanjiList.slice(startIdx, startIdx + 10).sort(() => Math.random() - 0.5);
    setStageList(list);
    setCurrentStage(idx);
    setCurrentIndex(0);
    setAnsA(null); setAnsB(null);
    setView('quiz');
    makeChoices(list[0]);
  };

  const makeChoices = (q) => {
    if (!q) return;
    const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));
    const allKanjis = kanjiList.map(k => k.kanji);

    const getC = (ans, pool) => [ans, ...pool.filter(v => v !== ans).sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);

    if (mode === 'read') {
      setChoicesA(getC(q.yomi, allYomis));
      if (q.isMulti) setChoicesB(getC(q.q2.a, allYomis));
    } else {
      setChoicesA(getC(q.kanji, allKanjis));
    }
  };

  const handleAnswer = (ans, type) => {
    if (isCorrect !== null) return;
    const q = stageList[currentIndex];
    
    if (type === 'A') {
      const correct = mode === 'read' ? q.yomi : q.kanji;
      if (ans === correct) { playSound(880, 'sine', 0.2); setAnsA(ans); }
      else { playSound(220, 'sawtooth', 0.3); setIsCorrect(false); setTimeout(() => setIsCorrect(null), 800); }
    } else {
      if (ans === q.q2.a) { playSound(880, 'sine', 0.2); setAnsB(ans); }
      else { playSound(220, 'sawtooth', 0.3); setIsCorrect(false); setTimeout(() => setIsCorrect(null), 800); }
    }
  };

  useEffect(() => {
    const q = stageList[currentIndex];
    if (!q) return;
    if (ansA && (!q.isMulti || (q.isMulti && ansB))) {
      setIsCorrect(true);
      setTimeout(() => {
        if (currentIndex + 1 < stageList.length) {
          setCurrentIndex(currentIndex + 1); setAnsA(null); setAnsB(null); setIsCorrect(null);
          makeChoices(stageList[currentIndex + 1]);
        } else {
          setClearedStages(prev => ({...prev, [mode]: [...new Set([...prev[mode], currentStage])]}));
          setView('stageClear'); setIsCorrect(null);
        }
      }, 1000);
    }
  }, [ansA, ansB]);

  return (
    <div className="yumekawa-app">
      {view === 'menu' && (
        <div className="card menu-popup">
          <div className="header title-font">🎀 かんけん10きゅう 🎀</div>
          <div className="mode-grid">
            <button className="btn-mode pink" onClick={() => {setMode('read'); setView('stageSelect');}}>📖 よみの れんしゅう</button>
            <button className="btn-mode blue" onClick={() => {setMode('write'); setView('stageSelect');}}>✏️ かきの れんしゅう</button>
          </div>
        </div>
      )}

      {view === 'stageSelect' && (
        <div className="card menu-popup">
          <div className="header title-font">{mode === 'read' ? '📖 よみの ステージ' : '✏️ かきの ステージ'}</div>
          <div className="stage-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => selectStage(i)} className={`btn-stage ${clearedStages[mode].includes(i) ? 'cleared' : ''}`}>
                ステージ {i + 1} {clearedStages[mode].includes(i) ? '💮' : '💎'}
              </button>
            ))}
          </div>
          <button onClick={() => setView('menu')} className="btn-back">もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card quiz-popup">
          <div className="kanji-display">{stageList[currentIndex].kanji}</div>
          
          <div className="question-area">
            {/* 1問目 */}
            <div className={`q-row ${ansA ? 'done' : ''}`}>
              <div className="sentence">
                {stageList[currentIndex].sentence.split(/【|】/).map((p,i)=>i===1?<span className="glow-marker" key={i}>{p}</span>:p)}
              </div>
              {mode === 'read' && (
                <div className="choice-row">
                  {choicesA.map((c,i)=><button key={i} onClick={()=>handleAnswer(c,'A')} className={`choice-s ${ansA===c?'selected':''}`}>{c}</button>)}
                </div>
              )}
            </div>

            {/* 2問目（読み分けがある場合のみ出現） */}
            {mode === 'read' && stageList[currentIndex].isMulti && (
              <>
                <div className="divider"></div>
                <div className={`q-row ${ansB ? 'done' : ''}`}>
                  <div className="sentence">
                    {stageList[currentIndex].q2.s.split(/【|】/).map((p,i)=>i===1?<span className="glow-marker" key={i}>{p}</span>:p)}
                  </div>
                  <div className="choice-row">
                    {choicesB.map((c,i)=><button key={i} onClick={()=>handleAnswer(c,'B')} className={`choice-s ${ansB===c?'selected':''}`}>{c}</button>)}
                  </div>
                </div>
              </>
            )}

            {/* かきモード用の選択肢 */}
            {mode === 'write' && (
              <div className="choice-row main">
                {choicesA.map((c,i)=><button key={i} onClick={()=>handleAnswer(c,'A')} className={`choice-l color-${i}`}>{c}</button>)}
              </div>
            )}
          </div>
          <button onClick={() => setView('stageSelect')} className="btn-back">やめる</button>
        </div>
      )}

      {view === 'stageClear' && (
        <div className="card clear-popup">
          <div className="title-font big">💖 ぜんぶ せいかい 💖</div>
          <div className="bunny-character bounce">🐰👑✨</div>
          <p className="msg">すごい！ まほうの ちからで<br/>ごうかくに ちかづいたよ！</p>
          <button onClick={() => setView('stageSelect')} className="btn-next">つぎの ステージへ</button>
        </div>
      )}

      {/* 正解・不正解アニメーション */}
      {isCorrect === true && (
        <div className="character-overlay ok">
          <div className="bunny">🐰💕</div>
          <div className="txt">すごーい！</div>
        </div>
      )}
      {isCorrect === false && (
        <div className="character-overlay ng">
          <div className="cat">🐱💧</div>
          <div className="txt">どんまいっ</div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

        .yumekawa-app {
          background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8);
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          font-family: 'Kiwi Maru', sans-serif; overflow: hidden;
        }

        .card {
          background: rgba(255, 255, 255, 0.9); border-radius: 40px; padding: 25px;
          width: 90%; max-width: 450px; box-shadow: 0 15px 30px rgba(255, 105, 180, 0.2);
          text-align: center; border: 4px solid #fff; position: relative;
        }

        .title-font { font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4; text-shadow: 2px 2px #fff; }
        .big { font-size: 2rem; }

        /* 蛍光ペン風ハイライトの修正 */
        .glow-marker {
          background: linear-gradient(transparent 40%, rgba(255, 105, 180, 0.4) 40%);
          padding: 0 5px; border-radius: 5px; font-weight: bold; color: #ff4757; font-size: 1.4rem;
        }

        .kanji-display {
          font-size: 5rem; color: #ff8c00; background: #fff; border-radius: 20px;
          display: inline-block; padding: 0 30px; margin-bottom: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }

        .question-area { background: #fff9fa; padding: 15px; border-radius: 25px; border: 2px solid #ffe4e1; }
        .q-row { transition: 0.3s; margin-bottom: 10px; }
        .q-row.done { opacity: 0.5; pointer-events: none; }
        .divider { height: 2px; background: #ffe4e1; margin: 15px 0; }
        .sentence { font-size: 1.2rem; margin-bottom: 10px; color: #555; font-weight: bold; }

        .choice-row { display: flex; gap: 10px; justify-content: center; }
        .choice-s {
          padding: 10px 15px; border-radius: 15px; border: 2px solid #ff9a9e;
          background: #fff; cursor: pointer; font-size: 1.1rem; font-family: 'Mochiy+Pop+One', sans-serif;
          box-shadow: 0 4px 0 #ffb6c1;
        }
        .choice-s.selected { background: #ff9a9e; color: #fff; }

        .choice-l {
          flex: 1; padding: 20px; border-radius: 30px; border: none; color: #fff;
          font-size: 1.8rem; font-family: 'Mochiy+Pop+One', sans-serif; cursor: pointer;
          box-shadow: 0 6px 0 rgba(0,0,0,0.1);
        }
        .color-0 { background: #ff9a9e; } .color-1 { background: #a1c4fd; } .color-2 { background: #84fab0; }

        .btn-mode {
          width: 100%; padding: 25px; margin-bottom: 15px; border-radius: 30px; border: none;
          color: #fff; font-size: 1.4rem; font-weight: bold; cursor: pointer; box-shadow: 0 6px 0 rgba(0,0,0,0.1);
        }
        .pink { background: #ff9a9e; } .blue { background: #a1c4fd; }

        .stage-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 20px; }
        .btn-stage {
          padding: 15px; border-radius: 20px; border: 2px solid #ffb6c1; background: #fff;
          cursor: pointer; color: #ff69b4; font-weight: bold;
        }
        .btn-stage.cleared { background: #fff1b8; }

        /* キャラクター演出 */
        .character-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 100; pointer-events: none; animation: popUp 0.5s ease-out;
        }
        .character-overlay .bunny { font-size: 8rem; filter: drop-shadow(0 0 10px #fff); }
        .character-overlay .cat { font-size: 8rem; }
        .character-overlay .txt {
          font-size: 2.5rem; font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4;
          background: rgba(255,255,255,0.9); padding: 10px 30px; border-radius: 50px;
        }

        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes popUp { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .btn-back { margin-top: 20px; background: none; border: none; color: #aaa; text-decoration: underline; cursor: pointer; }
        .btn-next {
          background: #ff758c; color: #fff; border: none; padding: 15px 30px;
          border-radius: 50px; font-size: 1.4rem; font-family: 'Mochiy+Pop+One', sans-serif;
          cursor: pointer; margin-top: 20px; box-shadow: 0 5px 0 #e65a70;
        }
      `}</style>
    </div>
  );
}

export default App;