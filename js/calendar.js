/**
 * 切換月份功能
 */
function switchMonth(event, monthId, labelText) {
    // 1. 隱藏所有月份內容
    const contents = document.querySelectorAll('.month-content');
    contents.forEach(content => content.classList.remove('active'));

    // 2. 移除所有按鈕的 active 狀態
    const buttons = document.querySelectorAll('.month-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. 顯示選中的月份
    document.getElementById(monthId).classList.add('active');

    // 4. 設定當前按鈕為 active
    event.currentTarget.classList.add('active');

    // 5. 更新標題文字
    document.getElementById('current-month-label').innerText = labelText;
}

/**
 * 顯示/隱藏日期詳細內容
 */
function toggleEntry(event) {
    const cell = event.currentTarget;
    const entry = cell.querySelector('.entry-content');
    
    // 關閉其他開啟中的框
    document.querySelectorAll('.entry-content').forEach(el => {
        if (el !== entry) el.style.display = 'none';
    });

    // 切換當前狀態
    const isVisible = entry.style.display === 'block';
    entry.style.display = isVisible ? 'none' : 'block';
    
    // 防止點擊事件傳到 document
    event.stopPropagation();
}

/**
 * 點擊網頁空白處自動關閉彈出框
 */
document.addEventListener('click', () => {
    document.querySelectorAll('.entry-content').forEach(el => {
        el.style.display = 'none';
    });
});

/**
 * 切換年份選單顯示/隱藏
 */
function toggleYearMenu(event) {
    const dropdown = document.getElementById('year-dropdown');
    const isVisible = dropdown.style.display === 'block';
    
    // 關閉所有可能的內容框
    closeAllPopups();
    
    dropdown.style.display = isVisible ? 'none' : 'block';
    event.stopPropagation();
}

/**
 * 選擇年份並更新介面
 */
function selectYear(year) {
    // 1. 更新大標題文字
    const yearDisplay = document.getElementById('current-year-display');
    yearDisplay.innerHTML = `${year} <i class="bi bi-chevron-down"></i>`;
    
    // 2. 這裡你可以加入邏輯：例如跳轉到該年份的頁面，或切換顯示的月份資料
    // 如果目前只有 2025 的資料，可以先做個提示
    if (year !== '2025') {
        alert(`目前僅提供 2025 年的紀錄，${year} 年正在準備中！`);
    }
    
    // 3. 關閉選單
    document.getElementById('year-dropdown').style.display = 'none';
}

/**
 * 點擊頁面其他地方關閉選單
 */
document.addEventListener('click', function() {
    const dropdown = document.getElementById('year-dropdown');
    if (dropdown) dropdown.style.display = 'none';
});

// 封裝一個關閉所有彈窗的函數
function closeAllPopups() {
    document.querySelectorAll('.entry-content').forEach(el => el.style.display = 'none');
    const dropdown = document.getElementById('year-dropdown');
    if (dropdown) dropdown.style.display = 'none';
}
