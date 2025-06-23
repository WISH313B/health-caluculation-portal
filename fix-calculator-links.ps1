# 計算機リンクを.html付きに修正するスクリプト

Write-Host "計算機リンクを.html付きに修正中..." -ForegroundColor Green

# 対象となる全てのHTMLファイルを取得
$htmlFiles = Get-ChildItem -Path "." -Recurse -Include "*.html"

foreach ($file in $htmlFiles) {
    Write-Host "修正中: $($file.FullName)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 計算機ページへのリンクを修正
    $content = $content -replace 'href="calculators/pages/bmi"', 'href="calculators/pages/bmi.html"'
    $content = $content -replace 'href="calculators/pages/bmr"', 'href="calculators/pages/bmr.html"'
    $content = $content -replace 'href="calculators/pages/body-fat"', 'href="calculators/pages/body-fat.html"'
    $content = $content -replace 'href="calculators/pages/calories-burned"', 'href="calculators/pages/calories-burned.html"'
    $content = $content -replace 'href="calculators/pages/exercise-intensity"', 'href="calculators/pages/exercise-intensity.html"'
    $content = $content -replace 'href="calculators/pages/height-prediction"', 'href="calculators/pages/height-prediction.html"'
    $content = $content -replace 'href="calculators/pages/ideal-weight"', 'href="calculators/pages/ideal-weight.html"'
    $content = $content -replace 'href="calculators/pages/meal-calories"', 'href="calculators/pages/meal-calories.html"'
    $content = $content -replace 'href="calculators/pages/menstrual"', 'href="calculators/pages/menstrual.html"'
    $content = $content -replace 'href="calculators/pages/one-rep-max"', 'href="calculators/pages/one-rep-max.html"'
    $content = $content -replace 'href="calculators/pages/ovulation"', 'href="calculators/pages/ovulation.html"'
    $content = $content -replace 'href="calculators/pages/pace"', 'href="calculators/pages/pace.html"'
    $content = $content -replace 'href="calculators/pages/pregnancy-due-date"', 'href="calculators/pages/pregnancy-due-date.html"'
    $content = $content -replace 'href="calculators/pages/pregnancy-weight"', 'href="calculators/pages/pregnancy-weight.html"'
    $content = $content -replace 'href="calculators/pages/sleep-time"', 'href="calculators/pages/sleep-time.html"'
    $content = $content -replace 'href="calculators/pages/stress-index"', 'href="calculators/pages/stress-index.html"'
    $content = $content -replace 'href="calculators/pages/target-heart-rate"', 'href="calculators/pages/target-heart-rate.html"'
    $content = $content -replace 'href="calculators/pages/tdee"', 'href="calculators/pages/tdee.html"'
    $content = $content -replace 'href="calculators/pages/water-intake"', 'href="calculators/pages/water-intake.html"'
    $content = $content -replace 'href="calculators/pages/health-age"', 'href="calculators/pages/health-age.html"'
    
    # ブログリンクも修正
    $content = $content -replace 'href="blog/bmi-guide"', 'href="blog/bmi-guide.html"'
    $content = $content -replace 'href="blog/bmr-guide"', 'href="blog/bmr-guide.html"'
    $content = $content -replace 'href="blog/body-fat-reduction-guide"', 'href="blog/body-fat-reduction-guide.html"'
    $content = $content -replace 'href="blog/calorie-calculation-guide"', 'href="blog/calorie-calculation-guide.html"'
    $content = $content -replace 'href="blog/heart-rate-training-guide"', 'href="blog/heart-rate-training-guide.html"'
    $content = $content -replace 'href="blog/hydration-guide"', 'href="blog/hydration-guide.html"'
    $content = $content -replace 'href="blog/nutrition-balance-guide"', 'href="blog/nutrition-balance-guide.html"'
    $content = $content -replace 'href="blog/ovulation-prediction-guide"', 'href="blog/ovulation-prediction-guide.html"'
    $content = $content -replace 'href="blog/pregnancy-weight-guide"', 'href="blog/pregnancy-weight-guide.html"'
    $content = $content -replace 'href="blog/sleep-optimization-guide"', 'href="blog/sleep-optimization-guide.html"'
    
    # 内容が変更された場合のみファイルを保存
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "修正完了: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "変更なし: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "計算機リンクの修正が完了しました！" -ForegroundColor Green 