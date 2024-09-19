# Flask-React アプリケーション起動スクリプト

# バックエンド（Flask）起動関数
function Start-Backend {
    Write-Host "バックエンド（Flask）を起動中..."
    Set-Location -Path ".\backend"
    try {
        .\venv\Scripts\Activate.ps1
        python main.py
    }
    catch {
        Write-Host "エラー: バックエンドの起動に失敗しました。" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# フロントエンド（React）起動関数
function Start-Frontend {
    Write-Host "フロントエンド（React）を起動中..."
    Set-Location -Path ".\frontend"
    try {
        npm start
    }
    catch {
        Write-Host "エラー: フロントエンドの起動に失敗しました。" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}

# メイン処理
function Start-App {
    $choice = Read-Host "起動するサービスを選択してください（1: 両方, 2: バックエンドのみ, 3: フロントエンドのみ）"

    switch ($choice) {
        "1" {
            Start-Job -ScriptBlock ${function:Start-Backend}
            Start-Job -ScriptBlock ${function:Start-Frontend}
            Get-Job | Receive-Job -Wait -AutoRemoveJob
        }
        "2" { Start-Backend }
        "3" { Start-Frontend }
        default { Write-Host "無効な選択です。スクリプトを終了します。" -ForegroundColor Red }
    }
}

# スクリプト実行
Start-App