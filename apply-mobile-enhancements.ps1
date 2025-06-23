# 🚀 モバイルUX爆上げ適用スクリプト

Write-Host "Starting mobile UX enhancement application..." -ForegroundColor Green

# 適用対象の計算機ページ
$targetPages = @(
    "calculators/pages/pregnancy-due-date.html",
    "calculators/pages/tdee.html", 
    "calculators/pages/bmi.html",
    "calculators/pages/body-fat.html",
    "calculators/pages/meal-calories.html",
    "calculators/pages/bmr.html",
    "calculators/pages/ovulation.html",
    "calculators/pages/menstrual.html"
)

foreach ($page in $targetPages) {
    if (Test-Path $page) {
        Write-Host "Enhancing mobile UX for $page..." -ForegroundColor Yellow
        
        $content = Get-Content $page -Raw -Encoding UTF8
        
        # モバイルUX強化CSSを追加
        $cssLink = '<link rel="stylesheet" href="../../mobile-ux-enhancement.css">'
        
        # </head> タグの直前に挿入
        if ($content -match '</head>') {
            $content = $content -replace '</head>', "$cssLink`n</head>"
        }
        
        # viewport metaタグを最新版に更新
        $content = $content -replace '<meta name="viewport" content="[^"]*">', '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">'
        
        # PWA対応のtheme-colorを追加
        if ($content -notmatch 'theme-color') {
            $themeColorMeta = '<meta name="theme-color" content="#007bff">'
            $content = $content -replace '</head>', "$themeColorMeta`n</head>"
        }
        
        # タップハイライト色を設定
        $tapHighlight = '<meta name="msapplication-tap-highlight" content="no">'
        $content = $content -replace '</head>', "$tapHighlight`n</head>"
        
        $content | Out-File -FilePath $page -Encoding UTF8 -NoNewline
        
        Write-Host "✅ Enhanced: $page" -ForegroundColor Green
    } else {
        Write-Host "⚠️  File not found: $page" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Mobile UX enhancement completed for all target pages!" -ForegroundColor Green
Write-Host "📱 Features added:" -ForegroundColor Cyan
Write-Host "   • Large touch targets (56px minimum)" -ForegroundColor White
Write-Host "   • Improved readability (16px+ font)" -ForegroundColor White  
Write-Host "   • Enhanced visual feedback" -ForegroundColor White
Write-Host "   • Optimized spacing and layout" -ForegroundColor White
Write-Host "   • PWA-ready meta tags" -ForegroundColor White 