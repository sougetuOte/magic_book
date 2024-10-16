import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from models import db, User, Diary, PracticeItem, Image
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from werkzeug.utils import secure_filename

# .env ファイルから環境変数を読み込む
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# UPLOAD_FOLDERを絶対パスに変更
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    CORS(app)
    db.init_app(app)
    Migrate(app, db)

    # 日記関連のエンドポイント
    @app.route('/api/diaries', methods=['GET'])
    def get_diaries():
        try:
            diaries = Diary.query.all()
            return jsonify([{
                'id': diary.id,
                'date_time': diary.date_time.isoformat(),
                'title': diary.title,
                'weather': diary.weather,
                'constellation': diary.constellation,
                'content': diary.content
            } for diary in diaries]), 200
        except SQLAlchemyError as e:
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/diaries', methods=['POST'])
    def create_diary():
        data = request.json
        try:
            new_diary = Diary(
                date_time=datetime.fromisoformat(data['date_time']),
                title=data['title'],
                weather=data.get('weather'),
                constellation=data.get('constellation'),
                content=data['content'],
                user_id=1  # 仮のユーザーID。後で認証システムと連携する必要があります
            )
            db.session.add(new_diary)
            db.session.commit()
            return jsonify({
                'id': new_diary.id,
                'date_time': new_diary.date_time.isoformat(),
                'title': new_diary.title,
                'weather': new_diary.weather,
                'constellation': new_diary.constellation,
                'content': new_diary.content
            }), 201
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/diaries/<int:diary_id>', methods=['GET'])
    def get_diary(diary_id):
        try:
            diary = Diary.query.get(diary_id)
            if diary is None:
                return jsonify({"error": "指定された日記が見つかりません"}), 404
            return jsonify({
                'id': diary.id,
                'date_time': diary.date_time.isoformat(),
                'title': diary.title,
                'weather': diary.weather,
                'constellation': diary.constellation,
                'content': diary.content
            }), 200
        except SQLAlchemyError as e:
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/diaries/<int:diary_id>', methods=['PUT'])
    def update_diary(diary_id):
        data = request.json
        try:
            diary = Diary.query.get(diary_id)
            if diary is None:
                return jsonify({"error": "指定された日記が見つかりません"}), 404
            diary.date_time = datetime.fromisoformat(data.get('date_time', diary.date_time.isoformat()))
            diary.title = data.get('title', diary.title)
            diary.weather = data.get('weather', diary.weather)
            diary.constellation = data.get('constellation', diary.constellation)
            diary.content = data.get('content', diary.content)
            db.session.commit()
            return jsonify({
                'id': diary.id,
                'date_time': diary.date_time.isoformat(),
                'title': diary.title,
                'weather': diary.weather,
                'constellation': diary.constellation,
                'content': diary.content
            }), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/diaries/<int:diary_id>', methods=['DELETE'])
    def delete_diary(diary_id):
        try:
            diary = Diary.query.get(diary_id)
            if diary is None:
                return jsonify({"error": "指定された日記が見つかりません"}), 404
            db.session.delete(diary)
            db.session.commit()
            return jsonify({"message": "日記が正常に削除されました"}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    # 修行項目関連のエンドポイント
    @app.route('/api/diaries/<int:diary_id>/practice_items', methods=['GET'])
    def get_practice_items(diary_id):
        try:
            diary = Diary.query.get(diary_id)
            if diary is None:
                return jsonify({"error": "指定された日記が見つかりません"}), 404
            practice_items = PracticeItem.query.filter_by(diary_id=diary_id).all()
            return jsonify([{
                'id': item.id,
                'title': item.title,
                'description': item.description
            } for item in practice_items]), 200
        except SQLAlchemyError as e:
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/diaries/<int:diary_id>/practice_items', methods=['POST'])
    def create_practice_item(diary_id):
        data = request.json
        try:
            diary = Diary.query.get(diary_id)
            if diary is None:
                return jsonify({"error": "指定された日記が見つかりません"}), 404
            new_item = PracticeItem(
                title=data['title'],
                description=data.get('description'),
                diary_id=diary_id
            )
            db.session.add(new_item)
            db.session.commit()
            return jsonify({
                'id': new_item.id,
                'title': new_item.title,
                'description': new_item.description
            }), 201
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/practice_items/<int:item_id>', methods=['PUT'])
    def update_practice_item(item_id):
        data = request.json
        try:
            item = PracticeItem.query.get(item_id)
            if item is None:
                return jsonify({"error": "指定された修行項目が見つかりません"}), 404
            item.title = data.get('title', item.title)
            item.description = data.get('description', item.description)
            db.session.commit()
            return jsonify({
                'id': item.id,
                'title': item.title,
                'description': item.description
            }), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/practice_items/<int:item_id>', methods=['DELETE'])
    def delete_practice_item(item_id):
        try:
            item = PracticeItem.query.get(item_id)
            if item is None:
                return jsonify({"error": "指定された修行項目が見つかりません"}), 404
            db.session.delete(item)
            db.session.commit()
            return jsonify({"message": "修行項目が正常に削除されました"}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    # 画像関連のエンドポイント
    @app.route('/api/diaries/<int:diary_id>/images', methods=['POST'])
    def upload_image(diary_id):
        try:
            diary = Diary.query.get(diary_id)
            if diary is None:
                return jsonify({"error": "指定された日記が見つかりません"}), 404

            if 'file' not in request.files:
                return jsonify({"error": "ファイルがアップロードされていません"}), 400

            file = request.files['file']
            if file.filename == '':
                return jsonify({"error": "ファイルが選択されていません"}), 400

            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                new_image = Image(image_path=file_path, diary_id=diary_id)
                db.session.add(new_image)
                db.session.commit()

                return jsonify({
                    "id": new_image.id,
                    "image_path": new_image.image_path,
                    "message": "画像が正常にアップロードされました"
                }), 201
            else:
                return jsonify({"error": "許可されていないファイル形式です"}), 400

        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/api/images/<int:image_id>', methods=['DELETE'])
    def delete_image(image_id):
        try:
            image = Image.query.get(image_id)
            if image is None:
                return jsonify({"error": "指定された画像が見つかりません"}), 404

            # ファイルシステムから画像を削除
            if os.path.exists(image.image_path):
                os.remove(image.image_path)

            db.session.delete(image)
            db.session.commit()
            return jsonify({"message": "画像が正常に削除されました"}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({"error": "データベースエラーが発生しました"}), 500

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

app = create_app()

@app.cli.command("init-db")
def init_db():
    db.create_all()
    print("データベースを初期化しました。")

if __name__ == '__main__':
    app.run(debug=True)

# 日本語コメント
# このファイルは Flask バックエンドのメインエントリーポイントです。
# データベースの初期化と設定、アプリケーションファクトリの作成を行います。
# 各APIエンドポイントの実装を行っています。
# 日記のCRUD操作、修行項目のCRUD操作、画像のアップロードと削除が実装されています。
# 'flask init-db' コマンドでデータベースを初期化できます。
