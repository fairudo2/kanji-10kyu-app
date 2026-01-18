import React, { useState, useEffect } from 'react';

// 漢検10級（1年生）全80文字データ
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

  // 読み方のセット（選択肢の重複チェック用）
  const allYomis = Array.from(new Set(kanjiList.map(k => k.yomi)));

  // リセット・開始
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

  // 選択肢を作る（同じ読みが出ないように調整）
  const makeChoices = (question) => {
    if (!question) return;
    const correctYomi = question.yomi;
    // 正解以外の読みからランダムに2つ選ぶ
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
      }, 400);
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  if (isFinished) {
    return (
      <div className="kanji-container">
        <div className="card">
          <div className="finish-text">✨ ぜんもんクリア！ ✨</div>
          <div className="kanji-box">🌸</div>
          <p>80文字ぜんぶ まわりました！すごい！</p>
          <button onClick={startQuiz} className="btn-restart">もういちど やる</button>
        </div>
        <style>{`.finish-text { font-size: 2rem; color: #f5222d; font-weight: bold; margin-bottom: 20px; } .btn-restart { background: #69c0ff; width: 100%; margin-top: 20px; }`}</style>
      </div>
    );
  }

  const q = shuffledList[currentIndex];
  if (!q) return null;

  return (
    <div className="kanji-container">
      <div className="card">
        <div className="header">かんけん10きゅう きあい！</div>
        <div className="progress-bar">{kanjiList.length}問じゅう {currentIndex + 1}問め</div>
        <div className="kanji-box">{q.kanji}</div>
        <div className="sentence">{q.sentence}</div>
        <div className="choices">
          {choices.map((c, i) => (
            <button key={i} onClick={() => handleAnswer(c)} className={`btn-${i}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {isCorrect === true && <div className="overlay ok">まる！ ⭕</div>}
      {isCorrect === false && <div className="overlay ng">ざんねん！ ❌</div>}

      <style>{`
        .kanji-container { background: #fffae6; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; font-family: sans-serif; }
        .card { background: white; border-radius: 25px; padding: 25px; width: 100%; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; border: 4px solid #ffd666; }
        .header { color: #d48806; font-weight: bold; margin-bottom: 5px; }
        .progress-bar { font-size: 1.2rem; font-weight: bold; color: #666; margin-bottom: 20px; background: #eee; border-radius: 10px; padding: 5px; }
        .kanji-box { font-size: 8rem; font-weight: bold; background: #fff1b8; border-radius: 20px; margin-bottom: 20px; color: #333; }
        .sentence { font-size: 1.4rem; color: #555; margin-bottom: 30px; min-height: 3rem; }
        .choices { display: grid; gap: 15px; }
        button { padding: 18px; font-size: 1.6rem; border: none; border-radius: 50px; color: white; font-weight: bold; box-shadow: 0 4px 0 rgba(0,0,0,0.1); cursor: pointer; }
        .btn-0 { background: #ff7875; } .btn-1 { background: #69c0ff; } .btn-2 { background: #95de64; }
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 5rem; font-weight: bold; z-index: 100; pointer-events: none; }
        .ok { color: #f5222d; } .ng { color: #2f54eb; }
      `}</style>
    </div>
  );
}

export default App;