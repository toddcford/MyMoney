import React, {useEffect, useState, useRef, forwardRef} from "react";
import { usePlaidLink } from 'react-plaid-link';
import styles from '../styles/Home.module.css'

const Link = (props) => {
  
  const onSuccess = React.useCallback((public_token, metadata) => {
    console.log(public_token)
    // send public_token to server
    const response = fetch('/api/exchange_public_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token }),
    });
    // response.then(data => {
    //   ref = data;
    //   console.log(data)});
    window.location.href = "/Home"
  }, []);
  
  const config = {
    token: props.linkToken,
    onSuccess
  };



  const { open, ready } = usePlaidLink(config);
  
  return (        
      <button type='submit' className="btn btn-primary"onClick={() => open()} >
        Link Account
      </button>
  );
};

export default Link;