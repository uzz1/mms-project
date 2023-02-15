import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './Main.css';
import Header from '../../components/Header/Header';
import Home from '../../pages/Home/Home';
import Search from '../../pages/Search/Search';
import NewPost from '../../pages/NewPost/NewPost';
import NewImage from '../../pages/NewImage/NewImage';
import Profile from '../../pages/Profile/Profile';
import EditProfile from '../../pages/EditProfile/EditProfile';
import Comments from '../../pages/Comments/Comments';
import Images from '../../pages/Images/Images';
import Dashboard from '../../pages/Dashboard/Dashboard.js';

const Main = () => {
  return (
    <Router>
      <Header />

        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/newpost" component={NewPost} />
          <Route path="/profile" component={Profile} />
          <Route path="/edit_profile" component={EditProfile} />
          <Route path="/comments/:id" component={Comments} />
          <Route path="/images/:id" component={Images} />
          <Route path="/newimage/:id" component={NewImage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/locations" exact component={Home} />
          <Route path="/" exact component={Dashboard} />
        </Switch>

    </Router>
  );
}

export default Main;