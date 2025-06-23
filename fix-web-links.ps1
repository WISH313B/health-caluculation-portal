# ウェブ用：拡張子なしリンクに修正

Write-Host "Converting links to clean URLs for web..." -ForegroundColor Green

$htmlFiles = Get-ChildItem -Path "." -Recurse -Include "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # メインページリンクを拡張子なしに変更
    $content = $content -replace 'href="index\.html"', 'href="/"'
    $content = $content -replace 'href="\.\./index\.html"', 'href="/"'
    $content = $content -replace 'href="\.\./\.\./index\.html"', 'href="/"'
    
    $content = $content -replace 'href="blog\.html"', 'href="/blog"'
    $content = $content -replace 'href="faq\.html"', 'href="/faq"'
    $content = $content -replace 'href="privacy-policy\.html"', 'href="/privacy-policy"'
    $content = $content -replace 'href="terms-of-service\.html"', 'href="/terms-of-service"'
    
    # 相対パスからの修正
    $content = $content -replace 'href="\.\./blog\.html"', 'href="/blog"'
    $content = $content -replace 'href="\.\./faq\.html"', 'href="/faq"'
    $content = $content -replace 'href="\.\./privacy-policy\.html"', 'href="/privacy-policy"'
    $content = $content -replace 'href="\.\./terms-of-service\.html"', 'href="/terms-of-service"'
    
    $content = $content -replace 'href="\.\./\.\./blog\.html"', 'href="/blog"'
    $content = $content -replace 'href="\.\./\.\./faq\.html"', 'href="/faq"'
    $content = $content -replace 'href="\.\./\.\./privacy-policy\.html"', 'href="/privacy-policy"'
    $content = $content -replace 'href="\.\./\.\./terms-of-service\.html"', 'href="/terms-of-service"'
    
    # 計算機リンクを拡張子なしに変更
    $content = $content -replace 'href="calculators/pages/([^"]+)\.html"', 'href="/calculators/pages/$1"'
    
    # ブログリンクを拡張子なしに変更
    $content = $content -replace 'href="blog/([^"]+)\.html"', 'href="/blog/$1"'
    
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "All links converted to clean URLs!" -ForegroundColor Green
Write-Host "Website should now work properly on web server!" -ForegroundColor Cyan 