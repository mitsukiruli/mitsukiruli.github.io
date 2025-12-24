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
