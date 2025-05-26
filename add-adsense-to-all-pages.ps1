# Google AdSenseスクリプトをすべてのHTMLファイルに追加するスクリプト
# 既存のデザインや形式に影響を与えずに追加

# AdSenseスクリプトの定義
$adsenseScript = @"
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1741576930615169"
     crossorigin="anonymous"></script>
"@

# 現在のディレクトリとサブディレクトリからすべてのHTMLファイルを取得
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Recurse

Write-Host "HTMLファイルの処理を開始します..." -ForegroundColor Green

foreach ($file in $htmlFiles) {
    Write-Host "処理中: $($file.FullName)" -ForegroundColor Yellow
    
    # ファイルの内容を読み込み
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 既にAdSenseスクリプトが含まれているかチェック
    if ($content -match "pagead2\.googlesyndication\.com") {
        Write-Host "  → 既にAdSenseスクリプトが含まれています。スキップします。" -ForegroundColor Cyan
        continue
    }
    
    # <title>タグの後にAdSenseスクリプトを挿入
    if ($content -match "(<title>.*?</title>)") {
        $newContent = $content -replace "(<title>.*?</title>)", "`$1`n$adsenseScript"
        
        # ファイルに書き戻し（UTF-8エンコーディング）
        $newContent | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        
        Write-Host "  → AdSenseスクリプトを追加しました。" -ForegroundColor Green
    } else {
        Write-Host "  → <title>タグが見つかりませんでした。スキップします。" -ForegroundColor Red
    }
}

Write-Host "`nすべてのHTMLファイルの処理が完了しました。" -ForegroundColor Green
Write-Host "AdSenseスクリプトがすべてのページに適用されました。" -ForegroundColor Green 