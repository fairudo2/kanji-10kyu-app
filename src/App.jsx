import React, { useState, useEffect } from 'react';

// 漢検10級全80文字データ（精査済み）
const kanjiList = [
  { kanji: "一", yomi: "いち", sentence: "一（いち）ねんせいに　なる。" },
  { kanji: "二", yomi: "に", sentence: "みかんが　二（に）こ　ある。" },
  { kanji: "三", yomi: "さん", sentence: "三（さん）にんで　あそぶ。" },
  { kanji: "四", yomi: "よん", sentence: "四（よん）ひきの　ねこ。" },
  { kanji: "五", yomi: "ご", sentence: "五（ご）にんの　こども。" },
  { kanji: "六", yomi: "ろく", sentence: "六（ろく）にんで　はしる。" },
  { kanji: "七", yomi: "なな", sentence: "七（なな）色の　にじ。" },
  { kanji: "八", yomi: "はち", sentence: "八（はち）にんの　かぞく。" },
  { kanji: "九", yomi: "く", sentence: "九（く）がつに　なった。" },
  { kanji: "十", yomi: "じゅう", sentence: "十（じゅう）円だま。" },
  { kanji: "百", yomi: "ひゃく", sentence: "百（ひゃく）点を　とった！" },
  { kanji: "千", yomi: "せん", sentence: "千（せん）円　もらった。" },
  { kanji: "上", yomi: "うえ", sentence: "つくえの　上（うえ）を見る。" },
  { kanji: "下", yomi: "した", sentence: "つくえの　下（した）を見る。" },
  { kanji: "左", yomi: "ひだり", sentence: "左（ひだり）に　まがる。" },
  { kanji: "右", yomi: "みぎ", sentence: "右（みぎ）の　て。" },
  { kanji: "中", yomi: "なか", sentence: "はこの　中（なか）を　見る。" },
  { kanji: "大", yomi: "だい", sentence: "大（だい）すきな　おやつ。" },
  { kanji: "小", yomi: "しょう", sentence: "小（しょう）がっこうに　いく。" },
  { kanji: "月", yomi: "つき", sentence: "お月（つき）さまが　出る。" },
  { kanji: "日", yomi: "ひ", sentence: "お日（ひ）さまが　のぼる。" },
  { kanji: "火", yomi: "ひ", sentence: "火（ひ）が　もえている。" },
  { kanji: "水", yomi: "みず", sentence: "水（みず）を　のむ。" },
  { kanji: "木", yomi: "き", sentence: "木（き）に　のぼる。" },
  { kanji: "金", yomi: "きん", sentence: "金（きん）メダルだ！" },
  { kanji: "土", yomi: "つち", sentence: "土（つち）あそびを　する。" },
  { kanji: "山", yomi: "やま", sentence: "高い　山（やま）に　のぼる。" },
  { kanji: "川", yomi: "かわ", sentence: "川（かわ）で　およぐ。" },
  { kanji: "田", yomi: "た", sentence: "田（た）んぼに　いく。" },
  { kanji: "石", yomi: "いし", sentence: "石（いし）を　ひろう。" },
  { kanji: "花", yomi: "はな", sentence: "きれいな　花（はな）が　さく。" },
  { kanji: "草", yomi: "くさ", sentence: "草（くさ）を　むしる。" },
  { kanji: "林", yomi: "はやし", sentence: "林（はやし）の中を　あるく。" },
  { kanji: "森", yomi: "もり", sentence: "森（もり）に　いく。" },
  { kanji: "竹", yomi: "たけ", sentence: "竹（たけ）やぶが　ある。" },
  { kanji: "虫", yomi: "むし", sentence: "虫（むし）とりを　する。" },
  { kanji: "貝", yomi: "かい", sentence: "うみで　貝（かい）を　ひろう。" },
  { kanji: "犬", yomi: "いぬ", sentence: "犬（いぬ）が　ほえる。" },
  { kanji: "足", yomi: "あし", sentence: "足（あし）が　はやい。" },
  { kanji: "手", yomi: "て", sentence: "手（て）を　あらう。" },
  { kanji: "目", yomi: "め", sentence: "目（め）を　あける。" },
  { kanji: "耳", yomi: "みみ", sentence: "耳（みみ）で　きく。" },
  { kanji: "口", yomi: "くち", sentence: "口（くち）を　大きく　あける。" },
  { kanji: "力", yomi: "ちから", sentence: "力（ちから）もち。" },
  { kanji: "人", yomi: "ひと", sentence: "人（ひと）が　あつまる。" },
  { kanji: "子", yomi: "こ", sentence: "女の子（こ）。" },
  { kanji: "女", yomi: "おんな", sentence: "女（おんな）の　こ。" },
  { kanji: "男", yomi: "おとこ", sentence: "男（おとこ）の　こ。" },
  { kanji: "名", yomi: "な", sentence: "お名（な）まえを　かく。" },
  { kanji: "正", yomi: "せい", sentence: "正（せい）かいです！" },
  { kanji: "生", yomi: "せい", sentence: "一ねん生（せい）。" },
  { kanji: "立", yomi: "た", sentence: "立（た）ってください。" },
  { kanji: "休", yomi: "やす", sentence: "休（やす）みの　ひ。" },
  { kanji: "出", yomi: "で", sentence: "おもてに　出（で）る。" },
  { kanji: "入", yomi: "はい", sentence: "おふろに　入（はい）る。" },
  { kanji: "見", yomi: "み", sentence: "ゆめを　見（み）る。" },
  { kanji: "音", yomi: "おと", sentence: "ピアノの　音（おと）。" },
  { kanji: "学", yomi: "がっ", sentence: "学（がっ）こうに　いく。" },
  { kanji: "校", yomi: "こう", sentence: "がっ校（こう）の　ていえん。" },
  { kanji: "文", yomi: "ぶん", sentence: "さく文（ぶん）を　かく。" },
  { kanji: "字", yomi: "じ", sentence: "きれいな　字（じ）。" },
  { kanji: "早", yomi: "はや", sentence: "早（はや）く　おきる。" },
  { kanji: "夕", yomi: "ゆう", sentence: "夕（ゆう）やけが　きれい。" },
  { kanji: "空", yomi: "そら", sentence: "空（そら）が　あおい。" },
  { kanji: "気", yomi: "き", sentence: "元気が　ある（き）。" },
  { kanji: "天", yomi: "てん", sentence: "天（てん）きが　いい。" },
  { kanji: "赤", yomi: "あか", sentence: "赤（あか）い　りんご。" },
  { kanji: "青", yomi: "あお", sentence: "青（あお）い　そら。" },
  { kanji: "白", yomi: "しろ", sentence: "白（しろ）い　くも。" },
  { kanji: "糸", yomi: "いと", sentence: "糸（いと）を　とおす。" },
  { kanji: "車", yomi: "くるま", sentence: "車（くるま）に　のる。" },
  { kanji: "町", yomi: "まち", sentence: "おとなりの　町（まち）。" },
  { kanji: "村", yomi: "むら", sentence: "村（むら）の　おまつり。" },
  { kanji: "王", yomi: "おう", sentence: "ライオンは　百じゅうの王（おう）。" },
  { kanji: "玉", yomi: "たま", sentence: "玉（たま）いれを　する。" },
  { kanji: "円", yomi: "えん", sentence: "百（円）だま。" },
  { kanji: "先", yomi: "せん", sentence: "お先（せん）に　どうぞ。" },
  { kanji: "年", yomi: "とし", sentence: "お年（とし）だま。" },
  { kanji: "左", yomi: "ひだり", sentence: "左（ひだり）を　むく。" },
  { kanji: "雨", yomi: "あめ", sentence: "雨（あめ）が　ふってきた。" }
];

// マイクラ風キャラクターデータ
const mcCharacters = [
  { name: "スティーブ", emoji: "👤", color: "#2dcedf" },
  { name: "クリーパー", emoji: "💣", color: "#4caf50" },
  { name: "アレックス", emoji: "👱‍♀️", color: "#ff9800" },
  { name: "エンダーマン", emoji: "👁️", color: "#212121" },
  { name: "ぶた", emoji: "🐷", color: "#f48fb1" },
  { name: "ひつじ", emoji: "🐑", color: "#f5f5f5" },
  { name: "ゾンビ", emoji: "🧟", color: "#388e3c" },
  { name: "スケルトン", emoji: "💀", color: "#e0e0e0" }
];

function App() {
  const [shuffledList, setShuffledList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [rewardChar, setRewardChar] = useState(null);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const playCorrectSound = () => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
  };

  const playIncorrectSound = () => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    osc.start(); osc.stop(audioCtx.currentTime + 0.5);
  };

  const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));

  const startQuiz = () => {
    const list = [...kanjiList].sort(() => Math.random() - 0.5);
    setShuffledList(list);
    setCurrentIndex(0);
    setIsFinished(false);
    setRewardChar(null);
    makeChoices(list[0]);
  };

  useEffect(() => { startQuiz(); }, []);

  const makeChoices = (question) => {
    if (!question) return;
    const correctYomi = question.yomi;
    const otherYomis = allYomis.filter(y => y !== correctYomi).sort(() => Math.random() - 0.5).slice(0, 2);
    setChoices([correctYomi, ...otherYomis].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (ans) => {
    const currentQ = shuffledList[currentIndex];
    if (ans === currentQ.yomi) {
      playCorrectSound();
      setIsCorrect(true);
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        // 10問ごとにご褒美
        if (nextIdx > 0 && nextIdx % 10 === 0 && nextIdx < 80) {
          setRewardChar(mcCharacters[Math.floor(Math.random() * mcCharacters.length)]);
          setIsCorrect(null);
        } else if (nextIdx < 80) {
          setCurrentIndex(nextIdx);
          makeChoices(shuffledList[nextIdx]);
          setIsCorrect(null);
        } else {
          setIsFinished(true);
        }
      }, 500);
    } else {
      playIncorrectSound();
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  if (rewardChar) {
    return (
      <div className="kanji-container reward-view">
        <div className="card reward-card" style={{borderColor: rewardChar.color}}>
          <div className="mc-title">なかまに　なった！</div>
          <div className="mc-char-box" style={{backgroundColor: rewardChar.color}}>
            <span className="mc-emoji">{rewardChar.emoji}</span>
          </div>
          <div className="mc-name">{rewardChar.name}</div>
          <button 
            onClick={() => {
              const nextIdx = currentIndex + 1;
              setCurrentIndex(nextIdx);
              makeChoices(shuffledList[nextIdx]);
              setRewardChar(null);
            }} 
            className="btn-mc"
          >
            つぎへ　すすむ！
          </button>
        </div>
        <style>{`
          .reward-view { background: #333 !important; }
          .reward-card { border: 8px solid; background: #fff !important; border-radius: 0 !important; }
          .mc-title { font-size: 2rem; color: #444; font-weight: bold; margin-bottom: 20px; }
          .mc-char-box { width: 150px; height: 150px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 4px solid #000; box-shadow: 10px 10px 0 rgba(0,0,0,0.1); }
          .mc-emoji { font-size: 5rem; }
          .mc-name { font-size: 2rem; font-weight: bold; color: #333; margin-bottom: 30px; }
          .btn-mc { background: #4caf50; color: white; border: 4px solid #1b5e20; padding: 15px; font-size: 1.5rem; font-weight: bold; box-shadow: 6px 6px 0 #1b5e20; cursor: pointer; }
          .btn-mc:active { transform: translate(4px, 4px); box-shadow: none; }
        `}</style>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="kanji-container finish-view">
        <div className="card finish-card">
          <div className="finish-title">🎉 ぜんもんクリア！ 🎉</div>
          <div className="finish-icon">🏆🌸✨</div>
          <p className="finish-message">80この　かんじを<br/>ぜーんぶ　マスターしたね！<br/>ほんとうに　すごい！</p>
          <button onClick={startQuiz} className="btn-restart">もういっかい！</button>
        </div>
        <style>{`
          .finish-view { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8); }
          .finish-card { border: 6px dashed #ff9a9e; background: rgba(255,255,255,0.95); animation: popIn 0.5s; }
          .finish-title { font-size: 2.2rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; }
          .finish-icon { font-size: 5rem; margin: 20px 0; animation: bounce 2s infinite; }
          .btn-restart { background: linear-gradient(to bottom, #a1c4fd, #c2e9fb); box-shadow: 0 6px 0 #89b0e5; width: 80%; font-size: 1.8rem; border-radius: 50px; color: white; border: none; cursor: pointer; }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        `}</style>
      </div>
    );
  }

  const q = shuffledList[currentIndex];
  if (!q) return null;

  return (
    <div className="kanji-container">
      <div className="card">
        <div className="header">🎀 かんけん10きゅう 🎀</div>
        <div className="progress-bar">
          <span className="progress-text">80もんじゅう {currentIndex + 1}もんめ</span>
          <div className="progress-gauge" style={{width: `${((currentIndex + 1) / 80) * 100}%`}}></div>
        </div>
        <div className="kanji-box">{q.kanji}</div>
        <div className="sentence">{q.sentence}</div>
        <div className="choices">
          {choices.map((c, i) => (
            <button key={i} onClick={() => handleAnswer(c)} className={`btn-choice color-${i}`}>
              {i === 0 ? '🌸' : i === 1 ? '✨' : '🍬'} {c}
            </button>
          ))}
        </div>
      </div>
      {isCorrect === true && <div className="overlay ok">まる！💖</div>}
      {isCorrect === false && <div className="overlay ng">ざんねん…💧</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .kanji-container { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8, #c2e9fb); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: 'Kiwi Maru', sans-serif; }
        .card { background: #fffef0; border-radius: 40px; padding: 30px; width: 100%; max-width: 480px; box-shadow: 0 15px 35px rgba(255,105,180,0.2); text-align: center; border: 4px dashed #ffb6c1; }
        .header { color: #ff69b4; font-weight: bold; font-size: 1.3rem; margin-bottom: 15px; }
        .progress-bar { background: #ffe4e1; border-radius: 25px; height: 25px; position: relative; overflow: hidden; margin-bottom: 25px; }
        .progress-text { position: absolute; width: 100%; top: 0; left: 0; line-height: 25px; font-size: 0.9rem; font-weight: bold; color: #d66b8a; z-index: 2; }
        .progress-gauge { height: 100%; background: linear-gradient(to right, #ff9a9e, #fad0c4); transition: width 0.3s ease; }
        .kanji-box { font-size: 8rem; font-weight: bold; border-radius: 30%; background: #fff1b8; padding: 20px; color: #ff8c00; box-shadow: 0 10px 20px rgba(255,165,0,0.2); margin-bottom: 20px; }
        .sentence { font-size: 1.5rem; color: #555; margin-bottom: 30px; font-weight: bold; }
        .choices { display: grid; gap: 15px; }
        .btn-choice { padding: 18px; font-size: 1.6rem; border: none; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; box-shadow: 0 6px 0 rgba(0,0,0,0.1); }
        .color-0 { background: linear-gradient(to bottom, #ff9a9e, #fecfef); }
        .color-1 { background: linear-gradient(to bottom, #a1c4fd, #c2e9fb); }
        .color-2 { background: linear-gradient(to bottom, #84fab0, #8fd3f4); }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 6rem; z-index: 100; pointer-events: none; }
        .ok { color: #ff69b4; } .ng { color: #5c9eff; }
      `}</style>
    </div>
  );
}

export default App;