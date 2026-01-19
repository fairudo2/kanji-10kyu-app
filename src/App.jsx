import React, { useState, useEffect } from 'react';

// 漢検10級 全80文字 データ完全修正版
// 答えのネタバレを削除し、1年生向けの短い文章にしました。
const kanjiList = [
  // --- ステージ1 (1-10) 数字 ---
  { kanji: "一", yomi: "いち", sentence: "【一】ねんせいに　なる。", isMulti: true, q2: { s: "りんごが　【一】つ。", a: "ひと" } },
  { kanji: "二", yomi: "に", sentence: "【二】ねんせいに　なる。", isMulti: true, q2: { s: "みかんが　【二】つ。", a: "ふた" } },
  { kanji: "三", yomi: "さん", sentence: "【三】かくけいの　つみき。", isMulti: true, q2: { s: "おかしを　【三】つ　たべる。", a: "み" } },
  { kanji: "四", yomi: "よん", sentence: "【四】ねんせいの　お兄さん。", isMulti: true, q2: { s: "パンを　【四】つ　かう。", a: "よ" } },
  { kanji: "五", yomi: "ご", sentence: "【五】えん　もっている。", isMulti: true, q2: { s: "あめを　【五】つ　もらう。", a: "いつ" } },
  { kanji: "六", yomi: "ろく", sentence: "あさ　【六】じに　おきる。", isMulti: true, q2: { s: "コップが　【六】つ　ある。", a: "む" } },
  { kanji: "七", yomi: "しち", sentence: "よる　【七】じに　ねる。", isMulti: true, q2: { s: "【七】つの　ほし。", a: "なな" } },
  { kanji: "八", yomi: "はち", sentence: "【八】にんで　あそぶ。", isMulti: true, q2: { s: "いしが　【八】つ　ある。", a: "や" } },
  { kanji: "九", yomi: "く", sentence: "【九】がつに　なる。", isMulti: true, q2: { s: "たまごが　【九】つ。", a: "ここの" } },
  { kanji: "十", yomi: "じゅう", sentence: "【十】えん　ひろう。", isMulti: true, q2: { s: "きょうは　【十】日。", a: "とお" } },

  // --- ステージ2 (11-20) 大小・位置 ---
  { kanji: "百", yomi: "ひゃく", sentence: "テストで　【百】てんを　とる。" },
  { kanji: "千", yomi: "せん", sentence: "【千】えんさつを　見る。" },
  { kanji: "上", yomi: "うえ", sentence: "つくえの　【上】に　おく。", isMulti: true, q2: { s: "【上】ぎを　きる。", a: "うわ" } },
  { kanji: "下", yomi: "した", sentence: "いすの　【下】に　ある。", isMulti: true, q2: { s: "ろう【下】を　あるく。", a: "か" } },
  { kanji: "左", yomi: "ひだり", sentence: "【左】てを　あげる。" },
  { kanji: "右", yomi: "みぎ", sentence: "【右】がわを　あるく。" },
  { kanji: "中", yomi: "なか", sentence: "はこの　【中】を　見る。", isMulti: true, q2: { s: "せ【中】を　あらう。", a: "なか" } },
  { kanji: "大", yomi: "おお", sentence: "【大】きい　ケーキ。", isMulti: true, q2: { s: "【大】がくせいの　お姉さん。", a: "だい" } },
  { kanji: "小", yomi: "ちい", sentence: "【小】さい　あり。", isMulti: true, q2: { s: "【小】がっこうに　いく。", a: "しょう" } },
  { kanji: "月", yomi: "つき", sentence: "きれいな　お【月】さま。", isMulti: true, q2: { s: "一【月】一日は　お正月。", a: "がつ" } },

  // --- ステージ3 (21-30) 曜日・自然 ---
  { kanji: "日", yomi: "ひ", sentence: "お【日】さまが　出ている。", isMulti: true, q2: { s: "あしたは　【日】ようび。", a: "にち" } },
  { kanji: "火", yomi: "ひ", sentence: "【火】が　もえている。", isMulti: true, q2: { s: "【火】ようびに　あそぶ。", a: "か" } },
  { kanji: "水", yomi: "みず", sentence: "つめたい　【水】。", isMulti: true, q2: { s: "【水】ようびは　早い。", a: "すい" } },
  { kanji: "木", yomi: "き", sentence: "大きな　【木】の　下。", isMulti: true, q2: { s: "【木】ようびの　よてい。", a: "もく" } },
  { kanji: "金", yomi: "きん", sentence: "【金】メダルを　もらう。", isMulti: true, q2: { s: "お【金】を　つかう。", a: "かね" } },
  { kanji: "土", yomi: "つち", sentence: "【土】あそびを　する。", isMulti: true, q2: { s: "【土】ようびは　お休み。", a: "ど" } },
  { kanji: "山", yomi: "やま", sentence: "【山】のぼりを　する。", isMulti: true, q2: { s: "ふじ【山】に　のぼる。", a: "さん" } },
  { kanji: "川", yomi: "かわ", sentence: "【川】で　およぐ。" },
  { kanji: "田", yomi: "た", sentence: "【田】んぼに　カエルがいる。", isMulti: true, q2: { s: "広い　水【田】。", a: "でん" } },
  { kanji: "石", yomi: "いし", sentence: "きれいな　【石】を　ひろう。" },

  // --- ステージ4 (31-40) 自然・生き物 ---
  { kanji: "花", yomi: "はな", sentence: "赤い　【花】が　さく。", isMulti: true, q2: { s: "【花】びんを　おく。", a: "か" } },
  { kanji: "草", yomi: "くさ", sentence: "【草】を　むしる。" },
  { kanji: "林", yomi: "はやし", sentence: "【林】の　中を　あるく。" },
  { kanji: "森", yomi: "もり", sentence: "【森】に　いく。" },
  { kanji: "竹", yomi: "たけ", sentence: "【竹】うまに　のる。", isMulti: true, q2: { s: "きれいな　【竹】りん。", a: "ちく" } },
  { kanji: "虫", yomi: "むし", sentence: "【虫】とりを　する。" },
  { kanji: "貝", yomi: "かい", sentence: "うみで　【貝】を　ひろう。" },
  { kanji: "犬", yomi: "いぬ", sentence: "白い　【犬】。", isMulti: true, q2: { s: "ばん【犬】が　いる。", a: "けん" } },
  { kanji: "足", yomi: "あし", sentence: "【足】が　はやい。", isMulti: true, q2: { s: "たのしい　えん【足】。", a: "そく" } },
  { kanji: "手", yomi: "て", sentence: "【手】を　あらう。" },

  // --- ステージ5 (41-50) 体・人 ---
  { kanji: "目", yomi: "め", sentence: "【目】が　いい。", isMulti: true, q2: { s: "【目】ひょうを　きめる。", a: "もく" } },
  { kanji: "耳", yomi: "みみ", sentence: "【耳】を　すます。" },
  { kanji: "口", yomi: "くち", sentence: "【口】を　あける。", isMulti: true, q2: { s: "いり【口】は　こちら。", a: "ぐち" } },
  { kanji: "力", yomi: "ちから", sentence: "【力】もちの　おとうさん。", isMulti: true, q2: { s: "みんなで　きょう【力】する。", a: "りょく" } },
  { kanji: "人", yomi: "ひと", sentence: "しっている　【人】。", isMulti: true, q2: { s: "三【人】で　たべる。", a: "にん" } },
  { kanji: "子", yomi: "こ", sentence: "元気な　【子】ども。", isMulti: true, q2: { s: "女の【子】と　あそぶ。", a: "こ" } },
  { kanji: "女", yomi: "おんな", sentence: "【女】の　ひと。", isMulti: true, q2: { s: "【女】子の　トイレ。", a: "じょ" } },
  { kanji: "男", yomi: "おとこ", sentence: "【男】の　こ。", isMulti: true, q2: { s: "わたしは　長【男】です。", a: "なん" } },
  { kanji: "名", yomi: "な", sentence: "お【名】まえを　かく。", isMulti: true, q2: { s: "ゆう【名】な　え。", a: "めい" } },
  { kanji: "正", yomi: "ただ", sentence: "【正】しい　こたえ。", isMulti: true, q2: { s: "お【正】月に　もちをたべる。", a: "しょう" } },

  // --- ステージ6 (51-60) 学校・動作 ---
  { kanji: "生", yomi: "う", sentence: "あかちゃんが　【生】まれる。", isMulti: true, q2: { s: "先【生】、さようなら。", a: "せい" } },
  { kanji: "立", yomi: "た", sentence: "いすから　【立】つ。", isMulti: true, q2: { s: "こく【立】こうえん。", a: "りつ" } },
  { kanji: "休", yomi: "やす", sentence: "学校が　お【休】み。", isMulti: true, q2: { s: "【休】じつの　パパ。", a: "きゅう" } },
  { kanji: "出", yomi: "で", sentence: "おばけが　【出】る。", isMulti: true, q2: { s: "【出】ぐちは　あっち。", a: "で" } },
  { kanji: "入", yomi: "はい", sentence: "へやに　【入】る。", isMulti: true, q2: { s: "【入】がくしき。", a: "にゅう" } },
  { kanji: "見", yomi: "み", sentence: "ゆめを　【見】る。", isMulti: true, q2: { s: "お花【見】を　する。", a: "み" } },
  { kanji: "音", yomi: "おと", sentence: "ピアノの　【音】。", isMulti: true, q2: { s: "【音】がくの　じかん。", a: "おん" } },
  { kanji: "学", yomi: "まな", sentence: "かんじを　【学】ぶ。", isMulti: true, q2: { s: "【学】こうへ　いく。", a: "がっ" } },
  { kanji: "校", yomi: "こう", sentence: "学【校】で　あそぶ。", isMulti: true, q2: { s: "【校】ちょう先生。", a: "こう" } },
  { kanji: "文", yomi: "ぶん", sentence: "作【文】を　かく。", isMulti: true, q2: { s: "【文】字（もじ）。", a: "も" } },

  // --- ステージ7 (61-70) 色・空 ---
  { kanji: "字", yomi: "じ", sentence: "きれいな　【字】。" },
  { kanji: "早", yomi: "はや", sentence: "【早】く　ねる。", isMulti: true, q2: { s: "【早】ちょうに　おきる。", a: "そう" } },
  { kanji: "夕", yomi: "ゆう", sentence: "【夕】がたに　かえる。", isMulti: true, q2: { s: "七【夕】の　ささかざり。", a: "ばた" } },
  { kanji: "空", yomi: "そら", sentence: "青い　【空】。", isMulti: true, q2: { s: "【空】気を　すう。", a: "くう" } },
  { kanji: "気", yomi: "き", sentence: "元【気】な　こえ。", isMulti: true, q2: { s: "さむ【気】が　する。", a: "け" } },
  { kanji: "天", yomi: "てん", sentence: "いい　【天】気。", isMulti: true, q2: { s: "【天】のがわを　見る。", a: "あま" } },
  { kanji: "赤", yomi: "あか", sentence: "【赤】い　りんご。", isMulti: true, q2: { s: "お祝いで　【赤】はんを　たべる。", a: "せき" } },
  { kanji: "青", yomi: "あお", sentence: "【青】い　うみ。", isMulti: true, q2: { s: "きれいな　【青】ぞら。", a: "あお" } },
  { kanji: "白", yomi: "しろ", sentence: "【白】い　くも。", isMulti: true, q2: { s: "【白】ちょうが　およぐ。", a: "はく" } },
  { kanji: "糸", yomi: "いと", sentence: "【糸】を　きる。" },

  // --- ステージ8 (71-80) 町・その他 ---
  { kanji: "車", yomi: "くるま", sentence: "【車】に　気をつける。", isMulti: true, q2: { s: "電【車】が　はしる。", a: "しゃ" } },
  { kanji: "町", yomi: "まち", sentence: "【町】へ　いく。", isMulti: true, q2: { s: "下【町】を　あるく。", a: "まち" } },
  { kanji: "村", yomi: "むら", sentence: "【村】の　ひと。", isMulti: true, q2: { s: "【村】ちょうさんが　はなす。", a: "そん" } },
  { kanji: "王", yomi: "おう", sentence: "【王】さま。", isMulti: true, q2: { s: "ありの　女【王】。", a: "おう" } },
  { kanji: "玉", yomi: "たま", sentence: "【玉】いれを　する。", isMulti: true, q2: { s: "百円【玉】を　おとす。", a: "だま" } },
  { kanji: "円", yomi: "えん", sentence: "百【円】だま。", isMulti: true, q2: { s: "【円】い　ボール。", a: "まる" } },
  { kanji: "先", yomi: "さき", sentence: "ゆび【先】。", isMulti: true, q2: { s: "【先】せいに　きく。", a: "せん" } },
  { kanji: "年", yomi: "ねん", sentence: "一【年】生。", isMulti: true, q2: { s: "【年】うえの　ともだち。", a: "とし" } },
  { kanji: "本", yomi: "ほん", sentence: "【本】を　よむ。", isMulti: true, q2: { s: "えんぴつが　三【本】。", a: "ぼん" } },
  { kanji: "休", yomi: "やす", sentence: "【休】み。", isMulti: true, q2: { s: "【休】じつは　あそぶ。", a: "きゅう" } }
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
    const safeList = kanjiList.slice(startIdx, startIdx + 10);
    if (safeList.length === 0) return;

    const list = safeList.sort(() => Math.random() - 0.5);
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
        setClearedStages(prev => ({...prev, [mode]: [...new Set([...prev[mode], currentStage])]}));
        setView('stageClear'); setIsCorrect(null);
      }
    }, 1000);
  };

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
          <div className="header-s">ステージ {currentStage + 1} - {currentIndex + 1}/10</div>
          <div className="kanji-display">{stageList[currentIndex].kanji}</div>
          
          <div className="question-area">
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
          <div className="title-font big">💖 ぜんぶ せいかい 💖</div>
          <div className="bunny-character bounce">🐰👑✨</div>
          <p className="msg">すごい！ ステージ{currentStage+1} クリア！</p>
          <button onClick={() => setView('stageSelect')} className="btn-next">つぎの ステージへ</button>
        </div>
      )}

      {isCorrect === true && <div className="character-overlay ok"><div className="bunny">🐰💕</div><div className="txt">すごーい！</div></div>}
      {isCorrect === false && <div className="character-overlay ng"><div className="cat">🐱💧</div><div className="txt">どんまいっ</div></div>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

        .yumekawa-app { background: linear-gradient(135deg, #ffdde1, #ee9ca7, #a7bfe8); min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Kiwi Maru', sans-serif; overflow: hidden; }
        .card { background: rgba(255, 255, 255, 0.9); border-radius: 40px; padding: 20px; width: 95%; max-width: 480px; box-shadow: 0 15px 30px rgba(255, 105, 180, 0.2); text-align: center; border: 4px solid #fff; position: relative; }
        .title-font { font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4; text-shadow: 2px 2px #fff; }
        .glow-marker { background: linear-gradient(transparent 50%, rgba(255, 105, 180, 0.4) 50%); padding: 0 3px; font-weight: bold; color: #ff4757; font-size: 1.4rem; }
        .kanji-display { font-size: 4rem; color: #ff8c00; background: #fff; border-radius: 20px; display: inline-block; padding: 0 25px; margin-bottom: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .question-area { background: #fff9fa; padding: 15px; border-radius: 25px; border: 2px solid #ffe4e1; text-align: left; }
        .q-row { transition: 0.3s; margin-bottom: 8px; }
        .q-row.done { opacity: 0.4; pointer-events: none; }
        .divider { height: 2px; background: #ffe4e1; margin: 10px 0; }
        .sentence { font-size: 1.1rem; margin-bottom: 8px; color: #555; font-weight: bold; padding-left: 5px; }
        .choice-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
        .choice-s { padding: 8px 12px; border-radius: 12px; border: 2px solid #ff9a9e; background: #fff; cursor: pointer; font-size: 1rem; font-family: 'Mochiy+Pop+One', sans-serif; box-shadow: 0 3px 0 #ffb6c1; min-width: 60px; }
        .choice-s.selected { background: #ff9a9e; color: #fff; }
        .choice-l { flex: 1; padding: 15px; border-radius: 30px; border: none; color: #fff; font-size: 1.5rem; font-family: 'Mochiy+Pop+One', sans-serif; cursor: pointer; box-shadow: 0 5px 0 rgba(0,0,0,0.1); }
        .color-0 { background: #ff9a9e; } .color-1 { background: #a1c4fd; } .color-2 { background: #84fab0; }
        .btn-mode { width: 100%; padding: 20px; margin-bottom: 15px; border-radius: 30px; border: none; color: #fff; font-size: 1.4rem; font-weight: bold; cursor: pointer; box-shadow: 0 6px 0 rgba(0,0,0,0.1); }
        .pink { background: #ff9a9e; } .blue { background: #a1c4fd; }
        .stage-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; }
        .btn-stage { padding: 15px; border-radius: 20px; border: 2px solid #ffb6c1; background: #fff; cursor: pointer; color: #ff69b4; font-weight: bold; }
        .btn-stage.cleared { background: #fff1b8; color: #d48806; border-color: #ffd666; }
        .character-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 100; pointer-events: none; animation: popUp 0.4s ease-out; }
        .character-overlay .bunny { font-size: 8rem; filter: drop-shadow(0 0 10px #fff); } .character-overlay .cat { font-size: 8rem; }
        .character-overlay .txt { font-size: 2rem; font-family: 'Mochiy+Pop+One', sans-serif; color: #ff69b4; background: rgba(255,255,255,0.95); padding: 10px 30px; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); margin-top: 10px; }
        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes popUp { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .btn-back { margin-top: 15px; background: none; border: none; color: #aaa; text-decoration: underline; cursor: pointer; }
        .btn-next { background: #ff758c; color: #fff; border: none; padding: 15px 30px; border-radius: 50px; font-size: 1.4rem; font-family: 'Mochiy+Pop+One', sans-serif; cursor: pointer; margin-top: 20px; box-shadow: 0 5px 0 #e65a70; }
      `}</style>
    </div>
  );
}

export default App;