# 【緊急】休眠ページ覚醒 - 魅力的なSEOタイトル・メタディスクリプション書き換え

Write-Host "Starting SEO title and meta description enhancement..." -ForegroundColor Green

# pregnancy-due-date.html の改善
Write-Host "Enhancing pregnancy-due-date.html..." -ForegroundColor Yellow
$content = Get-Content "calculators/pages/pregnancy-due-date.html" -Raw -Encoding UTF8

# 既存のタイトルとメタディスクリプションを魅力的に書き換え
$content = $content -replace '<title>出産予定日計算機 - 健康計算ポータル</title>', '<title>【簡単自動】出産予定日計算機｜最終月経日・排卵日から正確に算出 - 妊娠週数も表示</title>'

$content = $content -replace '<meta name="description" content="[^"]*">', '<meta name="description" content="【無料・匿名】最終月経日から出産予定日を自動計算！妊娠週数・トリメスター・重要なマイルストーンも表示。産婦人科医監修の正確な計算式を使用。妊活・妊娠中の方に必須のツール。">'

# OGPタイトルも更新
$content = $content -replace '<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="【簡単自動】出産予定日計算機｜最終月経日・排卵日から正確に算出">'
$content = $content -replace '<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="最終月経日から出産予定日を自動計算！妊娠週数・トリメスター・重要なマイルストーンも表示。産婦人科医監修の正確な計算式。">'

$content | Out-File -FilePath "calculators/pages/pregnancy-due-date.html" -Encoding UTF8 -NoNewline

# tdee.html の改善
Write-Host "Enhancing tdee.html..." -ForegroundColor Yellow
$content = Get-Content "calculators/pages/tdee.html" -Raw -Encoding UTF8

$content = $content -replace '<title>[^<]*</title>', '<title>【2024年最新】TDEE計算機｜1日の消費カロリーを正確算出 - ダイエット成功の必須ツール</title>'

$content = $content -replace '<meta name="description" content="[^"]*">', '<meta name="description" content="【無料・簡単】あなたの1日の総消費カロリー（TDEE）を正確計算！基礎代謝×活動レベルで理想のダイエットカロリーも自動算出。管理栄養士監修。痩せたい・体重維持したい方必見のツール。">'

$content = $content -replace '<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="【2024年最新】TDEE計算機｜1日の消費カロリーを正確算出">'
$content = $content -replace '<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="あなたの1日の総消費カロリー（TDEE）を正確計算！基礎代謝×活動レベルで理想のダイエットカロリーも自動算出。">'

$content | Out-File -FilePath "calculators/pages/tdee.html" -Encoding UTF8 -NoNewline

# bmi.html の改善
Write-Host "Enhancing bmi.html..." -ForegroundColor Yellow
$content = Get-Content "calculators/pages/bmi.html" -Raw -Encoding UTF8

$content = $content -replace '<title>[^<]*</title>', '<title>【診断結果で健康状態丸わかり】BMI計算機｜適正体重・肥満度を瞬時判定 - 医師監修</title>'

$content = $content -replace '<meta name="description" content="[^"]*">', '<meta name="description" content="【無料・瞬時】身長・体重からBMI・適正体重を自動計算！あなたの肥満度・健康リスクを医師監修の基準で正確判定。理想体重の範囲・改善アドバイスも表示。ダイエット開始前に必須チェック！">'

$content = $content -replace '<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="【診断結果で健康状態丸わかり】BMI計算機｜適正体重・肥満度を瞬時判定">'
$content = $content -replace '<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="身長・体重からBMI・適正体重を自動計算！肥満度・健康リスクを医師監修の基準で正確判定。理想体重の範囲・改善アドバイスも表示。">'

$content | Out-File -FilePath "calculators/pages/bmi.html" -Encoding UTF8 -NoNewline

# body-fat.html の改善
Write-Host "Enhancing body-fat.html..." -ForegroundColor Yellow
$content = Get-Content "calculators/pages/body-fat.html" -Raw -Encoding UTF8

$content = $content -replace '<title>[^<]*</title>', '<title>【隠れ肥満も発見】体脂肪率計算機｜年齢・性別別の理想値と比較 - トレーナー監修</title>'

$content = $content -replace '<meta name="description" content="[^"]*">', '<meta name="description" content="【無料・高精度】身長・体重・年齢から体脂肪率を正確計算！あなたの体脂肪が理想的かを年齢・性別別の基準で判定。隠れ肥満の発見にも。フィットネストレーナー監修の信頼できる計算式を使用。">'

$content = $content -replace '<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="【隠れ肥満も発見】体脂肪率計算機｜年齢・性別別の理想値と比較">'
$content = $content -replace '<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="身長・体重・年齢から体脂肪率を正確計算！年齢・性別別の基準で判定。隠れ肥満の発見にも。フィットネストレーナー監修。">'

$content | Out-File -FilePath "calculators/pages/body-fat.html" -Encoding UTF8 -NoNewline

# meal-calories.html の改善
Write-Host "Enhancing meal-calories.html..." -ForegroundColor Yellow
$content = Get-Content "calculators/pages/meal-calories.html" -Raw -Encoding UTF8

$content = $content -replace '<title>[^<]*</title>', '<title>【料理名で検索】食事カロリー計算機｜2万品目対応 - ダイエット食事管理の決定版</title>'

$content = $content -replace '<meta name="description" content="[^"]*">', '<meta name="description" content="【無料・2万品目対応】料理名を入力するだけで正確なカロリーを瞬時表示！外食・コンビニ・手料理すべて対応。栄養成分（タンパク質・脂質・炭水化物）も表示。管理栄養士監修のダイエット必須ツール。">'

$content = $content -replace '<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="【料理名で検索】食事カロリー計算機｜2万品目対応">'
$content = $content -replace '<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="料理名を入力するだけで正確なカロリーを瞬時表示！外食・コンビニ・手料理すべて対応。栄養成分も表示。管理栄養士監修。">'

$content | Out-File -FilePath "calculators/pages/meal-calories.html" -Encoding UTF8 -NoNewline

Write-Host "SEO enhancement completed! All titles and meta descriptions have been optimized for higher click-through rates." -ForegroundColor Green 