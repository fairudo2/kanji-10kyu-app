import React, { useState, useEffect } from 'react';

// 漢検8級（小学3年生） 新出漢字200字対策版
// 10文字 × 20ステージ構成
const kanjiList = [
  // --- ステージ1 (1-10) ---
  { kanji: "悪", yomi: "わる", sentence: "【悪】い　ことを　しない。", isMulti: true, q2: { s: "【悪】人を　つかまえる。", a: "あく" } },
  { kanji: "安", yomi: "やす", sentence: "くだものが　【安】い。", isMulti: true, q2: { s: "【安】ぜんな　道を　あるく。", a: "あん" } },
  { kanji: "暗", yomi: "くら", sentence: "外が　【暗】くなる。", isMulti: true, q2: { s: "【暗】算で　こたえる。", a: "あん" } },
  { kanji: "医", yomi: "い", sentence: "【医】者さんに　いく。", isMulti: false },
  { kanji: "委", yomi: "い", sentence: "図書【委】員に　なる。", isMulti: false },
  { kanji: "意", yomi: "い", sentence: "自分の　【意】見を　いう。", isMulti: false },
  { kanji: "育", yomi: "そだ", sentence: "植物を　【育】てる。", isMulti: true, q2: { s: "体【育】の　じかん。", a: "いく" } },
  { kanji: "員", yomi: "いん", sentence: "駅の　係【員】さん。", isMulti: false },
  { kanji: "院", yomi: "いん", sentence: "病【院】に　いく。", isMulti: false },
  { kanji: "飲", yomi: "の", sentence: "水を　【飲】む。", isMulti: true, q2: { s: "【飲】料水の　ボトル。", a: "いん" } },

  // ステージ2以降の200文字目までは、今後順次追加予定（現在はプレースホルダ）
  ...Array(190).fill({ kanji: "未", yomi: "み", sentence: "【未】だ実装されていないよ。", isMulti: false })
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
  
  // 記録用（20ステージ分に拡張）
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [records, setRecords] = useState({ read: Array(20).fill(null), write: Array(20).fill(null) });

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

  useEffect(() => {
    const saved = localStorage.getItem('kanken8_records');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let timer;
    if (view === 'quiz' && startTime > 0) {
      timer = setInterval(() => {
        setCurrentTime(((Date.now() - startTime) / 1000).toFixed(1));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [view, startTime]);

  const selectStage = (idx) => {
    const startIdx = idx * 10;
    const safeList = kanjiList.slice(startIdx, startIdx + 10);
    if (safeList.length === 0) return;

    const list = [...safeList].sort(() => Math.random() - 0.5);
    setStageList(list);
    setCurrentStage(idx);
    setCurrentIndex(0);
    setAnsA(null); setAnsB(null);
    setView('quiz');
    setStartTime(Date.now());
    setCurrentTime(0);
    makeChoices(list[0]);
  };

  const makeChoices = (q) => {
    if (!q) return;
    const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));
    const allKanjis = kanjiList.map(k => k.kanji);
    const getC = (ans, pool) => [ans, ...pool.filter(v => v !== ans).sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);

    if (mode === 'read') {
      setChoicesA(getC(q.yomi, allYomis));
      if (q.isMulti && q.q2) setChoicesB(getC(q.q2.a, allYomis));
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
    if (mode === 'read' && q.isMulti && q.q2) {
      if (ansA && ansB) nextQuestion();
    } else {
      if (ansA) nextQuestion();
    }
  }, [ansA, ansB]);

  const nextQuestion = () => {
    setIsCorrect(true);
    setTimeout(() => {
      if (currentIndex + 1 < stageList.length) {
        setCurrentIndex(currentIndex + 1); setAnsA(null); setAnsB(null); setIsCorrect(null);
        makeChoices(stageList[currentIndex + 1]);
      } else {
        finishStage();
      }
    }, 1000);
  };

  const finishStage = () => {
    const time = ((Date.now() - startTime) / 1000).toFixed(1);
    setFinalTime(time);
    const currentBest = records[mode][currentStage];
    let newRec = false;
    if (currentBest === null || parseFloat(time) < parseFloat(currentBest)) {
      newRec = true;
      const newRecords = { ...records };
      newRecords[mode][currentStage] = time;
      setRecords(newRecords);
      localStorage.setItem('kanken8_records', JSON.stringify(newRecords));
    }
    setIsNewRecord(newRec);
    setView('stageClear');
    setIsCorrect(null);
  };

  return (
    <div className="yumekawa-app">
      {view === 'menu' && (
        <div className="card menu-popup">
          <div className="header title-font">🌸 かんけん8きゅう 🌸</div>
          <p className="subtitle">小学3年生の かん字 (200字)</p>
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
            {[...Array(20)].map((_, i) => (
              <button key={i} onClick={() => selectStage(i)} className={`btn-stage ${records[mode][i] ? 'cleared' : ''}`}>
                <span className="stage-label">ステージ {i + 1}</span>
                {records[mode][i] ? <span className="best-time">👑 {records[mode][i]}s</span> : <span className="no-record">💎</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setView('menu')} className="btn-back">もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card quiz-popup">
          <div className="quiz-header">
            <div className="stage-info">ステージ {currentStage + 1} - {currentIndex + 1}/10</div>
            <div className="timer-badge">⏱️ {currentTime}</div>
          </div>
          <div className="kanji-display">
            {mode === 'read' ? stageList[currentIndex].kanji : stageList[currentIndex].yomi}
          </div>
          <div className="question-area">
            <div className={`q-row ${ansA ? 'done' : ''}`}>
              <div className="sentence">
                {stageList[currentIndex].sentence.split(/【|】/).map((p,i) => {
                  if (i === 1) {
                    return mode === 'read' ? <span className="glow-marker" key={i}>{p}</span> : <span className="blank-box" key={i}>⬜</span>;
                  }
                  return p;
                })}
              </div>
              {mode === 'read' && (
                <div className="choice-row">
                  {choicesA.map((c,i)=><button key={i} onClick={()=>handleAnswer(c,'A')} className={`choice-s ${ansA===c?'selected':''}`}>{c}</button>)}
                </div>
              )}
            </div>
            {mode === 'read' && stageList[currentIndex].isMulti && stageList[currentIndex].q2 && (
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
          <div className="title-font big">{isNewRecord ? "🎉 しんきろく！ 🎉" : "💖 クリア！ 💖"}</div>
          <div className="bunny-character bounce">{isNewRecord ? "🐰🏆✨" : "🐰🍭✨"}</div>
          <div className="result-time">
            <div className="time-label">タイム</div>
            <div className="time-value">{finalTime} <span className="unit">びょう</span></div>
          </div>
          <button onClick={() => setView('stageSelect')} className="btn-next">つぎへ</button>
        </div>
      )}

      {isCorrect === true && <div className="character-overlay ok"><div className="bunny">🐰💕</div><div className="txt">すごーい！</div></div>}
      {isCorrect === false && <div className="character-overlay ng"><div className="cat">🐱💧</div><div className="txt">どんまいっ</div></div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

        .yumekawa-app { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8); min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; }
        .card { background: rgba(255, 255, 255, 0.9); border-radius: 40px; padding: 20px; width: 95%; max-width: 480px; box-shadow: 0 15px 30px rgba(255, 105, 180, 0.2); text-align: center; border: 4px solid #fff; position: relative; }
        .title-font { font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4; text-shadow: 2px 2px #fff; font-size: 1.8rem; }
        .subtitle { color: #888; margin-top: -10px; font-weight: bold; }
        
        .stage-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; max-height: 350px; overflow-y: auto; padding: 10px; border-radius: 20px; background: rgba(255,255,255,0.5); }
        .btn-stage { padding: 10px; border-radius: 20px; border: 2px solid #ffb6c1; background: #fff; cursor: pointer; color: #ff69b4; font-weight: bold; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70px; }
        .btn-stage.cleared { background: #fff1b8; border-color: #ffd666; color: #d48806; }
        .best-time { font-family: 'Mochiy+Pop+One', sans-serif; color: #ff4757; }

        .kanji-display { font-size: 4rem; color: #ff8c00; background: #fff; border-radius: 20px; padding: 0 25px; margin-bottom: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .question-area { background: #fff9fa; padding: 15px; border-radius: 25px; border: 2px solid #ffe4e1; text-align: left; }
        .glow-marker { background: linear-gradient(transparent 50%, rgba(255, 105, 180, 0.4) 50%); font-weight: bold; color: #ff4757; font-size: 1.3rem; }
        .blank-box { display: inline-block; width: 1.5em; height: 1.5em; background: #eee; border: 2px dashed #aaa; border-radius: 5px; vertical-align: middle; }
        
        .choice-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 5px; }
        .choice-s { padding: 8px 15px; border-radius: 12px; border: 2px solid #ff9a9e; background: #fff; cursor: pointer; font-family: 'Mochiy+Pop+One', sans-serif; }
        .choice-s.selected { background: #ff9a9e; color: #fff; }
        .choice-l { flex: 1; padding: 15px; border-radius: 30px; border: none; color: #fff; font-size: 1.5rem; font-family: 'Mochiy+Pop+One', sans-serif; cursor: pointer; box-shadow: 0 5px 0 rgba(0,0,0,0.1); }
        .color-0 { background: #ff9a9e; } .color-1 { background: #a1c4fd; } .color-2 { background: #84fab0; }

        .btn-mode { width: 100%; padding: 15px; margin-bottom: 10px; border-radius: 25px; border: none; color: #fff; font-size: 1.2rem; font-weight: bold; cursor: pointer; box-shadow: 0 5px 0 rgba(0,0,0,0.1); font-family: 'Mochiy+Pop+One', sans-serif; }
        .pink { background: #ff9a9e; } .blue { background: #a1c4fd; }
        
        .character-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 100; pointer-events: none; }
        .txt { font-size: 1.8rem; font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4; background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 50px; margin-top: 10px; }
        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .btn-back { margin-top: 10px; background: none; border: none; color: #aaa; text-decoration: underline; cursor: pointer; }
        .btn-next { background: #ff758c; color: #fff; border: none; padding: 12px 25px; border-radius: 50px; font-size: 1.2rem; font-family: 'Mochiy+Pop+One', sans-serif; cursor: pointer; margin-top: 15px; }
      `}</style>
    </div>
  );
}

export default App;