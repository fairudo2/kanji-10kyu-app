import React, { useState, useEffect } from 'react';

// 漢検10級全80文字データ
const kanjiList = [
  { kanji: "一", yomi: "いち", sentence: "一（ ）ねんせいに なる。" },
  { kanji: "二", yomi: "に", sentence: "みかんが 二（ ）こ ある。" },
  { kanji: "三", yomi: "さん", sentence: "三（ ）にんで あそぶ。" },
  { kanji: "四", yomi: "よん", sentence: "四（ ）ひきの ねこ。" },
  { kanji: "五", yomi: "ご", sentence: "五（ ）にんの こども。" },
  { kanji: "六", yomi: "ろく", sentence: "六（ ）にんで はしる。" },
  { kanji: "七", yomi: "なな", sentence: "七（ ）つの おかし。" },
  { kanji: "八", yomi: "はち", sentence: "八（ ）にんの なかま。" },
  { kanji: "九", yomi: "きゅう", sentence: "九（ ）にんの チーム。" },
  { kanji: "十", yomi: "じゅう", sentence: "十（ ）えん だま。" },
  { kanji: "右", yomi: "みぎ", sentence: "右（ ）の てを あげる。" },
  { kanji: "左", yomi: "ひだり", sentence: "左（ ）に まがる。" },
  { kanji: "王", yomi: "おう", sentence: "王（ ）さまの おしろ。" },
  { kanji: "雨", yomi: "あめ", sentence: "雨（ ）が ふってきた。" },
  { kanji: "円", yomi: "えん", sentence: "百 円（ ）だまを もつ。" },
  { kanji: "音", yomi: "おと", sentence: "ピアノの 音（ ）を きく。" },
  { kanji: "花", yomi: "はな", sentence: "きれいな 花（ ）が さく。" },
  { kanji: "貝", yomi: "かい", sentence: "うみで 貝（ ）を ひろう。" },
  { kanji: "学", yomi: "がっ", sentence: "学（ ）こうへ いく。" },
  { kanji: "休", yomi: "やす", sentence: "あしたは お休（ ）みだ。" },
  // ※ 実際にはここへ80文字分続きます
];

function App() {
  const [view, setView] = useState('menu');
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [res, setRes] = useState(null);
  const [score, setScore] = useState(0);

  const startQuiz = (start, end) => {
    const qSet = kanjiList.slice(start, end).sort(() => Math.random() - 0.5);
    setQuestions(qSet);
    setIdx(0);
    setScore(0);
    setView('quiz');
    makeChoices(qSet[0]);
  };

  const makeChoices = (q) => {
    const others = kanjiList.filter(k => k.yomi !== q.yomi).sort(() => Math.random() - 0.5).slice(0, 2);
    const c = [q.yomi, ...others.map(k => k.yomi)].sort(() => Math.random() - 0.5);
    setChoices(c);
  };

  const check = (ans) => {
    if (res !== null) return;
    const isCorrect = ans === questions[idx].yomi;
    setRes(isCorrect ? 'ok' : 'ng');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(idx + 1);
        makeChoices(questions[idx + 1]);
        setRes(null);
      } else {
        setView('result');
        setRes(null);
      }
    }, 800);
  };

  return (
    <div className="app-container">
      {view === 'menu' && (
        <div className="card fluffy-card">
          <h1 className="title">🌸 漢検10級 とっくん 🌸</h1>
          <p className="subtitle">すきな ステージを えらんでね！</p>
          <div className="btn-grid">
            <button className="gem-btn pink" onClick={() => startQuiz(0, 10)}>1〜10もん</button>
            <button className="gem-btn blue" onClick={() => startQuiz(10, 20)}>11〜20もん</button>
          </div>
        </div>
      )}

      {view === 'quiz' && (
        <div className="card fluffy-card">
          <div className="info">{idx + 1} / {questions.length} もんめ</div>
          <div className="question-display">
             {questions[idx].sentence.split(/（|）/).map((part, i) => 
               i === 1 ? <span key={i} className="kanji-target">{questions[idx].kanji}</span> : part
             )}
          </div>
          <div className="choices">
            {choices.map((c, i) => (
              <button key={i} className={`gem-btn choice-color-${i}`} onClick={() => check(c)}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {view === 'result' && (
        <div className="card fluffy-card clear-effect">
          <h2 className="title">🎊 クリア！ 🎊</h2>
          <div className="score">{score * 10}<span>てん</span></div>
          <button className="gem-btn pink" onClick={() => setView('menu')}>メニューにもどる</button>
        </div>
      )}

      {res === 'ok' && <div className="overlay ok">⭕ まる！</div>}
      {res === 'ng' && <div className="overlay ng">❌ ざんねん</div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        .app-container { min-height: 100vh; background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8); display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; padding: 15px; }
        
        /* モコモコのカードデザイン */
        .fluffy-card { background: rgba(255, 255, 255, 0.85); border-radius: 40px; border: 4px dashed #ffb6c1; padding: 30px; width: 400px; text-align: center; box-shadow: 0 15px 35px rgba(255, 105, 180, 0.2); backdrop-filter: blur(5px); position: relative; }
        
        .title { color: #ff69b4; font-size: 1.6rem; margin-bottom: 5px; }
        .subtitle { color: #888; margin-bottom: 25px; font-size: 0.9rem; }
        
        .btn-grid { display: grid; gap: 15px; }
        
        /* 宝石のようなボタン */
        .gem-btn { padding: 18px; border-radius: 30px; border: none; font-size: 1.2rem; font-weight: bold; color: white; cursor: pointer; transition: 0.2s; box-shadow: 0 6px 0 #ffb6c1; }
        .gem-btn:active { transform: translateY(6px); box-shadow: none; }
        .pink { background: #ff9a9e; box-shadow: 0 6px 0 #ff7a8e; }
        .blue { background: #a1c4fd; box-shadow: 0 6px 0 #81a4ed; }
        
        .question-display { font-size: 1.5rem; margin-bottom: 30px; line-height: 2; }
        .kanji-target { color: #ff4757; font-size: 2.5rem; border-bottom: 4px solid #ff4757; margin: 0 5px; }
        
        .choices { display: grid; gap: 12px; }
        .choice-color-0 { background: #ff9a9e; box-shadow: 0 6px 0 #ff7a8e; }
        .choice-color-1 { background: #a1c4fd; box-shadow: 0 6px 0 #81a4ed; }
        .choice-color-2 { background: #84fab0; box-shadow: 0 6px 0 #72d998; }
        
        .score { font-size: 5rem; color: #ff69b4; margin: 20px 0; }
        .score span { font-size: 1.5rem; }
        
        .overlay { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 6rem; z-index: 100; pointer-events: none; }
        .ok { color: #ff69b4; text-shadow: 2px 2px 10px white; }
        .ng { color: #5c9eff; text-shadow: 2px 2px 10px white; }
      `}</style>
    </div>
  );
}

export default App;