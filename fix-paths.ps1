# PowerShell script to fix file paths in calculator HTML files

Write-Host "計算機ページのパスを修正中..."

# Get all HTML files in calculators/pages directory
$htmlFiles = Get-ChildItem -Path "calculators/pages/*.html" -File

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)"
    
    # Read file content
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Fix CSS and JS paths
    $content = $content -replace 'href="../style.css"', 'href="../../style.css"'
    $content = $content -replace 'href="([^"]+)\.css"', 'href="../../assets/css/$1.css"'
    $content = $content -replace 'src="../search.js"', 'src="../../search.js"'
    $content = $content -replace 'src="([^"]+)\.js"', 'src="../../assets/js/$1.js"'
    $content = $content -replace 'href="../index.html"', 'href="../../index.html"'
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

Write-Host "パス修正完了!" 