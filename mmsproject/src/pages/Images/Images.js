import React, { useState, useEffect, useContext } from 'react';
import {Link} from 'react-router-dom'
import './Images.css';
import { checkAuth, getToken } from '../../utils';
import { ImageContext } from '../../contexts/ImageContext';
import { PostContext } from '../../contexts/PostContext';
import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';
import Webcam from "react-webcam";
import { useGeolocated } from "react-geolocated";
import {Button} from 'reactstrap'
import GoogleMapReact from 'google-map-react';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

const Images = (props) => {
  const { id } = props.match.params;
  const [msg, setMsg] = useState('Loading...');
  const { images, setImages } = useContext(ImageContext);
  const { posts } = useContext(PostContext);
  const [image, setImage] = useState('');
  const { public_id } = jwt.decode(Cookie.get('token'));
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [img, setImg] = useState('');
  

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
          positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
        
      });

  const toggleModal = () => {
    setModal(!modal);
  }
  let post = null;

  post = posts.find(post => {
    return String(post.id) === String(id);
    
  });

  const MapMarker = (props) => {
    return (

<p style={{color: "blue"}}>< LocationOnOutlinedIcon style={{color: "red"}} />
{props.name}</p>
    );
   }

   const defaultProps = {
  
    center: {
      lat: -33.9249,
      lng: 18.4241
     
    },
    zoom: 9
  };
  // const geoloc = () => {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //   let lat1 = position.coords.latitude
  //   let lng1 = position.coords.longitude

  //   window.alert(lat1+"  "+lng1);})
  // }

  const deleteImage = (pid, post_id, image_id) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    fetch('/api/delete_image', {
      method: 'DELETE',
      headers: {
        'public_id': pid,
        'post_id': post_id,
        'image_id': image_id,
        'x-access-token': getToken()
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        toggleModal();
        setError('');
        
        window.location.reload(true);
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

  
  const getImages = () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    if (!post) {
      setMsg('No Posts Found!');
    } else {
      fetch('/api/images', {
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
            setImages(data.images);
          } else {
            setMsg('Oops, Something went wrong!!!')
          }
        })
        .catch(e => {
          setMsg('No Sites Found!');
        });
    }
  }

  useEffect(() => {
    getImages();
    
  
    
  }, [post]);
  

  const handleSubmit = (e) => {
    e.preventDefault();


    const convertBase64ToFile = function (image) {
      const byteString = atob(image.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      const newBlob = new Blob([ab], {
        type: 'image/jpeg',
      });
      return newBlob;
    };
    const formdata = new FormData();

    formdata.append('name', image);
    formdata.append('id', id);
    formdata.append('img', convertBase64ToFile(img));
    formdata.append('lat', coords.latitude);
    formdata.append('long', coords.longitude);

    fetch('/api/add_image', {
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
          setImages([
            ...images,
            data.image
          ]);
          setImage('');
          window.location.reload(true);
        } else {
          setMsg('Oops some error happened');
        }
      })
      .catch(e => {
        setMsg('Oops some error happened');
      })
  }

  const component = post && (
    <>
    <div className="images__body">
      <div className="real_post">
        <br></br>
      <h2> {post.post}</h2>

       <br></br>
       <img className='post_image' src={post.img}/>
      <div>
        <p><strong>Timestamp: </strong>{post.date_posted}</p>
        </div>
      <div>
        <p><strong>Latitude: </strong>{post.latitude}</p>
        </div>
        <div>
        <p><strong>Longitude: </strong>{post.longitude}</p>
        </div>
        <div className="images__extras">
                  <span>Author: {post.author}</span>
                  </div>
                  </div>
<br></br>
<br></br>
<h1>Mapped Image Geolocations</h1>
<div style={{ height: '60vh', width: '70vw' }}>

      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyB5o-gFEfMaWlniBtBOWkozXBz6mCsUrWg" }}
        // defaultCenter={defaultProps.center}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {images.length>0? images.map((im, i) => (
      <MapMarker key={i.toString()} name={im.name} lat={parseFloat(im.latitude)} lng={parseFloat(im.longitude)} />
    )):null}
       
      </GoogleMapReact>
      </div>

        <br></br>
<br></br>
        <h2>Images</h2>
     <br></br>

      {
       
        images.length > 0 ? (
          <div className="images">
            {images.map(image => (
              <div key={image.id} className="image">
                <div className="images__left">
                  <img className="image_img" src={image.img} alt="img" />
                </div>
                <div className="images__right">
                <h5><strong>{image.name}</strong></h5>
                <h5>{image.date_posted.slice(0,9)}</h5>
                <h5>{image.date_posted.slice(10)}</h5>

                  <div className="images__right_top">
                    
                    <strong>Latitude</strong>
                    <span>{image.latitude}</span>
                    </div>
                    <div className="images__right_top">
                    <strong>Longitude</strong>
                    <span>{image.longitude}</span>
                    </div>
                    <div className="images__right_top">
                    <Button onClick={() => deleteImage(public_id, id, image.id)}>delete</Button>
</div>
                  <div className="images__extras">
                  <span>Author: {image.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <p className="msg">No Images Found!!!</p >
          )
      }
    
      
    </div>
    <form onSubmit={handleSubmit}>
    <div className="add_image" >
     
     <div className="input_div">
    <Link to={`/newimage/${id}`}>
             <Button className="btn btn-primary post-btn">Add New Image</Button>
</Link>
     </div>

      
          </div>
          </form>
    
    </>
  );
  
  
  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  return (
    <div className="images">
      <Link to="/locations">
      <Button>Back</Button>
      </Link>
      <br></br>
      <br></br>
      <div className="images__header">
       <h1>Location Site Images</h1>
      
       
      
      </div>
      {msg && <p className="msg">{msg}</p>}
      {component}
    
    
    
    </div>
  );
}

export default Images;