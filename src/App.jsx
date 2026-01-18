import React, { useState, useEffect } from 'react';

// 漢検10級（1年生）全80文字データ（変更なし）
const kanjiList = [
  { kanji: "一", yomi: "いち", sentence: "(一)ねんせい。" },
  { kanji: "右", yomi: "みぎ", sentence: "(右)の手をあげる。" },
  { kanji: "雨", yomi: "あめ", sentence: "(雨)がふってきた。" },
  { kanji: "円", yomi: "えん", sentence: "百(円)だま。" },
  { kanji: "王", yomi: "おう", sentence: "ライオンは百じゅうの(王)。" },
  { kanji: "音", yomi: "おと", sentence: "大きな(音)がする。" },
  { kanji: "下", yomi: "した", sentence: "つくえの(下)を見る。" },
  { kanji: "火", yomi: "ひ", sentence: "(火)がもえている。" },
  { kanji: "花", yomi: "はな", sentence: "きれいな(花)がさく。" },
  { kanji: "貝", yomi: "かい", sentence: "うみで(貝)をひろう。" },
  { kanji: "学", yomi: "がっ", sentence: "(学)こうにいく。" },
  { kanji: "気", yomi: "き", sentence: "(気)もちがいい。" },
  { kanji: "休", yomi: "やす", sentence: "(休)みのひ。" },
  { kanji: "玉", yomi: "たま", sentence: "(玉)入れをする。" },
  { kanji: "金", yomi: "きん", sentence: "(金)メダルをとる。" },
  { kanji: "九", yomi: "く", sentence: "(九)がつになる。" },
  { kanji: "空", yomi: "そら", sentence: "(空)が青い。" },
  { kanji: "月", yomi: "つき", sentence: "お(月)さまが出る。" },
  { kanji: "犬", yomi: "いぬ", sentence: "(犬)がほえる。" },
  { kanji: "見", yomi: "み", sentence: "ゆめを(見)る。" },
  { kanji: "口", yomi: "くち", sentence: "(口)を大きくあける。" },
  { kanji: "校", yomi: "こう", sentence: "(校)ていではしる。" },
  { kanji: "左", yomi: "ひだり", sentence: "(左)をむく。" },
  { kanji: "三", yomi: "さん", sentence: "(三)にんのこども。" },
  { kanji: "山", yomi: "やま", sentence: "(山)にのぼる。" },
  { kanji: "子", yomi: "こ", sentence: "(子)いぬがくる。" },
  { kanji: "四", yomi: "よん", sentence: "(四)ひきのねこ。" },
  { kanji: "糸", yomi: "いと", sentence: "(糸)をとおす。" },
  { kanji: "字", yomi: "じ", sentence: "きれいな(字)をかく。" },
  { kanji: "耳", yomi: "みみ", sentence: "(耳)ですます。" },
  { kanji: "七", yomi: "なな", sentence: "(七)色の虹。" },
  { kanji: "車", yomi: "くるま", sentence: "(車)にのる。" },
  { kanji: "手", yomi: "て", sentence: "(手)をあらう。" },
  { kanji: "十", yomi: "じゅう", sentence: "(十)円だま。" },
  { kanji: "出", yomi: "で", sentence: "おもてに(出)る。" },
  { kanji: "女", yomi: "おんな", sentence: "(女)の　こ。" },
  { kanji: "小", yomi: "しょう", sentence: "(小)がっこう。" },
  { kanji: "上", yomi: "うえ", sentence: "(上)をむく。" },
  { kanji: "森", yomi: "もり", sentence: "(森)のなかをあるく。" },
  { kanji: "人", yomi: "ひと", sentence: "(人)があつまる。" },
  { kanji: "水", yomi: "みず", sentence: "(水)をのむ。" },
  { kanji: "正", yomi: "せい", sentence: "(正)かいです。" },
  { kanji: "生", yomi: "せい", sentence: "１年(生)。" },
  { kanji: "青", yomi: "あお", sentence: "(青)いそら。" },
  { kanji: "夕", yomi: "ゆう", sentence: "(夕)やけ。" },
  { kanji: "石", yomi: "いし", sentence: "(石)をなげる。" },
  { kanji: "赤", yomi: "あか", sentence: "(赤)いりんご。" },
  { kanji: "千", yomi: "せん", sentence: "(千)円さつ。" },
  { kanji: "川", yomi: "かわ", sentence: "(川)でおよぐ。" },
  { kanji: "先", yomi: "せん", sentence: "お(先)にどうぞ。" },
  { kanji: "早", yomi: "はや", sentence: "お(早)ようございます。" },
  { kanji: "草", yomi: "くさ", sentence: "(草)をむしる。" },
  { kanji: "足", yomi: "あし", sentence: "(足)がはやい。" },
  { kanji: "村", yomi: "むら", sentence: "(村)のまつり。" },
  { kanji: "大", yomi: "だい", sentence: "(大)すきです。" },
  { kanji: "男", yomi: "おとこ", sentence: "(男)の　こ。" },
  { kanji: "竹", yomi: "たけ", sentence: "(竹)やぶ。" },
  { kanji: "中", yomi: "なか", sentence: "はこの(中)を見る。" },
  { kanji: "虫", yomi: "むし", sentence: "(虫)とり。" },
  { kanji: "町", yomi: "まち", sentence: "となりの(町)。" },
  { kanji: "天", yomi: "てん", sentence: "(天)きがいい。" },
  { kanji: "田", yomi: "た", sentence: "(田)んぼ。" },
  { kanji: "土", yomi: "つち", sentence: "(土)あそび。" },
  { kanji: "二", yomi: "に", sentence: "(二)じゅうえん。" },
  { kanji: "日", yomi: "ひ", sentence: "あさ(日)。" },
  { kanji: "入", yomi: "はい", sentence: "おふろに(入)る。" },
  { kanji: "年", yomi: "とし", sentence: "お(年)だま。" },
  { kanji: "白", yomi: "しろ", sentence: "(白)いかみ。" },
  { kanji: "八", yomi: "はち", sentence: "(八)にん。" },
  { kanji: "百", yomi: "ひゃく", sentence: "(百)点。" },
  { kanji: "文", yomi: "ぶん", sentence: "さく(文)をかく。" },
  { kanji: "木", yomi: "き", sentence: "(木)にのぼる。" },
  { kanji: "本", yomi: "ほん", sentence: "(本)をよむ。" },
  { kanji: "名", yomi: "な", sentence: "お(名)まえ。" },
  { kanji: "目", yomi: "め", sentence: "(目)をあける。" },
  { kanji: "立", yomi: "た", sentence: "(立)ってください。" },
  { kanji: "力", yomi: "ちから", sentence: "(力)もち。" },
  { kanji: "林", yomi: "はやし", sentence: "(林)をあるく。" },
  { kanji: "六", yomi: "ろく", sentence: "(六)にん。" },
  { kanji: "五", yomi: "ご", sentence: "(五)にん。" }
];

function App() {
  const [shuffledList, setShuffledList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));

  const startQuiz = () => {
    const list = [...kanjiList].sort(() => Math.random() - 0.5);
    setShuffledList(list);
    setCurrentIndex(0);
    setIsFinished(false);
    makeChoices(list[0]);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  const makeChoices = (question) => {
    if (!question) return;
    const correctYomi = question.yomi;
    const otherYomis = allYomis
      .filter(y => y !== correctYomi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    setChoices([correctYomi, ...otherYomis].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (ans) => {
    const currentQ = shuffledList[currentIndex];
    if (ans === currentQ.yomi) {
      setIsCorrect(true);
      setTimeout(() => {
        if (currentIndex + 1 < shuffledList.length) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          makeChoices(shuffledList[nextIdx]);
          setIsCorrect(null);
        } else {
          setIsFinished(true);
        }
      }, 500);
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  if (isFinished) {
    return (
      <div className="kanji-container finish-view">
        <div className="card finish-card">
          <div className="finish-title">🎉 ぜんもんクリア！ 🎉</div>
          <div className="finish-icon">🦄🌸✨</div>
          <p className="finish-message">80この かんじ<br/>ぜーんぶ おぼえたね！<br/>すごい すごい！</p>
          <button onClick={startQuiz} className="btn-restart">もういっかい！</button>
        </div>
        <style>{`
          .finish-view { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8); }
          .finish-card { border: 6px dashed #ff9a9e; background: rgba(255,255,255,0.95); animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
          .finish-title { font-size: 2.2rem; color: #ff69b4; font-weight: bold; margin-bottom: 20px; text-shadow: 2px 2px 0 #fff; }
          .finish-icon { font-size: 5rem; margin: 20px 0; animation: bounce 2s infinite; }
          .finish-message { font-size: 1.5rem; color: #555; line-height: 1.6; margin-bottom: 30px; }
          .btn-restart { background: linear-gradient(to bottom, #a1c4fd, #c2e9fb); box-shadow: 0 6px 0 #89b0e5; width: 80%; font-size: 1.8rem; }
          .btn-restart:active { box-shadow: 0 0 0 #89b0e5; transform: translateY(6px); }
          @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
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
          <span className="progress-text">のこり {kanjiList.length - currentIndex}もん！</span>
          <div className="progress-gauge" style={{width: `${(currentIndex / kanjiList.length) * 100}%`}}></div>
        </div>
        <div className="kanji-box-wrapper">
          <div className="kanji-box">{q.kanji}</div>
        </div>
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
        /* Google Fontsからかわいいフォントを読み込み */
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');

        .kanji-container {
          /* パステルカラーのグラデーション背景 */
          background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8, #c2e9fb);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Kiwi Maru', sans-serif; /* フォント適用 */
        }

        .card {
          background: #fffef0; /* クリーム色 */
          border-radius: 40px; /* 丸く */
          padding: 30px 25px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 15px 35px rgba(255, 105, 180, 0.2), inset 0 -5px 0 rgba(0,0,0,0.05);
          text-align: center;
          border: 4px dashed #ffb6c1; /* ピンクの点線枠 */
          position: relative;
          overflow: hidden;
        }
        /* カードの背景に薄い模様を入れる */
        .card::before {
          content: '🌸✨🍬💖';
          position: absolute;
          top: -20px; left: -20px;
          font-size: 8rem;
          opacity: 0.05;
          z-index: 0;
          pointer-events: none;
          transform: rotate(-20deg);
        }

        .header {
          color: #ff69b4; /* 濃いピンク */
          font-weight: bold;
          font-size: 1.3rem;
          margin-bottom: 15px;
          text-shadow: 2px 2px 0 #fff;
          position: relative;
          z-index: 1;
        }

        .progress-bar {
          background: #ffe4e1; /* 薄いピンク */
          border-radius: 25px;
          height: 25px;
          position: relative;
          overflow: hidden;
          margin-bottom: 25px;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
          z-index: 1;
        }
        .progress-text {
          position: absolute;
          width: 100%;
          top: 0; left: 0;
          line-height: 25px;
          font-size: 0.9rem;
          font-weight: bold;
          color: #d66b8a;
          text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
        }
        .progress-gauge {
          height: 100%;
          background: linear-gradient(to right, #ff9a9e, #fad0c4);
          border-radius: 25px;
          transition: width 0.3s ease;
        }

        .kanji-box-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .kanji-box {
          font-size: 8rem;
          font-weight: bold;
          /* 雲のような形 */
          border-radius: 50% 40% 60% 50% / 40% 50% 50% 60%;
          background: linear-gradient(135deg, #fff1b8, #ffe0b2);
          padding: 30px 40px;
          color: #ff8c00; /* オレンジ系の文字色 */
          text-shadow: 3px 3px 0 rgba(255,255,255,0.8);
          box-shadow: 0 10px 20px rgba(255, 165, 0, 0.2), inset 0 5px 10px rgba(255,255,255,0.5);
          animation: float 3s ease-in-out infinite;
        }

        .sentence {
          font-size: 1.5rem;
          color: #666;
          margin-bottom: 30px;
          min-height: 3rem;
          font-weight: bold;
          position: relative;
          z-index: 1;
        }

        .choices {
          display: grid;
          gap: 18px;
          position: relative;
          z-index: 1;
        }

        .btn-choice {
          padding: 18px;
          font-size: 1.6rem;
          border: none;
          border-radius: 50px; /* キャンディ型 */
          color: white;
          font-weight: bold;
          cursor: pointer;
          font-family: 'Kiwi Maru', sans-serif;
          transition: all 0.1s;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }
        /* ボタンの光沢感 */
        .btn-choice::after {
          content: '';
          position: absolute;
          top: 5px; left: 10px;
          width: 90%; height: 40%;
          background: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.1));
          border-radius: 50px;
        }
        .btn-choice:active {
          transform: translateY(6px);
          box-shadow: none !important;
        }

        /* 各ボタンの色（グラデーションと立体的な影） */
        .color-0 {
          background: linear-gradient(to bottom, #ff9a9e, #fecfef);
          box-shadow: 0 6px 0 #ff758c, 0 8px 15px rgba(255, 117, 140, 0.3);
        }
        .color-1 {
          background: linear-gradient(to bottom, #a1c4fd, #c2e9fb);
          box-shadow: 0 6px 0 #89b0e5, 0 8px 15px rgba(137, 176, 229, 0.3);
        }
        .color-2 {
          background: linear-gradient(to bottom, #84fab0, #8fd3f4);
          box-shadow: 0 6px 0 #6dd5a8, 0 8px 15px rgba(109, 213, 168, 0.3);
        }

        .overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);
          font-size: 6rem;
          font-weight: bold;
          z-index: 100;
          pointer-events: none;
          text-shadow: 3px 3px 0 #fff, 5px 5px 10px rgba(0,0,0,0.2);
          animation: popUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .ok { color: #ff69b4; }
        .ng { color: #5c9eff; }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes popUp {
          to { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default App;