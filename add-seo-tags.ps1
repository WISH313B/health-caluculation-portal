# PowerShell script to add SEO meta tags to calculator HTML files

# 計算機の情報を定義
$calculators = @{
    "ideal-weight" = @{
        "title" = "理想体重計算機 | 無料で理想・標準体重を計算 - 健康計算ポータル"
        "description" = "身長から理想体重・標準体重を瞬時に計算。健康的な体重の範囲や体重管理のアドバイスも提供。無料の理想体重計算機で健康管理を始めましょう。"
        "keywords" = "理想体重計算機,理想体重,標準体重,適正体重,健康管理,ダイエット,体重管理"
        "app_name" = "理想体重計算機"
        "app_description" = "身長から理想体重・標準体重を計算し、健康的な体重管理をサポートするツール"
    }
    "height-prediction" = @{
        "title" = "身長予測計算機 | 子供の将来身長を無料で予測 - 健康計算ポータル"
        "description" = "子供の現在の身長と両親の身長から将来の身長を科学的に予測。成長曲線や身長偏差値も表示。無料の身長予測計算機で子供の成長を見守りましょう。"
        "keywords" = "身長予測計算機,身長予測,将来身長,子供,成長,身長偏差値,成長曲線"
        "app_name" = "身長予測計算機"
        "app_description" = "子供の将来身長を予測し、成長過程をサポートするツール"
    }
    "tdee" = @{
        "title" = "1日の消費カロリー計算機 | 無料でTDEE・代謝を計算 - 健康計算ポータル"
        "description" = "基礎代謝と活動レベルから1日の総消費カロリー（TDEE）を正確に計算。ダイエットや体重維持に必要なカロリーも算出。無料のTDEE計算機で理想の体重管理を。"
        "keywords" = "TDEE計算機,総消費カロリー,1日消費カロリー,代謝,ダイエット,カロリー計算,体重管理"
        "app_name" = "1日の消費カロリー計算機"
        "app_description" = "1日の総消費カロリー（TDEE）を計算し、効果的な体重管理をサポートするツール"
    }
    "meal-calories" = @{
        "title" = "食事カロリー計算機 | 無料で料理・食品のカロリーを計算 - 健康計算ポータル"
        "description" = "様々な食品・料理のカロリーを簡単計算。栄養バランスや1日の摂取カロリーも管理できます。無料の食事カロリー計算機で健康的な食生活を始めましょう。"
        "keywords" = "食事カロリー計算機,食品カロリー,料理カロリー,栄養,ダイエット,食事管理,カロリー表"
        "app_name" = "食事カロリー計算機"
        "app_description" = "食品・料理のカロリーを計算し、健康的な食事管理をサポートするツール"
    }
    "calories-burned" = @{
        "title" = "運動消費カロリー計算機 | 無料で運動・エクササイズのカロリーを計算 - 健康計算ポータル"
        "description" = "様々な運動・エクササイズで消費するカロリーを体重と時間から正確に計算。効果的なダイエット・フィットネスプランの作成にお役立てください。"
        "keywords" = "運動消費カロリー計算機,運動カロリー,エクササイズ,フィットネス,ダイエット,消費カロリー"
        "app_name" = "運動消費カロリー計算機"
        "app_description" = "運動・エクササイズの消費カロリーを計算し、効果的なフィットネスをサポートするツール"
    }
    "one-rep-max" = @{
        "title" = "最大重量(1RM)計算機 | 無料で筋トレの最大挙上重量を計算 - 健康計算ポータル"
        "description" = "現在の挙上重量と回数から1RM（最大挙上重量）を科学的に算出。筋トレプログラムの作成や目標設定に最適。無料の1RM計算機で効果的な筋力トレーニングを。"
        "keywords" = "1RM計算機,最大重量,最大挙上重量,筋トレ,筋力トレーニング,ワンレップマックス,フィットネス"
        "app_name" = "最大重量(1RM)計算機"
        "app_description" = "筋トレの最大挙上重量を計算し、効果的なトレーニングプランをサポートするツール"
    }
    "target-heart-rate" = @{
        "title" = "目標心拍数計算機 | 無料で運動時の最適心拍数を計算 - 健康計算ポータル"
        "description" = "年齢と運動目的から最適な目標心拍数を計算。脂肪燃焼や心肺機能向上に効果的な心拍ゾーンを表示。無料の目標心拍数計算機で効率的な有酸素運動を。"
        "keywords" = "目標心拍数計算機,心拍数,有酸素運動,脂肪燃焼,心拍ゾーン,フィットネス,運動強度"
        "app_name" = "目標心拍数計算機"
        "app_description" = "運動時の最適な目標心拍数を計算し、効果的な有酸素運動をサポートするツール"
    }
    "pace" = @{
        "title" = "ペース計算機 | 無料でランニング・マラソンのペースを計算 - 健康計算ポータル"
        "description" = "距離と時間からランニングペースを計算。マラソンの目標タイムやスプリット計算も可能。無料のペース計算機でランニング・マラソンの目標達成をサポート。"
        "keywords" = "ペース計算機,ランニングペース,マラソン,ジョギング,スプリット,目標タイム,ランニング"
        "app_name" = "ペース計算機"
        "app_description" = "ランニング・マラソンのペースを計算し、目標達成をサポートするツール"
    }
    "exercise-intensity" = @{
        "title" = "運動強度計算機 | 無料で運動負荷・強度を計算 - 健康計算ポータル"
        "description" = "心拍数や体感から運動強度を科学的に算出。適切な運動負荷で効果的なトレーニングを実現。無料の運動強度計算機で安全で効率的な運動を。"
        "keywords" = "運動強度計算機,運動負荷,トレーニング強度,心拍数,運動処方,フィットネス"
        "app_name" = "運動強度計算機"
        "app_description" = "運動強度・負荷を計算し、適切なトレーニングレベルをサポートするツール"
    }
}

Write-Host "SEOメタタグを追加中..."

foreach ($calc in $calculators.Keys) {
    $fileName = "calculators/pages/$calc.html"
    
    if (Test-Path $fileName) {
        Write-Host "Processing: $fileName"
        
        $content = Get-Content $fileName -Raw -Encoding UTF8
        $info = $calculators[$calc]
        
        # SEOメタタグを追加
        $seoTags = @"
    <title>$($info.title)</title>
    
    <!-- SEO メタタグ -->
    <meta name="description" content="$($info.description)">
    <meta name="keywords" content="$($info.keywords)">
    <meta name="author" content="健康計算ポータル">
    
    <!-- Open Graph -->
    <meta property="og:title" content="$($info.title)">
    <meta property="og:description" content="$($info.description)">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://your-domain.com/calculators/pages/$calc.html">
    <meta property="og:image" content="https://your-domain.com/assets/images/$calc-og-image.jpg">
    <meta property="og:site_name" content="健康計算ポータル">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="$($info.title)">
    <meta name="twitter:description" content="$($info.description)">
    <meta name="twitter:image" content="https://your-domain.com/assets/images/$calc-og-image.jpg">
    
    <!-- ファビコン -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- 構造化データ -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "$($info.app_name)",
        "description": "$($info.app_description)",
        "url": "https://your-domain.com/calculators/pages/$calc.html",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
        }
    }
    </script>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="../../assets/css/$calc.css">
"@

        # 古いタイトルとリンクタグを置換
        $content = $content -replace '<title>[^<]*</title>', ''
        $content = $content -replace '<link rel="stylesheet"[^>]*>', ''
        
        # 新しいSEOタグを挿入
        $content = $content -replace '(<meta name="viewport"[^>]*>)', "`$1`n$seoTags"
        
        # パスの修正
        $content = $content -replace 'href="../index.html"', 'href="../../index.html"'
        $content = $content -replace 'src="../search.js"', 'src="../../search.js"'
        $content = $content -replace "src=`"$calc\.js`"", "src=`"../../assets/js/$calc.js`""
        
        Set-Content -Path $fileName -Value $content -Encoding UTF8
    }
}

Write-Host "SEOメタタグ追加完了!" 