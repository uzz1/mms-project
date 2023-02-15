import React, {useContext, useState, useEffect} from 'react'
import { PostContext } from '../../contexts/PostContext';
import { checkAuth, getToken } from '../../utils';
import GoogleMapReact from 'google-map-react';
import { Container } from 'reactstrap';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import './Dashboard.css'
import {Button} from 'reactstrap'
import {Link} from 'react-router-dom'

function Dashboard(props) {
  const { posts } = useContext(PostContext);
  const [currentUser, setCurrentUser] = useState('');
  const [msg, setMsg] = useState('');

  

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
   
   const MapMarker = (props) => {
    return (

<p style={{color: "blue"}}>< LocationOnOutlinedIcon style={{color: "red"}} />
{props.title}</p>
    );
   }
   
  const defaultProps = {
  
    center: {
      lat: -33.9249,
      lng: 18.4241
     
    },
    zoom: 9
  };

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }
  return (
    <>
    <div className="dashboard">
    <h1>Dashboard</h1>
    <div className='welcome'>
    <h5>Welcome: {currentUser.username}</h5>
    </div>
    <h3>Locations Sites: {posts.length}</h3>
    <div style={{ height: '60vh', width: '70vw' }}>
      {posts?
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyB5o-gFEfMaWlniBtBOWkozXBz6mCsUrWg" }}
        // defaultCenter={defaultProps.center}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {posts.length>0? posts.map((post, i) => (
      <MapMarker key={i.toString()} title={post.post} lat={parseFloat(post.latitude)} lng={parseFloat(post.longitude)} />
    )):null}
       
      </GoogleMapReact>
:null}
    
    </div>
<div>
  <Link to="/locations">
  <Button>View Locations</Button>
  </Link>

</div>
    </div>
   </>
  )
}

export default Dashboard