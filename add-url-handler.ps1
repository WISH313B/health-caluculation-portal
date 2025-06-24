# HTMLファイルにurl-handler.jsスクリプトを追加するスクリプト

# 相対パスを計算する関数
function Get-RelativePath {
    param (
        [string]$filePath
    )
    
    # ファイルの深さを計算
    $depth = ($filePath.Split([IO.Path]::DirectorySeparatorChar) | Measure-Object).Count - 1
    
    # ルートからの相対パスを構築
    if ($depth -eq 1) {
        return "assets/js/url-handler.js"
    } else {
        return "../" * ($depth - 1) + "assets/js/url-handler.js"
    }
}

# すべてのHTMLファイルを取得
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # ファイルの内容を読み込む
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # すでにスクリプトが追加されているかチェック
    if ($content -match "url-handler\.js") {
        Write-Host "Script already exists in $($file.Name), skipping..."
        continue
    }
    
    # 相対パスを計算
    $relativePath = Get-RelativePath -filePath $file.FullName
    
    # スクリプトタグを作成
    $scriptTag = "`n    <script src=`"$relativePath`"></script>"
    
    # </head>タグの前にスクリプトを挿入
    $content = $content -replace "</head>", "$scriptTag`n</head>"
    
    # ファイルを保存（UTF8エンコーディングを維持）
    $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
    
    Write-Host "Added url-handler.js to $($file.Name)"
}

Write-Host "`nScript completed. All HTML files have been updated." 