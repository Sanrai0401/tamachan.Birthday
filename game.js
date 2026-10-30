/* =====================================
   Happy Birthday, たまちゃん！
   ゲーム進行システム
===================================== */

// 画面取得
const titleScreen = document.getElementById("title-screen");
const cakeScreen = document.getElementById("cake-screen");
const giftScreen = document.getElementById("gift-screen");
const letterScreen = document.getElementById("letter-screen");

const startButton = document.getElementById("start-button");

const candles = document.querySelectorAll(".candle");
const cakeArea = document.getElementById("cake-area");
const cakeMessage = document.getElementById("cake-message");
const candleCount = document.getElementById("candle-count");

const giftBoxes = document.querySelectorAll(".gift-box");
const giftMessage = document.getElementById("gift-message");
const giftCount = document.getElementById("gift-count");

const openLetterButton = document.getElementById("open-letter");
const letter = document.getElementById("letter");
const endingMessage = document.getElementById("ending-message");

// ゲーム状態
const TOTAL_CANDLES = 20;

let blownCandles = 0;
let openedGifts = 0;
let gameFinished = false;

let animationFrame = null;
let movingCandles = [];
let previousTime = 0;

// 画面切り替え
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(item => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
}

// スタート
startButton.addEventListener("click", () => {
  showScreen(cakeScreen);

  if (typeof playStartSound === "function") {
    playStartSound();
  }

  if (typeof startBGM === "function") {
    startBGM();
  }

  startCandleGame();
});

// ろうそくゲーム開始
function startCandleGame() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  blownCandles = 0;
  candleCount.textContent = `残り ${TOTAL_CANDLES} 本`;
  cakeMessage.textContent = "動いているろうそくをタップして消してね！";

  movingCandles = [];

  const areaWidth = cakeArea.clientWidth;
  const areaHeight = cakeArea.clientHeight;

  candles.forEach(candle => {
    candle.classList.remove("blown");
    candle.textContent = "🕯️";
    candle.disabled = false;

    const candleData = {
      element: candle,
      x: 25 + Math.random() * Math.max(1, areaWidth - 50),
      y: 25 + Math.random() * Math.max(1, areaHeight - 50),
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      changeDirection: Math.random() * 1500
    };

    if (Math.abs(candleData.vx) < 0.5) {
      candleData.vx = 0.8;
    }

    if (Math.abs(candleData.vy) < 0.5) {
      candleData.vy = 0.8;
    }

    movingCandles.push(candleData);

    candle.style.left = `${candleData.x}px`;
    candle.style.top = `${candleData.y}px`;
    candle.style.transform = "translate(-50%, -50%)";
  });

  previousTime = 0;
  moveCandles();
}

// ろうそくの移動
function moveCandles(timestamp = 0) {
  const width = cakeArea.clientWidth;
  const height = cakeArea.clientHeight;

  const deltaTime = previousTime
    ? Math.min(timestamp - previousTime, 32)
    : 16;

  previousTime = timestamp;

  movingCandles.forEach(data => {
    const candle = data.element;

    if (candle.classList.contains("blown")) {
      return;
    }

    // 時間経過で少しずつ方向を変える
    data.changeDirection -= deltaTime;

    if (data.changeDirection <= 0) {
      data.vx += (Math.random() - 0.5) * 0.8;
      data.vy += (Math.random() - 0.5) * 0.8;

      // 移動速度を調整
      data.vx = Math.max(-2.5, Math.min(2.5, data.vx));
      data.vy = Math.max(-2.5, Math.min(2.5, data.vy));

      data.changeDirection = 800 + Math.random() * 1200;
    }

    // 移動
    data.x += data.vx * (deltaTime / 16);
    data.y += data.vy * (deltaTime / 16);

    // 画面端で反射
    const margin = 24;

    if (data.x < margin || data.x > width - margin) {
      data.vx *= -1;
    }

    if (data.y < margin || data.y > height - margin) {
      data.vy *= -1;
    }

    // 移動範囲内に収める
    data.x = Math.max(margin, Math.min(width - margin, data.x));
    data.y = Math.max(margin, Math.min(height - margin, data.y));

    candle.style.left = `${data.x}px`;
    candle.style.top = `${data.y}px`;
  });

  if (blownCandles < TOTAL_CANDLES) {
    animationFrame = requestAnimationFrame(moveCandles);
  }
}

// ろうそくをタップして消す
candles.forEach(candle => {
  candle.addEventListener("click", () => {
    if (candle.classList.contains("blown")) {
      return;
    }

    candle.classList.add("blown");
    candle.textContent = "💨";
    candle.disabled = true;

    blownCandles++;

    candleCount.textContent =
      `残り ${TOTAL_CANDLES - blownCandles} 本`;

    cakeMessage.textContent = "ナイス！ ろうそくを消したよ！";

    if (typeof playCandleSound === "function") {
      playCandleSound();
    }

    if (blownCandles === TOTAL_CANDLES) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      cakeMessage.textContent =
        "おめでとう！ 20本全部消せたね！";

      if (typeof playSuccessSound === "function") {
        playSuccessSound();
      }

      setTimeout(() => {
        showScreen(giftScreen);
      }, 1800);
    }
  });
});

// プレゼント探し
const giftItems = [
  "💐 お花を見つけた！",
  "💎 宝物を見つけた！",
  "🎀 特別なプレゼントを見つけた！"
];

giftBoxes.forEach(box => {
  box.addEventListener("click", () => {
    if (box.classList.contains("opened")) {
      return;
    }

    const index = Number(box.dataset.index);

    box.classList.add("opened");
    box.textContent = ["💐", "💎", "🎀"][index];
    box.disabled = true;

    openedGifts++;

    giftMessage.textContent = giftItems[index];

    giftCount.textContent =
      `プレゼント発見：${openedGifts} / 3`;

    if (typeof playGiftSound === "function") {
      playGiftSound();
    }

    if (openedGifts === 3) {
      giftMessage.textContent =
        "全部見つけたね！ 最後のプレゼントがあるよ。";

      if (typeof playSuccessSound === "function") {
        playSuccessSound();
      }

      setTimeout(() => {
        showScreen(letterScreen);
      }, 1800);
    }
  });
});

// 手紙を開く
openLetterButton.addEventListener("click", () => {
  if (gameFinished) return;

  gameFinished = true;

  letter.classList.remove("hidden");
  endingMessage.classList.remove("hidden");

  openLetterButton.classList.add("hidden");

  if (typeof playLetterSound === "function") {
    playLetterSound();
  }

  endingMessage.textContent =
    "Happy Birthday, たまちゃん！ ♡";
});

// 初期状態
showScreen(titleScreen);