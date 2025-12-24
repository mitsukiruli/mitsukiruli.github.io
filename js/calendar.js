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
function selectYear(selectedYear) {
    // 1. 更新大標題年份顯示
    const yearDisplay = document.getElementById('current-year-display');
    yearDisplay.innerHTML = `${selectedYear} <i class="bi bi-chevron-down"></i>`;

    // 2. 隱藏當前頁面所有月份內容
    document.querySelectorAll('.month-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    // 3. 更新月份按鈕的 onclick 事件，讓它們指向新年份
    // 假設你的月份按鈕順序是 1月, 2月...
    const monthButtons = document.querySelectorAll('.month-btn');
    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    monthButtons.forEach((btn, index) => {
        const mName = monthNames[index];
        const mLabel = `${selectedYear} ${mName.charAt(0).toUpperCase() + mName.slice(1)}`;
        // 動態重新設定按鈕功能
        btn.setAttribute('onclick', `switchMonth(event, '${mName}-${selectedYear}', '${mLabel}')`);
    });

    // 4. 自動顯示該年份的第一個月份 (例如 1 月)
    const firstMonthId = `january-${selectedYear}`;
    const firstMonthContent = document.getElementById(firstMonthId);
    
    if (firstMonthContent) {
        firstMonthContent.classList.add('active');
        firstMonthContent.style.display = 'block';
        document.getElementById('current-month-label').innerText = `${selectedYear} January`;
        
        // 將第一個按鈕（1月）設為 active 狀態
        monthButtons.forEach(b => b.classList.remove('active'));
        monthButtons[0].classList.add('active');
    } else {
        alert(`${selectedYear} 年的資料尚未建立喔！`);
    }

    // 5. 關閉下拉選單
    document.getElementById('year-dropdown').style.display = 'none';
}
