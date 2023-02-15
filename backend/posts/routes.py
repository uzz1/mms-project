from flask import jsonify, request, url_for
from backend.posts import posts
from backend.users import users
from backend.users.models import User
from backend.posts.models import Post, Comment, Image
from backend import db, app
import secrets
import os
from sqlalchemy import desc, and_
from backend.decorators import token_required


@posts.route('/delete_post', methods=['DELETE'])
@token_required
def delete_post(current_user):
    try:
        public_id = request.headers.get('public_id')
        post_id = request.headers.get('post_id')

        if not public_id or not post_id:
            return jsonify({
                "status": 501,
                "msg": "Oops, Some error happened!"
            }), 500
        if public_id == current_user.public_id:
            post = Post.query.filter_by(id=post_id).first()
            if post:
                db.session.delete(post)
                db.session.commit()

                return jsonify({
                    "status": 200,
                    "msg": "Deleted post"
                })
            return jsonify({
                "status": 404,
                "msg": "No post found!!!"
            })

        return jsonify({
            "status": 401,
            "msg": "Unauthorized"
        })
    except:
        return jsonify({
            "status": 500,
            "is_author": False
        }), 500


@posts.route('/delete_comment', methods=['DELETE'])
@token_required
def delete_comment(current_user):
    try:
        public_id = request.headers.get('public_id')
        post_id = request.headers.get('post_id')
        comment_id = request.headers.get('comment_id')

        if not public_id or not post_id:
            return jsonify({
                "status": 500,
                "msg": "Oops, Some error happened!"
            }), 500
        if public_id == current_user.public_id:
            post = Post.query.filter_by(id=post_id).first()
            if post:
                comment = Comment.query.filter_by(id=comment_id).first()
                if comment:
                    db.session.delete(comment)
                    db.session.commit()

                return jsonify({
                    "status": 200,
                    "msg": "Deleted post"
                })
            return jsonify({
                "status": 404,
                "msg": "No post found!!!"
            })

        return jsonify({
            "status": 401,
            "msg": "Unauthorized"
        })
    except:
        return jsonify({
            "status": 500,
            "is_author": False
        }), 500


@posts.route('/add_comment', methods=['POST'])
@token_required
def add_comment(current_user):
    try:
        comment = request.form.get('comment')
        id = request.form.get('id')

        if not comment or not id:
            return jsonify({
                "status": 500,
                "msg": "Comment is not proper... "
            }), 500

        post = Post.query.filter_by(id=id).first()

        if not post:
            return jsonify({
                "status": 404,
                "msg": "No Post found..."
            }), 404

        # save the comment
        user = current_user

        new_comment = Comment(post=post, commentator=user, comment=comment)

        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "status": 200,
            "msg": "Comment added successfully",
            "comment": {
                "id": new_comment.id,
                "comment": new_comment.comment,
                "date_posted": new_comment.date_posted.strftime("%Y-%m-%d %H:%M:%S"),
                "commentator": new_comment.commentator.username,

            }
        })
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/comments', methods=['GET'])
@token_required
def get_comments(current_user):
    try:
        id = request.headers.get('id')
        # get post and comments related to it
        post = Post.query.filter_by(id=id).first()
        if not post:
            return jsonify({
                "status": 404,
                "msg": "No Post Found!!!"
            }), 404

        # the post exists
        # so fetch comments
        comments = []
        if len(post.comments) > 0:
            comments = [{
                "id": comment.id,
                "comment": comment.comment,
                "date_posted": comment.date_posted.strftime("%Y-%m-%d %H:%M:%S"),
                "profile_pic": url_for('posts.static', filename='profile_pics/' + comment.commentator.profile_pic),
                "commentator": comment.commentator.username,
            } for comment in post.comments]

        return jsonify({
            "status": 200,
            "comments": comments,
            "msg": "Success!!!"
        }), 200
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/add_image', methods=['POST'])
@token_required
def add_image(current_user):
    try:
        img = request.files.get('img')
        name = request.form.get('name')
        id = request.form.get('id')
        lat = request.form.get('lat')
        long = request.form.get('long')

        img_fn = save_image(img)

        if not name or not id:
            return jsonify({
                "status": 501,
                "msg": "Image is not properly defined... "
            }), 501

        post = Post.query.filter_by(id=id).first()

        if not post:
            return jsonify({
                "status": 404,
                "msg": "No Post found..."
            }), 404

        # save the image
        user = current_user

        new_image = Image(
            img=img_fn, post=post, author=user, name=name, latitude=lat, longitude=long)

        db.session.add(new_image)
        db.session.commit()

        return jsonify({
            "status": 200,
            "msg": "Image added successfully",
            "image": {
                "id": new_image.id,
                "image": new_image.name,
                # "latitude": new_image.latitude,
                # "longitude": new_image.longitude,
                "date_posted": new_image.date_posted.strftime("%Y-%m-%d %H:%M:%S"),
                "img": url_for('posts.static', filename='uploads/' + new_image.img),
                "author": new_image.author.username,

            }
        })
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/delete_image', methods=['DELETE'])
@token_required
def delete_image(current_user):
    try:
        public_id = request.headers.get('public_id')
        post_id = request.headers.get('post_id')
        image_id = request.headers.get('image_id')

        if not public_id or not post_id:
            return jsonify({
                "status": 500,
                "msg": "Oops, Some error happened!"
            }), 500
        if public_id == current_user.public_id:
            post = Post.query.filter_by(id=post_id).first()
            if post:
                image = Image.query.filter_by(id=image_id).first()
                if image:
                    db.session.delete(image)
                    db.session.commit()

                return jsonify({
                    "status": 200,
                    "msg": "Deleted image"
                })
            return jsonify({
                "status": 404,
                "msg": "No image found!!!"
            })

        return jsonify({
            "status": 401,
            "msg": "Unauthorized"
        })
    except:
        return jsonify({
            "status": 500,
            "is_author": False
        }), 500


@posts.route('/images', methods=['GET'])
@token_required
def get_images(current_user):
    try:
        id = request.headers.get('id')
        # get post and images related to it
        post = Post.query.filter_by(id=id).first()
        if not post:
            return jsonify({
                "status": 404,
                "msg": "No Post Found!!!"
            }), 404

        # the post exists
        # so fetch images
        images = []
        if len(post.images) > 0:
            images = [{
                "id": image.id,
                "name": image.name,
                "latitude": image.latitude,
                "longitude": image.longitude,
                "date_posted": image.date_posted.strftime("%Y-%m-%d %H:%M:%S"),
                "img": url_for('posts.static', filename='uploads/' + image.img),
                "author": image.author.username,
            } for image in post.images]
        images.reverse()

        return jsonify({
            "status": 200,
            "images": images,
            "msg": "Success!!!"
        }), 200
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500

    return img_fn


@posts.route('/posts', methods=['GET'])
@token_required
def get_posts(current_user):
    try:
        posts = Post.query.order_by(desc(Post.date_posted)).all()

        posts = [{
            "id": post.id,
            "author": post.author.username,
            "public_id": post.author.public_id,
            "latitude": post.latitude,
            "longitude": post.longitude,
            "date_posted": post.date_posted,
            "img": url_for('posts.static', filename='uploads/' + post.img),
            "post": post.body
        } for post in posts]

        return jsonify({
            "status": 200,
            "posts": posts
        }), 200
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


def save_image(img):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(img.filename)

    img_fn = random_hex + f_ext
    img_path = os.path.join(posts.root_path, 'static/uploads', img_fn)

    # save the image
    img.save(img_path)

    return img_fn

# create


@posts.route('/search', methods=['POST'])
@token_required
def search(current_user):
    try:
        if request.form.get('term'):
            term = request.form.get('term')

            posts = Post.query.filter(Post.body.contains(term)).all()

            if len(posts) > 0:
                posts = [{
                    "id": post.id,
                    "author": post.author.username,
                    "public_id": post.author.public_id,
                    "latitude": post.latitude,
                    "longitude": post.longitude,
                    "date_posted": post.date_posted,
                    "img": url_for('posts.static', filename='uploads/' + post.img),
                    "post": post.body
                } for post in posts]
                return jsonify({
                    "status": 200,
                    "posts": posts,
                    "msg": "Got some matching locations!"
                }), 200

            return jsonify({
                "status": 404,
                "msg": "No locations found..."
            }), 404

        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/newpost', methods=['POST'])
@token_required
def new_post(current_user):
    try:
        img = request.files.get('img')
        text = request.form.get('text')
        lat = request.form.get('lat')
        long = request.form.get('long')

        img_fn = save_image(img)

        author = current_user

        post = Post(img=img_fn, body=text, author=author,
                    latitude=lat, longitude=long)

        # save the post
        db.session.add(post)
        db.session.commit()

        return jsonify({
            "status": 200,
            "post": {
                "id": post.id,
                "public_id": post.author.public_id,
                "latitude": post.latitude,
                "longitude": post.longitude,
                "author": post.author.username,
                "img": url_for('posts.static', filename='uploads/' + post.img),
                "post": post.body
            }
        }), 200
    except:
        db.session.rollback()
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500
