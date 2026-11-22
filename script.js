"use strict";

/**
 * TAM HÙNG TRANH BÁ – HÀO KHÍ TÂY SƠN
 * Engine điều phối trò chơi, âm thanh Web Audio và phím tắt trình chiếu.
 */

const gameShell = document.getElementById("game-shell");
const screens = document.querySelectorAll(".screen");
const infoModal = document.getElementById("info-modal");
const shortcutsModal = document.getElementById("shortcuts-modal");
const resultModal = document.getElementById("result-modal");
const modalTitle = document.getElementById("modal-title");
const modalKicker = document.getElementById("modal-kicker");
const modalContent = document.getElementById("modal-content");

let soundEnabled = true;
let bgmEnabled = true;
let bgmPlaying = false;
let bgmFadeInterval = null;
const bgmPlayer = document.getElementById("bgm-player");

let selectedAnswer = null;
let questionResolved = false;
let timerId = null;
let timeRemaining = 20;
let audioContext = null;

// Cấu hình mặc định ba phe
const DEFAULT_TEAMS = [
  { id: "dragon", faction: "PHE RỒNG", icon: "龍", color: "#4d9ce0", defaultName: "LONG VỆ", score: 0, correctCount: 0 },
  { id: "tiger", faction: "PHE HỔ", icon: "虎", color: "#d5a43c", defaultName: "HỔ UY", score: 0, correctCount: 0 },
  { id: "eagle", faction: "PHE ƯNG", icon: "鷹", color: "#a979d5", defaultName: "THIÊN ƯNG", score: 0, correctCount: 0 }
];

const gameState = {
  teams: DEFAULT_TEAMS.map((team) => ({ ...team, name: team.defaultName })),
  selectedStartTeamIndex: 0, // Phe được chọn xuất phát đầu tiên
  activeTeamIndex: 0,        // Phe đang thực hiện lượt thi
  turnIndex: 0,              // Lượt hiện tại trong danh sách câu hỏi
  totalTurns: 12,
  isTieBreak: false,
  tieBreakIndex: 0,
  tiedTeamIndices: []
};

const ROUND_NAMES = ["KHỞI ĐỘNG", "CHIẾN THẮNG CHỐNG XIÊM", "CHIẾN THẮNG CHỐNG THANH", "QUYẾT CHIẾN"];
const ANSWER_KEYS = ["A", "B", "C", "D"];

const CAMPAIGN_STAGES = {
  1: {
    status: "CHẶNG 1 · KHỞI ĐỘNG LỊCH SỬ",
    title: "KHỞI ĐỘNG LỊCH SỬ",
    description: "Tập hợp nghĩa quân, củng cố lực lượng và điểm lại bối cảnh thế kỷ XVIII trước các đòn tiến công quyết định."
  },
  2: {
    status: "CHẶNG 2 · CHIẾN DỊCH 1785",
    title: "RẠCH GẦM – XOÀI MÚT",
    description: "Nguyễn Huệ chỉ huy nghĩa quân Tây Sơn mai phục và tiêu diệt 5 vạn quân Xiêm trên sông Tiền rạng sáng ngày 19/01/1785."
  },
  3: {
    status: "CHẶNG 3 · CHIẾN DỊCH 1789",
    title: "NGỌC HỒI – ĐỐNG ĐA",
    description: "Quang Trung hành quân thần tốc ra Bắc, công phá đồn Ngọc Hồi, giải phóng Thăng Long mùa xuân Kỷ Dậu 1789, quét sạch 29 vạn quân Thanh."
  }
};

const modalData = {
  guide: {
    kicker: "QUÂN LỆNH THI ĐẤU",
    title: "LUẬT CHƠI TAM HÙNG",
    content: `
      <p><strong>1. Thể thức:</strong> Ba phe (Rồng, Hổ, Ưng) thi đấu luân phiên lần lượt theo lượt chơi riêng biệt.</p>
      <p><strong>2. Thời gian:</strong> Mỗi câu có <strong>20 giây</strong> để suy nghĩ. Khi còn 5 giây sẽ có cảnh báo gấp rút.</p>
      <p><strong>3. Xác nhận:</strong> Chọn phương án rồi bấm nút <em>XÁC NHẬN ĐÁP ÁN</em> (hoặc phím Enter).</p>
      <p><strong>4. Tính điểm:</strong> Trả lời đúng nhận trọn vẹn điểm theo từng vòng (100đ → 200đ → 300đ → 500đ). Không trừ điểm khi trả lời sai hoặc hết giờ.</p>
      <p><strong>5. Phân định:</strong> Nếu bằng điểm cao nhất sau 12 câu, các phe hòa điểm sẽ bước vào vòng câu hỏi phụ phân định ngôi đầu!</p>
    `
  },
  history: {
    kicker: "TỔNG QUAN SỬ LIỆU",
    title: "HÀO KHÍ TÂY SƠN THẾ KỶ XVIII",
    content: `
      <p><strong>• Năm 1785 – Rạch Gầm – Xoài Mút:</strong> Sau khi Nguyễn Ánh cầu viện Xiêm, 5 vạn quân giặc tràn vào Gia Định. Nguyễn Huệ mưu trí bố trí trận địa mai phục kết hợp hỏa pháo và thủy binh, tiêu diệt hoàn toàn quân Xiêm chỉ trong một ngày.</p>
      <p><strong>• Năm 1789 – Ngọc Hồi – Đống Đa:</strong> Lê Chiêu Thống rước 29 vạn quân Mãn Thanh sang xâm lược. Nguyễn Huệ lên ngôi Hoàng đế lấy niên hiệu Quang Trung tại núi Bân (Huế), lãnh đạo cuộc hành quân thần tốc ra Bắc, đại phá quân giặc vào sáng mùng 5 Tết Kỷ Dậu, giải phóng Thăng Long.</p>
    `
  }
};

/* ==========================================================
   HỆ THỐNG ÂM THANH WEB AUDIO SYNTHESIZER (100% OFFLINE)
   ========================================================== */
function getAudioContext() {
  if (!soundEnabled) return null;
  const AudioConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioConstructor) return null;
  if (!audioContext) audioContext = new AudioConstructor();
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

function playTone(frequency, duration, type = "sine", volume = 0.08, delay = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const startAt = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.03);
}

function playCue(cue) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (cue === "drum") {
    // Tiếng trống trận rền vang
    playTone(95, 0.22, "triangle", 0.12, 0);
    playTone(75, 0.25, "sine", 0.14, 0.05);
    playTone(85, 0.28, "triangle", 0.12, 0.2);
    playTone(65, 0.35, "sine", 0.15, 0.26);
    playTone(110, 0.32, "triangle", 0.16, 0.45);
    playTone(60, 0.45, "sine", 0.18, 0.52);
  } else if (cue === "gong") {
    // Tiếng chiêng đồng vang dội
    playTone(440, 1.2, "sine", 0.08, 0);
    playTone(660, 0.9, "sine", 0.05, 0.02);
    playTone(880, 0.7, "triangle", 0.03, 0.04);
  } else if (cue === "correct") {
    // Âm sắc báo đúng (Hợp âm vang)
    playTone(523.25, 0.18, "sine", 0.09, 0);       // C5
    playTone(659.25, 0.22, "sine", 0.09, 0.08);    // E5
    playTone(783.99, 0.45, "sine", 0.11, 0.16);    // G5
    playTone(1046.5, 0.55, "triangle", 0.07, 0.24);// C6
  } else if (cue === "wrong") {
    // Âm sắc báo sai (Trầm buồn)
    playTone(220, 0.25, "sawtooth", 0.04, 0);
    playTone(164.8, 0.38, "triangle", 0.06, 0.15);
  } else if (cue === "warning") {
    // Đồng hồ còn 5 giây
    playTone(480, 0.08, "square", 0.03, 0);
  } else if (cue === "victory") {
    // Khải hoàn ca hoàng gia
    const notes = [523.25, 659.25, 783.99, 1046.5, 880, 1046.5];
    notes.forEach((note, index) => {
      playTone(note, 0.45, "triangle", 0.09, index * 0.14);
      playTone(note / 2, 0.5, "sine", 0.08, index * 0.14);
    });
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const button = document.getElementById("sound-toggle");
  button.setAttribute("aria-pressed", String(soundEnabled));
  button.innerHTML = soundEnabled ? "🔊 <span>HIỆU ỨNG</span>" : "🔇 <span>TẮT HIỆU ỨNG</span>";
  if (soundEnabled) playCue("gong");
}

/* ==========================================================
   HỆ THỐNG NHẠC TRẬN MỞ ĐẦU HÙNG TRÁNG (BGM ENGINE)
   ========================================================== */
function updateBgmUI(isPlaying) {
  const introBtn = document.getElementById("intro-music-toggle");
  const introText = document.getElementById("music-status-text");
  const topBtn = document.getElementById("music-toggle-top");
  const topText = document.getElementById("top-music-text");

  if (introBtn) {
    introBtn.classList.toggle("is-playing", isPlaying);
    introBtn.setAttribute("aria-pressed", String(isPlaying));
  }
  if (introText) {
    introText.textContent = isPlaying ? "ĐANG PHÁT (BẤM ĐỂ TẮT)" : "BẬT NHẠC TRẬN";
  }
  if (topBtn) {
    topBtn.classList.toggle("is-active", isPlaying);
    topBtn.setAttribute("aria-pressed", String(isPlaying));
  }
  if (topText) {
    topText.textContent = isPlaying ? "NHẠC TRẬN: BẬT" : "NHẠC TRẬN: TẮT";
  }
}

function fadeBgmVolume(targetVolume, durationMs = 1000, callback = null) {
  if (!bgmPlayer) return;
  clearInterval(bgmFadeInterval);
  const stepTime = 50;
  const steps = Math.max(1, Math.floor(durationMs / stepTime));
  const startVol = bgmPlayer.volume;
  const delta = (targetVolume - startVol) / steps;
  let step = 0;

  bgmFadeInterval = setInterval(() => {
    step++;
    const newVol = Math.min(1, Math.max(0, startVol + delta * step));
    bgmPlayer.volume = newVol;
    if (step >= steps) {
      clearInterval(bgmFadeInterval);
      bgmPlayer.volume = targetVolume;
      if (callback) callback();
    }
  }, stepTime);
}

function playBgm(targetVol = 0.7) {
  if (!bgmEnabled || !bgmPlayer) return;
  clearInterval(bgmFadeInterval);

  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  if (bgmPlayer.paused) {
    bgmPlayer.volume = 0.05;
    const playPromise = bgmPlayer.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          bgmPlaying = true;
          updateBgmUI(true);
          fadeBgmVolume(targetVol, 1500);
        })
        .catch((err) => {
          console.warn("Autoplay audio note:", err);
          bgmPlaying = false;
          updateBgmUI(false);
        });
    }
  } else {
    bgmPlaying = true;
    updateBgmUI(true);
    fadeBgmVolume(targetVol, 1000);
  }
}

function pauseBgm() {
  if (!bgmPlayer) return;
  clearInterval(bgmFadeInterval);
  fadeBgmVolume(0, 500, () => {
    bgmPlayer.pause();
    bgmPlaying = false;
    updateBgmUI(false);
  });
}

function toggleBgm() {
  if (bgmPlaying) {
    bgmEnabled = false;
    pauseBgm();
  } else {
    bgmEnabled = true;
    playBgm(0.7);
    playCue("gong");
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }
}

/* ==========================================================
   ĐIỀU HƯỚNG MÀN HÌNH & MODAL
   ========================================================== */
function showScreen(screenId) {
  screens.forEach((screen) => {
    const isTarget = screen.id === `screen-${screenId}`;
    if (isTarget) {
      screen.hidden = false;
      window.requestAnimationFrame(() => screen.classList.add("screen--active"));
    } else {
      screen.classList.remove("screen--active");
      window.setTimeout(() => {
        if (!screen.classList.contains("screen--active")) screen.hidden = true;
      }, 500);
    }
  });

  // Tự động điều chỉnh âm lượng nhạc nền theo từng màn hình (Ducking & Swell)
  if (bgmPlaying) {
    if (screenId === "question") {
      fadeBgmVolume(0.2, 800); // Hạ nhỏ vừa đủ nghe để tập trung đọc câu hỏi
    } else if (screenId === "intro" || screenId === "victory") {
      fadeBgmVolume(0.7, 1000); // Khúc tráng ca vang dội
    } else {
      fadeBgmVolume(0.45, 800); // Mức vừa phải khi duyệt bản đồ, đội thi
    }
  }
}

function openModal(type) {
  const data = modalData[type];
  if (!data) return;
  modalKicker.innerHTML = `<span></span> ${data.kicker} <span></span>`;
  modalTitle.textContent = data.title;
  modalContent.innerHTML = data.content;
  infoModal.showModal();
}

function openShortcutsModal() {
  shortcutsModal.showModal();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
  })[c]);
}

/* ==========================================================
   QUẢN LÝ PHE & TÊN ĐỘI
   ========================================================== */
function getTeamRank(teamId) {
  const sorted = [...gameState.teams].sort((a, b) => b.score - a.score || b.correctCount - a.correctCount);
  return sorted.findIndex((t) => t.id === teamId) + 1;
}

function renderFactionCards() {
  const container = document.getElementById("faction-cards");
  if (!container) return;

  container.innerHTML = gameState.teams.map((team, index) => {
    const isSelected = index === gameState.selectedStartTeamIndex;
    return `
      <article class="faction-card ${isSelected ? "is-active" : ""}" style="--faction-color:${team.color}" data-team-index="${index}" tabindex="0" role="button" aria-label="Chọn ${team.faction}">
        <div class="faction-symbol" aria-hidden="true">${team.icon}</div>
        <p class="faction-kind">${team.faction}</p>
        <input class="team-name-input" data-team-name="${index}" value="${escapeHtml(team.name)}" maxlength="20" aria-label="Tên đội ${team.faction}" title="Nhấp để đổi tên đội" />
        <div class="faction-statline">
          <div><b>${team.score}</b><small>CHIẾN CÔNG</small></div>
          <div><b>${team.correctCount}</b><small>CÂU ĐÚNG</small></div>
        </div>
        <p class="faction-rank">THỨ HẠNG TẠM THỜI: <strong>#${getTeamRank(team.id)}</strong></p>
      </article>
    `;
  }).join("");

  container.querySelectorAll(".faction-card").forEach((card) => {
    const select = () => selectStartTeam(Number(card.dataset.teamIndex));
    card.addEventListener("click", (e) => {
      if (!e.target.matches(".team-name-input")) select();
    });
    card.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !e.target.matches(".team-name-input")) {
        e.preventDefault();
        select();
      }
    });
  });

  container.querySelectorAll(".team-name-input").forEach((input) => {
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("input", () => {
      const idx = Number(input.dataset.teamName);
      gameState.teams[idx].name = input.value.trim() || DEFAULT_TEAMS[idx].defaultName;
      updateCommandPanel();
    });
  });
}

function selectStartTeam(teamIndex) {
  gameState.selectedStartTeamIndex = teamIndex;
  gameState.activeTeamIndex = teamIndex;
  renderFactionCards();
  updateCommandPanel();
  playCue("gong");
}

function updateCommandPanel() {
  const team = gameState.teams[gameState.selectedStartTeamIndex];
  document.getElementById("active-faction-icon").textContent = team.icon;
  document.getElementById("active-faction-name").textContent = `${team.faction} · ${team.name}`;
  document.getElementById("turn-order-text").textContent = `Đội ${team.name} sẽ nhận câu số 1, luân phiên cùng các phe còn lại qua 4 vòng.`;
}

function resetTeams() {
  gameState.teams.forEach((team, index) => {
    team.name = DEFAULT_TEAMS[index].defaultName;
    team.score = 0;
    team.correctCount = 0;
  });
  gameState.selectedStartTeamIndex = 0;
  gameState.activeTeamIndex = 0;
  gameState.turnIndex = 0;
  gameState.isTieBreak = false;
  gameState.tieBreakIndex = 0;
  renderFactionCards();
  updateCommandPanel();
  playCue("gong");
}

/* ==========================================================
   BẢN ĐỒ CHIẾN DỊCH
   ========================================================== */
function selectCampaignStage(stageId) {
  const stage = CAMPAIGN_STAGES[stageId];
  if (!stage) return;

  document.querySelectorAll(".campaign-stop").forEach((stop) => {
    stop.classList.toggle("is-current", Number(stop.dataset.stage) === stageId);
  });

  document.querySelectorAll(".map-node[data-stage]").forEach((node) => {
    node.classList.toggle("is-active-stage", Number(node.dataset.stage) === stageId);
  });

  document.getElementById("stage-status").textContent = stage.status;
  document.getElementById("stage-title").textContent = stage.title;
  document.getElementById("stage-description").textContent = stage.description;
  playCue("drum");
}

/* ==========================================================
   ĐIỀU PHỐI VÒNG THI & CÂU HỎI
   ========================================================== */
function renderScoreRail() {
  const container = document.getElementById("rail-teams-container");
  if (!container) return;

  container.innerHTML = gameState.teams.map((team, index) => {
    const isPlaying = index === gameState.activeTeamIndex;
    return `
      <div class="rail-team ${isPlaying ? "is-playing" : ""}" style="--team-color:${team.color}">
        <b>${escapeHtml(team.name)}</b>
        <span>${team.score} đ</span>
      </div>
    `;
  }).join("");
}

function renderQuestion() {
  stopTimer();
  selectedAnswer = null;
  questionResolved = false;

  let currentQuestion = null;
  const tieBadge = document.getElementById("tie-break-badge");

  if (gameState.isTieBreak) {
    tieBadge.hidden = false;
    currentQuestion = TIE_BREAKER_QUESTIONS[gameState.tieBreakIndex % TIE_BREAKER_QUESTIONS.length];
    document.getElementById("round-label").textContent = "VÒNG PHÂN ĐỊNH HẠNG NHẤT";
    document.getElementById("question-count").textContent = `CÂU PHỤ ${gameState.tieBreakIndex + 1}`;
    document.getElementById("question-points-pill").textContent = `+${currentQuestion.points} ĐIỂM`;
  } else {
    tieBadge.hidden = true;
    if (gameState.turnIndex >= QUESTIONS.length) {
      return checkFinalOutcome();
    }
    currentQuestion = QUESTIONS[gameState.turnIndex];
    document.getElementById("round-label").textContent = `VÒNG ${currentQuestion.round} — ${ROUND_NAMES[currentQuestion.round - 1]}`;
    document.getElementById("question-count").textContent = `CÂU ${gameState.turnIndex + 1} / ${QUESTIONS.length}`;
    document.getElementById("question-points-pill").textContent = `+${currentQuestion.points} ĐIỂM`;
  }

  const team = gameState.teams[gameState.activeTeamIndex];
  document.getElementById("question-team-icon").textContent = team.icon;
  document.getElementById("question-team-name").textContent = `${team.faction} · ${team.name}`;
  document.getElementById("turn-team-badge").style.setProperty("--team-color", team.color);

  document.getElementById("question-text").textContent = currentQuestion.question;
  document.getElementById("selection-note").textContent = `Độ khó: ${currentQuestion.difficulty} · Bấm chọn hoặc dùng phím A, B, C, D`;
  document.getElementById("confirm-answer").disabled = true;

  const answerList = document.getElementById("answer-list");
  answerList.innerHTML = currentQuestion.answers.map((answer, index) => `
    <button class="answer-button" type="button" role="radio" aria-checked="false" data-answer-index="${index}">
      <span class="answer-key">${ANSWER_KEYS[index]}</span>
      <span class="answer-text">${escapeHtml(answer)}</span>
    </button>
  `).join("");

  answerList.querySelectorAll(".answer-button").forEach((btn) => {
    btn.addEventListener("click", () => selectAnswer(Number(btn.dataset.answerIndex)));
  });

  renderScoreRail();
  startTimer();
}

function selectAnswer(index) {
  if (questionResolved) return;
  selectedAnswer = index;

  document.querySelectorAll(".answer-button").forEach((btn) => {
    const isSelected = Number(btn.dataset.answerIndex) === index;
    btn.classList.toggle("is-selected", isSelected);
    btn.setAttribute("aria-checked", String(isSelected));
  });

  document.getElementById("confirm-answer").disabled = false;
  document.getElementById("selection-note").textContent = `Đã chọn phương án [${ANSWER_KEYS[index]}]. Nhấn XÁC NHẬN (hoặc phím Enter) để truyền lệnh.`;
  playTone(400, 0.05, "sine", 0.04);
}

function updateTimerVisual() {
  const ring = document.getElementById("timer-ring");
  const valueDisplay = document.getElementById("timer-value");
  valueDisplay.textContent = timeRemaining;

  const progress = Math.max(0, (timeRemaining / 20) * 100);
  ring.style.setProperty("--progress", String(progress));
  ring.style.setProperty("--timer-color", timeRemaining <= 5 ? "#e53935" : "#d4a342");
}

function startTimer() {
  stopTimer();
  timeRemaining = 20;
  updateTimerVisual();

  timerId = window.setInterval(() => {
    timeRemaining -= 1;
    updateTimerVisual();

    if (timeRemaining === 5) {
      playCue("warning");
    }

    if (timeRemaining <= 0) {
      resolveQuestion(true);
    }
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function resolveQuestion(timedOut = false) {
  if (questionResolved) return;
  questionResolved = true;
  stopTimer();

  const currentQuestion = gameState.isTieBreak
    ? TIE_BREAKER_QUESTIONS[gameState.tieBreakIndex % TIE_BREAKER_QUESTIONS.length]
    : QUESTIONS[gameState.turnIndex];

  const team = gameState.teams[gameState.activeTeamIndex];
  const isCorrect = !timedOut && selectedAnswer === currentQuestion.correctAnswer;

  // Đánh dấu thị giác đáp án đúng / sai
  document.querySelectorAll(".answer-button").forEach((btn) => {
    const idx = Number(btn.dataset.answerIndex);
    btn.disabled = true;
    if (idx === currentQuestion.correctAnswer) {
      btn.classList.add("is-correct-reveal");
    } else if (idx === selectedAnswer && !isCorrect) {
      btn.classList.add("is-wrong-reveal");
    }
  });

  if (isCorrect) {
    team.score += currentQuestion.points;
    team.correctCount += 1;
  }

  playCue(isCorrect ? "correct" : "wrong");
  renderScoreRail();
  renderFactionCards();

  // Hiển thị hộp thoại kết quả và kiến thức lịch sử
  const statusEl = document.getElementById("result-status");
  statusEl.textContent = isCorrect ? "CHÍNH XÁC – QUÂN LỆNH HOÀN THÀNH" : timedOut ? "HẾT THỜI GIAN QUÂN LỆNH" : "CHƯA CHÍNH XÁC";
  statusEl.classList.toggle("is-wrong", !isCorrect);

  document.getElementById("result-title").textContent = isCorrect ? `CHIẾN CÔNG +${currentQuestion.points}` : "KHÔNG CÓ CHIẾN CÔNG";
  document.getElementById("result-answer").textContent = `Đáp án chính xác: ${ANSWER_KEYS[currentQuestion.correctAnswer]}. ${currentQuestion.answers[currentQuestion.correctAnswer]}`;
  document.getElementById("result-explanation").textContent = currentQuestion.explanation;

  const nextBtnText = (gameState.turnIndex === QUESTIONS.length - 1 && !gameState.isTieBreak)
    ? "TỔNG KẾT CHIẾN DỊCH (ENTER)"
    : "TIẾP TỤC (ENTER)";
  document.getElementById("next-turn").querySelector("span").textContent = nextBtnText;

  resultModal.showModal();
}

function advanceTurn() {
  resultModal.close();

  if (gameState.isTieBreak) {
    // Luân chuyển giữa các đội hòa điểm trong vòng phân định
    const currentTieOrderIdx = gameState.tiedTeamIndices.indexOf(gameState.activeTeamIndex);
    const nextTieOrderIdx = (currentTieOrderIdx + 1) % gameState.tiedTeamIndices.length;
    gameState.activeTeamIndex = gameState.tiedTeamIndices[nextTieOrderIdx];
    gameState.tieBreakIndex += 1;

    // Kiểm tra xem sau khi mỗi đội hòa đều đã thi một lượt câu phụ, điểm đã phân định chưa
    if (gameState.tieBreakIndex % gameState.tiedTeamIndices.length === 0) {
      const tiedTeams = gameState.tiedTeamIndices.map((i) => gameState.teams[i]);
      const maxScore = Math.max(...tiedTeams.map((t) => t.score));
      const stillTied = tiedTeams.filter((t) => t.score === maxScore);

      if (stillTied.length === 1) {
        // Đã tìm ra quán quân duy nhất
        gameState.isTieBreak = false;
        return finishQuiz();
      }
    }
    renderQuestion();
    return;
  }

  // Vòng thi 12 câu chính:
  gameState.turnIndex += 1;

  if (gameState.turnIndex >= QUESTIONS.length) {
    return checkFinalOutcome();
  }

  // Phe thi tiếp theo = (Phe được chọn ban đầu + Lượt hiện tại) % 3
  const cycle = gameState.turnIndex % gameState.teams.length;
  gameState.activeTeamIndex = (gameState.selectedStartTeamIndex + cycle) % gameState.teams.length;

  renderQuestion();
}

function checkFinalOutcome() {
  const ranked = getRankedTeams();
  const highestScore = ranked[0].score;
  const topTiedTeams = ranked.filter((t) => t.score === highestScore);

  if (topTiedTeams.length > 1 && TIE_BREAKER_QUESTIONS.length > 0) {
    // Có từ 2 đội trở lên bằng điểm cao nhất -> Mở câu hỏi phụ phân định
    gameState.isTieBreak = true;
    gameState.tiedTeamIndices = topTiedTeams.map((t) => gameState.teams.findIndex((team) => team.id === t.id));
    gameState.activeTeamIndex = gameState.tiedTeamIndices[0];
    gameState.tieBreakIndex = 0;

    modalKicker.innerHTML = `<span></span> PHÂN ĐỊNH HẠNG NHẤT <span></span>`;
    modalTitle.textContent = "BẰNG ĐIỂM CHIẾN CÔNG!";
    modalContent.innerHTML = `
      <p>Các phe <strong>${topTiedTeams.map((t) => `${t.faction} (${t.name})`).join(", ")}</strong> đang có cùng điểm số dẫn đầu <strong>${highestScore} điểm</strong>!</p>
      <p>Bước vào <strong>CÂU HỎI PHỤ PHÂN ĐỊNH</strong> để xác định vị trí Đệ nhất Hào khí Tây Sơn!</p>
    `;
    infoModal.showModal();
    playCue("gong");

    // Khi người dùng đóng modal này, màn hình câu hỏi phụ sẽ hiển thị
    infoModal.addEventListener("close", () => {
      renderQuestion();
    }, { once: true });
    return;
  }

  finishQuiz();
}

/* ==========================================================
   BẢNG XẾP HẠNG & VINH DANH CHIẾN THẮNG
   ========================================================== */
function getRankedTeams() {
  return [...gameState.teams].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    return a.id.localeCompare(b.id);
  });
}

function finishQuiz() {
  stopTimer();
  renderRanking();
  showScreen("ranking");
  playCue("gong");
}

function renderRanking() {
  const ranked = getRankedTeams();
  const list = document.getElementById("ranking-list");
  list.innerHTML = ranked.map((team, index) => `
    <article class="ranking-row" style="--team-color:${team.color}">
      <strong class="ranking-place">#${index + 1}</strong>
      <span class="ranking-symbol">${team.icon}</span>
      <div class="ranking-name">
        ${escapeHtml(team.name)}
        <small>${team.faction}</small>
      </div>
      <span class="ranking-correct">${team.correctCount} CÂU CHÍNH XÁC</span>
      <strong class="ranking-score">${team.score} đ</strong>
    </article>
  `).join("");
}

function showVictory() {
  const winner = getRankedTeams()[0];
  const emblem = document.getElementById("winner-emblem");
  emblem.textContent = winner.icon;
  emblem.style.setProperty("--winner-color", winner.color);

  document.getElementById("victory-heading").textContent = winner.name;
  document.getElementById("winner-faction").textContent = winner.faction;
  document.getElementById("winner-score").textContent = winner.score;
  document.getElementById("winner-summary").textContent = `Lập đại công với ${winner.correctCount} lần phá trận chính xác · Xứng danh Đệ nhất Hào khí Tây Sơn!`;

  showScreen("victory");
  playCue("victory");
}

function startQuiz() {
  gameState.teams.forEach((team) => {
    team.score = 0;
    team.correctCount = 0;
  });
  gameState.turnIndex = 0;
  gameState.isTieBreak = false;
  gameState.tieBreakIndex = 0;
  gameState.activeTeamIndex = gameState.selectedStartTeamIndex;

  renderFactionCards();
  showScreen("question");
  window.setTimeout(renderQuestion, 250);
  playCue("drum");
}

/* ==========================================================
   HỆ THỐNG PHÍM TẮT ĐIỀU KHIỂN TRÌNH CHIẾU
   ========================================================== */
function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    // Không bắt phím khi đang nhập tên đội
    if (e.target.matches("input, textarea")) return;

    const key = e.key.toUpperCase();

    // Phím toàn màn hình F
    if (key === "F" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      toggleFullscreen();
      return;
    }

    // Phím âm thanh M (Hiệu ứng)
    if (key === "M") {
      e.preventDefault();
      toggleSound();
      return;
    }

    // Phím N: Bật/Tắt nhạc nền hào hùng
    if (key === "N") {
      e.preventDefault();
      toggleBgm();
      return;
    }

    // Phím về trang chủ H
    if (key === "H") {
      stopTimer();
      showScreen("intro");
      return;
    }

    // Phím mở trợ giúp phím tắt ? hoặc K
    if (key === "?" || key === "K") {
      e.preventDefault();
      openShortcutsModal();
      return;
    }

    // Phím Enter hoặc Space
    if (e.key === "Enter" || e.key === " ") {
      if (resultModal.open) {
        e.preventDefault();
        advanceTurn();
        return;
      }
      if (infoModal.open) {
        e.preventDefault();
        infoModal.close();
        return;
      }
      if (shortcutsModal.open) {
        e.preventDefault();
        shortcutsModal.close();
        return;
      }
      const activeScreen = document.querySelector(".screen--active");
      if (activeScreen && activeScreen.id === "screen-question") {
        const confirmBtn = document.getElementById("confirm-answer");
        if (!confirmBtn.disabled && !questionResolved) {
          e.preventDefault();
          resolveQuestion(false);
        }
      }
      return;
    }

    // Phím chọn đáp án A, B, C, D hoặc 1, 2, 3, 4 trong màn hình câu hỏi
    const activeScreen = document.querySelector(".screen--active");
    if (activeScreen && activeScreen.id === "screen-question" && !questionResolved && !resultModal.open) {
      let mappedIndex = -1;
      if (key === "A" || key === "1") mappedIndex = 0;
      else if (key === "B" || key === "2") mappedIndex = 1;
      else if (key === "C" || key === "3") mappedIndex = 2;
      else if (key === "D" || key === "4") mappedIndex = 3;

      if (mappedIndex >= 0 && mappedIndex < 4) {
        e.preventDefault();
        selectAnswer(mappedIndex);
      }
    }
  });
}

/* ==========================================================
   LẮNG NGHE SỰ KIỆN GIAO DIỆN
   ========================================================== */
document.getElementById("start-button").addEventListener("click", () => {
  showScreen("factions");
  playCue("gong");
  if (!bgmPlaying && bgmEnabled) {
    playBgm(0.65);
  }
});
document.getElementById("intro-music-toggle")?.addEventListener("click", toggleBgm);
document.getElementById("music-toggle-top")?.addEventListener("click", toggleBgm);
document.getElementById("guide-button").addEventListener("click", () => openModal("guide"));
document.getElementById("history-button").addEventListener("click", () => openModal("history"));
document.getElementById("modal-close").addEventListener("click", () => infoModal.close());
document.getElementById("shortcuts-toggle").addEventListener("click", openShortcutsModal);
document.getElementById("shortcuts-close").addEventListener("click", () => shortcutsModal.close());
document.getElementById("sound-toggle").addEventListener("click", toggleSound);
document.getElementById("fullscreen-toggle").addEventListener("click", toggleFullscreen);

document.getElementById("home-button").addEventListener("click", () => {
  stopTimer();
  showScreen("intro");
  playCue("gong");
});

document.getElementById("reset-teams").addEventListener("click", resetTeams);
document.getElementById("continue-to-map").addEventListener("click", () => {
  selectCampaignStage(1);
  showScreen("map");
});

document.getElementById("confirm-answer").addEventListener("click", () => resolveQuestion(false));
document.getElementById("next-turn").addEventListener("click", advanceTurn);
document.getElementById("show-victory").addEventListener("click", showVictory);
document.getElementById("ranking-home").addEventListener("click", () => {
  stopTimer();
  showScreen("intro");
});
document.getElementById("play-again").addEventListener("click", startQuiz);
document.getElementById("victory-ranking").addEventListener("click", () => {
  renderRanking();
  showScreen("ranking");
});
document.getElementById("victory-home").addEventListener("click", () => {
  stopTimer();
  showScreen("intro");
});

document.getElementById("launch-campaign").addEventListener("click", startQuiz);

document.querySelectorAll(".campaign-stop").forEach((stop) => {
  stop.addEventListener("click", () => selectCampaignStage(Number(stop.dataset.stage)));
});

document.querySelectorAll(".map-node[data-stage]").forEach((node) => {
  node.addEventListener("click", () => selectCampaignStage(Number(node.dataset.stage)));
});

function setupAudioGestureTrigger() {
  const triggerAudio = () => {
    getAudioContext();
    const activeScreen = document.querySelector(".screen--active");
    if (activeScreen && activeScreen.id === "screen-intro" && bgmEnabled && !bgmPlaying) {
      playBgm(0.7);
    }
    window.removeEventListener("click", triggerAudio);
    window.removeEventListener("keydown", triggerAudio);
  };
  window.addEventListener("click", triggerAudio, { once: true });
  window.addEventListener("keydown", triggerAudio, { once: true });
}

// Khởi chạy ban đầu
renderFactionCards();
updateCommandPanel();
setupKeyboardShortcuts();
setupAudioGestureTrigger();
