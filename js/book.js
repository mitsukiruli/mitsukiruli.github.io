<script>
document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有互動卡片
    const emojiCards = document.querySelectorAll('.interactive-gallery .emoji-card');
    // 獲取內容展示區
    const contentArea = document.getElementById('expanded-content-area');

    emojiCards.forEach(card => {
        // 監聽 summary 點擊事件
        const summary = card.querySelector('summary');
        
        summary.addEventListener('click', (event) => {
            // 阻止 <details> 標籤預設的開合行為
            event.preventDefault(); 
            
            const contentId = card.getAttribute('data-content-id');
            const templateContent = document.getElementById(contentId);
            const isActive = card.classList.contains('active');

            // 1. 清除所有活動狀態和內容
            emojiCards.forEach(c => c.classList.remove('active'));
            contentArea.innerHTML = '';
            
            // 2. 決定是關閉還是展開新的內容
            if (!isActive) {
                // 如果目前是關閉狀態，則展開新的內容
                
                card.classList.add('active'); // 標記為活動狀態 (用於 CSS 樣式)
                
                if (templateContent) {
                    // 複製模板內容並添加到展示區
                    const newContent = templateContent.cloneNode(true);
                    newContent.removeAttribute('id'); // 移除 ID 避免重複
                    
                    // 設置動畫
                    newContent.style.opacity = 0; 
                    contentArea.appendChild(newContent);
                    
                    setTimeout(() => {
                        newContent.style.opacity = 1;
                    }, 50);
                }
                
                // (可選) 滾動到內容區
                contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
</script>
function showChapters(category) {
    currentStep = 'chapters';
    const worldName = document.getElementById('display-world-name').innerText;
    const list = document.getElementById('chapter-data');
    
    document.getElementById('overview-grid').style.display = 'none';
    document.getElementById('chapter-view').style.display = 'block';
    document.getElementById('category-title').innerText = category;

    // 從 JSON 中抓取對應分類的文章
    let chapters = (worldData && worldData[worldName]) ? worldData[worldName][category] : null;
    let html = "";

    if (chapters) {
        chapters.forEach((item, index) => {
            html += `<li onclick="displayArticle('${worldName}', '${category}', ${index})">
                        <span>${item.title}</span>
                     </li>`;
        });
