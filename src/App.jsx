import React, { useState, useEffect } from 'react';

// 漢検10級全80文字データ
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

function App() {
  const [view, setView] = useState('menu'); 
  const [mode, setMode] = useState('read'); 
  const [currentStage, setCurrentStage] = useState(0);
  const [stageList, setStageList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState([]);
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

  const selectMode = (m) => {
    setMode(m);
    setView('stageSelect');
  };

  const selectStage = (stageIdx) => {
    const startIdx = stageIdx * 10;
    const list = kanjiList.slice(startIdx, startIdx + 10).sort(() => Math.random() - 0.5);
    setStageList(list);
    setCurrentStage(stageIdx);
    setCurrentIndex(0);
    setView('quiz');
    makeChoices(list[0], mode);
  };

  const makeChoices = (question, currentMode) => {
    if (!question) return;
    const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));
    const allKanjis = kanjiList.map(k => k.kanji);
    
    let correct, distractors;
    if (currentMode === 'read') {
      correct = question.yomi;
      distractors = allYomis.filter(y => y !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
    } else {
      correct = question.kanji;
      distractors = allKanjis.filter(k => k !== correct).sort(() => Math.random() - 0.5).slice(0, 2);
    }
    setChoices([correct, ...distractors].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (ans) => {
    if (isCorrect !== null) return;
    const currentQ = stageList[currentIndex];
    const correctAns = mode === 'read' ? currentQ.yomi : currentQ.kanji;
    
    if (ans === correctAns) {
      playSound(880, 'sine', 0.3);
      setIsCorrect(true);
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx < 10) {
          setCurrentIndex(nextIdx);
          makeChoices(stageList[nextIdx], mode);
          setIsCorrect(null);
        } else {
          if (mode === 'read') {
            setClearedStagesRead(prev => Array.from(new Set([...prev, currentStage])));
          } else {
            setClearedStagesWrite(prev => Array.from(new Set([...prev, currentStage])));
          }
          setView('stageClear');
          setIsCorrect(null);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }, 500);
    } else {
      playSound(220, 'sawtooth', 0.5);
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  const renderQuestionText = () => {
    const q = stageList[currentIndex];
    if (mode === 'read') {
      // 修正ポイント：漢字の部分だけを正確に抜き出して、そこだけに赤線を引くように修正
      const parts = q.sentence.split(new RegExp(`(${q.kanji})`, 'g'));
      return (
        <>
          <div className="kanji-box">{q.kanji}</div>
          <div className="sentence">
             {parts.map((part, i) => 
               part === q.kanji ? <span key={i} className="highlight">{part}</span> : part
             )}
          </div>
        </>
      );
    } else {
      const hiddenSentence = q.sentence.replace(q.kanji, '⬜');
      return (
        <>
          <div className="kanji-box">{q.yomi}</div>
          <div className="sentence">{hiddenSentence}</div>
        </>
      );
    }
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
            <button className="btn-mode mode-read" onClick={() => selectMode('read')}>
              <span className="mode-icon">📖</span>
              <span className="mode-text">よみ (ひらがな)</span>
            </button>
            <button className="btn-mode mode-write" onClick={() => selectMode('write')}>
              <span className="mode-icon">✏️</span>
              <span className="mode-text">かき (かんじ)</span>
            </button>
          </div>
        </div>
      )}

      {view === 'stageSelect' && (
        <div className="card menu-card popup">
          <div className="header title-font">
            {mode === 'read' ? '📖 よみの ステージ' : '✏️ かきの ステージ'}
          </div>
          <div className="stage-grid">
            {[...Array(8)].map((_, i) => {
              const isCleared = mode === 'read' ? clearedStagesRead.includes(i) : clearedStagesWrite.includes(i);
              return (
                <button key={i} onClick={() => selectStage(i)} className={`btn-stage ${isCleared ? 'cleared' : ''}`}>
                  <span className="stage-num">ステージ {i + 1}</span>
                  {isCleared ? <span className="stage-medal">💮クリア!</span> : <span className="stage-icon">💎</span>}
                </button>
              );
            })}
          </div>
          <button onClick={() => setView('menu')} className="btn-back">もどる</button>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card quiz-card popup">
          <div className="header">✨ ステージ {currentStage + 1} ✨</div>
          <div className="progress-bar">
            <div className="progress-gauge" style={{width: `${((currentIndex + 1) / 10) * 100}%`}}></div>
            <span className="progress-text">{currentIndex + 1} / 10 もんめ</span>
          </div>
          
          {renderQuestionText()}

          <div className="choices">
            {choices.map((c, i) => (
              <button key={i} onClick={() => handleAnswer(c)} className={`btn-choice color-${i}`}>{c}</button>
            ))}
          </div>
          <button onClick={() => setView('stageSelect')} className="btn-back">やめる</button>
        </div>
      )}

      {view === 'stageClear' && (
        <div className="card clear-card popup">
          {showConfetti && <div className="confetti">🎉🎊✨</div>}
          <div className="finish-title title-font">🎉 ステージ {currentStage + 1} クリア！ 🎉</div>
          <div className="finish-icon bounce">🦄🍭💖</div>
          <p className="finish-message">10もん　ぜんぶ　せいかい！<br/>すごい！　そのちょうし！</p>
          <button onClick={() => setView('stageSelect')} className="btn-restart">つぎの ステージへ</button>
        </div>
      )}

      {isCorrect === true && <div className="overlay ok popup">まる！🙆‍♀️💕</div>}
      {isCorrect === false && <div className="overlay ng popup">ざんねん…💧</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

        .kanji-container {
          background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8, #c2e9fb);
          background-size: 400% 400%;
          animation: gradientBG 20s ease infinite;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; font-family: 'Kiwi Maru', sans-serif; overflow: hidden; position: relative;
        }
        .bg-elements { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .cloud, .star { position: absolute; font-size: 4rem; opacity: 0.6; animation: float 10s infinite linear; }
        .c1 { top: 10%; left: 10%; animation-duration: 15s; } .c2 { top: 60%; right: 15%; animation-duration: 12s; animation-delay: -5s; font-size: 6rem; }
        .s1 { top: 30%; right: 20%; animation-duration: 8s; font-size: 3rem; } .s2 { bottom: 20%; left: 25%; animation-duration: 10s; animation-delay: -2s; font-size: 2rem; }

        .card {
          background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px);
          border-radius: 50px; padding: 30px; width: 100%; max-width: 500px;
          box-shadow: 0 20px 40px rgba(255, 105, 180, 0.3), inset 0 0 20px rgba(255,255,255,0.5);
          text-align: center; border: 4px solid transparent; position: relative; z-index: 1;
        }
        .menu-card { border-image: linear-gradient(to right, #ff9a9e, #fad0c4) 1; border-radius: 50px; }
        .quiz-card { border-image: linear-gradient(to right, #a1c4fd, #c2e9fb) 1; }
        .clear-card { border-image: linear-gradient(to right, #ffd700, #ffecb3) 1; }
        .popup { animation: popUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .bounce { animation: bounce 2s infinite; }

        .title-font { font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4; text-shadow: 3px 3px 0 #fff; }
        .header { font-weight: bold; font-size: 1.5rem; margin-bottom: 20px; color: #ff69b4; }
        .menu-sub { font-size: 1.2rem; color: #666; margin-bottom: 30px; font-weight: bold; }
        
        .mode-grid { display: grid; gap: 20px; }
        .btn-mode {
          padding: 25px; border-radius: 30px; border: none; color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 15px;
          font-family: 'Mochiy+Pop+One', sans-serif; font-size: 1.4rem;
          box-shadow: 0 8px 0 rgba(0,0,0,0.1), 0 15px 20px rgba(0,0,0,0.1);
          transition: transform 0.1s;
        }
        .btn-mode:active { transform: translateY(6px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }
        .mode-read { background: linear-gradient(to right, #ff9a9e, #fad0c4); }
        .mode-write { background: linear-gradient(to right, #a1c4fd, #c2e9fb); }
        .mode-icon { font-size: 2rem; }

        .stage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .btn-stage {
          padding: 20px 10px; border: none; border-radius: 30px;
          background: linear-gradient(to bottom, #fff, #f0f0f0);
          color: #ff69b4; font-weight: bold; cursor: pointer;
          box-shadow: 0 8px 0 #ffb6c1, 0 15px 20px rgba(255,105,180,0.2);
          transition: all 0.1s; display: flex; flex-direction: column; align-items: center;
        }
        .btn-stage:active { transform: translateY(6px); box-shadow: 0 2px 0 #ffb6c1; }
        .btn-stage.cleared {
          background: linear-gradient(to bottom, #fff1b8, #ffe0b2);
          color: #d48806; box-shadow: 0 8px 0 #ffd666, 0 15px 20px rgba(255, 215, 0, 0.2);
        }
        
        .progress-bar { background: #ffe4e1; border-radius: 25px; height: 30px; position: relative; overflow: hidden; margin-bottom: 25px; }
        .progress-text { position: absolute; width: 100%; top: 0; left: 0; line-height: 30px; font-size: 1rem; font-weight: bold; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); z-index: 2; }
        .progress-gauge { height: 100%; background: linear-gradient(to right, #ff9a9e, #feada6); transition: width 0.3s ease; }
        
        .kanji-box { font-size: 6rem; font-weight: bold; border-radius: 30px; background: #fff; padding: 10px; color: #ff8c00; box-shadow: 0 10px 25px rgba(255, 165, 0, 0.3); margin-bottom: 20px; display: inline-block; min-width: 160px; }
        .sentence { font-size: 1.6rem; color: #555; margin-bottom: 30px; font-weight: bold; }
        .highlight { border-bottom: 3px solid #ff4757; color: #ff4757; }
        
        .choices { display: grid; gap: 18px; }
        .btn-choice {
          padding: 15px; font-size: 2rem; border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer;
          box-shadow: 0 6px 0 rgba(0,0,0,0.2); font-family: 'Mochiy+Pop+One', sans-serif; transition: all 0.1s;
        }
        .btn-choice:active { transform: translateY(6px); box-shadow: none; }
        .color-0 { background: linear-gradient(to bottom, #ff9a9e, #fecfef); }
        .color-1 { background: linear-gradient(to bottom, #a1c4fd, #c2e9fb); }
        .color-2 { background: linear-gradient(to bottom, #84fab0, #8fd3f4); }
        
        .btn-back { margin-top: 30px; background: rgba(255,255,255,0.5); border: none; color: #ff69b4; font-weight: bold; padding: 10px 20px; border-radius: 20px; cursor: pointer; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 7rem; z-index: 100; pointer-events: none; text-shadow: 3px 3px 0 #fff; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }
        
        @keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes popUp { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>
    </div>
  );
}

export default App;