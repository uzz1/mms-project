import React, { useEffect, useState } from 'react';

import { checkAuth, getToken } from '../../utils';
import Cookie from 'js-cookie';
import './Profile.css';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [msg, setMsg] = useState('');

  const logout = async () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    await Cookie.remove('token');
    return window.location.replace('/login')
  }

  // get current user
  const getCurrentUser = () => {
    fetch('/api/get_current_user', {
      method: 'GET',
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setMsg('');
          setCurrentUser(data.user);
        } else {
          setMsg('Oops, Some error happened!');
        }
      })
      .catch(e => {
        setMsg('Oops, Some error happened!');
      })
  }

  useEffect(getCurrentUser, []);

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  const component = currentUser ? (
    <div>
            <div className="profile__top">User Profile</div>

      <div className="profile__header">

        <div className="profile__header__details">
        <p>
        Username: 
        </p>
      <p className="profile__header__username">
         {currentUser.username}
        </p>
        <p>
        Email: 
        </p>
      <p className="profile__header__username">
         {currentUser.email}
        </p>
        </div>
     
      <div className="profile__header__logout">
        <button onClick={logout} className="btn btn-primary" href="/logout">Logout</button>
      </div>
    </div>

    <div className="profile__body_top">
      <div>
  
      </div>
     
     
    </div>

    <div className="profile__body_middle">
        <span className="profile__verbose">Posts: </span>
        <span className="profile__number"><strong>{currentUser.posts}</strong></span>
    </div>

    <a className="profile__body_edit-btn btn btn-primary" href="/edit_profile">Edit Profile</a>
    </div>
  ) : (
      <p className="msg">{msg}</p>
    );

  return (
    <div className="profile">
      {component}
    </div>
  );
}

export default Profile;