from backend import db
import uuid


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String, unique=True, default=str(uuid.uuid4()))
    username = db.Column(db.String, index=True, unique=True, nullable=False)
    email = db.Column(db.String, index=True, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)
    comments = db.relationship('Comment', backref='commentator', lazy=True)
    images = db.relationship('Image', backref='author', lazy=True)

    def __repr__(self):
        return self.username
