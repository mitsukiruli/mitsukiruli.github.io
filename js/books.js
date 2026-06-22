let currentStep = 'lobby'; 
let worldData = null; 

// 1. 初始載入
window.onload = function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => { 
            worldData = data; 
            console.log("JSON 資料載入成功");
            handleUrlHash();
        })
        .catch(err => console.error("無法讀取 JSON 資料:", err));
};

window.onhashchange = handleUrlHash;

function handleUrlHash() {
    const hash = decodeURIComponent(window.location.hash.substring(1));
    if (!hash) {
        if (currentStep !== 'lobby') {
            resetToLobby(); // 抽離成一個函式，確保重置乾淨
        }
        return;
    }
    if (!worldData) return; 

    const parts = hash.split('|');
    if (parts.length === 1) {
        switchWorld(parts[0], false);
    } else if (parts.length === 3) {
        switchWorld(parts[0], false);
        showChapters(parts[1], false);
        displayArticle(parts[0], parts[1], parseInt(parts[2]), false);
    }
}

// 2. 切換世界大地圖 (含配色)
const worldColors = {
    '獵人vanilLa✕吸血鬼瑠璃': { primary: '#eb4536', secondary: '#4a60a5' },
    '樂團': { primary: '#7f8182', secondary: '#262626' },
    '獅院三年級生vanilLa✕鷹院一年級生瑠璃': { primary: '#a4b4de', secondary: '#435d71' },
    '男公關': { primary: '#EFBB24', secondary: '#69b0ac' },
    '酒吧': { primary: '#6681d8', secondary: '#8879b9' }
};

function switchWorld(target, updateHash = true) {
    if (target.endsWith('.html')) {
        window.location.href = target;
        return;
    }

    // --- 切換主題色 ---
    const colors = worldColors[target];
    if (colors) {
        document.documentElement.style.setProperty('--world-primary', colors.primary);
        document.documentElement.style.setProperty('--world-secondary', colors.secondary);
        document.documentElement.style.setProperty('--world-bg', '#ffffff');
    }
    const section = document.getElementById('world-system');
    if (section) section.style.backgroundColor = "#ffffff";

    if (updateHash) window.location.hash = encodeURIComponent(target);
    
    const bannerImg = document.getElementById('world-banner-img');
    const bannerContainer = document.querySelector('.world-banner-container');
    
    // 設定對應 Banner
    if (bannerImg) {
        const banners = {
            '獵人vanilLa✕吸血鬼瑠璃': 'img/testimonials/v/無標題306_20251230221312.jpg',
            '獅院三年級生vanilLa✕鷹院一年級生瑠璃': 'img/testimonials/v/無標題306_20260409213857.png',
            '樂團': 'img/testimonials/v/無標題306_20260331033921.png',
            '男公關': 'img/testimonials/v/無標題306_20260410150748.png',
            '酒吧': 'img/testimonials/v/無標題306_20260410150748.png'
        };
        bannerImg.src = banners[target] || ''; 
    }
    
    const playerContainer = document.getElementById('music-player-container');
    const audioTag = document.getElementById('bgm-audio');
    if (audioTag) { audioTag.pause(); audioTag.src = ""; }
    if (playerContainer) { playerContainer.style.display = 'none'; }

    const mainNav = document.getElementById('main-footer-nav');
    if (mainNav) mainNav.style.display = 'none';

    currentStep = 'overview';
    document.getElementById('world-lobby').style.display = 'none';
    document.getElementById('world-detail-page').style.display = 'block';
    document.getElementById('overview-grid').style.display = 'grid';
    document.getElementById('chapter-view').style.display = 'none';
    document.getElementById('article-reader').style.display = 'none';
    
    if (bannerContainer) bannerContainer.style.display = 'block';
    document.getElementById('display-world-name').innerText = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. 章節目錄
function showChapters(category, updateHash = true) {
    currentStep = 'chapters';
    const worldName = document.getElementById('display-world-name').innerText;
    const list = document.getElementById('chapter-data');
    
    document.getElementById('overview-grid').style.display = 'none';
    document.getElementById('chapter-view').style.display = 'block';
    document.getElementById('category-title').innerText = category;
    document.getElementById('article-reader').style.display = 'none'; 

    let chapters = (worldData && worldData[worldName]) ? worldData[worldName][category] : null;
    let html = "";

    if (chapters) {
        chapters.forEach((item, index) => {
            if (category === '世界設定') {
                html += `
                    <li class="accordion-item">
                        <div class="accordion-header" onclick="toggleAccordion(this)">
                            <span>${item.title}</span>
                            <i class="bi bi-chevron-down"></i>
                        </div>
                        <div class="accordion-content">
                            <div class="accordion-body">${item.content}</div>
                        </div>
                    </li>`;
            } else {
                html += `<li onclick="displayArticle('${worldName}', '${category}', ${index})">
                            <span>${item.title}</span>
                         </li>`;
            }
        });
    }
    list.innerHTML = html || "<li>內容準備中，敬請期待...</li>";
}

function toggleAccordion(element) {
    const item = element.parentElement;
    item.classList.toggle('active');
}

// 4. 顯示文章內容 (包含音樂偵測)
function displayArticle(world, cat, index, updateHash = true) {
    currentStep = 'reader';
    const article = worldData[world][cat][index];
    
    if (updateHash) {
        window.location.hash = encodeURIComponent(`${world}|${cat}|${index}`);
    }

    const bannerContainer = document.querySelector('.world-banner-container');
    if (bannerContainer) bannerContainer.style.display = 'none';

    document.getElementById('chapter-view').style.display = 'none';
    document.getElementById('article-reader').style.display = 'block';
    
    const playerContainer = document.getElementById('music-player-container');
    const audioTag = document.getElementById('bgm-audio');
    const icon = document.getElementById('music-icon');

    if (article.audio) {
        playerContainer.style.display = 'block';
        audioTag.src = article.audio;
        audioTag.pause(); 
        icon.className = 'bi bi-music-note-beamed'; 
    } else {
        playerContainer.style.display = 'none';
        audioTag.pause();
        audioTag.src = "";
    }

    document.getElementById('article-content').innerHTML = `
        <h3 class="article-inner-title">${article.title}</h3>
        <div class="article-body-text">${article.content}</div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// --- 延時重播功能 ---
const audioTag = document.getElementById('bgm-audio');
const musicBtn = document.getElementById('music-toggle-btn');
const icon = document.getElementById('music-icon');

if (audioTag) {
    audioTag.addEventListener('ended', function() {
        console.log("播放結束，30秒冷卻中...");

        // 1. 播放結束時，先移除旋轉動畫與更改圖示
        if (musicBtn) musicBtn.classList.remove('music-playing');
        if (icon) icon.className = 'bi bi-hourglass-split'; // 變成沙漏圖示（可選，增加氛圍）

        // 2. 設定 30 秒計時器 (30000 毫秒)
        setTimeout(() => {
            // 檢查是否還在閱讀器頁面 (currentStep === 'reader') 且有音源
            if (currentStep === 'reader' && audioTag.src !== "") {
                audioTag.currentTime = 0; // 回到開頭
                audioTag.play().then(() => {
                    // 重新播放後，加回旋轉動畫與圖示
                    if (musicBtn) musicBtn.classList.add('music-playing');
                    if (icon) icon.className = 'bi bi-pause-circle';
                    console.log("30秒到，開始重播");
                }).catch(err => {
                    console.log("自動重播被瀏覽器攔截");
                });
            }
        }, 30000); 
    });
}

// 5. 統一返回邏輯
function handleBack() {
    const bannerContainer = document.querySelector('.world-banner-container');
    const worldName = document.getElementById('display-world-name').innerText;
    
    // 每次點返回都先暫停音樂
    const playerContainer = document.getElementById('music-player-container');
    const audioTag = document.getElementById('bgm-audio');
    
    if (audioTag) { audioTag.pause(); audioTag.src = ""; }
    if (playerContainer) { playerContainer.style.display = 'none'; }

    if (currentStep === 'reader') {
        window.location.hash = encodeURIComponent(worldName);
        document.getElementById('article-reader').style.display = 'none';
        document.getElementById('chapter-view').style.display = 'block';
        currentStep = 'chapters';
    } else if (currentStep === 'chapters') {
        window.location.hash = encodeURIComponent(worldName);
        document.getElementById('chapter-view').style.display = 'none';
        document.getElementById('overview-grid').style.display = 'grid';
        if (bannerContainer) bannerContainer.style.display = 'block';
        currentStep = 'overview';
    } else if (currentStep === 'overview') {
        resetToLobby();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetToLobby() {
    window.location.hash = ""; 
    document.getElementById('world-detail-page').style.display = 'none';
    document.getElementById('world-lobby').style.display = 'block';
    
    const mainNav = document.getElementById('main-footer-nav');
    if (mainNav) mainNav.style.display = 'flex';
    
    // ⚡️ 核心修正：回到大廳，背景變回淺藍色 (#f0f8ff)
    document.documentElement.style.setProperty('--world-bg', '#f0f8ff');
    
    // 重置其他顏色變數
    document.documentElement.style.setProperty('--world-primary', '#ffffff'); 
    document.documentElement.style.setProperty('--world-secondary', '#435d71');
    
    // 音樂清理 (加上上一題建議的隱藏)
    const audioTag = document.getElementById('bgm-audio');
    const playerContainer = document.getElementById('music-player-container');
    if (audioTag) { audioTag.pause(); audioTag.src = ""; }
    if (playerContainer) { playerContainer.style.display = 'none'; }
    
    currentStep = 'lobby';
}
    

// 6. 音樂播放點擊事件
document.getElementById('music-toggle-btn').addEventListener('click', function() {
    const audioTag = document.getElementById('bgm-audio');
    const icon = document.getElementById('music-icon');
    
    if (audioTag.paused) {
        audioTag.play();
        icon.className = 'bi bi-pause-circle'; 
        this.classList.add('music-playing');
    } else {
        audioTag.pause();
        icon.className = 'bi bi-play-circle'; 
        this.classList.remove('music-playing');
    }
});

function stopAndHideMusic() {
    const playerContainer = document.getElementById('music-player-container');
    const audioTag = document.getElementById('bgm-audio');
    const icon = document.getElementById('music-icon');

    if (audioTag) {
        audioTag.pause();
        audioTag.src = "";
    }
    if (playerContainer) {
        playerContainer.style.display = 'none';
    }
    if (icon) {
        icon.className = 'bi bi-music-note-beamed';
    }
}
(function () {
  const track    = document.getElementById('carouselTrack');
  const slides   = Array.from(track.querySelectorAll('.carousel-slide'));
  const dotsWrap = document.getElementById('dotsContainer');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const wrapper  = document.getElementById('carouselWrapper');

  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');

  let current = 0;
  let autoTimer;

  // ── build dots ──
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `第 ${i+1} 張`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
  }

  function getSlideImg(idx) {
    const slide = slides[idx];
    return slide.querySelector('img') || null;
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); startAuto(); });

  // ── open lightbox on click ──
  wrapper.addEventListener('click', () => openLightbox(current));

  function openLightbox(idx) {
    const slide = slides[idx];
    const img   = slide.querySelector('img');
    if (!img) return;           // placeholder：沒有真實圖就不開
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = slide.dataset.caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  lbPrev.addEventListener('click', e => {
    e.stopPropagation();
    goTo(current - 1);
    openLightbox(current);
  });
  lbNext.addEventListener('click', e => {
    e.stopPropagation();
    goTo(current + 1);
    openLightbox(current);
  });

  // keyboard
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')  { goTo(current - 1); openLightbox(current); }
    if (e.key === 'ArrowRight') { goTo(current + 1); openLightbox(current); }
  });

  // touch swipe
  let touchX = null;
  wrapper.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, {passive:true});
  wrapper.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
    touchX = null;
  }, {passive:true});

  goTo(0);
  startAuto();
})();
