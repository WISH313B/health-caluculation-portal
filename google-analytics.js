// Google Analytics 4 設定
// 健康計算ポータル専用設定

// GA4初期化
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// 基本設定（実際のGA4測定IDに置き換えてください）
gtag('config', 'G-XXXXXXXXXX', {
    // プライバシー設定
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    
    // カスタムディメンション
    custom_map: {
        'custom_parameter_1': 'calculator_type',
        'custom_parameter_2': 'user_goal',
        'custom_parameter_3': 'calculation_result'
    },
    
    // サイト検索設定
    site_search_query_parameter: 'q',
    
    // eコマース設定（無料サービスでも有用）
    send_page_view: true
});

// カスタムイベント設定
function trackCalculatorUsage(calculatorType, userGoal = null) {
    gtag('event', 'calculator_usage', {
        'event_category': 'Health Calculator',
        'event_label': calculatorType,
        'calculator_type': calculatorType,
        'user_goal': userGoal,
        'value': 1
    });
}

function trackCalculationResult(calculatorType, result, isHealthy = null) {
    gtag('event', 'calculation_completed', {
        'event_category': 'Health Calculator',
        'event_label': calculatorType,
        'calculator_type': calculatorType,
        'calculation_result': result,
        'is_healthy_range': isHealthy,
        'value': 1
    });
}

function trackSearchUsage(searchTerm, resultsCount) {
    gtag('event', 'search', {
        'search_term': searchTerm,
        'results_count': resultsCount
    });
}

function trackUserEngagement(engagementType, details = null) {
    gtag('event', 'user_engagement', {
        'event_category': 'User Interaction',
        'event_label': engagementType,
        'engagement_details': details,
        'value': 1
    });
}

// コンバージョン設定（目標達成）
function trackGoalCompletion(goalType, calculatorType = null) {
    gtag('event', 'conversion', {
        'event_category': 'Goal Completion',
        'event_label': goalType,
        'calculator_type': calculatorType,
        'value': 1
    });
}

// ページビュー拡張
function trackEnhancedPageView(pageTitle, pageLocation, contentGroup = null) {
    gtag('event', 'page_view', {
        'page_title': pageTitle,
        'page_location': pageLocation,
        'content_group1': contentGroup
    });
}

// ユーザー属性追跡（プライバシー配慮）
function setUserProperties(userType, preferredCalculators = null) {
    gtag('set', {
        'user_type': userType,
        'preferred_calculators': preferredCalculators
    });
}

// エラー追跡
function trackError(errorType, errorMessage, pageLocation) {
    gtag('event', 'exception', {
        'description': errorMessage,
        'fatal': false,
        'error_type': errorType,
        'page_location': pageLocation
    });
}

// パフォーマンス追跡
function trackPerformance(metricName, value, unit = 'ms') {
    gtag('event', 'timing_complete', {
        'name': metricName,
        'value': value,
        'event_category': 'Performance',
        'unit': unit
    });
}

// 健康関連特化イベント
function trackHealthGoal(goalType, currentValue, targetValue = null) {
    gtag('event', 'health_goal_set', {
        'event_category': 'Health Management',
        'goal_type': goalType,
        'current_value': currentValue,
        'target_value': targetValue,
        'value': 1
    });
}

// 妊娠・出産関連追跡
function trackPregnancyCalculation(calculationType, gestationalWeek = null) {
    gtag('event', 'pregnancy_calculation', {
        'event_category': 'Pregnancy & Birth',
        'calculation_type': calculationType,
        'gestational_week': gestationalWeek,
        'value': 1
    });
}

// フィットネス関連追跡
function trackFitnessCalculation(calculationType, fitnessLevel = null, goal = null) {
    gtag('event', 'fitness_calculation', {
        'event_category': 'Fitness & Exercise',
        'calculation_type': calculationType,
        'fitness_level': fitnessLevel,
        'fitness_goal': goal,
        'value': 1
    });
}

// 初期化完了通知
console.log('Google Analytics 4 for 健康計算ポータル initialized successfully');

// プライバシー通知
console.log('Analytics configured with privacy protection enabled'); 