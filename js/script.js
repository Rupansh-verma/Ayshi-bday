
(function(){
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('blur-in-start');
    });
  });
})();

document.body.addEventListener('click', function(e){
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http')) return;

  e.preventDefault();
  document.body.classList.add('blur-out');
  if (typeof saveMusicState === 'function') saveMusicState();
  setTimeout(() => { window.location.href = href; }, 550);
});


const NOTE_STORAGE_KEY = 'gfNoteContent';

let noteBtn = document.getElementById('noteBtn');
if (!noteBtn){
  noteBtn = document.createElement('button');
  noteBtn.id = 'noteBtn';
  noteBtn.className = 'note-btn';
  noteBtn.setAttribute('aria-label', 'write a little note');
  noteBtn.title = 'tulis catatan kecil';
  noteBtn.innerHTML = '<span class="note-icon">📝</span>';
  document.body.appendChild(noteBtn);
}

let noteOverlay = document.getElementById('noteOverlay');
if (!noteOverlay){
  noteOverlay = document.createElement('div');
  noteOverlay.id = 'noteOverlay';
  noteOverlay.className = 'note-overlay';
  noteOverlay.innerHTML = `
    <div class="note-paper" id="notePaper">
      <button class="note-close" id="noteClose" aria-label="close note">✕</button>
      <h3 class="note-title">just for you to fill in 💌</h3>
      <p class="note-hint">Anything you want say, I am listening ~</p>
      <textarea id="noteTextarea" class="note-textarea" placeholder="dear... Rupansh..."></textarea>
      <span class="note-saved" id="noteSaved">saved ✓</span>
    </div>
  `;
  document.body.appendChild(noteOverlay);
}

const noteTextarea = document.getElementById('noteTextarea');
const noteClose    = document.getElementById('noteClose');
const noteSavedTag = document.getElementById('noteSaved');

noteTextarea.value = localStorage.getItem(NOTE_STORAGE_KEY) || '';

function openNote(){
  noteOverlay.classList.add('open');
  setTimeout(() => noteTextarea.focus(), 200);
}

function closeNote(){
  noteOverlay.classList.remove('open');
}

noteBtn.addEventListener('click', openNote);
noteClose.addEventListener('click', closeNote);

noteOverlay.addEventListener('click', (e) => {
  if (e.target === noteOverlay) closeNote();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && noteOverlay.classList.contains('open')) closeNote();
});

let noteSaveTimeout = null;
noteTextarea.addEventListener('input', () => {
  clearTimeout(noteSaveTimeout);
  noteSavedTag.classList.remove('show');
  noteSaveTimeout = setTimeout(() => {
    localStorage.setItem(NOTE_STORAGE_KEY, noteTextarea.value);
    noteSavedTag.classList.add('show');
    setTimeout(() => noteSavedTag.classList.remove('show'), 1400);
  }, 500);
});


const MUSIC_STORAGE_KEY = 'bgMusicState';

// Check if audio element already exists globally, or create it
let bgMusic = document.getElementById('bgMusic');
if (!bgMusic){
  bgMusic = document.createElement('audio');
  bgMusic.id = 'bgMusic';
  bgMusic.loop = true;
  bgMusic.preload = 'auto';
  const source = document.createElement('source');
  source.src = 'assets/music.mp3';
  source.type = 'audio/mpeg';
  bgMusic.appendChild(source);
  document.body.appendChild(bgMusic);
}

let musicBtn = document.getElementById('musicBtn');
if (!musicBtn){
  musicBtn = document.createElement('button');
  musicBtn.id = 'musicBtn';
  musicBtn.className = 'music-btn';
  musicBtn.setAttribute('aria-label', 'play music');
  musicBtn.title = 'play our song';
  musicBtn.innerHTML = '<span class="music-icon">🎵</span>';
  document.body.appendChild(musicBtn);
}

const musicIcon = musicBtn.querySelector('.music-icon');
let noteInterval = null;

function spawnMusicNote(){
  const notes = ['🎵', '🎶', '💫'];
  const note = document.createElement('span');
  note.className = 'music-note';
  note.textContent = notes[Math.floor(Math.random() * notes.length)];
  note.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
  musicBtn.appendChild(note);
  setTimeout(() => note.remove(), 1400);
}

function setMusicUI(isPlaying){
  musicBtn.classList.toggle('playing', isPlaying);
  musicIcon.textContent = isPlaying ? '🎶' : '🎵';
  clearInterval(noteInterval);
  if (isPlaying) noteInterval = setInterval(spawnMusicNote, 500);
}

// Save current play state and timestamp to sessionStorage
function saveMusicState(){
  const state = {
    playing: !bgMusic.paused,
    time: bgMusic.currentTime || 0
  };
  sessionStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(state));
}

// Restore music state on page load
function restoreMusicState() {
  const savedState = JSON.parse(sessionStorage.getItem(MUSIC_STORAGE_KEY));
  if (!savedState) return;

  bgMusic.currentTime = savedState.time;
  
  if (savedState.playing) {
    bgMusic.play().then(() => {
      setMusicUI(true);
    }).catch((err) => {
      // Browser might block autoplay until user interacts, which is normal
      setMusicUI(false);
    });
  }
}

// Run restore as soon as script loads or metadata is ready
if (bgMusic.readyState >= 1) {
  restoreMusicState();
} else {
  bgMusic.addEventListener('loadedmetadata', restoreMusicState, { once: true });
}

// Toggle play/pause manually via button
musicBtn.addEventListener('click', () => {
  if (bgMusic.paused){
    bgMusic.play().then(() => {
      setMusicUI(true);
      saveMusicState();
    }).catch(() => {});
  } else {
    bgMusic.pause();
    setMusicUI(false);
    saveMusicState();
  }
});

// Continuously save state as time updates so it's always fresh
bgMusic.addEventListener('timeupdate', () => {
  if (!bgMusic.paused) {
    saveMusicState();
  }
});

// Save state right before navigating away
window.addEventListener('beforeunload', saveMusicState);

// Intercept link clicks to save state smoothly before changing pages
document.body.addEventListener('click', function(e){
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http')) return;

  saveMusicState();
});

const letterMessage =
`My dear Madam ji,

Happy birthday to the most wonderful person I know. I don't think words can fully capture how grateful I am to have you in my life, but I'm going to try anyway.

You make every ordinary day feel special just by being in it. Your smile, your laugh, the way you care about everyone around you.

I hope this year brings you every single thing you've been hoping for, and so much more. I promise to be right beside you for all of it — the big moments and the tiny, quiet ones too, especially the sad ones.

Thank you for being exactly who you are. I love you more than words can say.

Happy birthday, Ayshi💖💖 . Here's to you. 🎂
You might wanna look down your window now, I have a little surprise for you.`;

const letterEl = document.getElementById('letter-text');
let typeIndex = 0;

function typeWriter(){
  if (!letterEl) return;
  if (typeIndex < letterMessage.length){
    const chunk = letterMessage.slice(0, typeIndex + 1).replace(/\n/g, '<br>');
    letterEl.innerHTML = chunk + '<span class="cursor">&nbsp;</span>';
    typeIndex++;
    setTimeout(typeWriter, 22);
  } else {
    letterEl.innerHTML = letterMessage.replace(/\n/g, '<br>');
  }
}

/* ================================================================
   CONFETTI EXPLOSION — hanya jalan di letter.html
================================================================= */
const canvas = document.getElementById('confetti-canvas');

if (canvas){
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  const confettiColors = ['#ffd6e8', '#ff9fc7', '#d6ecff', '#a8d8ff', '#e6d9ff', '#c7a9ff', '#ffffff'];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createConfetti(){
    confettiPieces = [];
    const count = 140;
    for (let i = 0; i < count; i++){
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        size: 6 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: 2 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }
  }

  let confettiActive = false;
  let confettiFrames = 0;
  const maxConfettiFrames = 260;

  function animateConfetti(){
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle'){
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      }
      ctx.restore();
    });

    confettiFrames++;
    if (confettiFrames < maxConfettiFrames){
      requestAnimationFrame(animateConfetti);
    } else {
      confettiActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function fireConfetti(){
    createConfetti();
    confettiActive = true;
    confettiFrames = 0;
    animateConfetti();
  }

  window.addEventListener('load', () => {
    typeWriter();
    fireConfetti();
  });
}
