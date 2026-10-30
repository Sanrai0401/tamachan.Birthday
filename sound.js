/* =====================================
   Happy Birthday, たまちゃん！
   サウンドシステム
===================================== */

let audioContext = null;
let bgmTimer = null;
let bgmIndex = 0;

// 音声を初期化
function initializeAudio() {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
}

// 音を鳴らす基本関数
function playTone(
  frequency,
  duration = 0.2,
  type = "sine",
  volume = 0.08
) {
  initializeAudio();

  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(
    frequency,
    audioContext.currentTime
  );

  gain.gain.setValueAtTime(
    volume,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

// =====================================
// 効果音
// =====================================

// ゲームスタート
function playStartSound() {
  playTone(523, 0.15);
  setTimeout(() => playTone(659, 0.15), 120);
  setTimeout(() => playTone(784, 0.3), 240);
}

// ろうそくを消す
function playCandleSound() {
  playTone(700, 0.12, "sine", 0.05);
  setTimeout(() => playTone(520, 0.18, "sine", 0.04), 70);
}

// 成功
function playSuccessSound() {
  playTone(523, 0.2);
  setTimeout(() => playTone(659, 0.2), 150);
  setTimeout(() => playTone(784, 0.2), 300);
  setTimeout(() => playTone(1046, 0.4), 450);
}

// プレゼントを開ける
function playGiftSound() {
  playTone(659, 0.12);
  setTimeout(() => playTone(784, 0.15), 100);
  setTimeout(() => playTone(988, 0.25), 200);
}

// 手紙を開く
function playLetterSound() {
  playTone(523, 0.3);
  setTimeout(() => playTone(659, 0.3), 250);
  setTimeout(() => playTone(784, 0.5), 500);
}

// =====================================
// BGM
// =====================================

const bgmNotes = [
  523, 659, 784, 659,
  587, 698, 880, 698,
  659, 784, 988, 784,
  587, 698, 880, 784
];

function startBGM() {
  initializeAudio();

  if (bgmTimer) return;

  bgmIndex = 0;

  bgmTimer = setInterval(() => {
    const note = bgmNotes[bgmIndex];

    playTone(note, 0.35, "sine", 0.025);

    bgmIndex++;

    if (bgmIndex >= bgmNotes.length) {
      bgmIndex = 0;
    }
  }, 450);
}

function stopBGM() {
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
}