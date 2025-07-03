// 危険日・安全日計算機のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    const lastPeriodDateInput = document.getElementById('lastPeriodDate');
    const cycleLengthInput = document.getElementById('cycleLength');
    const calculateButton = document.getElementById('calculateButton');
    const resultSection = document.getElementById('resultSection');
    
    // 今日の日付をデフォルトに設定
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    lastPeriodDateInput.value = formatDate(lastWeek);
    
    calculateButton.addEventListener('click', calculateSafeDays);
    
    // エンターキーでも計算実行
    lastPeriodDateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateSafeDays();
    });
    
    cycleLengthInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateSafeDays();
    });
    
    function calculateSafeDays() {
        const lastPeriodDate = new Date(lastPeriodDateInput.value);
        const cycleLength = parseInt(cycleLengthInput.value);
        
        // 入力値の検証
        if (!lastPeriodDateInput.value) {
            alert('最終月経開始日を入力してください。');
            return;
        }
        
        if (!cycleLength || cycleLength < 21 || cycleLength > 35) {
            alert('生理周期は21～35日の範囲で入力してください。');
            return;
        }
        
        // 計算実行
        const results = calculatePeriodDays(lastPeriodDate, cycleLength);
        displayResults(results);
        generateCalendar(results);
        
        // 結果セクションを表示
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function calculatePeriodDays(lastPeriodDate, cycleLength) {
        const today = new Date();
        
        // 次回生理予定日
        const nextPeriodDate = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
        
        // 排卵日（次回生理予定日の14日前）
        const ovulationDate = new Date(nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        
        // 危険日の範囲（排卵日前5日から排卵日後2日）
        const dangerStartDate = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000);
        const dangerEndDate = new Date(ovulationDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        
        // 生理期間（通常5日間）
        const periodEndDate = new Date(lastPeriodDate.getTime() + 5 * 24 * 60 * 60 * 1000);
        
        // 比較的安全な期間の計算
        const safeStartDate1 = new Date(periodEndDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        const safeEndDate1 = new Date(dangerStartDate.getTime() - 1 * 24 * 60 * 60 * 1000);
        
        const safeStartDate2 = new Date(dangerEndDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        const safeEndDate2 = new Date(nextPeriodDate.getTime() - 1 * 24 * 60 * 60 * 1000);
        
        return {
            lastPeriodDate,
            nextPeriodDate,
            ovulationDate,
            dangerStartDate,
            dangerEndDate,
            periodEndDate,
            safeStartDate1,
            safeEndDate1,
            safeStartDate2,
            safeEndDate2,
            cycleLength
        };
    }
    
    function displayResults(results) {
        // 危険日
        document.getElementById('dangerPeriod').textContent = 
            `${formatDateJP(results.dangerStartDate)} ～ ${formatDateJP(results.dangerEndDate)}`;
        
        // 排卵日
        document.getElementById('ovulationDate').textContent = formatDateJP(results.ovulationDate);
        
        // 安全日（2つの期間をまとめて表示）
        let safePeriodText = '';
        if (results.safeStartDate1 <= results.safeEndDate1) {
            safePeriodText += `${formatDateJP(results.safeStartDate1)} ～ ${formatDateJP(results.safeEndDate1)}`;
        }
        if (results.safeStartDate2 <= results.safeEndDate2) {
            if (safePeriodText) safePeriodText += '、';
            safePeriodText += `${formatDateJP(results.safeStartDate2)} ～ ${formatDateJP(results.safeEndDate2)}`;
        }
        document.getElementById('safePeriod').textContent = safePeriodText || '該当なし';
        
        // 次回生理予定日
        document.getElementById('nextPeriodDate').textContent = formatDateJP(results.nextPeriodDate);
    }
    
    function generateCalendar(results) {
        const calendar = document.getElementById('safeDaysCalendar');
        calendar.innerHTML = '';
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // カレンダーのヘッダー（曜日）
        const dayHeaders = ['日', '月', '火', '水', '木', '金', '土'];
        dayHeaders.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            calendar.appendChild(dayElement);
        });
        
        // 今月の1日
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // 月初の空セルを追加
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendar.appendChild(emptyDay);
        }
        
        // 日付セルを生成
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // 今日の日付をハイライト
            if (isSameDate(date, today)) {
                dayElement.classList.add('today');
            }
            
            // 期間ごとの色分け
            const dayType = getDayType(date, results);
            dayElement.classList.add(dayType);
            
            calendar.appendChild(dayElement);
        }
    }
    
    function getDayType(date, results) {
        // 生理期間
        if (date >= results.lastPeriodDate && date <= results.periodEndDate) {
            return 'menstrual';
        }
        
        // 排卵日
        if (isSameDate(date, results.ovulationDate)) {
            return 'ovulation';
        }
        
        // 危険日
        if (date >= results.dangerStartDate && date <= results.dangerEndDate) {
            return 'danger';
        }
        
        // 安全日
        if ((date >= results.safeStartDate1 && date <= results.safeEndDate1) ||
            (date >= results.safeStartDate2 && date <= results.safeEndDate2)) {
            return 'safe';
        }
        
        return 'normal';
    }
    
    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function formatDateJP(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
        return `${month}月${day}日(${dayOfWeek})`;
    }
    
    // 初期計算（デフォルト値で）
    calculateSafeDays();
}); 