from flask import jsonify, request, url_for
from backend.users import users
from backend.posts import posts
from backend.users.models import User
from backend import bcrypt, db, app
import jwt
import datetime
import base64
from backend.decorators import token_required
from PIL import Image
from sqlalchemy import not_, and_
import secrets
import os


def save_image(img):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(img.filename)

    img_fn = random_hex + f_ext
    img_path = os.path.join(posts.root_path, 'static/profile_pics', img_fn)

    output_size = (125, 125)
    i = Image.open(img)
    i.thumbnail(output_size)

    # save the image
    i.save(img_path)

    return img_fn


@users.route('/update_profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:

        username = request.form.get('username')
        email = request.form.get('email')

        if username != current_user.username:
            if User.query.filter_by(username=username).first():
                # user with username exists
                return jsonify({
                    "status": 409,
                    "field": "username",
                    "msg": "Username already exists..."
                }), 409
            current_user.username = username
        if email != current_user.email:
            if User.query.filter_by(email=email).first():
                # user with that email exists
                return jsonify({
                    "status": 409,
                    "field": "email",
                    "msg": "Email already exists..."
                }), 409
            current_user.email = email

        db.session.commit()

        return jsonify({
            "status": 200,
            "msg": "Updated profile"
        }), 200
    except:
        return jsonify({
            "status": 500,
            "field": "common",
            "msg": "Oops, Some error happened! Try Again..."
        }), 500


@users.route('/get_current_user', methods=['GET'])
@token_required
def get_current_user(current_user):
    try:
        if not current_user:
            return jsonify({
                "status": 401,
                "msg": "Invalid User"
            }), 401

        return jsonify({
            "status": 200,
            "user": {
                "username": current_user.username,
                "posts": len(current_user.posts),
                "email": current_user.email,
            },
            "msg": "Awesome"
        })
    except:
        return jsonify({
            "status": 500,
            "field": "common",
            "msg": "Oops, Some error happened! Try Again..."
        }), 500


@users.route('/signup', methods=['POST'])
def signup():
    try:

        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        if not username or not password or not email:
            return jsonify({
                "status": 401,
                "field": "common",
                "msg": "All fields are required!"
            })

        hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')

        if User.query.filter_by(username=username).first():

            # user with username exists
            return jsonify({
                "status": 409,
                "field": "username",
                "msg": "Username already exists..."
            }), 409
        elif User.query.filter_by(email=email).first():

            # user with that email exists
            return jsonify({
                "status": 409,
                "field": "email",
                "msg": "Email already exists..."
            }), 409
        else:
            # New user
            user = User(username=username, email=email, password=hashed_pwd)

            db.session.add(user)
            db.session.commit()
            return jsonify({
                "status": 200,
                "field": "success",
                "msg": "Your account has been succesfully created! Please Login to Continue..."
            })
    except:
        return jsonify({
            "status": 500,
            "field": "common",
            "msg": "Oops, Some error happened!"
        }), 500


@users.route('/login', methods=['GET'])
def login():
    try:
        auth = request.authorization

        if not auth:
            return jsonify({
                "status": 401,
                "field": "common",
                "msg": "Autherization required!"
            })

        username = base64.b64decode(auth.username).decode('utf-8')
        password = base64.b64decode(auth.password).decode('utf-8')

        if not username or not password:
            return jsonify({
                "status": 401,
                "field": "common",
                "msg": "Both Credentials required!"
            })

        user = User.query.filter_by(username=username).first()

        if user != None:
            # check password
            if bcrypt.check_password_hash(user.password, password):
                # valid password
                # validation done
                token = jwt.encode({
                    'public_id': user.public_id,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
                }, app.secret_key)

                return jsonify({
                    "status": 200,
                    "token": token.decode('utf-8'),
                    "msg": "You are now logged in!"
                }), 200
            else:
                # invalid password
                return jsonify({
                    "status": 401,
                    "field": "password",
                    "msg": "Password doesn't match!"
                }), 401
        else:
            return jsonify({
                "status": 401,
                "field": "username",
                "msg": "Invalid Username"
            }), 401
    except:
        return jsonify({
            "status": 500,
            "field": "common",
            "msg": "Oops, Some error happened! Try Again..."
        }), 500
