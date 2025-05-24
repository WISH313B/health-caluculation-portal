document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calories-burned-form');
    const resultSection = document.getElementById('result-section');
    const activityCategory = document.getElementById('activity-category');
    const activitySelect = document.getElementById('activity');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        // 短縮URL形式で返す（実際のドメインに合わせて調整）
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/${fileName}`;
    }

    // 運動種目データ
    const activities = {
        cardio: {
            name: '有酸素運動',
            items: {
                'walking_slow': { name: 'ゆっくり歩行（4km/h）', mets: 2.9 },
                'walking_normal': { name: '通常歩行（5km/h）', mets: 3.5 },
                'walking_fast': { name: '速歩（6.5km/h）', mets: 4.3 },
                'jogging': { name: 'ジョギング（8km/h）', mets: 8.0 },
                'running': { name: 'ランニング（10km/h）', mets: 10.0 },
                'cycling_light': { name: '自転車（軽い）', mets: 4.0 },
                'cycling_moderate': { name: '自転車（中程度）', mets: 6.0 },
                'cycling_vigorous': { name: '自転車（激しい）', mets: 8.0 },
                'swimming_leisure': { name: '水泳（レジャー）', mets: 6.0 },
                'swimming_laps': { name: '水泳（クロール）', mets: 8.0 }
            }
        },
        strength: {
            name: '筋力トレーニング',
            items: {
                'weight_light': { name: '軽いウェイトトレーニング', mets: 3.5 },
                'weight_moderate': { name: '中程度のウェイトトレーニング', mets: 5.0 },
                'weight_vigorous': { name: '激しいウェイトトレーニング', mets: 6.0 },
                'pushups': { name: '腕立て伏せ', mets: 3.8 },
                'pullups': { name: '懸垂', mets: 4.0 },
                'squats': { name: 'スクワット', mets: 5.0 },
                'lunges': { name: 'ランジ', mets: 4.0 },
                'crunches': { name: '腹筋運動', mets: 3.8 },
                'plank': { name: 'プランク', mets: 4.0 },
                'circuit': { name: 'サーキットトレーニング', mets: 8.0 }
            }
        },
        sports: {
            name: 'スポーツ',
            items: {
                'tennis': { name: 'テニス', mets: 7.0 },
                'basketball': { name: 'バスケットボール', mets: 6.5 },
                'soccer': { name: 'サッカー', mets: 7.0 },
                'volleyball': { name: 'バレーボール', mets: 4.0 },
                'baseball': { name: '野球', mets: 5.0 },
                'table_tennis': { name: '卓球', mets: 4.0 },
                'badminton': { name: 'バドミントン', mets: 5.5 },
                'golf': { name: 'ゴルフ', mets: 4.8 },
                'martial_arts': { name: '武道', mets: 10.0 },
                'dance': { name: 'ダンス', mets: 7.8 }
            }
        },
        daily: {
            name: '日常活動',
            items: {
                'cleaning': { name: '掃除', mets: 3.3 },
                'gardening': { name: '園芸', mets: 3.8 },
                'shopping': { name: '買い物', mets: 2.3 },
                'stairs': { name: '階段の上り下り', mets: 4.0 },
                'cooking': { name: '料理', mets: 2.0 },
                'washing': { name: '洗濯', mets: 2.0 },
                'desk_work': { name: 'デスクワーク', mets: 1.5 },
                'standing': { name: '立ち仕事', mets: 2.0 },
                'child_care': { name: '育児', mets: 3.0 },
                'commuting': { name: '通勤（歩行）', mets: 4.0 }
            }
        }
    };

    // カテゴリー選択時の処理
    activityCategory.addEventListener('change', () => {
        const category = activityCategory.value;
        activitySelect.innerHTML = '<option value="">運動種目を選択</option>';
        
        if (category) {
            const items = activities[category].items;
            for (const [key, value] of Object.entries(items)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = value.name;
                activitySelect.appendChild(option);
            }
            activitySelect.disabled = false;
        } else {
            activitySelect.disabled = true;
        }
    });

    // フォーム送信時の処理
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateCalories();
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    // 再計算ボタンの処理
    recalculateButton.addEventListener('click', () => {
        // 入力値をリセット
        form.reset();
        activitySelect.disabled = true;
        
        // セクションの表示切り替え
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    // Twitter共有ボタンの処理
    shareButton.addEventListener('click', () => {
        const calories = document.getElementById('calories-value').textContent;
        const activity = activitySelect.options[activitySelect.selectedIndex]?.text || '運動';
        const weight = document.getElementById('weight').value;
        const hours = document.getElementById('duration-hours').value || 0;
        const minutes = document.getElementById('duration-minutes').value || 0;
        
        // 短縮URLを取得
        const currentUrl = getShortUrl();
        
        const duration = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
        const tweetText = `体重${weight}kgで${activity}を${duration}行い、${calories}kcal消費しました！\n#健康計算ポータル #消費カロリー #運動\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });

    // カロリー計算
    function calculateCalories() {
        const weight = parseFloat(document.getElementById('weight').value);
        const hours = parseFloat(document.getElementById('duration-hours').value) || 0;
        const minutes = parseFloat(document.getElementById('duration-minutes').value) || 0;
        const duration = hours + (minutes / 60);
        const activity = activitySelect.value;
        const category = activityCategory.value;

        const mets = activities[category].items[activity].mets;
        const calories = Math.round(mets * weight * duration * 1.05); // 1.05は安全係数

        displayResults(calories, mets, duration);
    }

    // 結果の表示
    function displayResults(calories, mets, duration) {
        // カロリー表示
        document.getElementById('calories-value').textContent = calories;
        
        // 結果説明を更新
        const weight = document.getElementById('weight').value;
        const activity = activitySelect.options[activitySelect.selectedIndex].text;
        const hours = document.getElementById('duration-hours').value || 0;
        const minutes = document.getElementById('duration-minutes').value || 0;
        const durationText = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
        
        document.getElementById('result-description').textContent = 
            `体重${weight}kgで${activity}を${durationText}行った場合の消費カロリーです。`;

        // METs表示
        document.getElementById('mets-value').textContent = mets.toFixed(1);

        // 運動強度の判定
        const intensityLevel = document.getElementById('intensity-level');
        let intensityText;
        let intensityColor;
        if (mets < 3) {
            intensityText = '運動強度: 軽い';
            intensityColor = '#34C759';
        } else if (mets < 6) {
            intensityText = '運動強度: 中程度';
            intensityColor = '#FFD60A';
        } else {
            intensityText = '運動強度: 高強度';
            intensityColor = '#FF3B30';
        }
        intensityLevel.textContent = intensityText;
        intensityLevel.style.backgroundColor = intensityColor;
        intensityLevel.style.color = mets < 6 ? 'black' : 'white';

        // 脂肪燃焼効率の計算と表示
        const fatBurningBar = document.getElementById('fat-burning-bar');
        const fatBurningLabel = document.getElementById('fat-burning-label');
        let fatBurningEfficiency;
        
        if (mets < 3) {
            fatBurningEfficiency = 30;
            fatBurningLabel.textContent = '脂肪燃焼効率: 低';
        } else if (mets < 6) {
            fatBurningEfficiency = 60;
            fatBurningLabel.textContent = '脂肪燃焼効率: 中';
        } else if (mets < 8) {
            fatBurningEfficiency = 85;
            fatBurningLabel.textContent = '脂肪燃焼効率: 高';
        } else {
            fatBurningEfficiency = 100;
            fatBurningLabel.textContent = '脂肪燃焼効率: 最大';
        }
        fatBurningBar.style.width = `${fatBurningEfficiency}%`;

        // 同等の運動例を表示
        const equivalentList = document.getElementById('equivalent-list');
        const currentActivity = activitySelect.value;
        const currentCategory = activityCategory.value;
        const currentMets = activities[currentCategory].items[currentActivity].mets;
        
        let equivalentActivities = [];
        for (const category of Object.values(activities)) {
            for (const [key, value] of Object.entries(category.items)) {
                if (Math.abs(value.mets - currentMets) <= 0.5 && 
                    `${currentCategory}.${currentActivity}` !== `${category.name}.${key}`) {
                    equivalentActivities.push(value.name);
                }
            }
        }

        equivalentList.innerHTML = equivalentActivities
            .slice(0, 3)
            .map(activity => `<li><i class="fas fa-equals"></i> ${activity}</li>`)
            .join('');

        // 運動のコツを表示
        const exerciseTips = document.getElementById('exercise-tips');
        const tips = getExerciseTips(mets, duration);
        exerciseTips.innerHTML = tips.map(tip => `<li><i class="fas fa-lightbulb"></i> ${tip}</li>`).join('');
    }

    // 運動のコツを取得
    function getExerciseTips(mets, duration) {
        const tips = [];

        if (mets < 3) {
            tips.push('強度を上げることで、より効果的な脂肪燃焼が期待できます');
            tips.push('徐々に運動時間を延ばしていくことをお勧めします');
        } else if (mets < 6) {
            tips.push('この強度は持続的な運動に適しています');
            tips.push('週3-4回のペースで継続することで効果が期待できます');
        } else {
            tips.push('十分な休息を取り、オーバーワークに注意してください');
            tips.push('高強度の運動は週2-3回程度に抑えることをお勧めします');
        }

        if (duration < 0.5) {
            tips.push('運動時間を30分以上に延ばすことで、より効果的な脂肪燃焼が期待できます');
        } else if (duration > 2) {
            tips.push('長時間の運動は水分補給と栄養補給に特に注意してください');
        }

        tips.push('運動前後のストレッチで怪我を予防しましょう');
        return tips;
    }
}); 