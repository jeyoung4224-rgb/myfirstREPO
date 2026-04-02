/* =============================================
   멍-라벨 (Mung-Label) — main.js
   ============================================= */

// ---- 히어로 동영상 자동 재생 ----
(function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  // 음소거 상태에서 autoplay 보장
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // 자동재생 차단 시 사용자 인터랙션 후 재시도
      document.addEventListener('click', () => video.play(), { once: true });
      document.addEventListener('touchstart', () => video.play(), { once: true });
    });
  }
})();

// ---- 발바닥 파티클 (히어로 배경 생동감) ----
(function startPawParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const container = document.createElement('div');
  container.className = 'hero-particles';
  hero.appendChild(container);

  const pawEmojis = ['🐾', '🐕', '🐶', '🦴', '❤️', '🐾', '🐾'];
  for (let i = 0; i < 20; i++) {
    const paw = document.createElement('span');
    paw.className = 'hero-paw';
    paw.textContent = pawEmojis[Math.floor(Math.random() * pawEmojis.length)];
    paw.style.left = Math.random() * 100 + '%';
    paw.style.animationDuration = (9 + Math.random() * 12) + 's';
    paw.style.animationDelay = (Math.random() * 12) + 's';
    paw.style.fontSize = (0.7 + Math.random() * 1.1) + 'rem';
    container.appendChild(paw);
  }
})();

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Mobile Nav ----
const hamburger = document.getElementById('hamburger');
let mobileNav = null;
let overlay = null;

function createMobileNav() {
  overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.innerHTML = `
    <button class="mobile-nav-close" id="mobileNavClose"><i class="fas fa-times"></i></button>
    <a href="#home">🏠 홈</a>
    <a href="#features">✨ 기능</a>
    <a href="#how-it-works">🚀 사용법</a>
    <a href="#allergens">🧬 알레르기 정보</a>
    <a href="#compare">⚖️ 비교</a>
    <a href="#reviews">💬 후기</a>
    <a href="#download" style="color:var(--primary);font-weight:700;">📱 무료 다운로드</a>
  `;
  document.body.appendChild(mobileNav);

  document.getElementById('mobileNavClose').addEventListener('click', closeMobileNav);
  overlay.addEventListener('click', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
}

function openMobileNav() {
  if (!mobileNav) createMobileNav();
  mobileNav.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  if (mobileNav) mobileNav.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMobileNav);

// ---- Phone screen slider ----
const screens = document.querySelectorAll('.app-screen');
const dots = document.querySelectorAll('.sdot');
let currentScreen = 0;
let screenTimer = null;

function showScreen(idx) {
  screens.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  if (screens[idx]) screens[idx].classList.add('active');
  if (dots[idx]) dots[idx].classList.add('active');
  currentScreen = idx;
}

function nextScreen() {
  showScreen((currentScreen + 1) % screens.length);
}

function startScreenTimer() {
  screenTimer = setInterval(nextScreen, 2800);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(screenTimer);
    showScreen(i);
    startScreenTimer();
  });
});

startScreenTimer();

// ---- Features tabs ----
const featTabs = document.querySelectorAll('.feat-tab');
const featPanels = document.querySelectorAll('.feat-panel');

featTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    featTabs.forEach(t => t.classList.remove('active'));
    featPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

// ---- Allergen filter + grid ----
const allergenData = [
  { icon: '🌾', name: '밀 (소맥)', aka: '소맥분, 글루텐', level: 'high' },
  { icon: '🥛', name: '유제품', aka: '탈지분유, 유청', level: 'high' },
  { icon: '🥚', name: '달걀', aka: '난백, 난황', level: 'high' },
  { icon: '🐔', name: '닭고기', aka: '가금류', level: 'medium' },
  { icon: '🐄', name: '소고기', aka: '우육, 쇠고기', level: 'medium' },
  { icon: '🌽', name: '옥수수', aka: '콘, 옥수수전분', level: 'medium' },
  { icon: '🐟', name: '생선', aka: '어분, 연어분', level: 'medium' },
  { icon: '🌰', name: '대두 (콩)', aka: '두부, 콩기름', level: 'low' },
  { icon: '🍖', name: '돼지고기', aka: '돈육, 포크', level: 'low' },
  { icon: '🥔', name: '감자', aka: '감자전분', level: 'low' },
  { icon: '🍬', name: '말토덱스트린', aka: '덱스트린', level: 'low' },
  { icon: '🧪', name: '에톡시퀸', aka: '산화방지제', level: 'high' },
];

const levelLabel = { high: '고위험', medium: '중위험', low: '저위험' };
const levelClass = { high: 'level-high', medium: 'level-medium', low: 'level-low' };
const allergenGrid = document.getElementById('allergenGrid');

function renderAllergens(filter = 'all') {
  if (!allergenGrid) return;
  allergenGrid.innerHTML = '';
  allergenData
    .filter(a => filter === 'all' || a.level === filter)
    .forEach(a => {
      const card = document.createElement('div');
      card.className = 'allergen-card';
      card.innerHTML = `
        <div class="allergen-card-icon">${a.icon}</div>
        <div class="allergen-card-name">${a.name}</div>
        <div class="allergen-card-aka">${a.aka}</div>
        <span class="allergen-card-level ${levelClass[a.level]}">${levelLabel[a.level]}</span>
      `;
      allergenGrid.appendChild(card);
    });
}

renderAllergens();

document.querySelectorAll('.af-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.af-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAllergens(btn.dataset.filter);
  });
});

// ---- Reviews marquee ----
const reviews = [
  { stars: 5, text: '드디어 장 볼 때 성분 걱정이 없어졌어요. 카메라 한 번으로 끝나니 너무 편해요!', name: '박지수', dog: '푸들 보호자', avatar: '👩' },
  { stars: 5, text: '초코가 맨날 긁었는데 멍-라벨로 밀가루 알레르기 찾아냈어요. 지금은 완전 건강해요 🐶', name: '김민준', dog: '말티즈 보호자', avatar: '👨' },
  { stars: 5, text: '성분 백과사전이 너무 유용해요! 에톡시퀸이 뭔지 이제 알겠어요.', name: '이서연', dog: '비숑 보호자', avatar: '👩‍🦰' },
  { stars: 4, text: '해외 사료도 인식이 잘 돼요. 다국어 지원이 정말 강력하네요.', name: '정도현', dog: '골든레트리버 보호자', avatar: '🧑' },
  { stars: 5, text: '두 마리 프로필 각각 설정해두니까 스캔하면 각자 알레르기 맞게 알려줘요 👍', name: '최유진', dog: '시바견 2마리 보호자', avatar: '👩‍🦱' },
  { stars: 5, text: '수의사 선생님도 추천해주셨어요. 보호자라면 꼭 써봐야 할 앱!', name: '홍성훈', dog: '웰시코기 보호자', avatar: '👴' },
  { stars: 5, text: '마트에서 새 간식 살 때마다 스캔해요. 이제 불안하지 않아요!', name: '강예원', dog: '포메라니안 보호자', avatar: '👱‍♀️' },
  { stars: 4, text: '빨간 불 뜨면 왜 위험한지도 알려줘서 공부가 많이 됩니다.', name: '조태양', dog: '닥스훈트 보호자', avatar: '🧔' },
];

const reviewsTrack = document.getElementById('reviewsTrack');
if (reviewsTrack) {
  const allReviews = [...reviews, ...reviews];
  allReviews.forEach(r => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <span class="review-avatar">${r.avatar}</span>
        <div class="review-author-info">
          <strong>${r.name}</strong>
          <span>${r.dog}</span>
        </div>
      </div>
    `;
    reviewsTrack.appendChild(card);
  });
}

// ---- Counter animation ----
function animateCounter(el, target, duration = 1800) {
  const isFloat = String(target).includes('.');
  const decimals = isFloat ? 1 : 0;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isFloat
      ? value.toFixed(decimals)
      : Math.floor(value).toLocaleString('ko-KR');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(decimals) : target.toLocaleString('ko-KR');
  }
  requestAnimationFrame(update);
}

// ---- Intersection Observer ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (entry.target.dataset.target) {
      const t = parseFloat(entry.target.dataset.target);
      animateCounter(entry.target, t);
      observer.unobserve(entry.target);
    }
    if (entry.target.classList.contains('problem-card')) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
document.querySelectorAll('.problem-card').forEach(el => observer.observe(el));

// ---- QR code pattern (decorative) ----
const qrGrid = document.getElementById('qrGrid');
if (qrGrid) {
  const pattern = [
    1,1,1,1,1,1,1,0,1,0,
    1,0,0,0,0,0,1,0,0,1,
    1,0,1,1,1,0,1,0,1,1,
    1,0,1,1,1,0,1,0,0,0,
    1,0,0,0,0,0,1,0,1,0,
    1,1,1,1,1,1,1,0,0,1,
    0,0,0,0,0,0,0,0,1,0,
    1,0,1,1,0,1,0,1,0,1,
    0,1,1,0,1,0,1,1,1,1,
    1,0,0,1,0,1,1,0,1,1,
  ];
  pattern.forEach(v => {
    const cell = document.createElement('div');
    cell.className = 'qr-cell ' + (v ? 'black' : 'white');
    qrGrid.appendChild(cell);
  });
}

// ---- Scroll to top ----
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
});
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
