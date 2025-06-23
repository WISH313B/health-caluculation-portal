# SEO最適化：内部リンク正規化スクリプト
# 全ての内部リンクを拡張子なしの正規URLに統一

Write-Host "Normalizing internal links to canonical URLs..." -ForegroundColor Green

$htmlFiles = Get-ChildItem -Path "." -Recurse -Include "*.html"

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 1. ホームページリンクの正規化
    $content = $content -replace 'href="index\.html"', 'href="/"'
    $content = $content -replace 'href="\.\./index\.html"', 'href="/"'
    $content = $content -replace 'href="\.\./\.\./index\.html"', 'href="/"'
    
    # 2. メインページリンクの正規化
    $content = $content -replace 'href="blog\.html"', 'href="/blog"'
    $content = $content -replace 'href="faq\.html"', 'href="/faq"'
    $content = $content -replace 'href="privacy-policy\.html"', 'href="/privacy-policy"'
    $content = $content -replace 'href="terms-of-service\.html"', 'href="/terms-of-service"'
    
    # blog/内ファイルからの相対リンク修正
    if ($file.FullName -like "*\blog\*" -and $file.Name -ne "blog.html") {
        $content = $content -replace 'href="\.\./blog\.html"', 'href="/blog"'
        $content = $content -replace 'href="\.\./faq\.html"', 'href="/faq"'
        $content = $content -replace 'href="\.\./privacy-policy\.html"', 'href="/privacy-policy"'
        $content = $content -replace 'href="\.\./terms-of-service\.html"', 'href="/terms-of-service"'
    }
    
    # calculators/pages/内ファイルからの相対リンク修正
    if ($file.FullName -like "*\calculators\pages\*") {
        $content = $content -replace 'href="\.\./\.\./blog\.html"', 'href="/blog"'
        $content = $content -replace 'href="\.\./\.\./faq\.html"', 'href="/faq"'
        $content = $content -replace 'href="\.\./\.\./privacy-policy\.html"', 'href="/privacy-policy"'
        $content = $content -replace 'href="\.\./\.\./terms-of-service\.html"', 'href="/terms-of-service"'
    }
    
    # 3. 計算機ページリンクの正規化
    $content = $content -replace 'href="calculators/pages/([^"]+)\.html"', 'href="/calculators/pages/$1"'
    
    # 4. ブログ記事リンクの正規化
    $content = $content -replace 'href="blog/([^"]+)\.html"', 'href="/blog/$1"'
    
    # 5. OGPとメタタグのURL正規化
    $content = $content -replace 'content="[^"]*\.html"', { 
        param($match)
        $url = $match.Value -replace '\.html"', '"'
        return $url
    }
    
    # 変更があった場合のみファイルを保存
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "No changes: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "Internal link normalization completed!" -ForegroundColor Green
Write-Host "All internal links now use canonical URLs without .html extension" -ForegroundColor Cyan 