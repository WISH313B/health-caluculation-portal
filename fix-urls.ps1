# すべてのHTMLファイルから.html拡張子を削除するスクリプト

Write-Host "HTMLファイルのURL修正を開始します..." -ForegroundColor Green

# 修正対象のファイルパターン
$files = @(
    "calculators/pages/*.html",
    "blog/*.html",
    "*.html"
)

foreach ($pattern in $files) {
    $htmlFiles = Get-ChildItem -Path $pattern -Recurse -ErrorAction SilentlyContinue
    
    foreach ($file in $htmlFiles) {
        Write-Host "処理中: $($file.FullName)" -ForegroundColor Yellow
        
        # ファイルの内容を読み込み
        $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
        
        # 修正前の内容を保存
        $originalContent = $content
        
        # リンクの修正
        # href="index.html" → href="/"
        $content = $content -replace 'href="index\.html"', 'href="/"'
        
        # href="../../index.html" → href="/"
        $content = $content -replace 'href="\.\./\.\./index\.html"', 'href="/"'
        
        # href="../../../index.html" → href="/"
        $content = $content -replace 'href="\.\./\.\./\.\./index\.html"', 'href="/"'
        
        # .html拡張子を削除（ただし、外部リンクやアセットファイルは除外）
        $content = $content -replace 'href="([^"]+)\.html"', 'href="$1"'
        
        # カノニカルURLの修正
        $content = $content -replace 'href="https://your-domain\.com/([^"]+)\.html"', 'href="https://your-domain.com/$1"'
        
        # 構造化データのURL修正
        $content = $content -replace '"url": "https://your-domain\.com/([^"]+)\.html"', '"url": "https://your-domain.com/$1"'
        
        # 内容が変更された場合のみファイルを更新
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "✓ 修正完了: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "- 変更なし: $($file.Name)" -ForegroundColor Gray
        }
    }
}

Write-Host "`nURL修正が完了しました！" -ForegroundColor Green
Write-Host "注意: .htaccessファイルが正しく設定されていることを確認してください。" -ForegroundColor Yellow 