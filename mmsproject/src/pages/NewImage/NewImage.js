import React, { useState, useContext } from 'react';

import './NewImage.css';
import { PostContext } from '../../contexts/PostContext';
import { getToken, checkAuth } from '../../utils';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Webcam from "react-webcam";
import { useGeolocated } from "react-geolocated";
import {Link} from 'react-router-dom'

const NewImage = (props) => {
  const { id } = props.match.params;
  const [img, setImg] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState('');

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
          positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
        
      });

  const { posts, setPosts } = useContext(PostContext);

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

    // make a formdata
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
          // setImages([
          //   ...images,
          //   data.image
          // ]);
          setImage('');
          setText('');
          window.alert("Successfully added new image")
  
          props.history.push(`/images/${id}`);
        } else {
        setError("Oops, Some error happened! Try Again...");

        }
      })
      .catch(e => {
        setError("Oops, Some error happened! Try Again...");
      });
  }
  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "environment"
  };
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      
      setImg(imageSrc);
    },
    [webcamRef]
  );
  const retake = () => {
    setImg('')
  }

  return (
    <div className="newpost">
       <Link to="/locations">
      <Button>Back</Button>
      </Link>
      <br></br>
      <div>
        {img!=''? 
      (<img src={img} className="img"/>)
      :
      (
        <Webcam
        audio={false}
        height={400}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        videoConstraints={videoConstraints}
      />
      )}
    
      
      </div>
      {img===''?
      (<Button onClick={capture}>Capture photo</Button>)
      :
      (<Button onClick={retake}>Retake</Button>)  
    }
      
      <br></br>
      <br></br>
      {error && <p className="newpost__error">Oops, Some Error happened! Try Again...</p>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="siteName">Image Name</Label>
          <Input type="text" name="name" id="imageName" placeholder="Enter Image Name" onChange={
          e => setImage(e.target.value)} required/>
        
        </FormGroup>
        <FormGroup>
          {img!='' ?
          (          <Label for="img">Image Set</Label>
          )
          :
          (          <Label for="img">Image not set... Capture a photo</Label>
          )
        }

        </FormGroup>
        <FormGroup>
          <Label for="location">Location:</Label>

          {!isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        <table>
            <tbody>
                <tr>
                    <td>latitude</td>
                    <td>{coords.latitude}</td>
                </tr>
                <tr>
                    <td>longitude</td>
                    <td>{coords.longitude}</td>
                </tr>
               
            </tbody>
        </table>
    ) : (
        <div>Getting the location data&hellip; </div>
    )}

        </FormGroup>
        <Button>Add Image Object</Button>
      </Form>
     
    </div>
  );
}

export default NewImage;