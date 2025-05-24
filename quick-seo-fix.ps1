# Quick SEO fix for remaining calculator pages

$pages = @(
    "height-prediction", "tdee", "meal-calories", "calories-burned",
    "one-rep-max", "target-heart-rate", "pace", "exercise-intensity",
    "pregnancy-due-date", "pregnancy-weight", "ovulation", "menstrual",
    "sleep-time", "water-intake", "stress-index", "health-age"
)

Write-Host "残りのページを一括修正中..."

foreach ($page in $pages) {
    $file = "calculators/pages/$page.html"
    
    if (Test-Path $file) {
        Write-Host "Processing: $file"
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Fix broken paths
        $content = $content -replace 'href="../../assets/css/https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"', 'href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"'
        $content = $content -replace 'href="../../assets/css/../../style.css"', 'href="../../style.css"'
        $content = $content -replace 'href="../../assets/css/\./', 'href="../../assets/css/'
        $content = $content -replace 'src="../../assets/js/../../search.js"', 'src="../../search.js"'
        $content = $content -replace 'src="../../assets/js/\./', 'src="../../assets/js/'
        
        # Add basic SEO meta description
        if ($content -notmatch '<meta name="description"') {
            $content = $content -replace '(<meta name="viewport"[^>]*>)', '$1
    <meta name="description" content="健康計算ポータルの計算機で健康管理をサポート。BMI、体脂肪率、カロリー計算など20種類以上の健康ツールを無料で提供。">
    <meta name="keywords" content="健康計算機,BMI,体脂肪率,カロリー計算,健康管理,ダイエット,フィットネス">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">'
        }
        
        Set-Content -Path $file -Value $content -Encoding UTF8
    }
}

Write-Host "一括修正完了!" 