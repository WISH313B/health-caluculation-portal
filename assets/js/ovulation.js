document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const lastPeriodDate = document.getElementById('lastPeriodDate');
    const cycleLength = document.getElementById('cycleLength');
    const period1 = document.getElementById('period1');
    const period2 = document.getElementById('period2');
    const period3 = document.getElementById('period3');

    // 今日の日付をデフォルトで設定
    const today = new Date();
    lastPeriodDate.value = formatDateForInput(today);

    // 入力値の変更イベント
    [lastPeriodDate, cycleLength, period1, period2, period3].forEach(input => {
        input.addEventListener('input', calculateAll);
    });

    // カレンダーの初期化
    initializeCalendar();

    // 初期計算
    calculateAll();
});

// 日付のフォーマット（YYYY-MM-DD）
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// 日付のフォーマット（日本語形式）
function formatDateJP(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 日付の差分を計算（日数）
function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 平均周期の計算
function calculateAverageCycle() {
    const dates = [period3, period2, period1, lastPeriodDate]
        .map(input => input.value ? new Date(input.value) : null)
        .filter(date => date !== null)
        .sort((a, b) => a - b);

    if (dates.length < 2) return parseInt(cycleLength.value) || 28;

    let totalDays = 0;
    let cycles = 0;
    for (let i = 1; i < dates.length; i++) {
        totalDays += getDaysDifference(dates[i-1], dates[i]);
        cycles++;
    }

    return Math.round(totalDays / cycles);
}

// 排卵日の計算
function calculateOvulationDate(periodDate, cycle) {
    const ovulationDate = new Date(periodDate);
    ovulationDate.setDate(ovulationDate.getDate() + cycle - 14);
    return ovulationDate;
}

// 妊娠しやすい期間の計算
function calculateFertileWindow(ovulationDate) {
    const start = new Date(ovulationDate);
    start.setDate(start.getDate() - 5);
    const end = new Date(ovulationDate);
    end.setDate(end.getDate() + 1);
    return { start, end };
}

// 次回生理予定日の計算
function calculateNextPeriod(periodDate, cycle) {
    const nextPeriod = new Date(periodDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);
    return nextPeriod;
}

// 現在の周期フェーズの計算
function calculateCurrentPhase(lastPeriod, ovulationDate, nextPeriod) {
    const today = new Date();
    
    if (today < ovulationDate) {
        const progress = (today - lastPeriod) / (ovulationDate - lastPeriod) * 100;
        return {
            phase: '卵胞期',
            progress: Math.min(100, progress),
            marker: 'follicular'
        };
    } else if (today <= new Date(ovulationDate.getTime() + 24 * 60 * 60 * 1000)) {
        return {
            phase: '排卵期',
            progress: 50,
            marker: 'ovulation'
        };
    } else {
        const progress = (today - ovulationDate) / (nextPeriod - ovulationDate) * 100;
        return {
            phase: '黄体期',
            progress: Math.min(100, progress),
            marker: 'luteal'
        };
    }
}

// 全ての計算を実行
function calculateAll() {
    const lastPeriod = new Date(lastPeriodDate.value);
    if (isNaN(lastPeriod.getTime())) return;

    const cycle = calculateAverageCycle();
    const ovulationDate = calculateOvulationDate(lastPeriod, cycle);
    const fertileWindow = calculateFertileWindow(ovulationDate);
    const nextPeriod = calculateNextPeriod(lastPeriod, cycle);
    const currentPhase = calculateCurrentPhase(lastPeriod, ovulationDate, nextPeriod);

    // 排卵日の表示
    document.getElementById('ovulationDate').textContent = formatDateJP(ovulationDate);
    
    // 排卵日までの日数
    const today = new Date();
    const daysUntil = getDaysDifference(today, ovulationDate);
    const daysText = today > ovulationDate ? '前' : '後';
    document.getElementById('daysUntilOvulation').textContent = 
        `${Math.abs(daysUntil)}日${daysText}`;

    // 妊娠しやすい時期の表示
    document.getElementById('fertileWindow').textContent = 
        `${formatDateJP(fertileWindow.start)} ～ ${formatDateJP(fertileWindow.end)}`;

    // 次回生理予定日の表示
    document.getElementById('nextPeriodDate').textContent = formatDateJP(nextPeriod);

    // 周期フェーズの表示
    updatePhaseDisplay(currentPhase);

    // カレンダーの更新
    updateCalendar(lastPeriod, ovulationDate, fertileWindow, nextPeriod);
}

// 周期フェーズの表示を更新
function updatePhaseDisplay(phase) {
    document.getElementById('cycleProgress').style.width = `${phase.progress}%`;
    document.getElementById('currentPhase').textContent = phase.phase;

    // マーカーの更新
    document.querySelectorAll('.marker').forEach(marker => {
        marker.classList.remove('active');
        if (marker.classList.contains(phase.marker)) {
            marker.classList.add('active');
        }
    });
}

// カレンダーの初期化
function initializeCalendar() {
    const calendar = document.getElementById('ovulationCalendar');
    const table = document.createElement('table');
    
    // 曜日の行を作成
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    weekdays.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    // 日付のセルを作成（6週分）
    const tbody = document.createElement('tbody');
    for (let i = 0; i < 6; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const td = document.createElement('td');
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    calendar.appendChild(table);
}

// カレンダーの更新
function updateCalendar(lastPeriod, ovulationDate, fertileWindow, nextPeriod) {
    const calendar = document.getElementById('ovulationCalendar');
    const today = new Date();
    
    // カレンダーの開始日を計算（表示月の1日）
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.setDate(1 - startDate.getDay());

    // カレンダーのセルを更新
    const cells = calendar.getElementsByTagName('td');
    Array.from(cells).forEach((cell, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        
        // 日付を設定
        cell.textContent = date.getDate();
        cell.className = '';
        
        // 当月以外の日付は薄く表示
        if (date.getMonth() !== today.getMonth()) {
            cell.style.color = '#ccc';
        }
        
        // 今日の日付をマーク
        if (isSameDay(date, today)) {
            cell.classList.add('today');
        }
        
        // 生理日をマーク
        if (isSameDay(date, lastPeriod)) {
            cell.classList.add('period');
        }
        
        // 排卵日をマーク
        if (isSameDay(date, ovulationDate)) {
            cell.classList.add('ovulation');
        }
        
        // 妊娠しやすい期間をマーク
        if (isDateInRange(date, fertileWindow.start, fertileWindow.end)) {
            cell.classList.add('fertile');
        }
    });
}

// 同じ日かどうかを判定
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// 日付が範囲内かどうかを判定
function isDateInRange(date, start, end) {
    return date >= start && date <= end;
}

// 入力値の検証
cycleLength.addEventListener('change', function() {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 21) value = 21;
    if (value > 35) value = 35;
    this.value = value;
    calculateAll();
}); 