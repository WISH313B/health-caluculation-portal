// 妊娠可能性判定ツールのJavaScript

document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    const resultSection = document.getElementById('resultSection');
    
    calculateButton.addEventListener('click', calculatePregnancyPossibility);
    
    function calculatePregnancyPossibility() {
        let totalScore = 0;
        let maxScore = 50; // 最大スコア
        
        // 生理の遅れスコア
        const periodDelay = document.querySelector('input[name="periodDelay"]:checked');
        if (periodDelay) {
            totalScore += parseInt(periodDelay.value);
        }
        
        // 性交渉の有無スコア
        const intercourse = document.querySelector('input[name="intercourse"]:checked');
        if (intercourse) {
            totalScore += parseInt(intercourse.value);
        }
        
        // 症状スコアの合計
        const symptoms = document.querySelectorAll('input[name="symptoms"]:checked');
        symptoms.forEach(symptom => {
            totalScore += parseInt(symptom.value);
        });
        
        // 入力値の検証
        if (!periodDelay || !intercourse) {
            alert('基本情報の質問にすべてお答えください。');
            return;
        }
        
        // 性交渉がない場合の特別処理
        if (intercourse.value === '0') {
            displayResult(0, '性交渉なし');
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        // パーセンテージ計算
        const percentage = Math.min(Math.round((totalScore / maxScore) * 100), 100);
        
        // 結果表示
        displayResult(percentage, '通常判定');
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function displayResult(percentage, type) {
        const resultCard = document.getElementById('resultCard');
        const resultTitle = document.getElementById('resultTitle');
        const resultPercentage = document.getElementById('resultPercentage');
        const resultDescription = document.getElementById('resultDescription');
        const recommendationList = document.getElementById('recommendationList');
        
        // 結果に基づく情報を設定
        let resultInfo = getResultInfo(percentage, type);
        
        // 結果カードのスタイル更新
        resultCard.style.background = resultInfo.gradient;
        
        // 結果表示
        resultTitle.textContent = resultInfo.title;
        resultPercentage.textContent = resultInfo.percentageText;
        resultDescription.innerHTML = resultInfo.description;
        
        // 推奨事項表示
        recommendationList.innerHTML = '';
        resultInfo.recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <i class="${rec.icon}"></i>
                <div class="text">${rec.text}</div>
            `;
            recommendationList.appendChild(item);
        });
    }
    
    function getResultInfo(percentage, type) {
        if (type === '性交渉なし') {
            return {
                title: '妊娠の可能性',
                percentageText: '0%',
                gradient: 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
                description: '性交渉がない場合、妊娠の可能性は基本的にありません。<br>生理の遅れや症状がある場合は、他の原因が考えられます。',
                recommendations: [
                    {
                        icon: 'fas fa-user-md',
                        text: '生理不順や体調不良の原因について医師に相談することをお勧めします'
                    },
                    {
                        icon: 'fas fa-heart',
                        text: 'ストレスや生活習慣の見直しを行いましょう'
                    }
                ]
            };
        }
        
        if (percentage >= 70) {
            return {
                title: '妊娠の可能性',
                percentageText: '高い',
                gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                description: '妊娠の可能性が高いと考えられます。<br>生理の遅れと複数の症状が確認されています。<br><strong>早急に妊娠検査薬での確認をお勧めします。</strong>',
                recommendations: [
                    {
                        icon: 'fas fa-vial',
                        text: '妊娠検査薬を使用して確認してください（生理予定日1週間後以降が推奨）'
                    },
                    {
                        icon: 'fas fa-hospital',
                        text: '陽性の場合は産婦人科を受診して正常妊娠を確認しましょう'
                    },
                    {
                        icon: 'fas fa-pills',
                        text: '葉酸サプリメントの摂取を開始することをお勧めします'
                    },
                    {
                        icon: 'fas fa-ban',
                        text: 'アルコール・喫煙は控えましょう'
                    }
                ]
            };
        } else if (percentage >= 40) {
            return {
                title: '妊娠の可能性',
                percentageText: '中程度',
                gradient: 'linear-gradient(135deg, #f39c12, #e67e22)',
                description: '妊娠の可能性があります。<br>いくつかの症状が確認されていますが、他の原因の可能性もあります。<br><strong>妊娠検査薬での確認をお勧めします。</strong>',
                recommendations: [
                    {
                        icon: 'fas fa-calendar-check',
                        text: '生理予定日から1週間後に妊娠検査薬を使用してください'
                    },
                    {
                        icon: 'fas fa-thermometer-half',
                        text: '基礎体温を測定して高温期の継続を確認しましょう'
                    },
                    {
                        icon: 'fas fa-user-md',
                        text: '症状が続く場合は医師に相談することをお勧めします'
                    },
                    {
                        icon: 'fas fa-heart',
                        text: '健康的な生活習慣を心がけましょう'
                    }
                ]
            };
        } else if (percentage >= 15) {
            return {
                title: '妊娠の可能性',
                percentageText: '低め',
                gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
                description: '現時点では妊娠の可能性は低めです。<br>症状は他の原因による可能性が高いですが、完全に否定はできません。<br>引き続き様子を見守りましょう。',
                recommendations: [
                    {
                        icon: 'fas fa-clock',
                        text: 'もう数日待ってから妊娠検査薬を使用することをお勧めします'
                    },
                    {
                        icon: 'fas fa-notes-medical',
                        text: '症状や生理周期を記録して経過を観察しましょう'
                    },
                    {
                        icon: 'fas fa-spa',
                        text: 'ストレス管理と十分な休息を心がけてください'
                    }
                ]
            };
        } else {
            return {
                title: '妊娠の可能性',
                percentageText: '低い',
                gradient: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                description: '現在の症状からは妊娠の可能性は低いと考えられます。<br>生理の遅れや症状は、ストレスや生活習慣の変化が原因の可能性があります。',
                recommendations: [
                    {
                        icon: 'fas fa-calendar-alt',
                        text: 'さらに生理が遅れる場合は妊娠検査薬を使用してください'
                    },
                    {
                        icon: 'fas fa-user-md',
                        text: '生理不順が続く場合は婦人科医に相談しましょう'
                    },
                    {
                        icon: 'fas fa-heart',
                        text: '規則正しい生活とストレス管理を心がけてください'
                    }
                ]
            };
        }
    }
    
    // 症状チェックボックスの変更を監視して動的に計算（オプション）
    const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]');
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    // リアルタイム更新を無効にしてボタンクリック時のみ計算するようにします
    // この機能が必要な場合は以下のコメントアウトを外してください
    /*
    [...symptomCheckboxes, ...radioButtons].forEach(input => {
        input.addEventListener('change', function() {
            if (resultSection.style.display === 'block') {
                calculatePregnancyPossibility();
            }
        });
    });
    */
}); 