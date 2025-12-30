let currentStep = 'lobby'; 
let worldData = null; 

// 1. 初始載入 JSON 數據並檢查網址 Hash
window.onload = function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => { 
            worldData = data; 
            console.log("JSON 資料載入成功");
            
            // 檢查網址是否有 # 號，如果有就自動跳轉
            handleUrlHash();
        })
        .catch(err => console.error("無法讀取 JSON 資料:", err));
};

// 監聽網址變化 (點擊瀏覽器返回鍵時也會觸發)
window.onhashchange = handleUrlHash;

function handleUrlHash() {
    const hash = decodeURIComponent(window.location.hash.substring(1));
    
    // 如果沒有 Hash，且目前不在大廳，才回到大廳狀態
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

    if (!worldData) return; // 確保資料載入才執行後續

    const parts = hash.split('|');
    if (parts.length === 1) {
        switchWorld(parts[0], false);
    } else if (parts.length === 3) {
        switchWorld(parts[0], false);
        showChapters(parts[1], false);
        displayArticle(parts[0], parts[1], parseInt(parts[2]), false);
    }
}


    const parts = hash.split('|');
    if (parts.length === 1) {
        // 只有世界名稱：跳轉到該世界的概覽
        switchWorld(parts[0], false);
    } else if (parts.length === 3) {
        // 有世界|分類|索引：跳轉到具體文章
        switchWorld(parts[0], false);
        showChapters(parts[1], false);
        displayArticle(parts[0], parts[1], parseInt(parts[2]), false);
    }
}

// 2. 切換世界大地圖
function switchWorld(target, updateHash = true) {
    if (target.endsWith('.html')) {
        window.location.href = target;
        return;
    }

    // 更新網址 Hash
    if (updateHash) window.location.hash = encodeURIComponent(target);

    // 動態切換 Banner 圖片路徑
    const bannerImg = document.getElementById('world-banner-img');
    const bannerContainer = document.querySelector('.world-banner-container');
    
    // 這裡放入你的圖片路徑
    if (target === '獵人vanilLa✕吸血鬼瑠璃') {
        bannerImg.src = 'img/testimonials/v/無標題306_20251230221312.jpg';
    } else if (target === '鷹院三年級生vanilLa✕鷹院一年級生瑠璃') {
        bannerImg.src = 'img/testimonials/v/無標題306_20251230221312.jpg';
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
                html += `
                    <li onclick="displayArticle('${worldName}', '${category}', ${index})">
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
    
    // ⚡️ 進入文章時更新 Hash 記錄位置
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

// 5. 統一返回邏輯
function handleBack() {
    const bannerContainer = document.querySelector('.world-banner-container');
    const worldName = document.getElementById('display-world-name').innerText;

    if (currentStep === 'reader') {
        // 回到章節層，更新 Hash 為世界名稱
        window.location.hash = encodeURIComponent(worldName);
        document.getElementById('article-reader').style.display = 'none';
        document.getElementById('chapter-view').style.display = 'block';
        currentStep = 'chapters';
    } else if (currentStep === 'chapters') {
        // 回到概覽層
        window.location.hash = encodeURIComponent(worldName);
        document.getElementById('chapter-view').style.display = 'none';
        document.getElementById('overview-grid').style.display = 'grid';
        if (bannerContainer) bannerContainer.style.display = 'block';
        currentStep = 'overview';
    } else if (currentStep === 'overview') {
        // 回到大廳，清空 Hash
        window.location.hash = ""; 
        document.getElementById('world-detail-page').style.display = 'none';
        document.getElementById('world-lobby').style.display = 'block';
        const mainNav = document.getElementById('main-footer-nav');
        if (mainNav) mainNav.style.display = 'flex';
        currentStep = 'lobby';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
