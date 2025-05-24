document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const methodButtons = document.querySelectorAll('.method-btn');
    const methodInputs = document.querySelectorAll('.method-inputs');
    const paceForm = document.getElementById('pace-form');

    // 結果表示関連
    const resultSection = document.getElementById('result-section');
    const resultTitle = document.getElementById('resultTitle');
    const resultValue = document.getElementById('resultValue');
    const resultUnit = document.getElementById('resultUnit');
    const resultDescription = document.getElementById('resultDescription');
    const splitsSection = document.getElementsByClassName('splits-section')[0];
    const splitsTableBody = document.getElementById('splitsTableBody');

    // アクションボタン
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 共通の入力要素
    const presetButtons = document.querySelectorAll('.preset-distances button');

    // ペース計算用入力
    const distanceInputPace = document.getElementById('distance');
    const distanceUnitPace = document.getElementById('distanceUnit');
    const hoursInputPace = document.getElementById('hours');
    const minutesInputPace = document.getElementById('minutes');
    const secondsInputPace = document.getElementById('seconds');

    // 時間計算用入力
    const distanceInputTime = document.getElementById('distanceTime');
    const distanceUnitTime = document.getElementById('distanceUnitTime');
    const paceMinutesInputTime = document.getElementById('paceMinutesTime');
    const paceSecondsInputTime = document.getElementById('paceSecondsTime');

    // 距離計算用入力
    const hoursInputDist = document.getElementById('hoursDist');
    const minutesInputDist = document.getElementById('minutesDist');
    const secondsInputDist = document.getElementById('secondsDist');
    const paceMinutesInputDist = document.getElementById('paceMinutesDist');
    const paceSecondsInputDist = document.getElementById('paceSecondsDist');

    let currentMethod = 'pace';
    let lastCalculationResult = null; // 最後の計算結果を保存

    // 初期状態でrequired属性を正しく設定
    methodInputs.forEach(inputDiv => {
        if (inputDiv.id === 'paceCalculator') {
            // ペース計算のdistanceフィールドのみrequiredに設定
            inputDiv.querySelectorAll('input[type="number"]').forEach(input => {
                if (input.id === 'distance') {
                    input.required = true;
                } else {
                    input.required = false;
                }
            });
        } else {
            // 他の計算方法のフィールドはすべてrequiredを無効化
            inputDiv.querySelectorAll('input[type="number"]').forEach(input => {
                input.required = false;
            });
        }
    });

    console.log('ペース計算機初期化完了');

    // 短縮URL生成関数
    function getShortUrl() {
        const baseUrl = 'https://health-calc.jp';
        const currentPath = window.location.pathname;
        if (currentPath.includes('pace')) {
            return `${baseUrl}/pace`;
        }
        return baseUrl;
    }

    // フォーム送信の処理
    paceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('フォーム送信開始, 現在の計算方法:', currentMethod);
        
        let success = false;
        
        if (currentMethod === 'pace') {
            console.log('ペース計算を実行');
            success = calculateAndDisplayPace();
        } else if (currentMethod === 'time') {
            console.log('時間計算を実行');
            success = calculateAndDisplayTime();
        } else if (currentMethod === 'distance') {
            console.log('距離計算を実行');
            success = calculateAndDisplayDistance();
        }
        
        console.log('計算結果:', success, lastCalculationResult);
        
        if (success && lastCalculationResult) {
            resultSection.style.display = 'block';
            paceForm.style.display = 'none';
            console.log('結果表示に切り替え');
            
            // ページの最上部までスムーズにスクロール
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        } else {
            console.log('計算に失敗しました');
        }
    });

    // 再計算ボタンのクリック処理
    recalculateButton.addEventListener('click', () => {
        // 入力値をリセット
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });
        
        // 計算方法を最初に戻す
        methodButtons.forEach(btn => btn.classList.remove('active'));
        methodButtons[0].classList.add('active');
        methodInputs.forEach(inputDiv => inputDiv.classList.remove('active'));
        methodInputs[0].classList.add('active');
        currentMethod = 'pace';
        
        // セクションの表示切り替え
        resultSection.style.display = 'none';
        splitsSection.style.display = 'none';
        paceForm.style.display = 'block';
        lastCalculationResult = null;
    });

    // 計算方法の切り替え
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentMethod = button.dataset.method;
            methodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            methodInputs.forEach(inputDiv => {
                inputDiv.classList.remove('active');
                if (inputDiv.id === `${currentMethod}Calculator`) {
                    inputDiv.classList.add('active');
                    // アクティブなフィールドのrequired属性を有効化
                    inputDiv.querySelectorAll('input[type="number"]').forEach(input => {
                        if (input.id === 'distance' || input.id === 'distanceTime') {
                            input.required = true;
                        }
                    });
                } else {
                    // 非アクティブなフィールドのrequired属性を無効化
                    inputDiv.querySelectorAll('input[type="number"]').forEach(input => {
                        input.required = false;
                    });
                }
            });
            resultSection.style.display = 'none';
            splitsSection.style.display = 'none';
        });
    });

    // プリセット距離の設定
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const distance = button.dataset.distance;
            const targetInputId = button.dataset.targetInput;
            if (targetInputId) {
                document.getElementById(targetInputId).value = distance;
            } else {
                if (currentMethod === 'pace') distanceInputPace.value = distance;
                else if (currentMethod === 'time') distanceInputTime.value = distance;
            }
        });
    });

    // 入力制限 (分と秒は0-59)
    function limitTimeInputValue(input) {
        input.addEventListener('input', () => {
            let value = parseInt(input.value);
            if (isNaN(value)) return;
            if (value < 0) input.value = 0;
            if (value > 59) input.value = 59;
        });
    }
    [minutesInputPace, secondsInputPace, paceSecondsInputTime, minutesInputDist, secondsInputDist, paceSecondsInputDist].forEach(limitTimeInputValue);

    // ペースを計算して表示
    function calculateAndDisplayPace() {
        const distance = parseFloat(distanceInputPace.value);
        const hours = parseInt(hoursInputPace.value) || 0;
        const minutes = parseInt(minutesInputPace.value) || 0;
        const seconds = parseInt(secondsInputPace.value) || 0;

        console.log('ペース計算の入力値:', { distance, hours, minutes, seconds });

        if (isNaN(distance) || distance <= 0 || (hours === 0 && minutes === 0 && seconds === 0)) {
            console.log('ペース計算: 入力値が無効');
            return false;
        }

        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        let distanceInKm = distanceUnitPace.value === 'mi' ? distance * 1.60934 : distance;
        
        console.log('ペース計算の変換値:', { totalSeconds, distanceInKm });
        
        if (distanceInKm === 0) {
            console.log('ペース計算: 距離が0');
            return false;
        }

        const secondsPerKm = totalSeconds / distanceInKm;
        const paceMinutes = Math.floor(secondsPerKm / 60);
        const paceSeconds = Math.round(secondsPerKm % 60);

        const paceText = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
        const unitText = distanceUnitPace.value === 'km' ? '/km' : '/マイル';

        console.log('ペース計算結果:', { paceText, unitText });

        resultTitle.textContent = 'あなたのペース';
        resultValue.textContent = paceText;
        resultUnit.textContent = unitText;
        resultDescription.textContent = `${distance}${distanceUnitPace.value}を${formatTime(totalSeconds)}で走るペースです。`;

        updateSplitTimes(secondsPerKm, distanceInKm, distanceUnitPace.value);
        splitsSection.style.display = 'block';

        // 計算結果を保存
        lastCalculationResult = {
            method: 'pace',
            result: `${paceText}${unitText}`,
            distance: distance,
            unit: distanceUnitPace.value
        };
        
        console.log('ペース計算完了');
        return true;
    }

    // 時間を計算して表示
    function calculateAndDisplayTime() {
        const distance = parseFloat(distanceInputTime.value);
        const paceMinutes = parseInt(paceMinutesInputTime.value) || 0;
        const paceSeconds = parseInt(paceSecondsInputTime.value) || 0;

        console.log('時間計算の入力値:', { distance, paceMinutes, paceSeconds });

        if (isNaN(distance) || distance <= 0 || (paceMinutes === 0 && paceSeconds === 0)) {
            console.log('時間計算: 入力値が無効');
            return false;
        }

        const paceTotalSeconds = (paceMinutes * 60) + paceSeconds;
        if (paceTotalSeconds === 0) {
            console.log('時間計算: ペースが0');
            return false;
        }
        let distanceInKm = distanceUnitTime.value === 'mi' ? distance * 1.60934 : distance;

        const totalSeconds = paceTotalSeconds * distanceInKm;
        const formattedTime = formatTime(totalSeconds);

        console.log('時間計算結果:', { formattedTime });

        resultTitle.textContent = '予想完走時間';
        resultValue.textContent = formattedTime;
        resultUnit.textContent = '';
        resultDescription.textContent = `${distance}${distanceUnitTime.value}を${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}/kmのペースで走った場合の完走時間です。`;
        splitsSection.style.display = 'none';

        // 計算結果を保存
        lastCalculationResult = {
            method: 'time',
            result: formattedTime,
            distance: distance,
            unit: distanceUnitTime.value
        };
        
        console.log('時間計算完了');
        return true;
    }

    // 距離を計算して表示
    function calculateAndDisplayDistance() {
        const hours = parseInt(hoursInputDist.value) || 0;
        const minutes = parseInt(minutesInputDist.value) || 0;
        const seconds = parseInt(secondsInputDist.value) || 0;
        const paceMinutes = parseInt(paceMinutesInputDist.value) || 0;
        const paceSeconds = parseInt(paceSecondsInputDist.value) || 0;

        console.log('距離計算の入力値:', { hours, minutes, seconds, paceMinutes, paceSeconds });

        if ((hours === 0 && minutes === 0 && seconds === 0) || (paceMinutes === 0 && paceSeconds === 0)) {
            console.log('距離計算: 入力値が無効');
            return false;
        }

        const totalSecondsRan = (hours * 3600) + (minutes * 60) + seconds;
        const paceTotalSeconds = (paceMinutes * 60) + paceSeconds;
        if (paceTotalSeconds === 0) {
            console.log('距離計算: ペースが0');
            return false;
        }

        const distanceInKm = totalSecondsRan / paceTotalSeconds;

        console.log('距離計算結果:', { distanceInKm });

        resultTitle.textContent = '予想走行距離';
        resultValue.textContent = distanceInKm.toFixed(2);
        resultUnit.textContent = 'km';
        resultDescription.textContent = `${formatTime(totalSecondsRan)}を${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}/kmのペースで走った場合の走行距離です。`;
        splitsSection.style.display = 'none';

        // 計算結果を保存
        lastCalculationResult = {
            method: 'distance',
            result: `${distanceInKm.toFixed(2)}km`,
            time: formatTime(totalSecondsRan)
        };
        
        console.log('距離計算完了');
        return true;
    }

    // スプリットタイムの更新
    function updateSplitTimes(secondsPerUnit, totalDistance, unit) {
        splitsTableBody.innerHTML = '';
        const intervals = Math.ceil(totalDistance);
        const unitLabel = unit === 'mi' ? 'マイル' : 'km';

        for (let i = 1; i <= intervals; i++) {
            const totalTimeAtInterval = secondsPerUnit * i;
            const lapTime = secondsPerUnit;

            const row = document.createElement('div');
            row.className = 'table-row';

            const distanceCell = document.createElement('span');
            distanceCell.textContent = `${i} ${unitLabel}`;

            const totalTimeCell = document.createElement('span');
            totalTimeCell.textContent = formatTime(totalTimeAtInterval);

            const lapTimeCell = document.createElement('span');
            lapTimeCell.textContent = formatTime(lapTime);

            row.appendChild(distanceCell);
            row.appendChild(totalTimeCell);
            row.appendChild(lapTimeCell);
            splitsTableBody.appendChild(row);
        }
    }

    // 時間のフォーマット（秒を時:分:秒または分:秒に変換）
    function formatTime(totalSeconds) {
        const absTotalSeconds = Math.abs(totalSeconds);
        const hours = Math.floor(absTotalSeconds / 3600);
        const minutes = Math.floor((absTotalSeconds % 3600) / 60);
        const seconds = Math.round(absTotalSeconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Twitterシェアボタン
    shareButton.addEventListener('click', () => {
        if (!lastCalculationResult) {
            return;
        }

        let shareText = '';
        if (lastCalculationResult.method === 'pace') {
            shareText = `${lastCalculationResult.distance}${lastCalculationResult.unit}のペース：${lastCalculationResult.result}`;
        } else if (lastCalculationResult.method === 'time') {
            shareText = `${lastCalculationResult.distance}${lastCalculationResult.unit}の予想完走時間：${lastCalculationResult.result}`;
        } else if (lastCalculationResult.method === 'distance') {
            shareText = `${lastCalculationResult.time}での予想走行距離：${lastCalculationResult.result}`;
        }

        // 現在のページのURLを取得
        const currentUrl = getShortUrl();
        
        const fullShareText = `${shareText}\n#健康計算ポータル #ランニング\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });
}); 