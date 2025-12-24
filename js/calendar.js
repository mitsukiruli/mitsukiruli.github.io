/**
 * 切換月份功能
 */
function switchMonth(event, monthId, labelText) {
    // 1. 隱藏所有月份內容並移除 active 類別
    const contents = document.querySelectorAll('.month-content');
    contents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none'; // ⚡️ 確保強制隱藏
    });

    // 2. 移除所有按鈕的 active 狀態
    const buttons = document.querySelectorAll('.month-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. 顯示選中的月份
    const target = document.getElementById(monthId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block'; // ⚡️ 確保顯示

        // 4. 設定當前按鈕為 active
        event.currentTarget.classList.add('active');

        // 5. 更新標題文字
        document.getElementById('current-month-label').innerText = labelText;
    } else {
        alert("該月份資料尚在準備中！");
    }
}

/**
 * 顯示/隱藏日期詳細內容 (回憶框)
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
    
    event.stopPropagation();
}

/**
 * 切換年份選單顯示/隱藏
 */
/**
 * 切換年份選單
 */
function toggleYearMenu(event) {
    // 平板端建議加入 preventDefault 避免雙擊或縮放干擾
    if (event.cancelable) event.preventDefault();
    
    const dropdown = document.getElementById('year-dropdown');
    
    // 強制關閉所有回憶框
    document.querySelectorAll('.entry-content').forEach(el => el.style.display = 'none');
    
    // 切換顯示
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
    
    event.stopPropagation();
}

/**
 * 針對平板與手機優化的點擊空白處關閉
 */
const closeHandler = () => {
    const dropdown = document.getElementById('year-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    document.querySelectorAll('.entry-content').forEach(el => el.style.display = 'none');
};

// 同時監聽 click 與 touchend
document.addEventListener('click', closeHandler);
document.addEventListener('touchend', (e) => {
    // 如果點擊的是選單本身，則不關閉
    if (!e.target.closest('.year-selector-container') && !e.target.closest('.has-entry')) {
        closeHandler();
    }
});

/**
 * 選擇年份並更新介面
 */
function selectYear(selectedYear) {
    // 1. 更新大標題年份顯示
    const yearDisplay = document.getElementById('current-year-display');
    yearDisplay.innerHTML = `${selectedYear} <i class="bi bi-chevron-down"></i>`;

    // 2. 隱藏所有月份內容
    document.querySelectorAll('.month-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    // 3. 更新月份按鈕的連結目標
    const monthButtons = document.querySelectorAll('.month-btn');
    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june', 
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    monthButtons.forEach((btn, index) => {
        const mName = monthNames[index];
        const mLabel = `${selectedYear} ${mName.charAt(0).toUpperCase() + mName.slice(1)}`;
        btn.setAttribute('onclick', `switchMonth(event, '${mName}-${selectedYear}', '${mLabel}')`);
    });

    // 4. 自動嘗試顯示選定年份的 1 月
    const firstMonthId = `january-${selectedYear}`;
    const firstMonthContent = document.getElementById(firstMonthId);
    
    if (firstMonthContent) {
        // 使用 switchMonth 的邏輯來觸發
        // 模擬點擊第一個按鈕來保持邏輯一致
        monthButtons[0].click();
    } else {
        alert(`${selectedYear} 年的資料尚未建立喔！`);
    }

    // 5. 關閉下拉選單
    document.getElementById('year-dropdown').style.display = 'none';
}

/**
 * 點擊網頁空白處自動關閉所有彈出框
 */
document.addEventListener('click', () => {
    // 關閉回憶框
    document.querySelectorAll('.entry-content').forEach(el => el.style.display = 'none');
    // 關閉年份選單
    const dropdown = document.getElementById('year-dropdown');
    if (dropdown) dropdown.style.display = 'none';
});
