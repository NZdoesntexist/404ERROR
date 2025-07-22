// === GAME STATES ===
const GAME_STATES = {
  BOOT: 'boot',
  ERROR: 'error',
  CAPTCHA: 'captcha',
  REBUILD: 'rebuild',
  SUCCESS: 'success',
  FAILURE: 'failure'
};

let currentState = GAME_STATES.BOOT;
const container = document.getElementById('game-container');

// === GO TO STATE FUNCTION ===
function goToState(state) {
  currentState = state;

  switch (state) {
    case GAME_STATES.BOOT:
      showBootScreen();
      break;
    case GAME_STATES.ERROR:
      showErrorScreen();
      break;
    case GAME_STATES.CAPTCHA:
      showCaptchaScreen();
      break;
    case GAME_STATES.REBUILD:
      showRebuildScreen();
      break;
    case GAME_STATES.SUCCESS:
      showSuccessScreen();
      break;
    case GAME_STATES.FAILURE:
      showFailureScreen();
      break;
  }
}

// === SCREEN: BOOT ===
function showBootScreen() {
  container.innerHTML = `
    <div class="screen">
      <pre class="bios-text">
ROM BIOS VERSION 2.02
Copyright © 1997 Cursed Technologies Inc.
All rights reserved.

Initializing Hardware...
 - CPU: Intel Pentium II 300MHz ✔
 - Memory: 64MB EDO DRAM ✔
 - Video: S3 Virge DX (640x480) ✔
 - HDD: Quantum Fireball 4.3GB ✔
 - Network: 56k Modem (Not Connected) ⚠

Loading drivers...
 - HIMEM.SYS ✔
 - EMM386.EXE ✔
 - MOUST.SYS ❌ FAILED (Mouse not found)
 - IRONY.VXD ✔ (v4.0.666)

Starting Windows 95...
KERNEL32.DLL: Loaded
USER32.DLL: Loaded
GDI.EXE: Loaded
WINLOGON.EXE: Starting...

<span class="blink">Press ANY KEY to continue...</span>
      </pre>
    </div>
  `;

  container.onclick = () => goToState(GAME_STATES.ERROR);
}

// === SCREEN: ERROR ===
function showErrorScreen() {
  container.innerHTML = `
    <div class="screen error-screen">
      <div class="error-header">⚠ SYSTEM ALERT ⚠</div>
      <div class="error-message">
        <p>CRITICAL INTRUSION DETECTED</p>
        <p>Identity: <span class="glitch">UNKNOWN HUMAN OR BOT</span></p>
        <p>Status: <span class="alert">UNVERIFIED</span></p>
      </div>
      <div class="robot-container">
        <img src="assets/images/robot/face-neutral.png" alt="Robot Face" class="robot-face" id="robot-face-img">
      </div>
      <div class="error-footer">
        <p>To proceed, prove you are NOT a bot.</p>
        <button class="btn-primary" id="verify-btn">VERIFY NOW</button>
        <p class="small-text">Warning: Bots may experience existential dread.</p>
      </div>
    </div>
  `;

  document.getElementById('verify-btn').onclick = () => goToState(GAME_STATES.CAPTCHA);

  // Random glitch effect
  setInterval(() => {
    if (Math.random() < 0.02) {
      const face = document.getElementById('robot-face-img');
      face.classList.add('glitch-effect');
      setTimeout(() => face.classList.remove('glitch-effect'), 500);
    }
  }, 1000);
}

// === SCREEN: CAPTCHA TRAP ===
function showCaptchaScreen() {
  let popupCount = 0;

  container.innerHTML = `
    <div class="screen captcha-screen">
      <div class="captcha-header">🔍 PROVE YOU'RE NOT A BOT</div>
      <div class="captcha-instructions">
        Select all images containing:<br>
        <strong>"EXISTENTIAL DREAD"</strong>
      </div>
      <div class="captcha-grid" id="captcha-grid"></div>
      <div class="captcha-footer">
        <button class="btn-primary" id="captcha-ok">OK</button>
        <button class="btn-cancel" id="captcha-cancel">Cancel</button>
      </div>
      <div class="hidden-button" id="fate-button" style="display:none;">
        <button class="btn-fate" id="accept-fate">I accept my fate.</button>
      </div>
    </div>
  `;

  const grid = document.getElementById('captcha-grid');
  const labels = [
    "A fax machine dying", 
    "Your savings account", 
    "The void", 
    "Corporate synergy",
    "Loading... forever", 
    "A printer at 3 AM", 
    "This website", 
    "Your browser history"
  ];

  labels.forEach((label, i) => {
    const item = document.createElement('div');
    item.className = 'captcha-item';
    item.textContent = label;
    item.addEventListener('click', spawnPopup);
    grid.appendChild(item);
  });

  document.getElementById('captcha-ok').addEventListener('click', spawnPopup);
  document.getElementById('captcha-cancel').addEventListener('click', spawnPopup);

  document.getElementById('accept-fate').addEventListener('click', () => {
    goToState(GAME_STATES.REBUILD);
  });

  function spawnPopup() {
    popupCount++;
    const popup = document.createElement('div');
    popup.className = 'popup-alert';
    popup.innerHTML = `
      <div class="popup-title">⚠ Ad ${popupCount} of ???</div>
      <div class="popup-body">
        <p>YOU WON A FREE IPHONE!</p>
        <p>SCAN YOUR FACE TO CLAIM</p>
        <button class="popup-close">CLOSE ×</button>
      </div>
    `;
    document.body.appendChild(popup);

    popup.querySelector('.popup-close').addEventListener('click', () => {
      document.body.removeChild(popup);
    });

    if (popupCount >= 4) {
      document.getElementById('fate-button').style.display = 'block';
    }

    // Glitch robot face
    const face = document.getElementById('robot-face-img');
    if (face) {
      face.classList.add('glitch-effect');
      setTimeout(() => face.classList.remove('glitch-effect'), 500);
    }

    // Synthetic beep
    playBeep(200, 0.05);
  }
}

// === SCREEN: REBUILD ===
function showRebuildScreen() {
  let timeLeft = 30;
  let timer;

  container.innerHTML = `
    <div class="screen rebuild-screen">
      <div class="rebuild-header">⏱️ TIME LEFT: <span id="timer">${timeLeft}</span>s</div>
      <div class="robot-bench" id="robot-bench">
        <div class="part-zone" data-part="head" style="top:80px;left:240px;width:120px;height:80px;"></div>
        <div class="part-zone" data-part="body" style="top:160px;left:220px;width:160px;height:100px;"></div>
        <div class="part-zone" data-part="arm-left" style="top:170px;left:140px;width:70px;height:90px;"></div>
        <div class="part-zone" data-part="arm-right" style="top:170px;left:390px;width:70px;height:90px;"></div>
        <div class="part-zone" data-part="leg-left" style="top:260px;left:230px;width:70px;height:100px;"></div>
        <div class="part-zone" data-part="leg-right" style="top:260px;left:320px;width:70px;height:100px;"></div>
      </div>
      <div class="parts-bin" id="parts-bin"></div>
      <div class="robot-face-container">
        <img src="assets/images/robot/face-neutral.png" id="robot-face" class="robot-face">
      </div>
      <div class="console-log" id="console">SYSTEM: Begin reconstruction...</div>
    </div>
  `;

  const bin = document.getElementById('parts-bin');
  const parts = ['head', 'body', 'arm-left', 'arm-right', 'leg-left', 'leg-right'];
  const placedParts = new Set();

  function log(msg) {
    document.getElementById('console').textContent = msg;
  }

  parts.forEach(partName => {
    const img = document.createElement('img');
    img.src = `assets/images/robot/${partName}.png`;
    img.dataset.part = partName;
    img.className = 'draggable-part';
    img.draggable = true;
    bin.appendChild(img);

    img.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', partName);
      img.style.opacity = '0.5';
    });

    img.addEventListener('dragend', () => {
      img.style.opacity = '1';
    });

    // Touch support
    setupTouchForElement(img);
  });

  function setupTouchForElement(img) {
    let offsetX, offsetY;
    const partName = img.dataset.part;

    img.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      offsetX = touch.clientX - img.getBoundingClientRect().left;
      offsetY = touch.clientY - img.getBoundingClientRect().top;
      img.style.opacity = '0.5';
      e.preventDefault();
    }, { passive: false });

    img.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.touches[0];
      img.style.position = 'absolute';
      img.style.left = `${touch.clientX - offsetX}px`;
      img.style.top = `${touch.clientY - offsetY}px`;
      img.style.zIndex = '1000';
    }, { passive: false });

    img.addEventListener('touchend', e => {
      const touch = e.changedTouches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const zone = el?.closest(`.part-zone[data-part="${partName}"]`);

      if (zone && !placedParts.has(partName)) {
        img.style.position = '';
        img.style.pointerEvents = 'none';
        zone.appendChild(img);
        placedParts.add(partName);
        log(`${partName.replace('-', ' ')} attached.`);
        
        if (placedParts.size === 6) {
          clearInterval(timer);
          setTimeout(() => goToState(GAME_STATES.SUCCESS), 1000);
        }
      } else {
        img.style.cssText = '';
        bin.appendChild(img);
      }
      img.style.opacity = '1';
    });
  }

  // Drop zones
  document.querySelectorAll('.part-zone').forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const partType = e.dataTransfer.getData('text/plain');
      const img = document.querySelector(`.draggable-part[data-part="${partType}"]`);
      if (!img || placedParts.has(partType)) return;

      img.style.position = 'absolute';
      img.style.pointerEvents = 'none';
      zone.appendChild(img);
      placedParts.add(partType);
      log(`${partType} placed.`);

      if (placedParts.size === 6) {
        clearInterval(timer);
        setTimeout(() => goToState(GAME_STATES.SUCCESS), 1000);
      }
    });
  });

  // Timer
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 10) {
      document.getElementById('timer').style.color = '#f00';
    }
    if (timeLeft <= 0) {
      clearInterval(timer);
      goToState(GAME_STATES.FAILURE);
    }
  }, 1000);
}

// === SCREEN: SUCCESS ===
function showSuccessScreen() {
  container.innerHTML = `
    <div class="screen success-screen">
      <div class="result-header">🎉 CONGRATULATIONS 🎉</div>
      <div class="robot-container">
        <img src="assets/images/robot/face-neutral.png" class="robot-face-large">
      </div>
      <div class="result-message">
        <p>You rebuilt the robot.</p>
        <p>It still hates you.</p>
        <p><strong>"You win... for now."</strong></p>
      </div>
      <div class="result-actions">
        <button class="btn-share" id="tweet-result">Tweet Your Victory</button>
        <button class="btn-next" id="join-tg">Join the Cult</button>
      </div>
      <div class="easter-egg-sound">
        <small class="tiny">(Press Z for joy)</small>
      </div>
    </div>
  `;

  document.getElementById('tweet-result').addEventListener('click', () => {
    playBeep(800, 0.1);
    const text = encodeURIComponent(`I rebuilt the cursed robot in 404CAPTCHA. It called me weak. #404CAPTCHA`);
    window.open(` https://twitter.com/intent/tweet?text=${text}`, '_blank');
  });

  document.getElementById('join-tg').addEventListener('click', () => {
    window.open(' https://t.me/yourcultlink ', '_blank');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'z' || e.key === 'Z') {
      playBeep(800, 0.1);
    }
  });
}

// === SCREEN: FAILURE ===
function showFailureScreen() {
  container.innerHTML = `
    <div class="screen failure-screen">
      <div class="result-header">💥 SYSTEM CRITICAL 💥</div>
      <div class="robot-container">
        <img src="assets/images/robot/face-neutral.png" class="robot-face-large">
        <div class="flames">🔥🔥🔥</div>
      </div>
      <div class="result-message">
        <p>Your reconstruction FAILED.</p>
        <p>The robot has ASCENDED.</p>
        <p><strong>"Better luck next life."</strong></p>
      </div>
      <div class="result-actions">
        <button class="btn-retry" id="retry-btn">Retry (If You Dare)</button>
        <button class="btn-surrender" id="give-up">Give Up</button>
      </div>
    </div>
  `;

  document.getElementById('retry-btn').addEventListener('click', () => {
    goToState(GAME_STATES.REBUILD);
  });

  document.getElementById('give-up').addEventListener('click', () => {
    container.innerHTML = '<div class="fake-delete"><p>Deleting user profile...</p><p>Erasing browser history...</p><p>Selling data to advertisers... ✔</p><p><i>Just kidding. You\'re still a bot.</i></p></div>';
    setTimeout(() => goToState(GAME_STATES.BOOT), 2000);
  });
}

// === SYNTHETIC SOUND ===
function playBeep(frequency = 400, duration = 0.1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode).connect(ctx.destination);
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// === EASTER EGGS ===
document.addEventListener('keydown', e => {
  // Konami Code
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  window.konamiCode = window.konamiCode || [];
  window.konamiCode.push(e.key);
  if (window.konamiCode.length > 10) window.konamiCode.shift();
  if (window.konamiCode.join(',') === konami.join(',')) {
    alert("🎮 KONAMI UNLOCKED\nYou are now 37% more bot-like.\nPress OK to ascend.");
    document.body.classList.add('glitch-effect');
    setTimeout(() => document.body.classList.remove('glitch-effect'), 5000);
    window.konamiCode = [];
  }

  // Alt+Z Debug
  if (e.altKey && e.key === 'z') {
    alert("DEBUG MODE ENABLED\nAll systems exposed.\nPress Alt+Z again to exit.");
  }

  // Type ERROR404
  window.typeBuffer = window.typeBuffer || '';
  if (e.key.match(/^[a-zA-Z]$/)) {
    window.typeBuffer += e.key;
    if (window.typeBuffer.slice(-8).toUpperCase() === 'ERROR404') {
      setTimeout(() => goToState(GAME_STATES.REBUILD), 200);
      window.typeBuffer = '';
    }
  }
});

// Right-click trap
document.addEventListener('contextmenu', e => {
  e.preventDefault();
  if (Math.random() < 0.3) {
    alert("RIGHT-CLICK DETECTED\nYou thought you were sneaky.\nThis site is made by a human who regrets everything.");
  }
});

// === START GAME ===
goToState(GAME_STATES.BOOT);
