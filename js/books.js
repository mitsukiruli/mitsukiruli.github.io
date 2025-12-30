let currentStep = 'lobby'; 
let worldData = null; 

// 1. 初始載入 JSON 數據
fetch('data.json')
    .then(response => response.json())
    .then(data => { 
        worldData = data; 
        console.log("JSON 資料載入成功");
    })
    .catch(err => console.error("無法讀取 JSON 資料:", err));

// 2. 切換世界大地圖 -> 進入概覽
function switchWorld(target) {
    if (target.endsWith('.html')) {
        window.location.href = target;
        return;
    }

    // 隱藏最外層導航
    const mainNav = document.getElementById('main-footer-nav');
    if (mainNav) mainNav.style.display = 'none';

    currentStep = 'overview';
    document.getElementById('world-lobby').style.display = 'none';
    document.getElementById('world-detail-page').style.display = 'block';
    document.getElementById('overview-grid').style.display = 'grid';
    document.getElementById('chapter-view').style.display = 'none';
    document.getElementById('article-reader').style.display = 'none';
    
    document.getElementById('display-world-name').innerText = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. 顯示章節目錄
function showChapters(category) {
    currentStep = 'chapters';
    const worldName = document.getElementById('display-world-name').innerText;
    const list = document.getElementById('chapter-data');
    
    document.getElementById('overview-grid').style.display = 'none';
    document.getElementById('chapter-view').style.display = 'block';
    document.getElementById('category-title').innerText = category;
    document.getElementById('article-reader').style.display = 'none'; // 確保閱讀器是關閉的

    let chapters = (worldData && worldData[worldName]) ? worldData[worldName][category] : null;
    let html = "";

    if (chapters) {
        chapters.forEach((item, index) => {
            // ⚡️ 關鍵判斷：如果分類是「世界設定」，改用折疊標籤
            if (category === '設定') {
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
                // 一般目錄維持原本的跳轉第三層邏輯
                html += `
                    <li onclick="displayArticle('${worldName}', '${category}', ${index})">
                        <span>${item.title}</span>
                    </li>`;
            }
        });
    }
    list.innerHTML = html || "<li>內容準備中，敬請期待...</li>";
}

// ⚡️ 新增：控制折疊展開的函數
function toggleAccordion(element) {
    const item = element.parentElement;
    item.classList.toggle('active');
}

// 4. 顯示文章內容
function displayArticle(world, cat, index) {
    currentStep = 'reader';
    const article = worldData[world][cat][index];
    
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
    if (currentStep === 'reader') {
        document.getElementById('article-reader').style.display = 'none';
        document.getElementById('chapter-view').style.display = 'block';
        currentStep = 'chapters';
    } else if (currentStep === 'chapters') {
        document.getElementById('chapter-view').style.display = 'none';
        document.getElementById('overview-grid').style.display = 'grid';
        currentStep = 'overview';
    } else if (currentStep === 'overview') {
        document.getElementById('world-detail-page').style.display = 'none';
        document.getElementById('world-lobby').style.display = 'block';
        
        const mainNav = document.getElementById('main-footer-nav');
        if (mainNav) mainNav.style.display = 'flex';
        
        currentStep = 'lobby';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
