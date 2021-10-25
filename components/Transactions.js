import react, {useEffect, useState} from 'react'
import styles from '../styles/Transactions.module.css'
import TransactionsPieChart from './TransactionsPieChart'

/* 
Maybe make a dropdown where you can filter by month and then by category?
*/

let net_worth = 0;

const formatDate = (date) => {
  const dateObj = new Date(date +'T00:00:00');
  return new Intl.DateTimeFormat('en-US').format(dateObj);
}

export default function Transactions(props) {
  const [displayedTData, setDisplayedTData] = useState(props.data);
  const [toggleDirection, setToggleDirection] = useState(true); 
  const [toggleDateDirection, setToggleDateDirection] = useState(false);
  const [showPieChart, setShowPieChart] = useState(true);
  
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const sortDate = () => {
    if (!showPieChart) { setShowPieChart(!showPieChart)}
    console.log("sorting dates...")
    const new_data = [...displayedTData];
    if (toggleDateDirection) {
      new_data.sort(function(a,b) { return (new Date(b.date)) - (new Date(a.date))})
    } else {
      new_data.sort(function(a,b) { return (new Date(a.date)) - (new Date(b.date))})
    }
    console.log(new_data);
    setDisplayedTData(new_data);
    setToggleDateDirection(!toggleDateDirection);
  }

  const sortValue = (data) => {
    if (!showPieChart) { setShowPieChart(!showPieChart)}
    const new_data = [...displayedTData]
    if (toggleDirection) {
      new_data.sort(function(a,b) { return a.amount - b.amount })
    } else {
      new_data.sort(function(a,b) { return b.amount - a.amount });
    }
    setDisplayedTData(new_data);
    setToggleDirection(!toggleDirection);
    return new_data;
  }

  const handleChartClick = (e) => {
    setShowPieChart(!showPieChart);
    
  }

  useEffect(() => {    

  }, [displayedTData])

  return (
    <div className={styles.nav}> 
      <div className={styles.sub_container}>
        <h3>Filter by: </h3>
        <button type="button" className={styles.button} onClick={()=> sortDate()} className="btn btn-success mr-2">Date</button>        
        <button type="button" className={styles.button} onClick={()=> sortValue()}className="btn btn-success mr-2">Amount</button>
        <button type="button" className={styles.button} onClick={()=> handleChartClick()}className="btn btn-success mr-2"> Category Breakdown</button>
      </div>
      {showPieChart ? 
      <section className={styles.data}>
              <div className={styles.transactions}>
                {/* <h3 className={styles.tx_title}> Recent Transactions</h3> */}
                {displayedTData.length !== 0 ? 
                <ul className={styles.tx_list}>
                  {displayedTData.map((transaction, transactionIdx) => {
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
              

            </section> : <TransactionsPieChart data={props.data} />}
    </div>
  )
}