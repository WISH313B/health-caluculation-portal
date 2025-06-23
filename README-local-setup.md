# 健康計算ポータル - ローカル確認手順

## 🌐 ローカルサーバーの起動方法

### 方法1: バッチファイルを使用（推奨）

1. `start-local-server.bat` ファイルをダブルクリック
2. コマンドプロンプトが開き、サーバーが起動します
3. ブラウザで `http://localhost:8000` にアクセス

### 方法2: 手動でコマンド実行

```bash
# コマンドプロンプトまたはPowerShellで実行
python -m http.server 8000
```

## 📱 確認できるページ一覧

### メインページ
- **トップページ**: `http://localhost:8000/index.html`
- **運営者情報**: `http://localhost:8000/about.html`

### 🤰 新規作成ページ
- **妊活から出産まで女性の健康完全ガイド**: `http://localhost:8000/women-health-complete-guide.html`
- **妊娠超初期症状チェッカー**: `http://localhost:8000/pregnancy-symptoms-checker.html`
- **つわりの乗り切り方ガイド**: `http://localhost:8000/blog/morning-sickness-guide.html`

### 📊 計算機（関連ツール）
- **排卵日計算機**: `http://localhost:8000/calculators/pages/ovulation.html`
- **出産予定日計算機**: `http://localhost:8000/calculators/pages/pregnancy-due-date.html`
- **生理周期計算機**: `http://localhost:8000/calculators/pages/menstrual.html`

## 🔧 トラブルシューティング

### ポート8000が使用中の場合
```bash
# 別のポートを使用
python -m http.server 8080
# ブラウザで http://localhost:8080 にアクセス
```

### Pythonがインストールされていない場合
1. [Python公式サイト](https://www.python.org/downloads/)からダウンロード
2. インストール時に「Add Python to PATH」にチェック
3. インストール後、コマンドプロンプトを再起動

### Alternative: Live Server（VS Code拡張）
VS Codeをお使いの場合、「Live Server」拡張機能も利用可能です。

## 📝 実装確認項目

### ✅ 妊娠超初期症状チェッカー
- [ ] 15項目の症状チェック機能
- [ ] 4段階の結果判定
- [ ] レスポンシブデザイン
- [ ] リセット機能

### ✅ ピラーページ
- [ ] 8章構成のコンテンツ
- [ ] 内部リンクの動作
- [ ] 目次ナビゲーション
- [ ] 参考文献の表示

### ✅ つわりガイド
- [ ] 詳細なコンテンツ表示
- [ ] 医療免責事項
- [ ] ブログレイアウト

## 🚀 本番環境への反映

ローカルで確認後、以下の手順で本番環境に反映：

1. サーバーにファイルをアップロード
2. パスの確認（相対パス/絶対パス）
3. SSL証明書の確認
4. キャッシュのクリア

---

## 📞 お問い合わせ

ローカル確認で問題が発生した場合は、エラーメッセージと共にお知らせください。 