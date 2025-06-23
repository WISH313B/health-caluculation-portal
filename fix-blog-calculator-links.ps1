# ブログ記事内の計算機リンクを修正するスクリプト
$blogFiles = Get-ChildItem "blog/*.html"

foreach ($file in $blogFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 計算機リンクを相対パス + .html拡張子に修正
    $content = $content -replace 'href="/calculators/pages/([^"]+)"', 'href="../calculators/pages/$1.html"'
    
    # 既に.htmlが付いているものは重複を避ける
    $content = $content -replace '\.html\.html"', '.html"'
    
    # ファイルに書き戻し
    Set-Content $file.FullName $content -Encoding UTF8
    Write-Host "修正完了: $($file.Name)"
}

Write-Host "全てのブログ記事の計算機リンクを修正しました。" 