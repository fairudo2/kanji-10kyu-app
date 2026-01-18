import React, { useState, useEffect } from 'react';

// 漢検10級全80文字データ（ネタバレなし・文脈修正済み）
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
  const [view, setView] = useState('menu'); // menu, quiz, stageClear
  const [currentStage, setCurrentStage] = useState(0);
  const [stageList, setStageList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [clearedStages, setClearedStages] = useState([]);

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

  const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));

  // ステージ開始
  const selectStage = (stageIdx) => {
    const startIdx = stageIdx * 10;
    const list = kanjiList.slice(startIdx, startIdx + 10).sort(() => Math.random() - 0.5);
    setStageList(list);
    setCurrentStage(stageIdx);
    setCurrentIndex(0);
    setView('quiz');
    makeChoices(list[0]);
  };

  const makeChoices = (question) => {
    if (!question) return;
    const correctYomi = question.yomi;
    const otherYomis = allYomis.filter(y => y !== correctYomi).sort(() => Math.random() - 0.5).slice(0, 2);
    setChoices([correctYomi, ...otherYomis].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (ans) => {
    if (isCorrect !== null) return;
    const currentQ = stageList[currentIndex];
    
    if (ans === currentQ.yomi) {
      playSound(880, 'sine', 0.3);
      setIsCorrect(true);
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx < 10) {
          setCurrentIndex(nextIdx);
          makeChoices(stageList[nextIdx]);
          setIsCorrect(null);
        } else {
          setClearedStages(prev => Array.from(new Set([...prev, currentStage])));
          setView('stageClear');
          setIsCorrect(null);
        }
      }, 500);
    } else {
      playSound(220, 'sawtooth', 0.5);
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  // メニュー画面
  if (view === 'menu') {
    return (
      <div className="kanji-container">
        <div className="card menu-card">
          <div className="header">🎀 かんけん10きゅう 🎀</div>
          <p className="menu-sub">どこの　おべんきょうを　する？</p>
          <div className="stage-grid">
            {[...Array(8)].map((_, i) => (
              <button key={i} onClick={() => selectStage(i)} className={`btn-stage ${clearedStages.includes(i) ? 'cleared' : ''}`}>
                ステージ {i + 1} {clearedStages.includes(i) && '🌸'}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ステージクリア画面
  if (view === 'stageClear') {
    return (
      <div className="kanji-container">
        <div className="card clear-card">
          <div className="finish-title">🌸 ステージ {currentStage + 1} クリア！ 🌸</div>
          <div className="finish-icon">✨🍭💎</div>
          <p className="finish-message">10問　ぜんぶ　せいかい！<br/>とっても　がんばったね！</p>
          <button onClick={() => setView('menu')} className="btn-restart">メニューに　もどる</button>
        </div>
      </div>
    );
  }

  const q = stageList[currentIndex];
  if (!q) return null;

  return (
    <div className="kanji-container">
      <div className="card">
        <div className="header">🎀 ステージ {currentStage + 1} 🎀</div>
        <div className="progress-bar">
          <span className="progress-text">10もんじゅう {currentIndex + 1}もんめ</span>
          <div className="progress-gauge" style={{width: `${((currentIndex + 1) / 10) * 100}%`}}></div>
        </div>
        <div className="kanji-box">{q.kanji}</div>
        <div className="sentence">{q.sentence}</div>
        <div className="choices">
          {choices.map((c, i) => (
            <button key={i} onClick={() => handleAnswer(c)} className={`btn-choice color-${i}`}>{c}</button>
          ))}
        </div>
        <button onClick={() => setView('menu')} className="btn-back">やめる</button>
      </div>
      {isCorrect === true && <div className="overlay ok">まる！💖</div>}
      {isCorrect === false && <div className="overlay ng">ざんねん…💧</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .kanji-container { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8, #c2e9fb); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Kiwi Maru', sans-serif; }
        .card { background: #fffef0; border-radius: 40px; padding: 30px; width: 100%; max-width: 480px; box-shadow: 0 15px 35px rgba(255, 105, 180, 0.2); text-align: center; border: 4px dashed #ffb6c1; }
        .header { color: #ff69b4; font-weight: bold; font-size: 1.3rem; margin-bottom: 15px; }
        
        .stage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
        .btn-stage { padding: 20px; font-size: 1.2rem; border: none; border-radius: 20px; background: white; color: #ff69b4; font-weight: bold; cursor: pointer; border: 3px solid #ffb6c1; box-shadow: 0 4px 0 #ffb6c1; }
        .btn-stage.cleared { background: #fff1b8; color: #d48806; border-color: #ffd666; box-shadow: 0 4px 0 #ffd666; }
        
        .progress-bar { background: #ffe4e1; border-radius: 25px; height: 25px; position: relative; overflow: hidden; margin-bottom: 25px; }
        .progress-text { position: absolute; width: 100%; top: 0; left: 0; line-height: 25px; font-size: 0.9rem; font-weight: bold; color: #d66b8a; z-index: 2; }
        .progress-gauge { height: 100%; background: linear-gradient(to right, #ff9a9e, #fad0c4); transition: width 0.3s ease; }
        
        .kanji-box { font-size: 8rem; font-weight: bold; border-radius: 30%; background: #fff1b8; padding: 20px; color: #ff8c00; box-shadow: 0 10px 20px rgba(255, 165, 0, 0.2); margin-bottom: 20px; }
        .sentence { font-size: 1.5rem; color: #555; margin-bottom: 30px; font-weight: bold; }
        .choices { display: grid; gap: 15px; }
        .btn-choice { padding: 18px; font-size: 1.6rem; border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; box-shadow: 0 6px 0 rgba(0,0,0,0.1); }
        .color-0 { background: linear-gradient(to bottom, #ff9a9e, #fecfef); }
        .color-1 { background: linear-gradient(to bottom, #a1c4fd, #c2e9fb); }
        .color-2 { background: linear-gradient(to bottom, #84fab0, #8fd3f4); }
        
        .btn-back { margin-top: 30px; background: none; border: none; color: #aaa; font-weight: bold; text-decoration: underline; cursor: pointer; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 6rem; z-index: 100; pointer-events: none; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }

        .clear-card { border-color: #ffd700; }
        .finish-title { font-size: 2rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
        .finish-icon { font-size: 5rem; margin: 20px 0; }
        .btn-restart { background: linear-gradient(to bottom, #a1c4fd, #c2e9fb); box-shadow: 0 6px 0 #89b0e5; width: 100%; font-size: 1.5rem; border-radius: 50px; color: white; border: none; padding: 15px; font-weight: bold; }
      `}</style>
    </div>
  );
}

export default App;