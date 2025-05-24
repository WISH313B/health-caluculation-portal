# PowerShell script to add SEO meta tags to women's health and other calculator HTML files

# 妊娠・女性の健康およびその他の計算機の情報を定義
$calculators = @{
    "pregnancy-due-date" = @{
        "title" = "出産予定日計算機 | 無料で妊娠・分娩予定日を計算 - 健康計算ポータル"
        "description" = "最終月経日から出産予定日を正確に計算。妊娠週数や妊娠カレンダーも表示。無料の出産予定日計算機で妊娠生活をサポートします。"
        "keywords" = "出産予定日計算機,妊娠,分娩,マタニティ,妊娠週数,妊娠カレンダー,女性の健康"
        "app_name" = "出産予定日計算機"
        "app_description" = "妊娠期間と出産予定日を計算し、妊娠生活をサポートするツール"
    }
    "pregnancy-weight" = @{
        "title" = "妊娠中の推奨体重計算機 | 無料で妊婦の適正体重増加を計算 - 健康計算ポータル"
        "description" = "妊娠前のBMIから妊娠中の適正な体重増加量を計算。健康的な妊娠期間を過ごすための体重管理をサポートします。"
        "keywords" = "妊娠中体重計算機,妊婦,体重増加,マタニティ,妊娠,女性の健康,体重管理"
        "app_name" = "妊娠中の推奨体重計算機"
        "app_description" = "妊娠中の適正体重増加を計算し、健康的な妊娠期間をサポートするツール"
    }
    "ovulation" = @{
        "title" = "排卵日計算機 | 無料で排卵日・妊娠しやすい日を計算 - 健康計算ポータル"
        "description" = "生理周期から排卵日と妊娠しやすい期間を計算。妊活や避妊の参考にお使いください。無料の排卵日計算機で女性の健康管理を。"
        "keywords" = "排卵日計算機,排卵日,妊活,生理周期,女性,妊娠しやすい日,女性の健康"
        "app_name" = "排卵日計算機"
        "app_description" = "排卵日と妊娠しやすい期間を計算し、女性の健康管理をサポートするツール"
    }
    "menstrual" = @{
        "title" = "生理周期計算機 | 無料で月経周期・次回生理日を計算 - 健康計算ポータル"
        "description" = "生理開始日と周期から次回の生理予定日を計算。生理周期の管理や体調管理にお役立てください。無料の生理周期計算機で女性の健康を。"
        "keywords" = "生理周期計算機,月経,生理,女性の健康,生理予測,月経周期,女性"
        "app_name" = "生理周期計算機"
        "app_description" = "生理周期を管理し、次回生理日を予測する女性の健康サポートツール"
    }
    "sleep-time" = @{
        "title" = "睡眠時間計算機 | 無料で理想の就寝・起床時間を計算 - 健康計算ポータル"
        "description" = "年齢別の適正睡眠時間や睡眠サイクルから理想の就寝・起床時間を計算。質の良い睡眠で健康的な生活を始めましょう。"
        "keywords" = "睡眠時間計算機,睡眠,休息,就寝時間,起床時間,睡眠サイクル,健康管理"
        "app_name" = "睡眠時間計算機"
        "app_description" = "理想的な睡眠時間と就寝・起床時間を計算し、質の良い睡眠をサポートするツール"
    }
    "water-intake" = @{
        "title" = "必要水分量計算機 | 無料で1日の適正水分摂取量を計算 - 健康計算ポータル"
        "description" = "体重・活動量・気候から1日に必要な水分摂取量を計算。脱水症状の予防や健康維持のための適正な水分補給をサポートします。"
        "keywords" = "水分量計算機,水分補給,水,脱水,健康管理,水分摂取,熱中症予防"
        "app_name" = "必要水分量計算機"
        "app_description" = "1日の適正水分摂取量を計算し、健康的な水分補給をサポートするツール"
    }
    "stress-index" = @{
        "title" = "ストレス指数計算機 | 無料でストレスレベルを診断・計算 - 健康計算ポータル"
        "description" = "生活習慣や心理状態からストレス指数を計算。ストレス解消法やメンタルヘルスケアのアドバイスも提供します。"
        "keywords" = "ストレス指数計算機,ストレス,精神的,心理,メンタルヘルス,ストレス解消,健康管理"
        "app_name" = "ストレス指数計算機"
        "app_description" = "ストレスレベルを診断し、メンタルヘルスケアをサポートするツール"
    }
    "health-age" = @{
        "title" = "健康年齢計算機 | 無料で生活習慣から健康年齢を計算 - 健康計算ポータル"
        "description" = "生活習慣・運動・食事・睡眠などから実年齢との差を表す健康年齢を計算。健康改善のアドバイスも提供します。"
        "keywords" = "健康年齢計算機,健康状態,生活習慣,ヘルス,健康診断,アンチエイジング,健康管理"
        "app_name" = "健康年齢計算機"
        "app_description" = "生活習慣から健康年齢を計算し、健康改善をサポートするツール"
    }
}

Write-Host "女性の健康・その他の計算機にSEOメタタグを追加中..."

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

Write-Host "女性の健康・その他のSEOメタタグ追加完了!" 