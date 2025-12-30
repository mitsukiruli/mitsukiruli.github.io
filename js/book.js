let currentStep = 'lobby'; 
let worldData = null; // 用來存儲從 JSON 抓到的資料

// 初始載入 JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => { worldData = data; })
    .catch(err => console.error("無法讀取 JSON 資料:", err));

function switchWorld(target) {
    if (target.endsWith('.html')) {
        window.location.href = target;
        return;
    }

    currentStep = 'overview';
    document.getElementById('world-lobby').style.display = 'none';
    document.getElementById('world-detail-page').style.display = 'block';
    document.getElementById('overview-grid').style.display = 'grid';
    document.getElementById('chapter-view').style.display = 'none';
    document.getElementById('article-reader').style.display = 'none';
    document.getElementById('display-world-name').innerText = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showChapters(category) {
    currentStep = 'chapters';
    const worldName = document.getElementById('display-world-name').innerText;
    const list = document.getElementById('chapter-data');
    
    document.getElementById('overview-grid').style.display = 'none';
    document.getElementById('chapter-view').style.display = 'block';
    document.getElementById('category-title').innerText = category;

    let chapters = worldData[worldName] ? worldData[worldName][category] : null;
    let html = "";

    if (chapters) {
        chapters.forEach((item, index) => {
            html += `<li onclick="displayArticle('${worldName}', '${category}', ${index})">
                        <span>${item.title}</span>
                     </li>`;
        });
    }
    list.innerHTML = html || "<li>內容準備中...</li>";
}

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
        currentStep = 'lobby';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
