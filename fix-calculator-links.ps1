# 計算機リンクの.html拡張子を削除するスクリプト

# 対象ディレクトリの設定
$directories = @(
    "blog",
    "calculators/pages",
    "templates"
)

# 対象ファイルの拡張子
$fileExtensions = @("*.html")

foreach ($dir in $directories) {
    Write-Host "Processing directory: $dir"
    
    # 各ディレクトリ内のHTMLファイルを取得
    Get-ChildItem -Path $dir -Include $fileExtensions -Recurse | ForEach-Object {
        $filePath = $_.FullName
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 計算機リンクのパターンを修正
        $modified = $content -replace '(href="[^"]*?calculators/pages/[^"]*?)\.html"', '$1"'
        
        # 変更があった場合のみファイルを更新
        if ($modified -ne $content) {
            Write-Host "Fixing calculator links in: $filePath"
            $modified | Set-Content $filePath -Encoding UTF8
        }
    }
}

Write-Host "Calculator link fixes completed!" 