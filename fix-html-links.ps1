# HTMLファイルのリンクを.html付きに戻すスクリプト

Write-Host "HTMLファイルのリンクを.html付きに修正中..." -ForegroundColor Green

# 処理済みファイルをカウント
$processedFiles = 0
$modifiedFiles = 0

# 対象となる全てのHTMLファイルを取得
$htmlFiles = Get-ChildItem -Path "." -Recurse -Include "*.html" | Where-Object { $_.Name -ne "404.html" }

foreach ($file in $htmlFiles) {
    $processedFiles++
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # ファイルの相対的な深さを計算
    $depth = ($file.FullName.Substring($PSScriptRoot.Length + 1).Split("\") | Where-Object { $_ -ne "" }).Count - 1
    $relativePrefix = "../" * $depth
    
    if ($depth -eq 0) {
        $relativePrefix = ""
    }
    
    # ホームリンクを相対パスに変換
    if ($content -match 'href="/"') {
        $content = $content -replace 'href="/"', "href=`"${relativePrefix}index.html`""
        $modified = $true
    }
    
    if ($content -match 'href="/index.html"') {
        $content = $content -replace 'href="/index.html"', "href=`"${relativePrefix}index.html`""
        $modified = $true
    }
    
    # ブログページへのリンクを修正
    $content = $content -replace 'href="/blog"', 'href="blog.html"'
    
    # FAQページへのリンクを修正
    $content = $content -replace 'href="/faq"', 'href="faq.html"'
    
    # プライバシーポリシーへのリンクを修正
    $content = $content -replace 'href="/privacy-policy"', 'href="privacy-policy.html"'
    
    # 利用規約へのリンクを修正
    $content = $content -replace 'href="/terms-of-service"', 'href="terms-of-service.html"'
    
    # calculators/pages/内のファイルからの相対パス修正
    if ($file.FullName -like "*calculators\pages\*") {
        $content = $content -replace 'href="index\.html"', 'href="../../index.html"'
        $content = $content -replace 'href="blog\.html"', 'href="../../blog.html"'
        $content = $content -replace 'href="faq\.html"', 'href="../../faq.html"'
        $content = $content -replace 'href="privacy-policy\.html"', 'href="../../privacy-policy.html"'
        $content = $content -replace 'href="terms-of-service\.html"', 'href="../../terms-of-service.html"'
    }
    
    # blog/内のファイルからの相対パス修正
    if ($file.FullName -like "*blog\*" -and $file.Name -ne "blog.html") {
        $content = $content -replace 'href="index\.html"', 'href="../index.html"'
        $content = $content -replace 'href="blog\.html"', 'href="../blog.html"'
        $content = $content -replace 'href="faq\.html"', 'href="../faq.html"'
        $content = $content -replace 'href="privacy-policy\.html"', 'href="../privacy-policy.html"'
        $content = $content -replace 'href="terms-of-service\.html"', 'href="../terms-of-service.html"'
    }
    
    # 内容が変更された場合のみファイルを保存
    if ($content -ne $originalContent) {
        $modifiedFiles++
        Write-Host "Modifying: $($file.FullName)"
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "✓ 修正完了: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "○ 変更なし: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "Processed $processedFiles files, modified $modifiedFiles files."
Write-Host "`n全ての修正が完了しました！" -ForegroundColor Green
Write-Host "これで、ローカルでもウェブでも正常に動作するはずです。" -ForegroundColor Cyan 