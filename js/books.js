let currentStep = 'lobby'; 
let worldData = null; 

// 1. 初始載入 JSON 數據並檢查網址 Hash
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
            document.getElementById('world-detail-page').style.display = 'none';
            document.getElementById('world-lobby').style.display = 'block';
            const mainNav = document.getElementById('main-footer-nav');
            if (mainNav) mainNav.style.display = 'flex';
            currentStep = 'lobby';
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

// 2. 切換世界大地圖
// 定義配色資料表
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

    // --- 新增：切換主題色 ---
    const colors = worldColors[target];
    if (colors) {
        document.documentElement.style.setProperty('--world-primary', colors.primary);
        document.documentElement.style.setProperty('--world-secondary', colors.secondary);
    }
    // ----------------------

    if (updateHash) window.location.hash = encodeURIComponent(target);
    
    // ... 妳原本處理 Banner 的程式碼 ...
        // 設定對應 Banner 圖片
    if (target === '獵人vanilLa✕吸血鬼瑠璃') {
        bannerImg.src = 'img/testimonials/v/無標題306_20251230221312.jpg';
    } else if (target === '鷹院三年級生vanilLa✕鷹院一年級生瑠璃') {
        bannerImg.src = 'img/無標題306_20260105011536.png';
    }else if (target === '樂團') {
        bannerImg.src = 'img/testimonials/v/無標題306_20260331033921.png';
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

// 3. 顯示章節目錄
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

// 4. 顯示文章內容
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
    
    document.getElementById('article-content').innerHTML = `
        <h3 class="article-inner-title">${article.title}</h3>
        <div class="article-body-text">${article.content}</div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// 監聽音樂播放點擊（更新圖示）
document.getElementById('music-toggle-btn').addEventListener('click', function() {
    const audioTag = document.getElementById('bgm-audio');
    const icon = document.getElementById('music-icon');
    
    if (audioTag.paused) {
        audioTag.play();
        icon.classList.remove('bi-music-note-beamed');
        icon.classList.add('bi-pause-circle'); // 切換為暫停圖示
        this.classList.add('music-playing');
    } else {
        audioTag.pause();
        icon.classList.remove('bi-pause-circle');
        icon.classList.add('bi-play-circle'); // 切換為播放圖示
        this.classList.remove('music-playing');
    }
});
    

// 5. 統一返回邏輯
function handleBack() {
    const bannerContainer = document.querySelector('.world-banner-container');
    const worldName = document.getElementById('display-world-name').innerText;

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
        window.location.hash = ""; 
        document.getElementById('world-detail-page').style.display = 'none';
        document.getElementById('world-lobby').style.display = 'block';
        const mainNav = document.getElementById('main-footer-nav');
        if (mainNav) mainNav.style.display = 'flex';
        currentStep = 'lobby';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function renderArticle(chapter) {
    const playerContainer = document.getElementById('music-player-container');
    const audioTag = document.getElementById('bgm-audio');
    const statusText = document.getElementById('music-status');

