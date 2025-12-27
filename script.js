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

// 頁面載入時執行
loadTodos();

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

// 頁面載入時執行
loadMoods();

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

// 載入儲存的主題
window.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementById('body');
    body.classList.add(themes[currentThemeIndex].name);
});

