import React, { useState, useContext } from 'react';
import { checkAuth } from '../../utils';
import { Redirect } from 'react-router-dom';

import './Signup.css';

import { Link } from 'react-router-dom';
import ErrorField from '../../components/ErrorField/ErrorField';
import { AuthContext } from '../../contexts/AuthContext';
import { Avatar } from '@material-ui/core';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';


const Signup = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setSignUpMsg } = useContext(AuthContext);

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    common: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append('username', username);
    formdata.append('email', email);
    formdata.append('password', password);

    fetch('/api/signup', {
      method: 'POST',
      body: formdata
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        // everything went well, redirect to Login
        setUsername('');
        setEmail('');
        setPassword('');

        // show success message
        setSignUpMsg(data.msg);

        props.history.push('/login');
      } else {
        switch (data.field) {
          case "username":
            setErrors({
              username: data.msg,
              email: '',
              password: '',
              common: ''
            });
            break;
          case "email":
            setErrors({
              username: '',
              email: data.msg,
              password: '',
              common: ''
            });
            break;
          case "password":
            setErrors({
              username: '',
              email: '',
              password: data.msg,
              common: ''
            });
            break;
          case "common":
            setErrors({
              username: '',
              email: '',
              password: '',
              common: data.msg
            });
            break;
          default:
            setErrors({
              username: '',
              email: '',
              password: '',
              common: "Oops, something went wrong!"
            });
            break;
        }
      }
    })
    .catch(e => {
      setErrors({
        username: '',
        email: '',
        password: '',
        common: "Oops, something went wrong!"
      });
    });
  }

  if (checkAuth()) {
    return <Redirect to={{
      pathname: '/'
    }} />
  }

  return (
    <div className="container">
      <div className="signup">
        <h1>Register</h1>
        <Avatar className="icon" />
        <Form onSubmit={handleSubmit}
        className="signup__form">
        <FormGroup>
          <Label for="username">Username</Label>
          <Input type="text" 
          name="username"
          value={username} 
          id="username" 
          placeholder="Choose a username"
          onChange={e => setUsername(e.target.value)}
          required
          minLength="2"
          maxLength="50"
          />
          {errors.username && <ErrorField error={errors.username} />}
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" 
          name="email"
          value={email} 
          id="email" 
          placeholder="yourmail@mail.com"
          onChange={e => setEmail(e.target.value)}
          required
          maxLength="150"
          />
          {errors.email && <ErrorField error={errors.email} />}
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" 
          name="password"
          value={password} 
          id="password" 
          placeholder="Choose a password"
          onChange={e => setPassword(e.target.value)}
          required
          minLength="8"
          />
 {errors.password && <ErrorField error={errors.password} />}
            {errors.common && <ErrorField error={errors.common} />}       
             </FormGroup>
             <button type="submit" className="btn btn-primary">Sign up</button>

        </Form>
        <div className="msg">
          Already have an account? <Link to="/login">Log in</Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;