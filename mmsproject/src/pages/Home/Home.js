import React, { useContext } from 'react';

import './Home.css';
import { PostContext } from '../../contexts/PostContext';
import Post from '../../components/Post/Post';
import { checkAuth } from '../../utils';
import { Responsive, WidthProvider } from "react-grid-layout";
import { Container, Row, Col } from 'reactstrap';
const ResponsiveGridLayout = WidthProvider(Responsive);

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
   
       <Container className="container">
        <Row>
        {postList}
        </Row>
       </Container>
  );
}

export default Home;