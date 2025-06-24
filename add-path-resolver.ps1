# PowerShellスクリプト: HTMLファイルにpath-resolver.jsを追加

# 処理済みファイルをカウント
$processedFiles = 0
$modifiedFiles = 0

# すべてのHTMLファイルを取得
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $processedFiles++
    Write-Host "Processing: $($file.FullName)"
    
    # ファイルの内容を読み込む
    $content = Get-Content -Path $file.FullName -Raw
    
    # path-resolver.jsがまだ追加されていない場合のみ処理
    if (-not $content.Contains('path-resolver.js')) {
        # ファイルの相対パスを計算
        $fileDir = $file.Directory.FullName
        $rootDir = $PSScriptRoot
        
        # ルートディレクトリからの相対パスを計算
        $relativePath = ""
        if ($fileDir -eq $rootDir) {
            $scriptPath = "path-resolver.js"
        } else {
            $depth = ($fileDir.Substring($rootDir.Length + 1).Split("\")).Length
            $relativePath = "../" * $depth
            $scriptPath = $relativePath + "path-resolver.js"
        }
        
        # スクリプトタグを追加
        $scriptTag = "`n    <!-- パス解決スクリプト -->`n    <script src=`"$scriptPath`"></script>"
        
        # メタタグの後にスクリプトを挿入
        $content = $content -replace '(<meta[^>]*>(?:\s*<!--[^>]*-->)*\s*</head>)', "$scriptTag`n$1"
        
        # 変更を保存
        $content | Set-Content -Path $file.FullName -Force -Encoding UTF8
        $modifiedFiles++
        Write-Host "Modified: $($file.FullName)" -ForegroundColor Green
    } else {
        Write-Host "Skipped (already has path-resolver.js): $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nSummary:"
Write-Host "Processed files: $processedFiles"
Write-Host "Modified files: $modifiedFiles" 