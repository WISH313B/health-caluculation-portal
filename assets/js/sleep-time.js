document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sleep-time-form');
    const resultSection = document.getElementById('result-section');
    const recalculateButton = document.getElementById('recalculate');
    const shareButton = document.getElementById('share-twitter');

    // 短縮URL生成関数
    function getShortUrl() {
        // 実際のサイトのURL構造に合わせて生成
        const path = window.location.pathname;
        const fileName = path.split('/').pop().replace('.html', '');
        return `https://minna-no-kenko.com/calculators/pages/${fileName}`;
    }

    // 年齢層別の推奨睡眠時間（時間）
    const AGE_SLEEP_RECOMMENDATIONS = {
        'teen': { min: 8, max: 10, ideal: 9 },
        'young-adult': { min: 7, max: 9, ideal: 8 },
        'adult': { min: 7, max: 9, ideal: 7.5 },
        'senior': { min: 7, max: 8, ideal: 7 }
    };

    // 睡眠サイクルの段階（各段階の持続時間は分単位）
    const SLEEP_CYCLE = {
        LIGHT: { 
            duration: 30, 
            label: '浅い睡眠',
            type: 'non-rem'
        },
        DEEP: { 
            duration: 45, 
            label: '深い睡眠',
            type: 'non-rem'
        },
        REM: { 
            duration: 15, 
            label: 'レム睡眠',
            type: 'rem'
        }
    };

    // 睡眠サイクルの説明
    const SLEEP_CYCLE_INFO = {
        rem: {
            title: 'レム睡眠',
            description: '夢を見やすい段階で、記憶の整理と定着が行われます。脳が活発に活動し、創造性や学習能力の向上に重要な役割を果たします。'
        },
        nonRem: {
            title: 'ノンレム睡眠',
            description: '体の回復に重要な段階です。浅い眠り（第1-2段階）から深い眠り（第3-4段階）へと進み、成長ホルモンの分泌が活発になります。'
        }
    };

    // 睡眠の質に影響する生活習慣の減点
    const HABIT_PENALTIES = {
        'caffeine': { score: -15, message: 'カフェインは睡眠の質を低下させる可能性があります' },
        'screen': { score: -20, message: 'ブルーライトは睡眠ホルモンの分泌を抑制します' },
        'exercise': { score: -10, message: '夜の激しい運動は体温を上昇させ、寝つきを悪くします' },
        'irregular': { score: -25, message: '不規則な就寝時間は体内時計を乱します' }
    };

    function calculateBedtime(wakeTime, recommendedHours) {
        const wake = new Date(`2000/01/01 ${wakeTime}`);
        const bed = new Date(wake.getTime() - (recommendedHours * 60 * 60 * 1000));
        return bed.toTimeString().slice(0, 5);
    }

    function calculateSleepCycles(bedtime, wakeTime) {
        const bed = new Date(`2000/01/01 ${bedtime}`);
        const wake = new Date(`2000/01/01 ${wakeTime}`);
        if (wake < bed) wake.setDate(wake.getDate() + 1);

        const totalMinutes = (wake - bed) / (1000 * 60);
        const cycleLength = Object.values(SLEEP_CYCLE).reduce((sum, stage) => sum + stage.duration, 0);
        const completeCycles = Math.floor(totalMinutes / cycleLength);

        return {
            cycles: completeCycles,
            totalMinutes: totalMinutes
        };
    }

    function calculateSleepQuality(habits, currentSleepHours, recommendedHours) {
        let score = 100;

        // 生活習慣による減点
        habits.forEach(habit => {
            if (HABIT_PENALTIES[habit]) {
                score += HABIT_PENALTIES[habit].score;
            }
        });

        // 睡眠時間の差による減点
        const hoursDiff = Math.abs(currentSleepHours - recommendedHours);
        if (hoursDiff > 0) {
            score -= Math.min(30, hoursDiff * 10);
        }

        return Math.max(0, Math.min(100, score));
    }

    function getSleepQualityLabel(score) {
        if (score >= 90) return { label: '最高', color: '#34C759' };
        if (score >= 70) return { label: '良好', color: '#007AFF' };
        if (score >= 50) return { label: '普通', color: '#FF9500' };
        return { label: '要改善', color: '#FF3B30' };
    }

    function updateResults(formData) {
        const ageGroup = formData.get('age-group');
        const wakeTime = formData.get('wake-time');
        const sleepHours = parseInt(formData.get('sleep-hours'));
        const sleepMinutes = parseInt(formData.get('sleep-minutes'));
        const habits = formData.getAll('habits[]');

        const recommendation = AGE_SLEEP_RECOMMENDATIONS[ageGroup];
        const currentSleepHours = sleepHours + (sleepMinutes / 60);
        const bedtime = calculateBedtime(wakeTime, recommendation.ideal);
        const cycles = calculateSleepCycles(bedtime, wakeTime);
        const quality = calculateSleepQuality(habits, currentSleepHours, recommendation.ideal);
        const qualityLabel = getSleepQualityLabel(quality);

        // 結果の更新
        document.getElementById('bedtime-value').textContent = bedtime;
        document.getElementById('duration-value').textContent = `${recommendation.ideal}時間`;
        document.getElementById('duration-min').textContent = recommendation.min;
        document.getElementById('duration-max').textContent = recommendation.max;
        document.getElementById('quality-score').textContent = quality;
        
        const qualityLabelElement = document.getElementById('quality-label');
        qualityLabelElement.textContent = qualityLabel.label;
        qualityLabelElement.style.color = qualityLabel.color;

        // 睡眠サイクルの選択肢を表示
        updateCycleOptions(wakeTime);

        // 睡眠サイクルのタイムラインを更新
        updateCycleTimeline(bedtime, wakeTime, cycles.cycles);

        // 現状評価とアドバイスを更新
        updateAnalysis(currentSleepHours, recommendation, habits);

        // 環境づくりのヒントを更新
        updateEnvironmentTips();
    }

    function updateCycleOptions(wakeTime) {
        const cycleOptions = document.getElementById('cycle-options');
        const cycles = [];
        
        // 90分周期で4-6サイクルの就寝時刻を計算
        for (let i = 4; i <= 6; i++) {
            const bedtime = calculateBedtime(wakeTime, (i * 1.5));
            const hours = i * 1.5;
            const hoursInt = Math.floor(hours);
            const minutes = Math.round((hours - hoursInt) * 60);
            
            let durationText;
            if (minutes === 0) {
                durationText = `${hoursInt}時間00分`;
            } else {
                durationText = `${hoursInt}時間${minutes}分`;
            }
            
            cycles.push(`
                <div class="cycle-option">
                    <span class="cycle-time">${bedtime}</span>
                    <span class="cycle-detail">就寝 - ${durationText}</span>
                </div>
            `);
        }

        cycleOptions.innerHTML = cycles.join('');
    }

    function updateCycleTimeline(bedtime, wakeTime, cycles) {
        const timeline = document.getElementById('cycle-timeline');
        const bed = new Date(`2000/01/01 ${bedtime}`);
        const wake = new Date(`2000/01/01 ${wakeTime}`);
        if (wake < bed) wake.setDate(wake.getDate() + 1);

        // 就寝時刻に応じて開始時刻を調整
        const bedMinutes = bed.getMinutes();
        let offsetMinutes;
        if (bedMinutes === 0) {
            offsetMinutes = 45; // 00分なら45分前から
        } else if (bedMinutes === 30) {
            offsetMinutes = 15; // 30分なら15分前から
        } else {
            // その他の時刻の場合は、直前の15分単位に合わせる
            offsetMinutes = (15 - (bedMinutes % 15)) + 15;
        }

        const startTime = new Date(bed.getTime() - offsetMinutes * 60 * 1000);
        const totalMinutes = (wake - startTime) / (1000 * 60);
        
        const cycleWidth = 150; // 1サイクルの固定幅
        const width = cycles * cycleWidth;
        const height = 100;
        const baseY = height - 10;

        // 睡眠ステージの高さを定義
        const stageHeights = {
            awake: 0,           // 覚醒
            light: height * 0.3, // 浅い睡眠
            deep: height * 0.7,  // 深い睡眠
            rem: height * 0.4    // レム睡眠
        };

        // 時間に基づいて睡眠ステージを計算
        function calculateSleepStage(minutes) {
            // 就寝時刻前は覚醒状態
            if (minutes < offsetMinutes) {
                return { height: 0, type: 'awake' };
            }
            
            const cycleMinutes = (minutes - offsetMinutes) % 90; // 90分を1サイクルとする
            if (cycleMinutes < 30) {
                return { height: stageHeights.light, type: 'light' };
            } else if (cycleMinutes < 60) {
                return { height: stageHeights.deep, type: 'deep' };
            } else {
                return { height: stageHeights.rem, type: 'rem' };
            }
        }

        // パスの生成
        let path = `M 0 ${baseY}`;
        const pointsPerCycle = 30;
        const minutesPerPoint = 90 / pointsPerCycle;

        for (let i = 0; i <= totalMinutes; i += minutesPerPoint) {
            const x = (i / totalMinutes) * width;
            const stage = calculateSleepStage(i);
            const y = baseY - stage.height;
            
            if (i === 0) {
                path += ` L ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        }

        // 時刻マーカーの生成
        const markers = [];
        const markerInterval = 15; // 15分ごとにマーカーを表示
        
        // 最初のマーカーの時刻を15分単位で切り下げ
        const firstMarkerTime = new Date(startTime.getTime());
        firstMarkerTime.setMinutes(Math.floor(firstMarkerTime.getMinutes() / 15) * 15);
        
        for (let time = new Date(firstMarkerTime); time <= wake; time = new Date(time.getTime() + markerInterval * 60 * 1000)) {
            const minutes = (time - startTime) / (1000 * 60);
            const x = (minutes / totalMinutes) * width;
            
            // 時刻表示のフォーマット
            let timeLabel = '';
            const mins = time.getMinutes();
            if (mins === 0) {
                timeLabel = `${time.getHours()}:00`;
            } else if (mins === 30) {
                timeLabel = `${time.getHours()}:30`;
            }
            
            if (timeLabel) {
                markers.push(`
                    <div class="cycle-marker" style="position: absolute; left: ${x}px">
                        ${timeLabel}
                    </div>
                `);
            }
        }

        timeline.innerHTML = `
            <p class="cycle-description">
                睡眠は浅い眠り→深い眠り→レム睡眠のサイクルを繰り返します。<br>
                深い眠りでは体の回復、レム睡眠では記憶の定着が行われます。
            </p>
            <div class="sleep-cycle-graph">
                <div class="y-axis">
                    <div class="y-axis-label">覚醒</div>
                    <div class="y-axis-label">レム</div>
                    <div class="y-axis-label">浅眠</div>
                    <div class="y-axis-label">深眠</div>
                </div>
                <div class="cycle-wave">
                    <svg viewBox="0 0 ${width} ${height}" style="width: ${width}px">
                        <defs>
                            <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#34C759;stop-opacity:0.2" />
                                <stop offset="100%" style="stop-color:#007AFF;stop-opacity:0.2" />
                            </linearGradient>
                            <linearGradient id="cycleStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:#007AFF" />
                                <stop offset="50%" style="stop-color:#34C759" />
                                <stop offset="100%" style="stop-color:#007AFF" />
                            </linearGradient>
                        </defs>
                        <path d="${path}" 
                              fill="url(#cycleGradient)" 
                              stroke="url(#cycleStroke)" 
                              stroke-width="2"
                              stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="x-axis">
                    <div class="cycle-markers" style="width: ${width}px">
                        ${markers.join('')}
                    </div>
                </div>
            </div>
            <div class="cycle-info">
                <p>1サイクル90分 × ${cycles}サイクル = ${cycles * 1.5}時間</p>
            </div>
        `;

        // スクロール同期の設定
        const cycleWave = timeline.querySelector('.cycle-wave');
        const xAxis = timeline.querySelector('.x-axis');
        
        const syncScroll = () => {
            cycleWave.scrollLeft = xAxis.scrollLeft;
        };

        xAxis.addEventListener('scroll', syncScroll);
    }

    function updateAnalysis(currentSleepHours, recommendation, habits) {
        const statusDetails = document.getElementById('status-details');
        const improvementTips = document.getElementById('improvement-tips');

        const status = [];
        const tips = [];

        // 現状評価
        if (currentSleepHours < recommendation.min) {
            status.push('睡眠時間が推奨時間より短めです');
            tips.push('徐々に就寝時刻を早めることを検討してください');
        } else if (currentSleepHours > recommendation.max) {
            status.push('睡眠時間が推奨時間より長めです');
            tips.push('質の良い睡眠を取ることで、適切な睡眠時間に調整できる可能性があります');
        }

        // 生活習慣の評価とアドバイス
        habits.forEach(habit => {
            if (HABIT_PENALTIES[habit]) {
                status.push(HABIT_PENALTIES[habit].message);
                switch (habit) {
                    case 'caffeine':
                        tips.push('就寝6時間前以降のカフェイン摂取を控えめにしましょう');
                        break;
                    case 'screen':
                        tips.push('就寝1時間前はブルーライトを制限し、リラックスモードを活用しましょう');
                        break;
                    case 'exercise':
                        tips.push('激しい運動は夕方までに済ませ、夜は軽いストレッチにとどめましょう');
                        break;
                    case 'irregular':
                        tips.push('休日も平日と同じ時間に就寝・起床するよう心がけましょう');
                        break;
                }
            }
        });

        if (status.length === 0) {
            status.push('概ね良好な睡眠習慣です');
        }
        if (tips.length === 0) {
            tips.push('現在の良好な睡眠習慣を維持しましょう');
        }

        statusDetails.innerHTML = status.map(item => `<li>${item}</li>`).join('');
        improvementTips.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }

    function updateEnvironmentTips() {
        const environmentTips = document.getElementById('environment-tips');
        const tips = [
            { icon: 'fas fa-thermometer-half', tip: '室温18-22℃を目安に調整' },
            { icon: 'fas fa-moon', tip: '暗めの照明環境を整える' },
            { icon: 'fas fa-volume-mute', tip: '静かな環境を確保' },
            { icon: 'fas fa-wind', tip: '適度な換気を心がける' }
        ];

        environmentTips.innerHTML = tips.map(tip => `
            <div class="environment-tip">
                <i class="${tip.icon}"></i>
                <span>${tip.tip}</span>
            </div>
        `).join('');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        updateResults(formData);
        resultSection.style.display = 'block';
        form.style.display = 'none';
    });

    recalculateButton.addEventListener('click', () => {
        resultSection.style.display = 'none';
        form.style.display = 'block';
    });

    shareButton.addEventListener('click', () => {
        const bedtime = document.getElementById('bedtime-value').textContent;
        const duration = document.getElementById('duration-value').textContent;
        const quality = document.getElementById('quality-score').textContent;
        
        // 現在のページのURLを取得
        const currentUrl = getShortUrl();
        
        const tweetText = `私の推奨就寝時刻は${bedtime}で、理想的な睡眠時間は${duration}です。睡眠の質スコア: ${quality}/100\n#健康計算ポータル #快眠\n\n${currentUrl}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(tweetUrl, '_blank');
    });
}); 