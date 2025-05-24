// 食材データベース
const foodDatabase = {
    grain: [
        { id: 'rice', name: '白米', calories: 168, protein: 2.5, fat: 0.3, carbs: 37.1, serving: '100g' },
        { id: 'bread', name: '食パン', calories: 264, protein: 9.3, fat: 4.3, carbs: 46.7, serving: '100g' },
        { id: 'udon', name: 'うどん', calories: 105, protein: 3.2, fat: 0.5, carbs: 22.1, serving: '100g' },
        { id: 'pasta', name: 'パスタ', calories: 371, protein: 13.0, fat: 1.8, carbs: 75.2, serving: '100g' }
    ],
    protein: [
        { id: 'chicken', name: '鶏むね肉', calories: 191, protein: 24.4, fat: 8.1, carbs: 0, serving: '100g' },
        { id: 'pork', name: '豚ロース', calories: 231, protein: 21.3, fat: 15.5, carbs: 0, serving: '100g' },
        { id: 'beef', name: '牛もも肉', calories: 271, protein: 20.2, fat: 20.1, carbs: 0, serving: '100g' },
        { id: 'salmon', name: '鮭', calories: 201, protein: 22.3, fat: 12.3, carbs: 0, serving: '100g' },
        { id: 'egg', name: '卵', calories: 151, protein: 12.3, fat: 10.3, carbs: 0.3, serving: '100g' }
    ],
    vegetable: [
        { id: 'cabbage', name: 'キャベツ', calories: 23, protein: 1.3, fat: 0.2, carbs: 5.2, serving: '100g' },
        { id: 'tomato', name: 'トマト', calories: 19, protein: 0.7, fat: 0.1, carbs: 4.7, serving: '100g' },
        { id: 'carrot', name: 'にんじん', calories: 37, protein: 0.6, fat: 0.2, carbs: 8.9, serving: '100g' },
        { id: 'potato', name: 'じゃがいも', calories: 76, protein: 1.6, fat: 0.2, carbs: 17.5, serving: '100g' }
    ],
    fruit: [
        { id: 'apple', name: 'りんご', calories: 52, protein: 0.2, fat: 0.2, carbs: 13.8, serving: '100g' },
        { id: 'banana', name: 'バナナ', calories: 89, protein: 1.1, fat: 0.2, carbs: 22.5, serving: '100g' },
        { id: 'orange', name: 'オレンジ', calories: 47, protein: 0.8, fat: 0.2, carbs: 12.0, serving: '100g' }
    ],
    dairy: [
        { id: 'milk', name: '牛乳', calories: 61, protein: 3.3, fat: 3.8, carbs: 4.8, serving: '100ml' },
        { id: 'yogurt', name: 'ヨーグルト', calories: 61, protein: 3.6, fat: 3.0, carbs: 4.8, serving: '100g' },
        { id: 'cheese', name: 'チーズ', calories: 374, protein: 26.2, fat: 30.2, carbs: 0.1, serving: '100g' }
    ]
};

// 現在の食事プラン
let currentMealPlan = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
};

// 現在選択中の食事時間
let currentMealTime = 'breakfast';

// 現在選択中のカテゴリー
let currentCategory = 'all';

// 目標カロリー（デフォルト値）
let targetCalories = 2000;

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // 食材リストの初期表示
    displayFoodList();

    // 短縮URL生成関数
    function getShortUrl() {
        // 短縮URL形式で返す（実際のドメインに合わせて調整）
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/${fileName}`;
    }

    // カテゴリーボタンのイベントリスナー
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.category-button.active').classList.remove('active');
            button.classList.add('active');
            currentCategory = button.dataset.category;
            displayFoodList();
        });
    });

    // 食事タブのイベントリスナー
    document.querySelectorAll('.meal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.meal-tab.active').classList.remove('active');
            tab.classList.add('active');
            currentMealTime = tab.dataset.meal;
            displayMealItems();
        });
    });

    // 検索機能
    const searchInput = document.getElementById('food-search');
    searchInput.addEventListener('input', () => {
        displayFoodList(searchInput.value);
    });

    // アクションボタンのイベントリスナー
    document.getElementById('save-meal').addEventListener('click', saveMealPlan);
    document.getElementById('clear-meal').addEventListener('click', clearMealPlan);
    document.getElementById('share-meal').addEventListener('click', shareMealPlan);

    // ドラッグ＆ドロップの設定
    setupDragAndDrop();

    // 栄養チャートの初期化
    initializeNutritionChart();
});

// 食材リストの表示
function displayFoodList(searchTerm = '') {
    const foodList = document.getElementById('food-list');
    foodList.innerHTML = '';

    let foodsToDisplay = [];
    if (currentCategory === 'all') {
        Object.values(foodDatabase).forEach(category => {
            foodsToDisplay = foodsToDisplay.concat(category);
        });
    } else {
        foodsToDisplay = foodDatabase[currentCategory] || [];
    }

    // 検索フィルター
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        foodsToDisplay = foodsToDisplay.filter(food => 
            food.name.toLowerCase().includes(term)
        );
    }

    foodsToDisplay.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        foodItem.draggable = true;
        foodItem.dataset.foodId = food.id;
        foodItem.innerHTML = `
            <div class="food-item-info">
                <div class="food-item-name">${food.name}</div>
                <div class="food-item-nutrition">
                    ${food.calories}kcal / ${food.serving}
                    (P:${food.protein}g F:${food.fat}g C:${food.carbs}g)
                </div>
            </div>
        `;

        // ドラッグイベントの設定
        foodItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', food.id);
        });

        foodList.appendChild(foodItem);
    });
}

// ドラッグ＆ドロップの設定
function setupDragAndDrop() {
    const mealItems = document.getElementById('meal-items');

    mealItems.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    mealItems.addEventListener('drop', (e) => {
        e.preventDefault();
        const foodId = e.dataTransfer.getData('text/plain');
        addFoodToMeal(foodId);
    });
}

// 食事に食材を追加
function addFoodToMeal(foodId) {
    let food;
    for (const category of Object.values(foodDatabase)) {
        food = category.find(f => f.id === foodId);
        if (food) break;
    }

    if (!food) return;

    currentMealPlan[currentMealTime].push({
        ...food,
        quantity: 1
    });

    displayMealItems();
    updateNutritionSummary();
}

// 食事内容の表示
function displayMealItems() {
    const mealItems = document.getElementById('meal-items');
    const items = currentMealPlan[currentMealTime];

    if (items.length === 0) {
        mealItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <p>左側から食材をドラッグ＆ドロップして追加してください</p>
            </div>
        `;
        return;
    }

    mealItems.innerHTML = items.map((item, index) => `
        <div class="food-item">
            <div class="food-item-info">
                <div class="food-item-name">${item.name}</div>
                <div class="food-item-nutrition">
                    ${item.calories}kcal / ${item.serving}
                    (P:${item.protein}g F:${item.fat}g C:${item.carbs}g)
                </div>
            </div>
            <button class="remove-item" onclick="removeFood(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// 食材の削除
function removeFood(index) {
    currentMealPlan[currentMealTime].splice(index, 1);
    displayMealItems();
    updateNutritionSummary();
}

// 栄養サマリーの更新
function updateNutritionSummary() {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    Object.values(currentMealPlan).forEach(meals => {
        meals.forEach(item => {
            totalCalories += item.calories * item.quantity;
            totalProtein += item.protein * item.quantity;
            totalFat += item.fat * item.quantity;
            totalCarbs += item.carbs * item.quantity;
        });
    });

    // 総カロリーの更新
    document.getElementById('total-calories').textContent = Math.round(totalCalories);
    
    // カロリー目標に対する進捗
    const percentage = Math.round((totalCalories / targetCalories) * 100);
    document.getElementById('calorie-percentage').textContent = percentage;
    document.querySelector('.progress').style.width = `${Math.min(percentage, 100)}%`;

    // 栄養素の更新
    document.getElementById('total-protein').textContent = Math.round(totalProtein);
    document.getElementById('total-fat').textContent = Math.round(totalFat);
    document.getElementById('total-carbs').textContent = Math.round(totalCarbs);

    // 栄養チャートの更新
    updateNutritionChart(totalProtein, totalFat, totalCarbs);
}

// 栄養チャートの初期化
let nutritionChart;
function initializeNutritionChart() {
    const ctx = document.getElementById('nutrition-chart').getContext('2d');
    nutritionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['タンパク質', '脂質', '炭水化物'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 栄養チャートの更新
function updateNutritionChart(protein, fat, carbs) {
    nutritionChart.data.datasets[0].data = [protein, fat, carbs];
    nutritionChart.update();
}

// 食事プランの保存
function saveMealPlan() {
    localStorage.setItem('mealPlan', JSON.stringify(currentMealPlan));
    alert('食事プランを保存しました');
}

// 食事プランのクリア
function clearMealPlan() {
    if (confirm('食事プランをクリアしますか？')) {
        currentMealPlan = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
        };
        displayMealItems();
        updateNutritionSummary();
    }
}

// 食事プランのシェア
function shareMealPlan() {
    const totalCalories = document.getElementById('total-calories').textContent;
    // 短縮URLを取得
    const currentUrl = getShortUrl();
    const tweetText = `今日の食事プラン：${totalCalories}kcal\n#健康計算ポータル #食事カロリー\n\n${currentUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
} 