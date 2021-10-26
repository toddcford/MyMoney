import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState, useRef} from 'react';
import Link from '../components/Link'
import BalancesPieChart from '../components/BalancesPieChart'

import { tryGetPreviewData } from 'next/dist/server/api-utils';

export default function LogIn() {

  const [linkToken, setLinkToken] = useState(null);
  const [balancesData, setBalancesData] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);
  
  
  const getAccountData = async () => {
    const response = await fetch('/api/investments');
    const data = await response.json();
    setInvestmentData(data.securities);
    console.log(data);
  }
  
  const generateToken = async () => {
    const response = await fetch('/api/create_link_token', {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data);
    setLinkToken(data.link_token);
  };
  useEffect(() => {
    generateToken();
  }, []);
  
  return (
    <div className={styles.container}>
      
      <h1 className={styles.title}> My Money </h1>           
      <form action="/Home" method='POST' onSubmit={()=> getBalancesData()}className={styles.registration_form}>
        <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" value='demo' id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We &apos;ll never share your email with anyone else.</div>
          </div> 
        
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" />
        </div>
        {/* <button type='submit'></button> */}
          {linkToken != null ? <Link linkToken={linkToken} /> : <h1> Loading... </h1>}                
      </form>     
  
    
      {balancesData != null ? <BalancesPieChart data={balancesData}/> : <></>}
      
      {/* <button className="btn btn-primary"onClick={()=>getBalancesData()}> Get Balances </button> */}
      <div className="investments">
        {investmentData != null ?   
          <ul>
            {investmentData.map((investment, investmentIdx) => {
              return <li key={investmentIdx}> {investment.name} </li>
            })}
          </ul> : <></>
        }
        </div> 
    </div>    
  );
}




