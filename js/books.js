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
    '鷹院三年級生vanilLa✕鷹院一年級生瑠璃': { primary: '#a4b4de', secondary: '#435d71' },
    'abo✕學pa': { primary: '#7d5947', secondary: '#3b2c25' }
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
    }

    if (updateHash) window.location.hash = encodeURIComponent(target);
    
    const bannerImg = document.getElementById('world-banner-img');
    const bannerContainer = document.querySelector('.world-banner-container');
    
    // 設定對應 Banner
    if (bannerImg) {
        if (target === '獵人vanilLa✕吸血鬼瑠璃') {
            bannerImg.src = 'img/testimonials/v/無標題306_20251230221312.jpg';
        } else if (target === '鷹院三年級生vanilLa✕鷹院一年級生瑠璃') {
            bannerImg.src = 'img/無標題306_20260105011536.png';
        } else if (target === '樂團') {
            bannerImg.src = 'img/testimonials/v/無標題306_20260331033921.png';
        }
    }

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

// 5. 統一返回邏輯
function handleBack() {
    const bannerContainer = document.querySelector('.world-banner-container');
    const worldName = document.getElementById('display-world-name').innerText;
    
    // 每次點返回都先暫停音樂
    const audioTag = document.getElementById('bgm-audio');
    if (audioTag) { audioTag.pause(); }

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

// 重置回首頁的配色與狀態
function resetToLobby() {
    window.location.hash = ""; 
    document.getElementById('world-detail-page').style.display = 'none';
    document.getElementById('world-lobby').style.display = 'block';
    const mainNav = document.getElementById('main-footer-nav');
    if (mainNav) mainNav.style.display = 'flex';
    
    // --- 重置為原本的淺藍色基調 ---
    document.documentElement.style.setProperty('--world-primary', '#a4b4de');
    document.documentElement.style.setProperty('--world-secondary', '#435d71');
    
    const audioTag = document.getElementById('bgm-audio');
    if (audioTag) { audioTag.pause(); audioTag.src = ""; }
    
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
