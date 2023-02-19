import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';

import './NewPost.css';
import { PostContext } from '../../contexts/PostContext';
import { getToken, checkAuth } from '../../utils';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Webcam from "react-webcam";
import { useGeolocated } from "react-geolocated";

const NewPost = (props) => {
  const [img, setImg] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');


  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
          positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
        
      });

  const { posts, setPosts } = useContext(PostContext);

  useEffect(() => {    
  },[])
  
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    if (img==='') {
      return window.alert("Image Not Set")
    }

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
    if (latitude === '') {
      setLatitude(coords.latitude)
    }
    if (longitude === '') {
      setLatitude(coords.longitude)
    }
    
    const formdata = new FormData();

    formdata.append('text', text);
    formdata.append('img', convertBase64ToFile(img));
    formdata.append('lat', latitude);
    formdata.append('long', longitude);

    fetch('/api/newpost', {
      method: 'POST',
      body: formdata,
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setPosts([
            data.post,
            ...posts
          ]);
          setText('');
          window.alert("Successfully added new location site")

          props.history.push('/locations');
        } else {
        setError("Oops, Some error happened! Try Again...");

        }
      })
      .catch(e => {
        setError("Oops, Some error happened! Try Again...");
      });
  }
  const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: "environment"
  };
  const webcamRef = useRef(null);
  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      
      setImg(imageSrc);
    },
    [webcamRef]
  );
  const retake = () => {
    setImg('')
  }

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setImg(newUrl);
      }
    }
  }
  const handleFileInput = useRef(null);

  // const askCameraPermission = async () => {
  //   try {
  //   await navigator.mediaDevices.getUserMedia({ video: true })
  //   .then(response => {
  //    window.alert(response)
  //   })
  // } catch (err) {
  //   window.alert(err.message)
  // }
  //}

const isMobile = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};




  return (
    <div className="newpost">
      <div className='mt'>
        <h2>Add New Location</h2>
        <br></br>
      {!isMobile.any()?
      img!=''? 
      (<img src={img} className="img"/>)
      :
      (
        <Webcam
        audio={false}
        height={500}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
        videoConstraints={videoConstraints}
      />
      )
      :
      img!=''? 
      (<img src={img} className="img"/>)
      :
      (
      <p>Capture an image to view it here</p>
      )
    }
      </div>
      {isMobile.any()?
      <>
      <br></br>
    <label for="file" className="label">Capture Image</label>
       <input 
       accept="image/*" 
       id="file" 
       type="file" 
       capture="environment"
       ref={handleFileInput}
       onChange={(e) => handleCapture(e.target)}
       style={{visibility:"hidden"}}
       />
       </>
       :
       (
       img===''?
      (<Button onClick={capture}>Capture Image</Button>)
      :
      (<Button onClick={retake}>Retake</Button>)  
       )
      }
     
     
      <br></br>
      <br></br>
      {error && <p className="newpost__error">Oops, Some Error happened! Try Again...</p>}
      <Form onSubmit={handleSubmit}>
      <FormGroup>
        {img!='' ?
          (          <Label style={{color: "green"}} for="img"><strong>Image Set</strong></Label>
          )
          :
          (          <Label style={{color: "red"}}  for="img"><strong>Image not set... Capture a photo</strong></Label>
          )
        }

        </FormGroup>
        <FormGroup>
          <Label for="siteName"><strong>Location Site Name</strong></Label>
          <Input type="text" name="name" id="siteName" placeholder="Enter Site Name" onChange={
          e => setText(e.target.value)} required/>
        
        </FormGroup>
       
        <FormGroup>
          <Label for="img"><strong>Location:</strong></Label>

          {!isGeolocationAvailable ? (
            <>
            <div>Your browser does not support Geolocation... Manually enter location</div>
            <br></br>
            <FormGroup>
          <Label for="latitude"><strong>Latitude</strong></Label>
          <Input type="text" name="latitude" id="latitude" placeholder="Enter Latitude" onChange={
          e => setLatitude(e.target.value)} required/>
        
        </FormGroup>
        <FormGroup>
          <Label for="longitude"><strong>Longitude</strong></Label>
          <Input type="text" name="longitude" id="siteName" placeholder="Enter Longitude" onChange={
          e => setLongitude(e.target.value)} required/>
        
        </FormGroup>
            </>
    ) : !isGeolocationEnabled ? (
      <>
        <div>Geolocation is not enabled... Manually enter location</div>
        <br></br>
        <FormGroup className='center'>
          <Label for="latitude"><strong>Latitude</strong></Label>
          <Input type="text" name="latitude" id="latitude" placeholder="Enter Latitude" value={latitude} onChange={
          e => setLatitude(e.target.value)} required/>
        
        </FormGroup>
        <FormGroup>
          <Label for="longitude"><strong>Longitude</strong></Label>
          <Input type="text" name="longitude" id="siteName" placeholder="Enter Longitude" value={longitude} onChange={
          e => setLongitude(e.target.value)} required/>
        
        </FormGroup>
        </>
    ) : coords ? (
      
        <table>
            <tbody>
                <tr>
                    <td><strong>Latitude</strong></td>
                    <td>{coords.latitude}</td>
                </tr>
                <tr>
                    <td><strong>Longitude</strong></td>
                    <td>{coords.longitude}</td>
                </tr>
               
            </tbody>
        </table>
    ) : (
        <div>Getting the location data&hellip; </div>
    )}

        </FormGroup>
        <Button>Add Location Site</Button>
      </Form>
     
    </div>
  );
}

export default NewPost;