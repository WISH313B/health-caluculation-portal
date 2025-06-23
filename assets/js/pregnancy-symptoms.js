// 妊娠超初期症状チェッカー JavaScript

class PregnancySymptomsChecker {
    constructor() {
        this.symptoms = [
            { id: 'symptom1', weight: 3, name: '生理が予定日より遅れている' },
            { id: 'symptom2', weight: 3, name: '基礎体温が高温のまま続いている' },
            { id: 'symptom3', weight: 2, name: '少量の出血があった（着床出血の可能性）' },
            { id: 'symptom4', weight: 2, name: '乳房の張りや痛み' },
            { id: 'symptom5', weight: 2, name: '乳首の色が濃くなった' },
            { id: 'symptom6', weight: 1, name: '強い眠気や疲労感' },
            { id: 'symptom7', weight: 2, name: '吐き気がある' },
            { id: 'symptom8', weight: 1, name: '匂いに敏感になった' },
            { id: 'symptom9', weight: 1, name: 'トイレが近くなった' },
            { id: 'symptom10', weight: 1, name: '軽い下腹部痛' },
            { id: 'symptom11', weight: 1, name: '腰が重い・痛い' },
            { id: 'symptom12', weight: 1, name: '便秘気味になった' },
            { id: 'symptom13', weight: 1, name: '食べ物の好みが変わった' },
            { id: 'symptom14', weight: 1, name: '感情の起伏が激しい' },
            { id: 'symptom15', weight: 1, name: '微熱っぽい感じ' }
        ];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const checkButton = document.getElementById('checkSymptomsBtn');
        const resetButton = document.getElementById('resetBtn');

        if (checkButton) {
            checkButton.addEventListener('click', () => this.checkSymptoms());
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetChecker());
        }
    }

    checkSymptoms() {
        const checkedSymptoms = [];
        let totalScore = 0;
        let symptomCount = 0;

        // チェックされた症状を収集
        this.symptoms.forEach(symptom => {
            const checkbox = document.getElementById(symptom.id);
            if (checkbox && checkbox.checked) {
                checkedSymptoms.push(symptom);
                totalScore += symptom.weight;
                symptomCount++;
            }
        });

        // 結果を表示
        this.displayResults(symptomCount, totalScore, checkedSymptoms);
    }

    displayResults(symptomCount, totalScore, checkedSymptoms) {
        const resultSection = document.getElementById('resultSection');
        const symptomCountElement = document.getElementById('symptomCount');
        const resultMessage = document.getElementById('resultMessage');
        const resultAdvice = document.getElementById('resultAdvice');

        // 症状数を表示
        if (symptomCountElement) {
            symptomCountElement.textContent = symptomCount;
        }

        // 結果レベルを判定
        const resultLevel = this.determineResultLevel(totalScore, checkedSymptoms);
        
        // 結果メッセージを設定
        const messages = this.getResultMessages(resultLevel);
        
        if (resultMessage) {
            resultMessage.innerHTML = messages.message;
        }
        
        if (resultAdvice) {
            resultAdvice.innerHTML = messages.advice;
        }

        // 結果セクションを表示
        if (resultSection) {
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    determineResultLevel(totalScore, checkedSymptoms) {
        // 高信頼度症状（生理の遅れ、基礎体温高温継続）のチェック
        const highReliabilitySymptoms = checkedSymptoms.filter(s => s.weight === 3);
        const mediumReliabilitySymptoms = checkedSymptoms.filter(s => s.weight === 2);
        
        if (highReliabilitySymptoms.length >= 2) {
            return 'high';
        } else if (highReliabilitySymptoms.length >= 1 && totalScore >= 5) {
            return 'high';
        } else if (totalScore >= 6 || mediumReliabilitySymptoms.length >= 2) {
            return 'medium';
        } else if (totalScore >= 3) {
            return 'low';
        } else {
            return 'minimal';
        }
    }

    getResultMessages(level) {
        const messages = {
            high: {
                message: `
                    <div class="result-level high">
                        <h4>🔴 妊娠の可能性：高い</h4>
                        <p>選択された症状には、妊娠の初期兆候として医学的に信頼度の高いものが複数含まれています。</p>
                    </div>
                `,
                advice: `
                    <div class="advice-content">
                        <h5>📋 推奨される対応</h5>
                        <ul>
                            <li><strong>妊娠検査薬の使用</strong>：生理予定日の1週間後以降に検査を行ってください</li>
                            <li><strong>医師への相談</strong>：結果に関わらず、産婦人科への受診をお勧めします</li>
                            <li><strong>生活習慣の見直し</strong>：アルコール・喫煙を控え、葉酸サプリメントの摂取を検討してください</li>
                            <li><strong>体調管理</strong>：無理をせず、十分な休息を取りましょう</li>
                        </ul>
                        <div class="important-note">
                            <p><strong>※ この結果は参考情報です。確定診断には医学的検査が必要です。</strong></p>
                        </div>
                    </div>
                `
            },
            medium: {
                message: `
                    <div class="result-level medium">
                        <h4>🟡 妊娠の可能性：中程度</h4>
                        <p>妊娠初期に見られる症状がいくつか確認されました。ただし、これらの症状は他の原因でも起こりうるものです。</p>
                    </div>
                `,
                advice: `
                    <div class="advice-content">
                        <h5>📋 推奨される対応</h5>
                        <ul>
                            <li><strong>経過観察</strong>：症状の変化を注意深く観察してください</li>
                            <li><strong>妊娠検査</strong>：生理予定日を過ぎたら妊娠検査薬を使用してください</li>
                            <li><strong>生活習慣</strong>：妊娠の可能性を考慮し、アルコール等は控えめにしましょう</li>
                            <li><strong>医師相談</strong>：症状が続く場合や不安がある場合は医師にご相談ください</li>
                        </ul>
                        <div class="important-note">
                            <p><strong>※ PMS（月経前症候群）などでも似た症状が現れることがあります。</strong></p>
                        </div>
                    </div>
                `
            },
            low: {
                message: `
                    <div class="result-level low">
                        <h4>🟢 妊娠の可能性：低い</h4>
                        <p>一部の症状が見られますが、妊娠以外の原因による可能性も高いと考えられます。</p>
                    </div>
                `,
                advice: `
                    <div class="advice-content">
                        <h5>📋 推奨される対応</h5>
                        <ul>
                            <li><strong>通常の生活</strong>：普段通りの生活を続けて問題ありません</li>
                            <li><strong>体調管理</strong>：症状が体調不良によるものでないか確認しましょう</li>
                            <li><strong>生理周期の確認</strong>：生理が遅れている場合は、妊娠検査を検討してください</li>
                            <li><strong>健康管理</strong>：バランスの良い食事と適度な運動を心がけましょう</li>
                        </ul>
                        <div class="important-note">
                            <p><strong>※ 症状が軽くても妊娠している可能性はゼロではありません。</strong></p>
                        </div>
                    </div>
                `
            },
            minimal: {
                message: `
                    <div class="result-level minimal">
                        <h4>⚪ 妊娠の可能性：とても低い</h4>
                        <p>現時点では妊娠を示唆する症状はほとんど見られません。</p>
                    </div>
                `,
                advice: `
                    <div class="advice-content">
                        <h5>📋 推奨される対応</h5>
                        <ul>
                            <li><strong>通常の生活</strong>：普段通りの生活を続けてください</li>
                            <li><strong>定期的な健康管理</strong>：一般的な健康管理を継続しましょう</li>
                            <li><strong>妊活中の場合</strong>：排卵日の予測や基礎体温の測定を続けてください</li>
                            <li><strong>生理周期の記録</strong>：今後の参考のため生理周期を記録しておきましょう</li>
                        </ul>
                        <div class="important-note">
                            <p><strong>※ 妊娠初期は症状が全くない場合も多くあります。</strong></p>
                        </div>
                    </div>
                `
            }
        };

        return messages[level] || messages.minimal;
    }

    resetChecker() {
        // 全てのチェックボックスをクリア
        this.symptoms.forEach(symptom => {
            const checkbox = document.getElementById(symptom.id);
            if (checkbox) {
                checkbox.checked = false;
            }
        });

        // 結果セクションを非表示
        const resultSection = document.getElementById('resultSection');
        if (resultSection) {
            resultSection.style.display = 'none';
        }

        // ページトップにスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ページ読み込み時にチェッカーを初期化
document.addEventListener('DOMContentLoaded', function() {
    new PregnancySymptomsChecker();
});

// 教育的なポップアップ機能
function showSymptomInfo(symptomId) {
    const symptomInfos = {
        'symptom1': {
            title: '生理の遅れについて',
            content: `
                <p>妊娠が成立すると、黄体ホルモン（プロゲステロン）の分泌が継続し、子宮内膜が維持されるため生理が来ません。</p>
                <p>ただし、ストレス、体重変化、疾患なども生理の遅れの原因となります。</p>
            `
        },
        'symptom2': {
            title: '基礎体温の高温継続について',
            content: `
                <p>通常、生理前には基礎体温が下がりますが、妊娠すると黄体ホルモンの作用で高温期が続きます。</p>
                <p>18日以上高温期が続く場合は、妊娠の可能性が高いとされています。</p>
            `
        }
        // 他の症状についても同様に追加可能
    };

    const info = symptomInfos[symptomId];
    if (info) {
        alert(`${info.title}\n\n${info.content.replace(/<[^>]*>/g, '')}`);
    }
}

// スムーズスクロール機能
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// 関連ツールへのナビゲーション
function navigateToTool(toolPath) {
    window.location.href = toolPath;
}

// アクセシビリティ向上のためのキーボードナビゲーション
document.addEventListener('keydown', function(event) {
    // Enterキーでチェックボックスの状態を切り替え
    if (event.key === 'Enter' && event.target.tagName === 'LABEL') {
        const checkbox = document.getElementById(event.target.getAttribute('for'));
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
        }
    }
});

// Google Analytics イベント追跡（実装されている場合）
function trackSymptomsCheck(symptomCount, resultLevel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'symptoms_check', {
            'event_category': 'Pregnancy Symptoms Checker',
            'event_label': `Symptoms: ${symptomCount}, Level: ${resultLevel}`,
            'value': symptomCount
        });
    }
} 