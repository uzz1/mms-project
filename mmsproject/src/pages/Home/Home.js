import React, { useContext } from 'react';

import './Home.css';
import { PostContext } from '../../contexts/PostContext';
import Post from '../../components/Post/Post';
import { checkAuth } from '../../utils';
import { Container, Row, Col, Button } from 'reactstrap';
import {Link} from 'react-router-dom'


const Home = (props) => {
  const { posts } = useContext(PostContext);



  const postList = posts.length > 0 ? (
   
    posts.map(post => (
      <Post key={post.id} public_id={post.public_id} id={post.id} author={post.author}  img={post.img}  post={post.post} latitude={post.latitude} longitude={post.longitude} />
    ))
  ) : (
    <p className="home__msg">Oops! No locations sites yet...</p>
  );

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }
  
  return (
   <div className="home">
     {/* <div className="dashboard">
      <Link to="/dashboard">
      <Button>Dashboard</Button>
      </Link>
      </div> */}
    <div className="heading__div"><h2>Location Sites</h2></div>
    
 <Container className="container">
        <Row className='row'>
        {postList}
        </Row>
       </Container>
   </div>
      
  );
}

export default Home;