document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('water-intake-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    console.log('JavaScript読み込み完了', { form, resultSection });

    // 短縮URL生成関数
    function getShortUrl() {
        // 実際のサイトのURL構造に合わせて生成
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/calculators/pages/${fileName}`;
    }

    // フォーム送信イベント
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('フォーム送信イベント発生');
        
        // 入力値を取得
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const activityLevel = document.getElementById('activity-level').value;
        const climate = document.getElementById('climate').value;

        console.log('入力値:', { weight, age, gender, activityLevel, climate });

        // バリデーション
        if (!weight || !age || !gender || !activityLevel || !climate) {
            alert('すべての必須項目を入力してください。');
            return;
        }

        if (weight < 30 || weight > 200) {
            alert('体重は30kg～200kgの範囲で入力してください。');
            return;
        }

        if (age < 10 || age > 100) {
            alert('年齢は10歳～100歳の範囲で入力してください。');
            return;
        }

        // 計算実行
        const result = calculateWaterIntake(weight, age, gender, activityLevel, climate);
        console.log('計算結果:', result);

        // 結果表示
        displayResults(result);

        // 画面切り替え
        calculateWaterIntake();
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    // 水分量計算
    function calculateWaterIntake(weight, age, gender, activityLevel, climate) {
        // 基本水分必要量の計算
        let baseRate = 35; // ml/kg

        // 年齢による調整
        if (age >= 65) {
            baseRate *= 0.85;
        } else if (age < 18) {
            baseRate *= 1.1;
        }

        // 性別による調整
        if (gender === 'female') {
            baseRate *= 0.9;
        }

        const baseWater = (weight * baseRate) / 1000;

        // 活動レベルによる追加水分
        const activityMultipliers = {
            'sedentary': 0,
            'light': 0.1,
            'moderate': 0.2,
            'active': 0.3,
            'very-active': 0.4
        };
        const activityWater = baseWater * (activityMultipliers[activityLevel] || 0);

        // 気候による追加水分
        const climateMultipliers = {
            'cool': 0,
            'normal': 0.05,
            'warm': 0.15,
            'hot': 0.25,
            'humid': 0.2
        };
        const climateWater = baseWater * (climateMultipliers[climate] || 0);

        // その他の要因による追加水分
        let extraWater = 0;
        if (document.getElementById('pregnant').checked) {
            extraWater += 0.3;
        }
        if (document.getElementById('breastfeeding').checked) {
            extraWater += 0.7;
        }
        if (document.getElementById('fever').checked) {
            extraWater += baseWater * 0.2;
        }
        if (document.getElementById('alcohol').checked) {
            extraWater += 0.5;
        }

        const totalWater = baseWater + activityWater + climateWater + extraWater;

        return {
            total: totalWater,
            base: baseWater,
            activity: activityWater,
            climate: climateWater,
            extra: extraWater,
            weight,
            age,
            gender,
            activityLevel
        };
    }

    // 結果表示
    function displayResults(result) {
        console.log('結果表示開始:', result);

        // 水分量表示
        document.getElementById('total-water').textContent = result.total.toFixed(1);
        document.getElementById('base-water').textContent = result.base.toFixed(1);
        document.getElementById('activity-water').textContent = result.activity.toFixed(1);
        document.getElementById('climate-water').textContent = result.climate.toFixed(1);
        document.getElementById('extra-water').textContent = result.extra.toFixed(1);

        // 結果説明
        const genderText = result.gender === 'male' ? '男性' : '女性';
        const activityTexts = {
            'sedentary': 'ほとんど運動しない',
            'light': '軽い運動（週1-3回）',
            'moderate': '中程度の運動（週3-5回）',
            'active': '激しい運動（週6-7回）',
            'very-active': '非常に激しい運動・肉体労働'
        };
        const activityText = activityTexts[result.activityLevel];

        document.getElementById('result-description').textContent = 
            `体重${result.weight}kg・${result.age}歳・${genderText}・${activityText}の方に推奨される1日の水分摂取量です。`;

        // 個別アドバイス表示
        displayTips(result);

        console.log('結果表示完了');
    }

    // 個別アドバイス表示
    function displayTips(result) {
        const tipsContainer = document.getElementById('tips-container');
        const tips = generateTips(result);
        
        tipsContainer.innerHTML = '';
        tips.forEach(tip => {
            const tipCard = document.createElement('div');
            tipCard.className = 'tip-card';
            tipCard.innerHTML = `
                <div class="icon">${tip.icon}</div>
                <div class="title">${tip.title}</div>
                <div class="content">${tip.content}</div>
            `;
            tipsContainer.appendChild(tipCard);
        });
    }

    // アドバイス生成
    function generateTips(result) {
        const tips = [];

        // 基本的なヒント
        tips.push({
            icon: '💧',
            title: '少量ずつこまめに',
            content: '1時間に約200ml（コップ1杯）を目安に、少量ずつ継続的に水分補給しましょう。'
        });

        tips.push({
            icon: '⏰',
            title: '起床時の水分補給',
            content: '起床後すぐにコップ1杯の水を飲むことで、睡眠中に失われた水分を補給できます。'
        });

        // 総水分量による個別ヒント
        if (result.total >= 3.0) {
            tips.push({
                icon: '🏃‍♂️',
                title: '運動前後の補給',
                content: '運動30分前に500ml、運動中は15-20分ごとに150-200mlの水分補給を心がけましょう。'
            });
        }

        if (result.total >= 2.5) {
            tips.push({
                icon: '🍎',
                title: '食事からの水分',
                content: '野菜や果物からも水分は摂取できます。スープや味噌汁なども効果的です。'
            });
        }

        // 性別による個別ヒント
        if (result.gender === 'female') {
            tips.push({
                icon: '🌸',
                title: '美容効果',
                content: '適切な水分補給は肌の潤いを保ち、新陳代謝を促進します。'
            });
        }

        // 活動レベルによる個別ヒント
        if (result.activityLevel === 'active' || result.activityLevel === 'very-active') {
            tips.push({
                icon: '💪',
                title: 'スポーツドリンクの活用',
                content: '長時間の運動時は、電解質を含むスポーツドリンクも効果的です。'
            });
        }

        // 追加要因による個別ヒント
        if (document.getElementById('pregnant').checked) {
            tips.push({
                icon: '🤱',
                title: '妊娠中の水分補給',
                content: '妊娠中は羊水の維持や血液量の増加により、通常より多くの水分が必要です。'
            });
        }

        if (document.getElementById('breastfeeding').checked) {
            tips.push({
                icon: '🍼',
                title: '授乳中の水分補給',
                content: '母乳の約90%は水分です。授乳前後にコップ1杯の水分補給を心がけましょう。'
            });
        }

        return tips.slice(0, 4);
    }

    // 再計算ボタン
    recalculateButton.addEventListener('click', () => {
        form.reset();
        resultSection.style.display = 'none';
        form.style.display = 'block';
        console.log('再計算: フォームをリセット');
    });

    // Twitter共有ボタン
    shareButton.addEventListener('click', () => {
        const totalWater = document.getElementById('total-water').textContent;
        const weight = document.getElementById('weight').value;
        const age = document.getElementById('age').value;
        
        const genderSelect = document.getElementById('gender');
        const activitySelect = document.getElementById('activity-level');
        const gender = genderSelect.options[genderSelect.selectedIndex]?.text || '';
        const activity = activitySelect.options[activitySelect.selectedIndex]?.text || '';
        
        const currentUrl = getShortUrl();
        const tweetText = `体重${weight}kg・${age}歳・${gender}・${activity}の私の推奨水分摂取量は${totalWater}L/日でした！\n#健康計算ポータル #水分補給 #健康管理\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });
}); 