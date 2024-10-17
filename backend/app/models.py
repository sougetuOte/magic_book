from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    diaries = db.relationship('Diary', backref='author', lazy=True)

class Diary(db.Model):
    __tablename__ = 'diaries'
    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    title = db.Column(db.String(100), nullable=False)
    weather = db.Column(db.String(50))
    constellation = db.Column(db.String(50))
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    practice_items = db.relationship('PracticeItem', backref='diary', lazy=True)
    images = db.relationship('Image', backref='diary', lazy=True)

class PracticeItem(db.Model):
    __tablename__ = 'practice_items'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    diary_id = db.Column(db.Integer, db.ForeignKey('diaries.id'), nullable=False)

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(255), nullable=False)
    diary_id = db.Column(db.Integer, db.ForeignKey('diaries.id'), nullable=False)