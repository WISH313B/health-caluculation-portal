# PowerShellスクリプト: HTMLファイル内のリンクを絶対パスに正規化

# 処理済みファイルをカウント
$processedFiles = 0
$modifiedFiles = 0

# すべてのHTMLファイルを取得
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $processedFiles++
    Write-Host "Processing: $($file.FullName)"
    
    # ファイルの内容を読み込む
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    # index.htmlへのリンクを/に変換
    if ($content -match 'href="index.html"') {
        $content = $content -replace 'href="index.html"', 'href="/"'
        $modified = $true
    }
    
    # 相対パスを絶対パスに変換
    $patterns = @(
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)calculators/pages/',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)blog/',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)assets/',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)components/',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)styles/',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)about.html"',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)contact.html"',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)faq.html"',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)privacy-policy.html"',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)terms-of-service.html"',
        'href="(?!/)(?!http)(?!#)(?!javascript)(?!mailto)(?!tel)blog.html"'
    )
    
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            $content = $content -replace $pattern, 'href="/'
            $modified = $true
        }
    }
    
    # 変更があった場合のみファイルを更新
    if ($modified) {
        $content | Set-Content -Path $file.FullName -Force -Encoding UTF8
        $modifiedFiles++
        Write-Host "Modified: $($file.FullName)" -ForegroundColor Green
    } else {
        Write-Host "No changes needed: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nSummary:"
Write-Host "Processed files: $processedFiles"
Write-Host "Modified files: $modifiedFiles" 