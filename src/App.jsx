import React, { useState, useEffect } from 'react';

// 漢検10級全80文字データ：問題文から答え（読み）を完全に隠しました！
const kanjiList = [
  { kanji: "一", yomi: "いち", sentence: "（　）ねんせいに　なる。" },
  { kanji: "二", yomi: "に", sentence: "みかんが　（　）こ　ある。" },
  { kanji: "三", yomi: "さん", sentence: "（　）にんで　あそぶ。" },
  { kanji: "四", yomi: "よん", sentence: "（　）ひきの　ねこ。" },
  { kanji: "五", yomi: "ご", sentence: "（　）にんの　こども。" },
  { kanji: "六", yomi: "ろく", sentence: "（　）にんで　はしる。" }, // image_6e44eb.png の箇所を修正
  { kanji: "七", yomi: "なな", sentence: "（　）色の　にじ。" },
  { kanji: "八", yomi: "はち", sentence: "（　）にんの　かぞく。" },
  { kanji: "九", yomi: "く", sentence: "（　）がつに　なった。" },
  { kanji: "十", yomi: "じゅう", sentence: "（　）円だま。" },
  { kanji: "百", yomi: "ひゃく", sentence: "（　）点を　とった！" },
  { kanji: "千", yomi: "せん", sentence: "（　）円　もらった。" },
  { kanji: "上", yomi: "うえ", sentence: "つくえの　（　）を見る。" },
  { kanji: "下", yomi: "した", sentence: "つくえの　（　）を見る。" },
  { kanji: "左", yomi: "ひだり", sentence: "（　）に　まがる。" },
  { kanji: "右", yomi: "みぎ", sentence: "（　）の　て。" },
  { kanji: "中", yomi: "なか", sentence: "はこの　（　）を　見る。" },
  { kanji: "大", yomi: "だい", sentence: "（　）すきな　おやつ。" },
  { kanji: "小", yomi: "しょう", sentence: "（　）がっこうに　いく。" },
  { kanji: "月", yomi: "つき", sentence: "お月（　）さまが　出る。" },
  { kanji: "日", yomi: "ひ", sentence: "お日（　）さまが　のぼる。" },
  { kanji: "火", yomi: "ひ", sentence: "（　）が　もえている。" },
  { kanji: "水", yomi: "みず", sentence: "（　）を　のむ。" },
  { kanji: "木", yomi: "き", sentence: "（　）に　のぼる。" },
  { kanji: "金", yomi: "きん", sentence: "（　）メダルだ！" },
  { kanji: "土", yomi: "つち", sentence: "（　）あそびを　する。" },
  { kanji: "山", yomi: "やま", sentence: "高い　（　）に　のぼる。" },
  { kanji: "川", yomi: "かわ", sentence: "（　）で　およぐ。" },
  { kanji: "田", yomi: "た", sentence: "（　）んぼに　いく。" },
  { kanji: "石", yomi: "いし", sentence: "（　）を　ひろう。" },
  { kanji: "花", yomi: "はな", sentence: "きれいな　（　）が　さく。" },
  { kanji: "草", yomi: "くさ", sentence: "（　）を　むしる。" },
  { kanji: "林", yomi: "はやし", sentence: "（　）の中を　あるく。" },
  { kanji: "森", yomi: "もり", sentence: "（　）に　いく。" },
  { kanji: "竹", yomi: "たけ", sentence: "（　）やぶが　ある。" },
  { kanji: "虫", yomi: "むし", sentence: "（　）とりを　する。" },
  { kanji: "貝", yomi: "かい", sentence: "うみで　（　）を　ひろう。" },
  { kanji: "犬", yomi: "いぬ", sentence: "（　）が　ほえる。" },
  { kanji: "足", yomi: "あし", sentence: "（　）が　はやい。" },
  { kanji: "手", yomi: "て", sentence: "（　）を　あらう。" },
  { kanji: "目", yomi: "め", sentence: "（　）を　あける。" },
  { kanji: "耳", yomi: "みみ", sentence: "（　）で　きく。" },
  { kanji: "口", yomi: "くち", sentence: "（　）を　大きく　あける。" },
  { kanji: "力", yomi: "ちから", sentence: "（　）もち。" },
  { kanji: "人", yomi: "ひと", sentence: "（　）が　あつまる。" },
  { kanji: "子", yomi: "こ", sentence: "女の子（　）。" },
  { kanji: "女", yomi: "おんな", sentence: "（　）の　こ。" },
  { kanji: "男", yomi: "おとこ", sentence: "（　）の　こ。" },
  { kanji: "名", yomi: "な", sentence: "お名（　）まえを　かく。" },
  { kanji: "正", yomi: "せい", sentence: "（　）かいです！" },
  { kanji: "生", yomi: "せい", sentence: "一ねん生（　）。" },
  { kanji: "立", yomi: "た", sentence: "（　）ってください。" },
  { kanji: "休", yomi: "やす", sentence: "（　）みの　ひ。" },
  { kanji: "出", yomi: "で", sentence: "おもてに　（　）る。" },
  { kanji: "入", yomi: "はい", sentence: "おふろに　（　）る。" },
  { kanji: "見", yomi: "み", sentence: "ゆめを　（　）る。" },
  { kanji: "音", yomi: "おと", sentence: "ピアノの　（　）。" },
  { kanji: "学", yomi: "がっ", sentence: "（　）こうに　いく。" },
  { kanji: "校", yomi: "こう", sentence: "がっ（　）の　ていえん。" },
  { kanji: "文", yomi: "ぶん", sentence: "さく（　）を　かく。" },
  { kanji: "字", yomi: "じ", sentence: "きれいな　（　）。" },
  { kanji: "早", yomi: "はや", sentence: "（　）く　おきる。" },
  { kanji: "夕", yomi: "ゆう", sentence: "（　）やけが　きれい。" },
  { kanji: "空", yomi: "そら", sentence: "（　）が　あおい。" },
  { kanji: "気", yomi: "き", sentence: "元気が　ある（　）。" },
  { kanji: "天", yomi: "てん", sentence: "（　）きが　いい。" },
  { kanji: "赤", yomi: "あか", sentence: "（　）い　りんご。" },
  { kanji: "青", yomi: "あお", sentence: "（　）い　そら。" },
  { kanji: "白", yomi: "しろ", sentence: "（　）い　くも。" },
  { kanji: "糸", yomi: "いと", sentence: "（　）を　とおす。" },
  { kanji: "車", yomi: "くるま", sentence: "（　）に　のる。" },
  { kanji: "町", yomi: "まち", sentence: "おとなりの　（　）。" },
  { kanji: "村", yomi: "むら", sentence: "（　）の　おまつり。" },
  { kanji: "王", yomi: "おう", sentence: "ライオンは　百じゅうの（　）。" },
  { kanji: "玉", yomi: "たま", sentence: "（　）いれを　する。" },
  { kanji: "円", yomi: "えん", sentence: "百（　）だま。" },
  { kanji: "先", yomi: "せん", sentence: "お（　）に　どうぞ。" },
  { kanji: "年", yomi: "とし", sentence: "お（　）だま。" },
  { kanji: "雨", yomi: "あめ", sentence: "（　）が　ふってきた。" }
];

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
    if (isCorrect !== null || rewardChar || isFinished) return;
    const currentQ = shuffledList[currentIndex];
    
    if (ans === currentQ.yomi) {
      playCorrectSound();
      setIsCorrect(true);
      
      // 0.6秒後に判定
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        // 10問ごとのご褒美判定（確実にここでrewardCharをセットします）
        if (nextIdx > 0 && nextIdx % 10 === 0 && nextIdx < shuffledList.length) {
          setRewardChar(mcCharacters[Math.floor(Math.random() * mcCharacters.length)]);
          setIsCorrect(null);
        } else if (nextIdx < shuffledList.length) {
          setCurrentIndex(nextIdx);
          makeChoices(shuffledList[nextIdx]);
          setIsCorrect(null);
        } else {
          setIsFinished(true);
        }
      }, 600);
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
          <div className="mc-title">🎉 なかまに　なった！ 🎉</div>
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
            つぎの　もんだいへ！
          </button>
        </div>
        <style>{`
          .reward-view { background: #1e1e1e !important; }
          .reward-card { border: 10px solid; background: white !important; border-radius: 0 !important; max-width: 400px; padding: 40px 20px; box-shadow: 0 0 50px rgba(255,255,255,0.2); }
          .mc-title { font-size: 2.2rem; color: #333; font-weight: bold; margin-bottom: 30px; }
          .mc-char-box { width: 160px; height: 160px; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; border: 6px solid #000; box-shadow: 12px 12px 0 rgba(0,0,0,0.2); }
          .mc-emoji { font-size: 6rem; }
          .mc-name { font-size: 2.4rem; font-weight: bold; color: #333; margin-bottom: 40px; }
          .btn-mc { background: #4caf50; color: white; border: 4px solid #1b5e20; padding: 20px 40px; font-size: 1.8rem; font-weight: bold; box-shadow: 8px 8px 0 #1b5e20; cursor: pointer; border-radius: 0; width: 100%; }
        `}</style>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="kanji-container finish-view">
        <div className="card finish-card">
          <div className="finish-title">👑 ぜんもんクリア！ 👑</div>
          <div className="finish-icon">💎🐲🔥</div>
          <p className="finish-message">80この　かんじを<br/>ぜーんぶ　マスターしたね！<br/>キミは　マイクラマスターだ！</p>
          <button onClick={startQuiz} className="btn-restart">はじめから　やる</button>
        </div>
        <style>{`
          .finish-view { background: linear-gradient(135deg, #2c3e50, #000); }
          .finish-card { border: 8px solid #ffd700; background: rgba(255,255,255,0.95); animation: popIn 0.5s; }
          .finish-title { font-size: 2.5rem; color: #b8860b; font-weight: bold; margin-bottom: 20px; }
          .finish-icon { font-size: 6rem; margin: 25px 0; animation: bounce 2s infinite; }
          .btn-restart { background: #ffd700; color: #000; border: 4px solid #b8860b; padding: 20px; font-size: 1.8rem; font-weight: bold; border-radius: 10px; cursor: pointer; width: 100%; }
        `}</style>
      </div>
    );
  }

  const q = shuffledList[currentIndex];
  if (!q) return null;

  return (
    <div className="kanji-container">
      <div className="card">
        <div className="header">🌸 かんけん10きゅう 🌸</div>
        <div className="progress-bar">
          <span className="progress-text">80もんじゅう {currentIndex + 1}もんめ</span>
          <div className="progress-gauge" style={{width: `${((currentIndex + 1) / 80) * 100}%`}}></div>
        </div>
        <div className="kanji-box">{q.kanji}</div>
        <div className="sentence">{q.sentence}</div>
        <div className="choices">
          {choices.map((c, i) => (
            <button key={i} onClick={() => handleAnswer(c)} className={`btn-choice color-${i}`}>
              {c}
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