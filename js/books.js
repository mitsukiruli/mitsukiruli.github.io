let currentStep = 'lobby'; // lobby -> overview -> chapters

function switchWorld(worldName) {
    currentStep = 'overview';
    document.getElementById('world-lobby').style.display = 'none';
    document.getElementById('world-detail-page').style.display = 'block';
    document.getElementById('overview-grid').style.display = 'grid';
    document.getElementById('chapter-view').style.display = 'none';
    
    document.getElementById('display-world-name').innerText = worldName;
    document.getElementById('back-text').innerText = '返回大地圖';
    window.scrollTo(0, 0);
}

function showChapters(category) {
    currentStep = 'chapters';
    document.getElementById('overview-grid').style.display = 'none';
    document.getElementById('chapter-view').style.display = 'block';
    document.getElementById('category-title').innerText = category;
    document.getElementById('back-text').innerText = '返回分組';

    // 模擬章節資料 - 你之後可以根據各個世界線擴充此處
    const list = document.getElementById('chapter-data');
    if (category === '主線劇情') {
        list.innerHTML = `
            <li onclick="alert('跳轉到文章頁面')"><span>序章：時空啟程</span><small>Vol.01</small></li>
            <li onclick="alert('跳轉到文章頁面')"><span>第一章：水藍色的約定</span><small>Vol.02</small></li>
        `;
    } else {
        list.innerHTML = `<li>該分類尚無內容...</li>`;
    }
}

function handleBack() {
    if (currentStep === 'chapters') {
        // 從章節返回三區塊概覽
        document.getElementById('chapter-view').style.display = 'none';
        document.getElementById('overview-grid').style.display = 'grid';
        document.getElementById('back-text').innerText = '返回大地圖';
        currentStep = 'overview';
    } else if (currentStep === 'overview') {
        // 從概覽返回大地圖
        document.getElementById('world-detail-page').style.display = 'none';
        document.getElementById('world-lobby').style.display = 'block';
        currentStep = 'lobby';
    }
}
