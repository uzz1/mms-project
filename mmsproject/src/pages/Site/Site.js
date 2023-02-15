import React, { useState, useEffect, useContext } from 'react';
import { checkAuth, getToken } from '../../utils';
import { CommentContext } from '../../contexts/CommentContext';
import { PostContext } from '../../contexts/PostContext';
import Post from '../../components/Post/Post';
import NewLocation from '../NewLocation/NewLocation';
import { Container, Row, Col } from 'reactstrap';
import "./Site.css"
import {Button} from 'reactstrap'
import Comments from '../Comments/Comments';
import { ImageContext } from '../../contexts/ImageContext';
import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';
import { useHistory } from 'react-router-dom'

const Site = (props) => {
    const { id } = props.match.params;
  const [msg, setMsg] = useState('Loading...');
  const {locations, setLocations } = useContext(ImageContext);
  const { posts } = useContext(PostContext);
  const [location, setLocation] = useState('');
  const { public_id } = jwt.decode(Cookie.get('token'));
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [img, setImg] = useState('');
  const navigate = useHistory();

  let post = null;

  useEffect(() => {
    setTimeout(() => {
      if (locations.length == 0){
      getLocations();

      }
    }, 2000)
  
  
    
  }, [locations, post]);


  const postList = posts.length > 0 ? (
   
    posts.map(post => (
      <Post key={post.id} public_id={post.public_id} id={post.id} author={post.author} liked={post.liked} profile_pic={post.profile_pic} img={post.img} likes={post.likes} post={post.post} />
    ))
  ) : (
    <p className="home__msg">Oops! No posts yet...</p>
  );

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  post = posts.find(post => {
    return String(post.id) === String(id);
    getLocations()
  });


  const toggleModal = () => {
    setModal(!modal);
  }

  const deleteLocation = (pid, post_id, location_id) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    fetch('/api/delete_location', {
      method: 'DELETE',
      headers: {
        'public_id': pid,
        'post_id': post_id,
        'location_id': location_id,
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


  const getLocations = async () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    if (!post) {
      setMsg('No Posts Found!');
    } else {
      await fetch('/api/locations', {
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
            setLocations(data.locations);
          } else {
            setMsg('Oops, Something went wrong!!!')
          }
        })
        .catch(e => {
          setMsg('No Posts Found!');
        });
    }
  }

  
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append('name', location);
    formdata.append('id', id);
    formdata.append('img', img);

    fetch('/api/add_location', {
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
          setLocations([
            ...locations,
            data.location
          ]);
          setLocation('');
          navigate.push(`/site/${id}`)
        } else {
          setMsg('Oops some error happened');
        }
      })
      .catch(e => {
        setMsg('Oops some error happened');
      })
  }


  
     

  return (
    <>
<Container className='main-container'>
  <Container className='site-container'>
  
    {post?
    <Post key={post.id} public_id={post.public_id} id={post.id} author={post.author} liked={post.liked} profile_pic={post.profile_pic} img={post.img} post={post.post} />
    :null}
   
   
    {/* <Col lg="6" md="6" sm="6" xs="12">
    <NewLocation />
    </Col> */}
  </Container>
 

  <Container className='location-container'>

<Row  className="location-row">
  {/* {postList} */}
  <Col lg="12" md="12" sm="12" xs="12">

      <div className="locations__header">
       <strong>Notes</strong>
      </div>
      {
        locations ? (
          <div className="locations">
            {locations.map(location => (
              <div key={location.id} className="location">
                <div className="locations__left">
                  <img className="avatar" src={location.img} alt="profile" />
                </div>
                <div className="locations__right">
                  <div className="locations__right_top">
                    <strong>{location.author}</strong>
                    <span>{location.name}</span>

                  </div>
                  <Button onClick={(e)=>{deleteLocation(public_id, id, location.id)}} title="delete">
                  Delete
                  </Button>
                  <div className="locations__extras">
                    <span>{location.date_posted}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) :  (
 
            <p className="msg">No Locations Found!!!</p >
       
          )
      }
      <form className="add_location" onSubmit={handleSubmit}>
      <input type="file" id="file" onChange={
          e => setImg(e.target.files[0])
        } required />
        <input type="text" required placeholder="Add a new location..." className="location_box" value={location} onChange={(e) => {
          setLocation(e.target.value);
        }} />
        <button type="submit" className="btn btn-primary post-btn">Add</button>
      </form>
    </Col>

        </Row>
        </Container>

</Container>
</>
  )
}

export default Site