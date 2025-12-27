// 時鐘功能
function updateClock() {
    const now = new Date();
    
    // 格式化時間
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // 格式化日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    const dateString = `${year}年${month}月${day}日 ${weekday}`;
    
    // 更新顯示
    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

// 每1秒更新一次時鐘
setInterval(updateClock, 1000);
updateClock(); // 立即執行一次

// 天氣功能
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=25.0330&longitude=121.5654&current=temperature_2m,apparent_temperature,precipitation_probability,windspeed_10m,weather_code&timezone=Asia/Taipei';

// 天氣代碼對應表
const weatherCodeMap = {
    0: { icon: '☀️', text: '晴天' },
    1: { icon: '🌤️', text: '大部分晴朗' },
    2: { icon: '⛅', text: '部分多雲' },
    3: { icon: '☁️', text: '多雲' },
    45: { icon: '🌫️', text: '霧' },
    48: { icon: '🌫️', text: '結霜霧' },
    51: { icon: '🌦️', text: '輕微毛毛雨' },
    53: { icon: '🌦️', text: '中等毛毛雨' },
    55: { icon: '🌦️', text: '濃密毛毛雨' },
    61: { icon: '🌧️', text: '小雨' },
    63: { icon: '🌧️', text: '中雨' },
    65: { icon: '🌧️', text: '大雨' },
    71: { icon: '🌨️', text: '小雪' },
    73: { icon: '🌨️', text: '中雪' },
    75: { icon: '🌨️', text: '大雪' },
    80: { icon: '🌦️', text: '輕微陣雨' },
    81: { icon: '🌦️', text: '中等陣雨' },
    82: { icon: '🌦️', text: '強烈陣雨' },
    95: { icon: '⛈️', text: '雷雨' },
    96: { icon: '⛈️', text: '雷雨帶冰雹' },
    99: { icon: '⛈️', text: '強烈雷雨帶冰雹' }
};

// 取得天氣資料
async function fetchWeather() {
    const loadingEl = document.getElementById('weatherLoading');
    const errorEl = document.getElementById('weatherError');
    const contentEl = document.getElementById('weatherContent');
    
    // 顯示 loading 狀態
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    contentEl.style.display = 'none';
    
    try {
        const response = await fetch(WEATHER_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const current = data.current;
        
        // 更新天氣資料
        document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
        document.getElementById('apparentTemp').textContent = `${Math.round(current.apparent_temperature)}°C`;
        document.getElementById('precipitation').textContent = `${current.precipitation_probability}%`;
        document.getElementById('windspeed').textContent = `${Math.round(current.windspeed_10m)} km/h`;
        
        // 更新天氣狀態
        const weatherInfo = weatherCodeMap[current.weather_code] || { icon: '🌤️', text: '未知' };
        document.getElementById('weatherIcon').textContent = weatherInfo.icon;
        document.getElementById('weatherStatus').textContent = weatherInfo.text;
        
        // 更新時間
        const updateTime = new Date();
        const timeString = updateTime.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('updateTime').textContent = `最後更新：${timeString}`;
        
        // 顯示內容，隱藏 loading
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        
    } catch (error) {
        console.error('天氣資料載入失敗:', error);
        
        // 顯示錯誤狀態
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
}

// 每 10 分鐘更新一次天氣（600000 毫秒）
setInterval(fetchWeather, 600000);


// 待辦清單功能
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 從本地儲存載入待辦事項
function loadTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${index})"
            >
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">刪除</button>
        `;
        
        todoList.appendChild(li);
    });
}

// 新增待辦事項
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('請輸入待辦事項！');
        return;
    }
    
    todos.push({
        text: text,
        completed: false
    });
    
    saveTodos();
    loadTodos();
    input.value = '';
    input.focus();
}

// 切換完成狀態
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    loadTodos();
}

// 刪除待辦事項
function deleteTodo(index) {
    if (confirm('確定要刪除這個待辦事項嗎？')) {
        todos.splice(index, 1);
        saveTodos();
        loadTodos();
    }
}

// 儲存到本地儲存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 拖放功能
let draggedElement = null;
let draggedOverElement = null;

// 初始化拖放功能
function initDragAndDrop() {
    const cards = document.querySelectorAll('.draggable-card');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    const cards = document.querySelectorAll('.draggable-card');
    cards.forEach(card => {
        card.classList.remove('drag-over');
    });
    
    draggedElement = null;
    draggedOverElement = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
        draggedOverElement = this;
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const container = document.getElementById('container');
        const allCards = Array.from(container.querySelectorAll('.draggable-card:not(.hidden)'));
        const draggedIndex = allCards.indexOf(draggedElement);
        const targetIndex = allCards.indexOf(this);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            if (draggedIndex < targetIndex) {
                container.insertBefore(draggedElement, this.nextSibling);
            } else {
                container.insertBefore(draggedElement, this);
            }
            
            saveCardOrder();
        }
    }
    
    this.classList.remove('drag-over');
    return false;
}

// 儲存卡片順序
function saveCardOrder() {
    const container = document.getElementById('container');
    const cards = Array.from(container.querySelectorAll('.draggable-card:not(.hidden)'));
    const order = cards.map(card => card.dataset.module);
    localStorage.setItem('cardOrder', JSON.stringify(order));
}

// 載入卡片順序
function loadCardOrder() {
    const savedOrder = JSON.parse(localStorage.getItem('cardOrder'));
    if (!savedOrder) return;
    
    const container = document.getElementById('container');
    const cards = Array.from(container.querySelectorAll('.draggable-card'));
    const cardMap = new Map();
    cards.forEach(card => {
        cardMap.set(card.dataset.module, card);
    });
    
    // 先移除所有卡片
    cards.forEach(card => card.remove());
    
    // 按照儲存的順序重新加入
    savedOrder.forEach(moduleId => {
        const card = cardMap.get(moduleId);
        if (card) {
            container.appendChild(card);
        }
    });
    
    // 加入未在順序中的卡片（新加入的模塊）
    cards.forEach(card => {
        if (!savedOrder.includes(card.dataset.module)) {
            container.appendChild(card);
        }
    });
}

// 模塊顯示/隱藏功能
function toggleModule(moduleId, isVisible) {
    const card = document.querySelector(`[data-module="${moduleId}"]`);
    const checkbox = document.querySelector(`input[data-module="${moduleId}"]`);
    
    if (card) {
        if (isVisible) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    }
    
    // 儲存顯示狀態
    const visibility = JSON.parse(localStorage.getItem('moduleVisibility')) || {};
    visibility[moduleId] = isVisible;
    localStorage.setItem('moduleVisibility', JSON.stringify(visibility));
}

// 載入模塊顯示狀態
function loadModuleVisibility() {
    const visibility = JSON.parse(localStorage.getItem('moduleVisibility')) || {};
    
    Object.keys(visibility).forEach(moduleId => {
        const checkbox = document.querySelector(`input[data-module="${moduleId}"]`);
        if (checkbox) {
            checkbox.checked = visibility[moduleId];
            toggleModule(moduleId, visibility[moduleId]);
        }
    });
}

// 側邊欄收合功能
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    sidebar.classList.toggle('collapsed');
    body.classList.toggle('sidebar-collapsed');
    
    // 儲存側邊欄狀態
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

// 載入側邊欄狀態
function loadSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        const sidebar = document.getElementById('sidebar');
        const body = document.body;
        sidebar.classList.add('collapsed');
        body.classList.add('sidebar-collapsed');
    }
}

// 頁面載入時執行 - 確保 DOM 已載入
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    loadMoods();
    fetchWeather(); // 載入天氣資料
    
    // 載入儲存的主題
    const body = document.getElementById('body');
    body.classList.add(themes[currentThemeIndex].name);
    
    // 初始化拖放功能
    initDragAndDrop();
    
    // 載入卡片順序和顯示狀態
    loadCardOrder();
    loadModuleVisibility();
    loadSidebarState();
});

// 心情紀錄功能
let moods = JSON.parse(localStorage.getItem('moods')) || [];

// 從本地儲存載入心情紀錄
function loadMoods() {
    const moodHistory = document.getElementById('moodHistory');
    moodHistory.innerHTML = '';
    
    if (moods.length === 0) {
        moodHistory.innerHTML = '<div style="color: rgba(255, 255, 255, 0.4); text-align: center; padding: 20px; font-size: 0.9rem;">還沒有心情紀錄</div>';
        return;
    }
    
    // 按日期倒序排列（最新的在前）
    const sortedMoods = [...moods].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedMoods.forEach((mood, index) => {
        const moodItem = document.createElement('div');
        moodItem.className = 'mood-item';
        
        const originalIndex = moods.findIndex(m => m.date === mood.date && m.text === mood.text);
        
        moodItem.innerHTML = `
            <div class="mood-text">${mood.text}</div>
            <div class="mood-date">${formatMoodDate(mood.date)}</div>
            <button class="mood-delete-btn" onclick="deleteMood(${originalIndex})">刪除</button>
        `;
        
        moodHistory.appendChild(moodItem);
    });
}

// 格式化心情日期
function formatMoodDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// 新增心情紀錄
function addMood() {
    const input = document.getElementById('moodInput');
    const text = input.value.trim();
    
    if (text === '') {
        alert('請輸入心情！');
        return;
    }
    
    const now = new Date();
    moods.push({
        text: text,
        date: now.toISOString()
    });
    
    saveMoods();
    loadMoods();
    input.value = '';
    input.focus();
}

// 刪除心情紀錄
function deleteMood(index) {
    if (confirm('確定要刪除這個心情紀錄嗎？')) {
        moods.splice(index, 1);
        saveMoods();
        loadMoods();
    }
}

// 儲存到本地儲存
function saveMoods() {
    localStorage.setItem('moods', JSON.stringify(moods));
}

// 背景顏色切換功能
const themes = [
    { name: 'theme-cyberpunk', label: '賽博龐克' },
    { name: 'theme-purple', label: '紫色' },
    { name: 'theme-blue', label: '藍色' },
    { name: 'theme-red', label: '紅色' },
    { name: 'theme-green', label: '綠色' }
];

let currentThemeIndex = parseInt(localStorage.getItem('themeIndex')) || 0;

function toggleBackground() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const body = document.getElementById('body');
    
    // 移除所有主題類別
    themes.forEach(theme => {
        body.classList.remove(theme.name);
    });
    
    // 添加當前主題
    body.classList.add(themes[currentThemeIndex].name);
    
    // 儲存當前主題
    localStorage.setItem('themeIndex', currentThemeIndex);
}


