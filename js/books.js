function openWorld(worldName) {
    // 1. 切換頁面顯示
    document.getElementById('lobby').classList.remove('active');
    document.getElementById('world-detail').classList.add('active');
    
    // 2. 更新標題
    document.getElementById('current-world-title').innerText = worldName;
    
    // 3. 捲動回頂部
    window.scrollTo(0, 0);

    // 這裡未來可以加入根據 worldName 抓取不同資料的邏輯
    console.log("進入了：" + worldName);
}

function goHome() {
    document.getElementById('world-detail').classList.remove('active');
    document.getElementById('lobby').classList.add('active');
}
