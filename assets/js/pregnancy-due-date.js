document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const methodBtns = document.querySelectorAll('.method-btn');
    const methodInputs = document.querySelectorAll('.method-inputs');
    const lmpDate = document.getElementById('lmpDate');
    const examDate = document.getElementById('examDate');
    const weeksPregnant = document.getElementById('weeksPregnant');
    const daysPregnant = document.getElementById('daysPregnant');

    // 今日の日付をデフォルトで設定
    const today = new Date();
    lmpDate.value = formatDateForInput(today);
    examDate.value = formatDateForInput(today);

    // 計算方法の切り替え
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const method = btn.dataset.method;
            methodInputs.forEach(input => {
                input.classList.remove('active');
                if (input.id === `${method}Method`) {
                    input.classList.add('active');
                }
            });

            calculateDueDate();
        });
    });

    // 入力値の変更イベント
    [lmpDate, examDate, weeksPregnant, daysPregnant].forEach(input => {
        input.addEventListener('input', calculateDueDate);
    });

    // 初期計算
    calculateDueDate();
});

// 出産予定日の計算
function calculateDueDate() {
    const activeMethod = document.querySelector('.method-btn.active').dataset.method;
    let dueDate, currentWeeks, currentDays;

    if (activeMethod === 'lmp') {
        // 最終月経開始日から計算
        const lmpDate = new Date(document.getElementById('lmpDate').value);
        if (isNaN(lmpDate.getTime())) return;

        // ナーゲレの法則：最終月経開始日 + 280日
        dueDate = new Date(lmpDate);
        dueDate.setDate(dueDate.getDate() + 280);

        // 現在の妊娠週数を計算
        const today = new Date();
        const diffTime = Math.abs(today - lmpDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        currentWeeks = Math.floor(diffDays / 7);
        currentDays = diffDays % 7;

    } else {
        // 妊娠週数から計算
        const examDate = new Date(document.getElementById('examDate').value);
        const weeks = parseInt(document.getElementById('weeksPregnant').value) || 0;
        const days = parseInt(document.getElementById('daysPregnant').value) || 0;
        if (isNaN(examDate.getTime())) return;

        // 診察日の妊娠週数から出産予定日を逆算
        const totalDays = (weeks * 7) + days;
        const remainingDays = 280 - totalDays;
        dueDate = new Date(examDate);
        dueDate.setDate(dueDate.getDate() + remainingDays);

        // 現在の妊娠週数
        currentWeeks = weeks;
        currentDays = days;
    }

    // 結果の表示
    updateResults(dueDate, currentWeeks, currentDays);
}

// 結果の表示を更新
function updateResults(dueDate, weeks, days) {
    // 出産予定日の表示（日本語形式）
    document.getElementById('dueDate').textContent = formatDateJP(dueDate);

    // 現在の妊娠週数の表示
    document.getElementById('currentWeek').textContent = weeks;
    document.getElementById('currentDay').textContent = days;

    // 進捗バーの更新
    updateProgressBar(weeks, days);

    // マイルストーンの更新
    updateMilestones(weeks);
}

// 進捗バーの更新
function updateProgressBar(weeks, days) {
    const totalDays = (weeks * 7) + days;
    const progress = (totalDays / 280) * 100;
    const progressBar = document.getElementById('progressBar');
    
    // 進捗バーの幅を更新
    progressBar.style.width = `${Math.min(100, progress)}%`;

    // トリメスターに基づいて色を変更
    if (weeks < 16) {
        progressBar.style.backgroundColor = '#4ECDC4'; // 初期
    } else if (weeks < 28) {
        progressBar.style.backgroundColor = '#45B7D1'; // 中期
    } else {
        progressBar.style.backgroundColor = '#FF6B6B'; // 後期
    }

    // トリメスターマークの更新
    const trimesterMarks = document.querySelector('.trimester-marks');
    const spans = trimesterMarks.querySelectorAll('span');
    spans.forEach(span => span.classList.remove('current'));

    if (weeks < 16) {
        spans[0].classList.add('current');
    } else if (weeks < 28) {
        spans[1].classList.add('current');
    } else {
        spans[2].classList.add('current');
    }
}

// マイルストーンの表示を更新
function updateMilestones(currentWeek) {
    document.querySelectorAll('.timeline-item').forEach(item => {
        const week = parseInt(item.dataset.week);
        if (currentWeek >= week) {
            item.style.opacity = '1';
            item.style.filter = 'none';
            item.classList.add('achieved');
        } else {
            item.style.opacity = '0.5';
            item.style.filter = 'grayscale(100%)';
            item.classList.remove('achieved');
        }
    });
}

// 日付のフォーマット（YYYY-MM-DD）- input要素用
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 日付のフォーマット（日本語形式：YYYY年MM月DD日）
function formatDateJP(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// 数値の検証
function validateNumber(input, min, max) {
    let value = parseInt(input.value);
    if (isNaN(value)) {
        value = 0;
    } else {
        value = Math.max(min, Math.min(max, value));
    }
    input.value = value;
    return value;
}

// 週数と日数の入力値の検証
document.getElementById('weeksPregnant').addEventListener('change', function() {
    validateNumber(this, 0, 42);
    calculateDueDate();
});

document.getElementById('daysPregnant').addEventListener('change', function() {
    validateNumber(this, 0, 6);
    calculateDueDate();
}); 