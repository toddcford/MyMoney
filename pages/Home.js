import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import BalancesPieChart from "../components/BalancesPieChart"
import Investments from "../components/Investments"
import Transactions from "../components/Transactions"
import Liabilities from '../components/Liabilities'
import React, {useState, useEffect} from "react";
import styles from '../styles/Dashboard.module.css'


const DEPOSITORY_ACCOUNTS = ['Plaid Checking', 'Plaid Saving', 'Plaid CD', 'Plaid Money Market']
const LIABILITY_ACCOUNTS = ['Plaid Credit Card', 'Plaid Student Loan' ,'Plaid Mortgage']
const INVESTMENT_ACCOUNTS = ['Plaid IRA', 'Plaid 401k'];
let net_worth = 0;

const formatDate = (date) => {
  const dateObj = new Date(date +'T00:00:00');
  return new Intl.DateTimeFormat('en-US').format(dateObj);
}
export default function Home() {
  
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // Need to add this state so we can keep the original data after filtering 
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [investmentSecurities, setInvestmentSecurities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState('Overview');

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const handleClick = (e) => {
    document.getElementById(activePage).style.color = 'black';
    setActivePage(e.target.innerText);
  }

  const sortClick = (e) => {
    const new_transactions = transactions.filter(transaction => {
      let new_account = accounts.filter(account => account.account_id === transaction.account_id)                  
      return (new_account[0].name === e.target.innerText)
    })
    setDisplayedTransactions(new_transactions);    
  }
  
  
  const getData2 = async () => {
    console.log("calling data 2")
    const response = await fetch('/api/investments');
    const investment_data = await response.json();
    console.log("investments: ", investment_data);
    setInvestmentSecurities(investment_data);
    
    const response2 = await fetch('/transactions_help');
    const transactions_data = await response2.json(); 
    console.log("transactions: ", transactions_data);
    setTransactions(transactions_data);
    setDisplayedTransactions(transactions_data);
    const response3 = await fetch('/api/accounts');
    const accounts_data = await response3.json();
    console.log("accounts: ", accounts_data.accounts);
    setAccounts(accounts_data.accounts);
    const response4 = await fetch('/api/balances');
    const balances_data = await response4.json();
    console.log("balances: ", balances_data);
    setBalances(balances_data)
    calculateTotals(balances_data);
    setIsLoading(false)
    
  
  }
  
  const getTransactions = async () => {
    setTimeout(getData2, 3000);
    const response = await fetch('/api/transactions');
    const data = await response.json();
    console.log(data);
    console.log("called setTimeout");
   }

   const calculateTotals = (balances_data) => {   
     for (const item of balances_data) {  
       if (LIABILITY_ACCOUNTS.includes(item.name)) {     
         net_worth -= item.balances.current;
       } else {     
         net_worth += item.balances.current;
       }
     }     
   }

   useEffect(() => {
    getTransactions();
   },[])

  useEffect(() => {
    if (!isLoading) document.getElementById(activePage).style.color = 'blue';
  }, [activePage])
  

  return ( 
    
      <div className={styles.orig_container}>
      {isLoading ? 
      <div>
      <h2 className={styles.loader}>Gathering Your Information...</h2>
      <div className={styles.loading_wrapper}>                     
        <p className={styles.spinner}></p>
      </div>
      </div>:  
      
      <div className={styles.dashboard_container}>
      {/* <button className='btn btn-primary' onClick={()=>getTransactions()}>Get Transactions</button> */}
      <Router>
      <section className={styles.summary_bar}>
        <div className={styles.options}>
          <h5 className={styles.option_title} id='Overview' onClick={(e)=> handleClick(e)}> <Link to="/">Overview </Link> </h5>
          <h5 className={styles.option_title} id='Transactions Detail'onClick={(e)=> handleClick(e)}> <Link to="/transactions">Transactions Detail </Link> </h5>
          <h5 className={styles.option_title} id='Investments' onClick={(e)=> handleClick(e)}> <Link to="/investments">Investments </Link></h5>
          <h5 className={styles.option_title} id='Liabilities'onClick={(e)=> handleClick(e)}> <Link to='/liabilities'>Liabilities </Link></h5>
        </div>
        </section>
        <Switch>
          <Route path='/liabilities'>
            <Liabilities data={balances} />
          </Route>
          <Route path="/transactions">
            <Transactions data={transactions} />
          </Route>
          <Route path="/investments">
            <Investments data={investmentSecurities} />
          </Route>
          <Route path="/">
              <section className={styles.data}>
              {/* <div className={styles.current_total}>
                <h2> {formatter.format(net_worth)} </h2>  
              </div> */}
              
            
              <div className={styles.accounts}>
                <h3 className={styles.accounts_title}>Accounts Breakdown</h3>
                <div className={styles.pieChart}> 
                  <BalancesPieChart data={balances} />
                </div>                      
              </div>
              <div className={styles.transactions}>
                <h3 className={styles.tx_title}> Recent Transactions</h3>
                {displayedTransactions.length !== 0 ? 
                <ul className={styles.tx_list}>
                  {displayedTransactions.map((transaction, transactionIdx) => {
                    return <li  className={styles.transaction_element} key={transactionIdx}>
                              <div className={styles.name_and_amount}>                          
                                  <p>
                                    {formatter.format(transaction.amount)}
                                  </p>
                                  <p className={styles.category}>
                                    {transaction.category[0]}
                                  </p>                          
                              </div>
                              <div className={styles.name}>
                                  <p className={styles.tx_type}>{transaction.name}</p>
                                  <p className={styles.date}>{formatDate(transaction.date)}</p>

                              </div>                          
                              
                              </li>
                  })}
                </ul> : <></>}
                
              </div>
              

            </section>
          </Route>
        </Switch>
      </Router>
      </div>
    }  
    </div>
    
  )
}

