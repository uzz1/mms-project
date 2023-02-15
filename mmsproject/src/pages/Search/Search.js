import React, { useState } from 'react';

import { checkAuth, getToken } from '../../utils';
import {Link} from 'react-router-dom';
import './Search.css';

const Search = () => {
  const [results, setResults] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const makeSearch = (search) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    // make a formdata
    const formdata = new FormData();

    formdata.append('term', search);

    // make a request
    fetch('/api/search', {
      method: 'POST',
      body: formdata,
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setMessage('');
          setResults(data.posts);
        } else if (data.status === 404) {
          setResults('');
          setMessage("Oops, No locations found...");
        } else {
          setResults('');
          setMessage("Oops, Some error happened! Try Again...");
        }
      })
      .catch(e => {
        setResults('');
        setMessage("Oops, Some error happened! Try Again...");
      });
  }


  const output = results && (
    results.map(result => (
      <div key={result.id} className="user">
        <Link to={`images/${result.id}`}>
        <div>
        <img className="user__profile_pic" src={result.img} alt="location image" />
        <span className="user__username">
          {result.post}
        </span>
        </div>
        </Link>
       
        <div>
          
        </div>
      </div>
    ))
  );

  return (
    <div className="search">
      <h1>Search</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Search Locations..." value={search} onChange={(e) => {
          setSearch(e.target.value);
          if (e.target.value !== '') {
            makeSearch(e.target.value);
          } 
        }} />
      </form>

      <p className="search__message">{message && message}</p>
      <div className="search__results">
        {output}
      </div>
    </div>
  );
}

export default Search;