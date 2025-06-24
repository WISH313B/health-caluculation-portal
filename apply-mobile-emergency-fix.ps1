# モバイル緊急修正を全ページに適用するスクリプト

Write-Host "モバイル緊急修正を適用中..." -ForegroundColor Green

# 計算機ページに修正を適用
$calculatorPages = Get-ChildItem -Path "calculators\pages" -Filter "*.html"
foreach ($page in $calculatorPages) {
    if ($page.Name -ne "bmi.html") {  # BMIページは既に修正済み
        $content = Get-Content $page.FullName -Raw -Encoding UTF8
        
        # モバイルCSSがまだ追加されていない場合のみ追加
        if ($content -notmatch "mobile-ux-enhancement.css") {
            $content = $content -replace '(\s*<link rel="stylesheet" href="../../assets/css/[^"]+\.css">)', 
                '$1' + "`n    <link rel=`"stylesheet`" href=`"../../mobile-ux-enhancement.css`">" + 
                "`n    <link rel=`"stylesheet`" href=`"../../mobile-emergency-fix.css`">"
            
            Set-Content $page.FullName -Value $content -Encoding UTF8
            Write-Host "修正完了: $($page.Name)" -ForegroundColor Yellow
        } else {
            Write-Host "既に修正済み: $($page.Name)" -ForegroundColor Gray
        }
    }
}

# ブログページに修正を適用
$blogPages = Get-ChildItem -Path "blog" -Filter "*.html"
foreach ($page in $blogPages) {
    if ($page.Name -ne "bmi-guide.html") {  # BMIガイドは既に修正済み
        $content = Get-Content $page.FullName -Raw -Encoding UTF8
        
        # モバイルCSSがまだ追加されていない場合のみ追加
        if ($content -notmatch "mobile-ux-enhancement.css") {
            $content = $content -replace '(\s*<link rel="stylesheet" href="blog-article.css">)', 
                '$1' + "`n    <link rel=`"stylesheet`" href=`"../mobile-ux-enhancement.css`">" + 
                "`n    <link rel=`"stylesheet`" href=`"../mobile-emergency-fix.css`">"
            
            Set-Content $page.FullName -Value $content -Encoding UTF8
            Write-Host "修正完了: $($page.Name)" -ForegroundColor Yellow
        } else {
            Write-Host "既に修正済み: $($page.Name)" -ForegroundColor Gray
        }
    }
}

# メインページ以外のHTMLファイルに修正を適用
$mainPages = @("about.html", "blog.html", "faq.html", "contact.html", "privacy-policy.html", "terms-of-service.html")
foreach ($pageName in $mainPages) {
    if (Test-Path $pageName) {
        $content = Get-Content $pageName -Raw -Encoding UTF8
        
        # モバイルCSSがまだ追加されていない場合のみ追加
        if ($content -notmatch "mobile-ux-enhancement.css") {
            $content = $content -replace '(\s*<link rel="stylesheet" href="style.css">)', 
                '$1' + "`n    <link rel=`"stylesheet`" href=`"mobile-ux-enhancement.css`">" + 
                "`n    <link rel=`"stylesheet`" href=`"mobile-emergency-fix.css`">"
            
            Set-Content $pageName -Value $content -Encoding UTF8
            Write-Host "修正完了: $pageName" -ForegroundColor Yellow
        } else {
            Write-Host "既に修正済み: $pageName" -ForegroundColor Gray
        }
    }
}

Write-Host "全ページのモバイル緊急修正が完了しました！" -ForegroundColor Green
Write-Host "ローカルサーバーでスマホ表示を確認してください。" -ForegroundColor Cyan 