# Flask-React 魔術日記アプリ

このプロジェクトは、Flask バックエンドと React フロントエンドを使用した魔術日記ウェブアプリケーションです。日記の記録、修行項目の管理、画像のアップロードなどの機能を提供します。

## 機能

- 日記の作成、閲覧、編集、削除
- 修行項目の追加、編集、削除
- 画像のアップロードと管理
- 天気と星座の記録
- ヘッダーとフッターのナビゲーション

## 前提条件

- Python 3.12.5
- Node.js v20.17.0
- npm（Node.js に付属）
- PowerShell

## セットアップと実行方法

### 環境変数の設定

1. プロジェクトのルートディレクトリにある `.env.sample` ファイルを `.env` にコピーします:
   ```
   cp .env.sample .env
   ```

2. `.env` ファイルを開き、必要に応じて値を変更します。特に、`SECRET_KEY` と `JWT_SECRET_KEY` は必ず変更してください:
   ```
   FLASK_APP=main.py
   FLASK_DEBUG=True
   DATABASE_URL=sqlite:///magic_diary.db
   SECRET_KEY=your_unique_secret_key_here
   JWT_SECRET_KEY=your_unique_jwt_secret_key_here
   UPLOAD_FOLDER=uploads
   ```

   注意: `SECRET_KEY` と `JWT_SECRET_KEY` には、それぞれユニークで強力な文字列を使用してください。

### データベースの初期化

1. バックエンドディレクトリに移動:
   ```
   cd backend
   ```

2. 仮想環境の作成と有効化:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

3. 必要なパッケージのインストール:
   ```
   pip install -r requirements.txt
   ```

4. データベースの初期化:
   ```
   flask init-db
   ```

### 統合起動スクリプトの使用

1. PowerShellを開き、プロジェクトのルートディレクトリに移動します:
   ```
   cd path\to\magic_book
   ```

2. 以下のコマンドを実行してスクリプトを起動します:
   ```
   .\start-app.ps1
   ```

3. プロンプトが表示されたら、起動するサービスを選択します:
   - 1: 両方（バックエンドとフロントエンド）
   - 2: バックエンドのみ
   - 3: フロントエンドのみ

### 手動での起動と終了（個別）

#### バックエンド（Flask）

起動:
1. バックエンドディレクトリに移動:
   ```
   cd backend
   ```

2. 仮想環境の有効化（まだ有効化していない場合）:
   ```
   venv\Scripts\activate
   ```

3. Flask アプリケーションの実行:
   ```
   python main.py
   ```

   バックエンドは `http://localhost:5000` で起動します。

終了:
1. Flask アプリケーションが実行されているターミナルで、`Ctrl + C` を押します。
2. 仮想環境を終了する場合は、以下のコマンドを実行:
   ```
   deactivate
   ```

#### フロントエンド（React）

起動:
1. 新しいターミナルを開き、フロントエンドディレクトリに移動:
   ```
   cd frontend
   ```

2. 必要な npm パッケージのインストール（初回のみ）:
   ```
   npm install
   ```

3. React 開発サーバーの起動:
   ```
   npm start
   ```

   フロントエンドは `http://localhost:3000` で起動します。

終了:
1. React 開発サーバーが実行されているターミナルで、`Ctrl + C` を押します。
2. 終了の確認を求められた場合は、`Y` を入力してEnterを押します。

注意: バックエンドとフロントエンドを別々のターミナルで実行している場合、それぞれのターミナルで終了手順を実行してください。

## アプリケーションへのアクセス

バックエンドとフロントエンドの両方が起動したら、ウェブブラウザで `http://localhost:3000` を開きます。魔術日記アプリケーションのインターフェースが表示されるはずです。

## 開発状況

### バックエンド（Flask）

- 日記のCRUD操作が実装済み
- 修行項目のCRUD操作が実装済み
- 画像のアップロードと管理機能が実装済み

### フロントエンド（React）

- 基本的なコンポーネント構造が実装済み
- 日記一覧表示、詳細・編集画面が実装済み
- Header と Footer コンポーネントが追加され、ナビゲーション機能が改善
- スタイリングが適用され、ユーザーインターフェースが改善

## 今後の開発計画

1. 画像管理機能のフロントエンド統合
2. ユーザー認証機能の実装
3. 検索・フィルター機能の追加
4. テストの実装
5. パフォーマンスの最適化とセキュリティの強化

## 開発

- Flask バックエンドのメインコードは `backend/main.py` にあります。
- データベースモデルは `backend/models.py` にあります。
- React フロントエンドのメインコードは `frontend/src/App.js` にあります。
- コンポーネントは `frontend/src/components/` ディレクトリにあります。

これらのファイルを必要に応じて修正し、アプリケーションを拡張してください。

## 画像管理

- 画像は `backend/uploads` ディレクトリに保存されます。
- アップロードされた画像は、対応する日記エントリーに関連付けられます。
- 画像の表示はフロントエンド側で実装する必要があります。

## 注意事項

- 本番環境にデプロイする前に、必ず環境変数の値を変更してください。
- セキュリティに関する考慮は全ての開発段階で行ってください。
- 定期的にデータのバックアップを行うことをお勧めします。
- 画像のアップロードには、適切なバリデーションとセキュリティ対策を実装してください。

## 貢献

プロジェクトに貢献する際は、`HANDOVER.md` ファイルを参照して、現在の開発状況と次のステップを確認してください。また、`TASK_PLAN.md` ファイルで詳細な開発計画を確認できます。
