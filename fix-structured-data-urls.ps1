# 構造化データとOGPのURL修正スクリプト

Write-Host "Fixing structured data and OGP URLs..." -ForegroundColor Green

$htmlFiles = Get-ChildItem -Path "." -Recurse -Include "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 構造化データのURL修正
    $content = $content -replace '"url":\s*"([^"]+)\.html"', '"url": "$1"'
    
    # OGP URLの修正
    $content = $content -replace 'property="og:url"\s+content="([^"]+)\.html"', 'property="og:url" content="$1"'
    
    # ドメインをminna-no-kenko.comに統一
    $content = $content -replace 'https://your-domain\.com', 'https://minna-no-kenko.com'
    
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Structured data and OGP URL fixes completed!" -ForegroundColor Green 