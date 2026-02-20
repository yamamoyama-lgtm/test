const state = {
  day: 1,
  money: 8,
  trust: 1,
  quality: 1,
  spendCount: 0,
  boughtOut: false,
  ended: false,
};

const dayEl = document.getElementById('day');
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');
const resultEl = document.getElementById('result');
const restartBtn = document.getElementById('restart');

const moneyEl = document.getElementById('money');
const trustEl = document.getElementById('trust');
const qualityEl = document.getElementById('quality');
const spendEl = document.getElementById('spend');

const scenes = {
  1: {
    text: '競合の大型情報屋が7日後にオープン予定。あなたは公認情報屋の管理人として、生活を守るために経営を立て直す。',
    choices: [
      { label: '広告と値下げを打つ（-2資金 / +2信用）', apply: () => { state.money -= 2; state.trust += 2; state.spendCount += 1; } },
      { label: '冒険者の精査班を雇う（-2資金 / +2品質）', apply: () => { state.money -= 2; state.quality += 2; state.spendCount += 1; } },
      { label: '様子見して支出を抑える（変化なし）', apply: () => {} },
    ],
  },
  3: {
    text: 'DAY3。常連が減り始めた。どの軸を強化する？',
    choices: [
      { label: '冒険者と独占契約（-2資金 / +2信用）', apply: () => { state.money -= 2; state.trust += 2; state.spendCount += 1; } },
      { label: '品質保証を導入（-2資金 / +2品質）', apply: () => { state.money -= 2; state.quality += 2; state.spendCount += 1; } },
      { label: '支出せず接客改善（+1信用）', apply: () => { state.trust += 1; } },
    ],
  },
  5: {
    text: 'DAY5。競合責任者ノクトから買収交渉の余地があるとの情報。ここで大金を使うか？',
    choices: [
      { label: '開店前買収を実行（-6資金 / END2狙い）', apply: () => { state.money -= 6; state.spendCount += 1; if (state.money >= 0) state.boughtOut = true; } },
      { label: '買収せず、店の精度をさらに強化（-1資金 / +1品質）', apply: () => { state.money -= 1; state.quality += 1; state.spendCount += 1; } },
      { label: '現金温存で耐える（変化なし）', apply: () => {} },
    ],
  },
};

function renderStats() {
  moneyEl.textContent = state.money;
  trustEl.textContent = state.trust;
  qualityEl.textContent = state.quality;
  spendEl.textContent = state.spendCount;
}

function stepToNextDay() {
  state.day += 2;
  if (state.day > 7) {
    finish();
    return;
  }
  render();
}

function finish() {
  state.ended = true;
  let ending = 'END1「倒産」';
  let reason = 'END2 / END3 条件を満たせず、1週間後に資金繰りが破綻。';

  if (state.boughtOut) {
    ending = 'END2「買収」';
    reason = '資金を貯めて競合オープン前に買収を実行。';
  } else if (state.spendCount <= 3) {
    ending = 'END3「資産」';
    reason = '買収はしなかったが、支出回数を3回以下に抑えて資産を維持。';
  }

  // END4 placeholder
  const extra = 'END4 は将来実装予定。';

  resultEl.innerHTML = `<h2>${ending}</h2><p>${reason}</p><p>最終値: 資金 ${state.money} / 信用 ${state.trust} / 品質 ${state.quality} / 支出回数 ${state.spendCount}</p><p>${extra}</p>`;
  resultEl.classList.remove('hidden');
  choicesEl.innerHTML = '';
  restartBtn.classList.remove('hidden');
  dayEl.textContent = 'DAY 7 結果';
  textEl.textContent = '一週間の経営判断が、あなたの店の未来を決めた。';
}

function render() {
  renderStats();
  const scene = scenes[state.day];
  dayEl.textContent = `DAY ${state.day}`;
  textEl.textContent = scene.text;
  choicesEl.innerHTML = '';

  scene.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.textContent = choice.label;
    btn.addEventListener('click', () => {
      choice.apply();
      renderStats();
      stepToNextDay();
    });
    choicesEl.appendChild(btn);
  });
}

restartBtn.addEventListener('click', () => window.location.reload());

render();
