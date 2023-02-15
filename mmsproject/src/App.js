import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Main from './containers/Main/Main';
import PostContextProvider from './contexts/PostContext';
import AuthContextProvider from './contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import CommentContextProvider from './contexts/CommentContext';
import ImageContextProvider from './contexts/ImageContext';

const App = () => {
  return (
    <Router>
      <PostContextProvider>
        <AuthContextProvider>
          <CommentContextProvider>
          <ImageContextProvider>
          <div className="container">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />

              <PrivateRoute path="/search" exact component={Main} />
              <PrivateRoute path="/newpost" exact component={Main} />
              <PrivateRoute path="/profile" exact component={Main} />
              <PrivateRoute path="/comments/:id" exact component={Main} />
              <PrivateRoute path="/images/:id" exact component={Main} />
              <PrivateRoute path="/newimage/:id" exact component={Main} />
              <PrivateRoute path="/edit_profile" exact component={Main} />
              <PrivateRoute path="/" exact component={Main} />
              <PrivateRoute path="/dashboard" exact component={Main} />
              <PrivateRoute path="/locations" exact component={Main} />
            </Switch>
          </div>
          </ImageContextProvider>
          </CommentContextProvider>
        </AuthContextProvider>
      </PostContextProvider>
    </Router>

  );
}

export default App;