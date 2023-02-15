import React, { useContext, useState } from 'react';

import { getToken, checkAuth } from '../../utils';

import './EditPost.css';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';

import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';

import { PostContext } from '../../contexts/PostContext';
import ErrorField from '../ErrorField/ErrorField';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';

const Post = ({ id, public_id, author, img, post }) => {
  const { posts, setPosts } = useContext(PostContext);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  }

  const deletePost = (pid, post_id) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    fetch('/api/delete_post', {
      method: 'DELETE',
      headers: {
        'public_id': pid,
        'post_id': post_id,
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

  const copyLink = () => {
    // copy link to clipboard
    console.log('link copied')
  }

  const isAuthor = (pid) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    const { public_id } = jwt.decode(Cookie.get('token'));

    if (public_id === pid) {
      return true;
    }

    return false;
  }

  

  
  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  return (
    <Col lg="4" md="4" sm="6" xs="12">
      {modal && <div className="modal">
        <div className="content">
        <span onClick={toggleModal} className="close">&times;</span>
        {isAuthor(public_id) ? (
          <>
          <li onClick={() => deletePost(public_id, id)}>Delete</li>
          </>
        ) : (
         null
        )}
        </div>

      </div>}
      <div className="post__top">
        <strong>{post}</strong>
        {isAuthor(public_id) ? (
          <>
      <button onClick={() => deletePost(public_id, id)}>delete</button>
      <MoreHorizIcon onClick={toggleModal} className="more" />
      </>
        ):(null)}
      </div>
      <div className="post__img">
        <img onDoubleClick={null} src={img} alt="post-img" />
      </div>

      {error && <ErrorField error={error} />}

      <div className="post__fun">
      <strong>Go to Site: </strong>
        <Link to={`/site/${id}`} className="comment_link">
          <h3>Site</h3>
        </Link>
      </div>
      
      <div className="post__fun">
      <strong>Notes: </strong>
        <Link to={`/comments/${id}`} className="comment_link">
          <CommentOutlinedIcon />
        </Link>
      </div>
     
      <div className="post__post">
        <strong>Author: </strong>{author} 
      </div>
    </Col>
  );
}

export default Post;