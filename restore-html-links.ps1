# シンプル解決策：全リンクを.html付きに戻す

Write-Host "Restoring all links to .html format..." -ForegroundColor Green

$htmlFiles = Get-ChildItem -Path "." -Recurse -Include "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # ホームページリンクを修正
    $content = $content -replace 'href="/"', 'href="index.html"'
    
    # メインページリンクを修正
    $content = $content -replace 'href="/blog"', 'href="blog.html"'
    $content = $content -replace 'href="/faq"', 'href="faq.html"'
    $content = $content -replace 'href="/privacy-policy"', 'href="privacy-policy.html"'
    $content = $content -replace 'href="/terms-of-service"', 'href="terms-of-service.html"'
    
    # 計算機リンクを修正
    $content = $content -replace 'href="/calculators/pages/([^"]+)"', 'href="calculators/pages/$1.html"'
    
    # ブログリンクを修正
    $content = $content -replace 'href="/blog/([^"]+)"', 'href="blog/$1.html"'
    
    # 相対パス修正（calculators/pages/内のファイル）
    if ($file.FullName -like "*calculators\pages\*") {
        $content = $content -replace 'href="index\.html"', 'href="../../index.html"'
        $content = $content -replace 'href="blog\.html"', 'href="../../blog.html"'
        $content = $content -replace 'href="faq\.html"', 'href="../../faq.html"'
        $content = $content -replace 'href="privacy-policy\.html"', 'href="../../privacy-policy.html"'
        $content = $content -replace 'href="terms-of-service\.html"', 'href="../../terms-of-service.html"'
    }
    
    # 相対パス修正（blog/内のファイル）
    if ($file.FullName -like "*\blog\*" -and $file.Name -ne "blog.html") {
        $content = $content -replace 'href="index\.html"', 'href="../index.html"'
        $content = $content -replace 'href="blog\.html"', 'href="../blog.html"'
        $content = $content -replace 'href="faq\.html"', 'href="../faq.html"'
        $content = $content -replace 'href="privacy-policy\.html"', 'href="../privacy-policy.html"'
        $content = $content -replace 'href="terms-of-service\.html"', 'href="../terms-of-service.html"'
    }
    
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "All links restored to .html format!" -ForegroundColor Green
Write-Host "Website should now work on both local and web!" -ForegroundColor Cyan 