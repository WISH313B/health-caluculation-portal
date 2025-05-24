document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('menstrual-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        // 短縮URL形式で返す（実際のドメインに合わせて調整）
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/${fileName}`;
    }

    // 入力要素
    const lastPeriodInput = document.getElementById('last-period');
    const cycleLengthInput = document.getElementById('cycle-length');
    const periodLengthInput = document.getElementById('period-length');

    // 結果表示要素
    const nextPeriodElement = document.getElementById('next-period');
    const ovulationDateElement = document.getElementById('ovulation-date');
    const fertilePeriodElement = document.getElementById('fertile-period');
    const calendarElement = document.getElementById('calendar');

    // フォーム送信イベント
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateCycle();
        resultSection.style.display = 'block';
        form.style.display = 'none';
        
        // ページの最上部までスムーズにスクロール
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });

    // 再計算ボタン
    recalculateButton.addEventListener('click', () => {
        // 入力値をリセット
        form.reset();
        
        // セクションの表示切り替え
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    // Twitter共有ボタンの処理
    shareButton.addEventListener('click', () => {
        const nextPeriod = document.getElementById('next-period').textContent;
        const ovulationDate = document.getElementById('ovulation-date').textContent;
        const cycleLength = document.getElementById('cycle-length').value;
        
        // 短縮URLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `生理周期${cycleLength}日で、次回月経予定日は${nextPeriod}、排卵予定日は${ovulationDate}でした！\n#健康計算ポータル #生理周期 #女性の健康\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });

    function calculateCycle() {
        const lastPeriod = new Date(lastPeriodInput.value);
        const cycleLength = parseInt(cycleLengthInput.value);
        const periodLength = parseInt(periodLengthInput.value);

        // 次回月経予定日の計算
        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

        // 排卵予定日の計算（次回月経の14日前）
        const ovulationDate = new Date(nextPeriod);
        ovulationDate.setDate(ovulationDate.getDate() - 14);

        // 妊娠しやすい期間の計算（排卵日前5日～排卵日後1日）
        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(fertileStart.getDate() - 5);
        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(fertileEnd.getDate() + 1);

        // 結果を表示
        nextPeriodElement.textContent = formatDate(nextPeriod);
        ovulationDateElement.textContent = formatDate(ovulationDate);
        fertilePeriodElement.textContent = `${formatDate(fertileStart)} ～ ${formatDate(fertileEnd)}`;

        // 結果説明を更新
        const lastPeriodDate = formatDate(lastPeriod);
        document.getElementById('next-period-description').textContent = 
            `最終月経開始日（${lastPeriodDate}）から${cycleLength}日後の予定日です。`;

        // カレンダーを生成
        generateCalendar(lastPeriod, nextPeriod, ovulationDate, fertileStart, fertileEnd, periodLength);
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        const dayName = dayNames[date.getDay()];
        return `${year}年${month}月${day}日（${dayName}）`;
    }

    function generateCalendar(lastPeriod, nextPeriod, ovulationDate, fertileStart, fertileEnd, periodLength) {
        calendarElement.innerHTML = '';

        // 今月のカレンダーを表示
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // 月の最初の日と最後の日
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // 月の最初の週の開始日（日曜日）
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // 曜日ヘッダーを追加
        const dayHeaders = ['日', '月', '火', '水', '木', '金', '土'];
        dayHeaders.forEach(dayName => {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'calendar-day header';
            headerDiv.textContent = dayName;
            calendarElement.appendChild(headerDiv);
        });

        // カレンダーの日付を生成（6週間分）
        const currentDate = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = currentDate.getDate();

            // 他の月の日付
            if (currentDate.getMonth() !== currentMonth) {
                dayDiv.classList.add('other-month');
            }

            // 今日
            if (currentDate.toDateString() === today.toDateString()) {
                dayDiv.classList.add('today');
            }

            // 月経期間をマーク
            const periodEnd = new Date(lastPeriod);
            periodEnd.setDate(periodEnd.getDate() + periodLength - 1);
            if (currentDate >= lastPeriod && currentDate <= periodEnd) {
                dayDiv.classList.add('menstrual');
            }

            // 次回月経期間をマーク
            const nextPeriodEnd = new Date(nextPeriod);
            nextPeriodEnd.setDate(nextPeriodEnd.getDate() + periodLength - 1);
            if (currentDate >= nextPeriod && currentDate <= nextPeriodEnd) {
                dayDiv.classList.add('menstrual');
            }

            // 排卵日をマーク
            if (currentDate.toDateString() === ovulationDate.toDateString()) {
                dayDiv.classList.add('ovulation');
            }

            // 妊娠しやすい期間をマーク
            if (currentDate >= fertileStart && currentDate <= fertileEnd) {
                if (!dayDiv.classList.contains('ovulation') && !dayDiv.classList.contains('menstrual')) {
                    dayDiv.classList.add('fertile');
                }
            }

            calendarElement.appendChild(dayDiv);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    // 今日の日付をデフォルトに設定
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    lastPeriodInput.max = `${yyyy}-${mm}-${dd}`;
}); 