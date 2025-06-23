# SEO最適化：canonical URL設定スクリプト
# 全HTMLファイルに正規URL（拡張子なし）のcanonicalタグを追加

Write-Host "Adding canonical tags for SEO optimization..." -ForegroundColor Green

# 基本URL（実際のドメインに変更してください）
$baseURL = "https://minna-no-kenko.com"

# HTMLファイル一覧を取得
$htmlFiles = Get-ChildItem -Path "." -Recurse -Include "*.html"

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 相対パスから正規URLを生成
    $relativePath = $file.FullName -replace [regex]::Escape($PWD.Path + "\"), ""
    $relativePath = $relativePath -replace "\\", "/"
    $relativePath = $relativePath -replace "\.html$", ""
    
    # インデックスファイルの処理
    if ($relativePath -eq "index") {
        $canonicalURL = $baseURL
    } else {
        $canonicalURL = "$baseURL/$relativePath"
    }
    
    # 既存のcanonicalタグを削除
    $content = $content -replace '<link\s+rel="canonical"[^>]*>', ''
    
    # 新しいcanonicalタグを</head>の直前に挿入
    if ($content -match '</head>') {
        $canonicalTag = "    <link rel=`"canonical`" href=`"$canonicalURL`">`r`n</head>"
        $content = $content -replace '</head>', $canonicalTag
        
        Write-Host "Added canonical: $canonicalURL" -ForegroundColor Green
    } else {
        Write-Host "Warning: No </head> tag found in $($file.Name)" -ForegroundColor Red
    }
    
    # 変更があった場合のみファイルを保存
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "Canonical tag optimization completed!" -ForegroundColor Green
Write-Host "All pages now have proper canonical URLs without .html extension" -ForegroundColor Cyan 