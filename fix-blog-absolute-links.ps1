# ブログファイルの絶対パスリンクを相対パスに修正するスクリプト

Write-Host "ブログファイルの絶対パスリンク修正を開始します..."

$blogFiles = Get-ChildItem -Path "blog\" -Filter "*.html"
Write-Host "対象ファイル数: $($blogFiles.Count)"

foreach ($file in $blogFiles) {
    Write-Host "処理中: $($file.Name)"
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # ヘッダーのホームリンク修正
    $content = $content -replace 'href="/"', 'href="../index.html"'
    
    # ナビゲーションリンク修正
    $content = $content -replace 'href="/blog"', 'href="../blog.html"'
    $content = $content -replace 'href="/faq"', 'href="../faq.html"'
    
    # 変更があった場合のみファイルを更新
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -Encoding UTF8
        Write-Host "  → 修正完了: $($file.Name)"
    } else {
        Write-Host "  → 変更なし: $($file.Name)"
    }
}

Write-Host "全ブログファイルの絶対パスリンク修正が完了しました。" 