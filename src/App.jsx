import React, { useState, useEffect } from 'react';

// 通常の80文字データ
const kanjiList = [
  { kanji: "一", yomi: "いち", sentence: "一（　）ねんせいに　なる。" },
  { kanji: "二", yomi: "に", sentence: "みかんが　二（　）こ　ある。" },
  { kanji: "三", yomi: "さん", sentence: "三（　）にんで　あそぶ。" },
  { kanji: "四", yomi: "よん", sentence: "四（　）ひきの　ねこ。" },
  { kanji: "五", yomi: "ご", sentence: "五（　）にんの　こども。" },
  { kanji: "六", yomi: "ろく", sentence: "六（　）にんで　はしる。" },
  { kanji: "七", yomi: "なな", sentence: "七（　）色の　にじ。" },
  { kanji: "八", yomi: "はち", sentence: "八（　）にんの　かぞく。" },
  { kanji: "九", yomi: "く", sentence: "九（　）がつに　なった。" },
  { kanji: "十", yomi: "じゅう", sentence: "十（　）円だま。" },
  { kanji: "百", yomi: "ひゃく", sentence: "百（　）点を　とった！" },
  { kanji: "千", yomi: "せん", sentence: "千（　）円　もらった。" },
  { kanji: "上", yomi: "うえ", sentence: "つくえの　上（　）を見る。" },
  { kanji: "下", yomi: "した", sentence: "つくえの　下（　）を見る。" },
  { kanji: "左", yomi: "ひだり", sentence: "左（　）に　まがる。" },
  { kanji: "右", yomi: "みぎ", sentence: "右（　）の　て。" },
  { kanji: "中", yomi: "なか", sentence: "はこの　中（　）を　見る。" },
  { kanji: "大", yomi: "だい", sentence: "大（　）すきな　おやつ。" },
  { kanji: "小", yomi: "しょう", sentence: "小（　）がっこうに　いく。" },
  { kanji: "月", yomi: "つき", sentence: "お月（　）さまが　出る。" },
  { kanji: "日", yomi: "ひ", sentence: "お日（　）さまが　のぼる。" },
  { kanji: "火", yomi: "ひ", sentence: "火（　）が　もえている。" },
  { kanji: "水", yomi: "みず", sentence: "水（　）を　のむ。" },
  { kanji: "木", yomi: "き", sentence: "木（　）に　のぼる。" },
  { kanji: "金", yomi: "きん", sentence: "金（　）メダルだ！" },
  { kanji: "土", yomi: "つち", sentence: "土（　）あそびを　する。" },
  { kanji: "山", yomi: "やま", sentence: "高い　山（　）に　のぼる。" },
  { kanji: "川", yomi: "かわ", sentence: "川（　）で　およぐ。" },
  { kanji: "田", yomi: "た", sentence: "田（　）んぼに　いく。" },
  { kanji: "石", yomi: "いし", sentence: "石（　）を　ひろう。" },
  { kanji: "花", yomi: "はな", sentence: "きれいな　花（　）が　さく。" },
  { kanji: "草", yomi: "くさ", sentence: "草（　）を　むしる。" },
  { kanji: "林", yomi: "はやし", sentence: "林（　）の中を　あるく。" },
  { kanji: "森", yomi: "もり", sentence: "森（　）に　いく。" },
  { kanji: "竹", yomi: "たけ", sentence: "竹（　）やぶが　ある。" },
  { kanji: "虫", yomi: "むし", sentence: "虫（　）とりを　する。" },
  { kanji: "貝", yomi: "かい", sentence: "うみで　貝（　）を　ひろう。" },
  { kanji: "犬", yomi: "いぬ", sentence: "犬（　）が　ほえる。" },
  { kanji: "足", yomi: "あし", sentence: "足（　）が　はやい。" },
  { kanji: "手", yomi: "て", sentence: "手（　）を　あらう。" },
  { kanji: "目", yomi: "め", sentence: "目（　）を　あける。" },
  { kanji: "耳", yomi: "みみ", sentence: "耳（　）で　きく。" },
  { kanji: "口", yomi: "くち", sentence: "口（　）を　大きく　あける。" },
  { kanji: "力", yomi: "ちから", sentence: "力（　）もち。" },
  { kanji: "人", yomi: "ひと", sentence: "人（　）が　あつまる。" },
  { kanji: "子", yomi: "こ", sentence: "女の子（　）。" },
  { kanji: "女", yomi: "おんな", sentence: "女（　）の　こ。" },
  { kanji: "男", yomi: "おとこ", sentence: "男（　）の　こ。" },
  { kanji: "名", yomi: "な", sentence: "お名（　）まえを　かく。" },
  { kanji: "正", yomi: "せい", sentence: "正（　）かいです！" },
  { kanji: "生", yomi: "せい", sentence: "一ねん生（　）。" },
  { kanji: "立", yomi: "た", sentence: "立（　）ってください。" },
  { kanji: "休", yomi: "やす", sentence: "休（　）みの　ひ。" },
  { kanji: "出", yomi: "で", sentence: "おもてに　出（　）る。" },
  { kanji: "入", yomi: "はい", sentence: "おふろに　入（　）る。" },
  { kanji: "見", yomi: "み", sentence: "ゆめを　見（　）る。" },
  { kanji: "音", yomi: "おと", sentence: "ピアノの　音（　）。" },
  { kanji: "学", yomi: "がっ", sentence: "学（　）こうに　いく。" },
  { kanji: "校", yomi: "こう", sentence: "がっ校（　）の　ていえん。" },
  { kanji: "文", yomi: "ぶん", sentence: "さく文（　）を　かく。" },
  { kanji: "字", yomi: "じ", sentence: "きれいな　字（　）。" },
  { kanji: "早", yomi: "はや", sentence: "早（　）く　おきる。" },
  { kanji: "夕", yomi: "ゆう", sentence: "夕（　）やけが　きれい。" },
  { kanji: "空", yomi: "そら", sentence: "空（　）が　あおい。" },
  { kanji: "気", yomi: "き", sentence: "元気が　ある（　）。" },
  { kanji: "天", yomi: "てん", sentence: "天（　）きが　いい。" },
  { kanji: "赤", yomi: "あか", sentence: "赤（　）い　りんご。" },
  { kanji: "青", yomi: "あお", sentence: "青（　）い　そら。" },
  { kanji: "白", yomi: "しろ", sentence: "白（　）い　くも。" },
  { kanji: "糸", yomi: "いと", sentence: "糸（　）を　とおす。" },
  { kanji: "車", yomi: "くるま", sentence: "車（　）に　のる。" },
  { kanji: "町", yomi: "まち", sentence: "おとなりの　町（　）。" },
  { kanji: "村", yomi: "むら", sentence: "村（　）の　おまつり。" },
  { kanji: "王", yomi: "おう", sentence: "ライオンは　百じゅうの王（　）。" },
  { kanji: "玉", yomi: "たま", sentence: "玉（　）いれを　する。" },
  { kanji: "円", yomi: "えん", sentence: "百（　）だま。" },
  { kanji: "先", yomi: "せん", sentence: "お先（　）に　どうぞ。" },
  { kanji: "年", yomi: "とし", sentence: "お年（　）だま。" },
  { kanji: "左", yomi: "ひだり", sentence: "左（　）を　むく。" },
  { kanji: "雨", yomi: "あめ", sentence: "雨（　）が　ふってきた。" }
];

// 【全網羅】同一漢字の読み分け（スペシャルステージ用）
const specialReadingGroups = [
  { kanji: "日", q1: { s: "【日】ようび", a: "にち" }, q2: { s: "にちよう【日】", a: "び" } },
  { kanji: "日", q1: { s: "とお【日】", a: "か" }, q2: { s: "お【日】さま", a: "ひ" } },
  { kanji: "一", q1: { s: "【一】ねんせい", a: "いち" }, q2: { s: "【一】つ", a: "ひと" } },
  { kanji: "二", q1: { s: "【二】ねんせい", a: "に" }, q2: { s: "【二】つ", a: "ふた" } },
  { kanji: "三", q1: { s: "【三】ねんせい", a: "さん" }, q2: { s: "【三】つ", a: "み" } },
  { kanji: "四", q1: { s: "【四】ねんせい", a: "よん" }, q2: { s: "【四】つ", a: "よ" } },
  { kanji: "五", q1: { s: "【五】ねんせい", a: "ご" }, q2: { s: "【五】つ", a: "いつ" } },
  { kanji: "六", q1: { s: "【六】ねんせい", a: "ろく" }, q2: { s: "【六】つ", a: "む" } },
  { kanji: "七", q1: { s: "【七】がつ", a: "しち" }, q2: { s: "【七】つ", a: "なな" } },
  { kanji: "八", q1: { s: "【八】ねんせい", a: "はち" }, q2: { s: "【八】つ", a: "や" } },
  { kanji: "九", q1: { s: "【九】がつ", a: "く" }, q2: { s: "【九】ねんせい", a: "きゅう" } },
  { kanji: "十", q1: { s: "【十】円", a: "じゅう" }, q2: { s: "【十】日", a: "とお" } },
  { kanji: "月", q1: { s: "一【月】", a: "がつ" }, q2: { s: "お【月】さま", a: "つき" } },
  { kanji: "上", q1: { s: "つくえの【上】", a: "うえ" }, q2: { s: "【上】ず", a: "じょう" } },
  { kanji: "下", q1: { s: "つくえの【下】", a: "した" }, q2: { s: "ろう【下】", a: "か" } },
  { kanji: "大", q1: { s: "【大】きい", a: "おお" }, q2: { s: "【大】すき", a: "だい" } },
  { kanji: "中", q1: { s: "はこの【中】", a: "なか" }, q2: { s: "【中】がっこう", a: "ちゅう" } },
  { kanji: "人", q1: { s: "一【人】", a: "にん" }, q2: { s: "この【人】", a: "ひと" } },
  { kanji: "生", q1: { s: "一ねん【生】", a: "せい" }, q2: { s: "【生】まれる", a: "う" } },
  { kanji: "名", q1: { s: "お【名】まえ", a: "な" }, q2: { s: "【名】じん", a: "めい" } }
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
  const [clearedStagesRead, setClearedStagesRead] = useState([]);
  const [clearedStagesWrite, setClearedStagesWrite] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

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

  const selectMode = (m) => { setMode(m); setView('stageSelect'); };

  const selectStage = (stageIdx) => {
    let list;
    if (stageIdx === 8) {
      list = [...specialReadingGroups].sort(() => Math.random() - 0.5);
    } else {
      const startIdx = stageIdx * 10;
      list = kanjiList.slice(startIdx, startIdx + 10).sort(() => Math.random() - 0.5);
    }
    setStageList(list);
    setCurrentStage(stageIdx);
    setCurrentIndex(0);
    setAnsA(null); setAnsB(null);
    setView('quiz');
    makeChoices(list[0], mode, stageIdx === 8);
  };

  const makeChoices = (question, currentMode, isSpecial) => {
    if (!question) return;
    const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));
    
    if (isSpecial) {
      const getC = (ans) => [ans, ...allYomis.filter(y => y !== ans).sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);
      setChoicesA(getC(question.q1.a));
      setChoicesB(getC(question.q2.a));
    } else {
      let correct = currentMode === 'read' ? question.yomi : question.kanji;
      let pool = currentMode === 'read' ? allYomis : kanjiList.map(k => k.kanji);
      setChoicesA([correct, ...pool.filter(v => v !== correct).sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5));
    }
  };

  const handleAnswer = (ans, type) => {
    if (isCorrect !== null) return;
    const q = stageList[currentIndex];

    if (currentStage === 8) {
      if (type === 'A') {
        if (ans === q.q1.a) { playSound(880, 'sine', 0.2); setAnsA(ans); }
        else { playSound(220, 'sawtooth', 0.3); setIsCorrect(false); setTimeout(() => setIsCorrect(null), 800); }
      } else {
        if (ans === q.q2.a) { playSound(880, 'sine', 0.2); setAnsB(ans); }
        else { playSound(220, 'sawtooth', 0.3); setIsCorrect(false); setTimeout(() => setIsCorrect(null), 800); }
      }
    } else {
      const correctAns = mode === 'read' ? q.yomi : q.kanji;
      if (ans === correctAns) { setAnsA(ans); }
      else { playSound(220, 'sawtooth', 0.5); setIsCorrect(false); setTimeout(() => setIsCorrect(null), 1000); }
    }
  };

  useEffect(() => {
    if (currentStage === 8) {
      if (ansA && ansB) {
        setIsCorrect(true);
        setTimeout(() => {
          const nextIdx = currentIndex + 1;
          if (nextIdx < stageList.length) {
            setCurrentIndex(nextIdx); setAnsA(null); setAnsB(null); setIsCorrect(null);
            makeChoices(stageList[nextIdx], mode, true);
          } else { finish(); }
        }, 800);
      }
    } else if (ansA) {
      setIsCorrect(true);
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx < 10) {
          setCurrentIndex(nextIdx); setAnsA(null); setIsCorrect(null);
          makeChoices(stageList[nextIdx], mode, false);
        } else { finish(); }
      }, 500);
    }
  }, [ansA, ansB]);

  const finish = () => {
    if (mode === 'read') setClearedStagesRead(prev => Array.from(new Set([...prev, currentStage])));
    else setClearedStagesWrite(prev => Array.from(new Set([...prev, currentStage])));
    setView('stageClear'); setIsCorrect(null); setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="kanji-container">
      <div className="bg-elements">
        <div className="cloud c1">☁️</div><div className="cloud c2">☁️</div>
        <div className="star s1">✨</div><div className="star s2">✨</div>
      </div>
      
      {view === 'menu' && (
        <div className="card menu-card popup">
          <div className="header title-font">🎀 かんけん10きゅう 🎀</div>
          <p className="menu-sub">どっちを　れんしゅうする？</p>
          <div className="mode-grid">
            <button className="btn-mode mode-read" onClick={() => selectMode('read')}>📖 よみ</button>
            <button className="btn-mode mode-write" onClick={() => selectMode('write')}>✏️ かき</button>
          </div>
        </div>
      )}

      {view === 'stageSelect' && (
        <div className="card menu-card popup">
          <div className="header title-font">{mode === 'read' ? '📖 よみの ステージ' : '✏️ かきの ステージ'}</div>
          <div className="stage-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => selectStage(i)} className={`btn-stage ${(mode === 'read' ? clearedStagesRead : clearedStagesWrite).includes(i) ? 'cleared' : ''}`}>
                <span className="stage-num">ステージ {i + 1}</span>
                {(mode === 'read' ? clearedStagesRead : clearedStagesWrite).includes(i) ? '💮' : '💎'}
              </button>
            ))}
            <button onClick={() => selectStage(8)} className={`btn-stage special ${(mode === 'read' ? clearedStagesRead : clearedStagesWrite).includes(8) ? 'cleared' : ''}`}>
              <span className="stage-num">よみわけ</span>🌈
            </button>
          </div>
          <button onClick={() => setView('menu')} className="btn-back">もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card quiz-card popup">
          <div className="header">✨ {currentStage === 8 ? 'よみわけ 特訓' : `ステージ ${currentStage + 1}`} ✨</div>
          <div className="progress-bar">
            <div className="progress-gauge" style={{width: `${((currentIndex + 1) / stageList.length) * 100}%`}}></div>
          </div>
          
          <div className="kanji-box-large">{stageList[currentIndex].kanji}</div>

          {currentStage === 8 ? (
            <div className="special-layout">
              <div className={`q-row ${ansA ? 'done' : ''}`}>
                <div className="sentence">{stageList[currentIndex].q1.s.split(/【|】/).map((p,i)=>i===1?<span className="target" key={i}>{p}</span>:p)}</div>
                <div className="choices-mini">{choicesA.map((c,i)=><button key={i} onClick={()=>handleAnswer(c,'A')} className={`btn-choice-s ${ansA===c?'selected':''}`}>{c}</button>)}</div>
              </div>
              <div className="divider"></div>
              <div className={`q-row ${ansB ? 'done' : ''}`}>
                <div className="sentence">{stageList[currentIndex].q2.s.split(/【|】/).map((p,i)=>i===1?<span className="target" key={i}>{p}</span>:p)}</div>
                <div className="choices-mini">{choicesB.map((c,i)=><button key={i} onClick={()=>handleAnswer(c,'B')} className={`btn-choice-s ${ansB===c?'selected':''}`}>{c}</button>)}</div>
              </div>
            </div>
          ) : (
            <div className="normal-layout">
              <div className="sentence">
                {mode==='read' ? stageList[currentIndex].sentence.split(/（|）/).map((p,i)=>p===stageList[currentIndex].kanji?<span className="highlight" key={i}>{p}</span>:p) 
                               : stageList[currentIndex].sentence.replace(stageList[currentIndex].kanji, '⬜')}
              </div>
              <div className="choices">{choicesA.map((c,i)=><button key={i} onClick={()=>handleAnswer(c,'A')} className={`btn-choice color-${i}`}>{c}</button>)}</div>
            </div>
          )}
          <button onClick={() => setView('stageSelect')} className="btn-back">やめる</button>
        </div>
      )}

      {view === 'stageClear' && (
        <div className="card clear-card popup">
          {showConfetti && <div className="confetti">🎉🎊✨</div>}
          <div className="finish-title title-font">🎉 ぜんぶ せいかい！ 🎉</div>
          <div className="finish-icon bounce">🦄🍭💖</div>
          <button onClick={() => setView('stageSelect')} className="btn-restart">つぎへ</button>
        </div>
      )}

      {isCorrect === true && <div className="overlay ok popup">🙆‍♀️💕</div>}
      {isCorrect === false && <div className="overlay ng popup">💧</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');
        .kanji-container { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8); min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; position: relative; overflow: hidden; }
        .bg-elements { position: absolute; width: 100%; height: 100%; pointer-events: none; }
        .cloud { position: absolute; font-size: 5rem; opacity: 0.4; animation: float 15s infinite linear; }
        .c1 { top: 10%; left: 5%; } .c2 { bottom: 10%; right: 5%; }
        @keyframes float { 0% { transform: translateX(-20px); } 50% { transform: translateX(20px); } 100% { transform: translateX(-20px); } }
        .card { background: rgba(255, 255, 255, 0.9); border-radius: 40px; padding: 25px; width: 95%; max-width: 450px; box-shadow: 0 15px 30px rgba(0,0,0,0.1); text-align: center; position: relative; z-index: 10; border: 4px solid #fff; }
        .title-font { font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4; }
        .mode-grid { display: grid; gap: 15px; }
        .btn-mode { padding: 20px; border-radius: 20px; border: none; background: #ff9a9e; color: #fff; font-size: 1.5rem; cursor: pointer; box-shadow: 0 5px 0 #ff7a8e; }
        .mode-write { background: #a1c4fd; box-shadow: 0 5px 0 #81a4ed; }
        .stage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
        .btn-stage { padding: 15px 5px; border-radius: 15px; border: 2px solid #ffb6c1; background: #fff; cursor: pointer; font-size: 0.9rem; }
        .btn-stage.cleared { background: #fff1b8; }
        .btn-stage.special { border: 2px dashed #ff69b4; grid-column: span 3; font-size: 1.2rem; }
        .kanji-box-large { font-size: 5rem; color: #ff8c00; background: #fff; border-radius: 20px; display: inline-block; padding: 0 20px; margin-bottom: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .progress-bar { background: #eee; height: 10px; border-radius: 5px; margin-bottom: 15px; overflow: hidden; }
        .progress-gauge { background: #84fab0; height: 100%; transition: width 0.3s; }
        .special-layout { text-align: left; background: #fff9fa; padding: 15px; border-radius: 20px; border: 2px solid #ffe4e1; }
        .q-row { transition: opacity 0.3s; }
        .q-row.done { opacity: 0.6; pointer-events: none; }
        .divider { height: 2px; background: #ffe4e1; margin: 15px 0; }
        .sentence { font-size: 1.1rem; margin-bottom: 10px; font-weight: bold; }
        .target { color: #ff4757; text-decoration: underline; font-size: 1.4rem; padding: 0 3px; }
        .choices-mini { display: flex; gap: 8px; justify-content: center; }
        .btn-choice-s { padding: 10px 15px; border-radius: 12px; border: 2px solid #a1c4fd; background: #fff; cursor: pointer; font-family: 'Mochiy+Pop+One', sans-serif; font-size: 1.1rem; }
        .btn-choice-s.selected { background: #a1c4fd; color: #fff; }
        .btn-choice { width: 100%; padding: 15px; margin-bottom: 10px; border-radius: 30px; border: none; color: #fff; font-size: 1.5rem; font-family: 'Mochiy+Pop+One', sans-serif; cursor: pointer; box-shadow: 0 5px 0 rgba(0,0,0,0.1); }
        .color-0 { background: #ff9a9e; } .color-1 { background: #a1c4fd; } .color-2 { background: #84fab0; }
        .highlight { color: #ff4757; border-bottom: 3px solid; }
        .btn-back { margin-top: 15px; background: none; border: none; color: #aaa; text-decoration: underline; cursor: pointer; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 8rem; z-index: 100; pointer-events: none; }
        .popup { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes pop { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default App;