import React, { useState, useEffect, useContext } from 'react';

import './Comments.css';
import { checkAuth, getToken } from '../../utils';
import { CommentContext } from '../../contexts/CommentContext';
import { PostContext } from '../../contexts/PostContext';
import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';
import {Button} from 'reactstrap'
import {Link} from 'react-router-dom'

const Comments = (props) => {
  const { id } = props.match.params;
  const [msg, setMsg] = useState('Loading...');
  const { comments, setComments } = useContext(CommentContext);
  const { posts } = useContext(PostContext);
  const [comment, setComment] = useState('');
  const { public_id } = jwt.decode(Cookie.get('token'));
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  }
  let post = null;

  post = posts.find(post => {
    return String(post.id) === String(id);
  });

  const deleteComment = (pid, post_id, comment_id) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    fetch('/api/delete_comment', {
      method: 'DELETE',
      headers: {
        'public_id': pid,
        'post_id': post_id,
        'comment_id': comment_id,
        'x-access-token': getToken()
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        toggleModal();
        setError('');
        
        window.location.reload('/');
      } else {
        toggleModal();
        setError('Oops, Some, error, happened!');
      }
    })
    .catch(e => {
      toggleModal();
      setError('Oops, Some, error, happened!');
    })  
  }

  
  const getComments = () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    if (!post) {
      setMsg('No Locations Found!');
    } else {
      fetch('/api/comments', {
        method: 'GET',
        headers: {
          'x-access-token': getToken(),
          'id': id,
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            setMsg('');
            setComments(data.comments);
          } else {
            setMsg('Oops, Something went wrong!!!')
          }
        })
        .catch(e => {
          setMsg('No Posts Found!');
        });
    }
  }

  useEffect(() => {
    getComments();
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append('comment', comment);
    formdata.append('id', id);

    fetch('/api/add_comment', {
      method: 'POST',
      body: formdata,
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setMsg('');
          setComments([
            ...comments,
            data.comment
          ]);
          setComment('');
        } else {
          setMsg('Oops some error happened');
        }
      })
      .catch(e => {
        setMsg('Oops some error happened');
      })
  }

  const component = post && (
    <div className="comments__body">
      <div className="real_post">
        <div className="real_post_left">
        </div>
        <div className="real_post_right">
        <br></br>
        <img className="comments__img" src={post.img}/>
          <strong> {post.post}</strong>
        </div>
      </div>

      {/* comments */}
      {
        comments.length > 0 ? (
          <div className="comments">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comments__left">
                </div>
                <div className="comments__right">
                  <div className="comments__right_top">
                    <strong>{comment.commentator}</strong>
                    <span>{comment.comment}</span>
                    <Button onClick={() => deleteComment(public_id, id, comment.id)}>delete</Button>

                  </div>
                  <div className="comments__extras">
                    <span>{comment.date_posted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <p className="msg">No Notes Found!!!</p >
          )
      }
      <form className="add_comment" onSubmit={handleSubmit}>
        <input type="text" required placeholder="Add a note..." className="comment_box" value={comment} onChange={(e) => {
          setComment(e.target.value);
        }} />
        <button type="submit" className="btn btn-primary post-btn">Add</button>
      </form>
    </div>
  );

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  return (
    <div className="comments">
      <div className="comments__header">
       <h2>Notes</h2>
       
      </div>
      <div className="back">
<Link to="/locations">
<Button>Back</Button>
</Link>
      </div>
      {msg && <p className="msg">{msg}</p>}
      {component}
    </div>
  );
}

export default Comments;