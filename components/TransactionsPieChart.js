import React from 'react';
import styles from '../styles/TransactionsPieChart.module.css'
// import { Pie } from 'react-chartjs-2';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F','#FFBB28', '#FF8042', '#AF19FF'];


export default function TransactionsPieChart(props) {  
  let total_transactions = props.data.length;
  console.log(total_transactions);
  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
       const key = obj[property][0];
       if (!acc[key]) {
          acc[key] = [];
       }
       // Add object to list for given key's value
       acc[key].push(obj);
       return acc;
    }, {});
  }

  const groupedCategories = groupBy(props.data, 'category')
  console.log(groupedCategories);
  const pieData = [];

  
  for (const item of Object.keys(groupedCategories)) {
    
    console.log('item length: ', groupedCategories[item].length);
    console.log('item: ', item);
    console.log('item.key: ', item.key);
    
    pieData.push({
      // `${item}`.toString()): groupedCategories[item].length,
      'category': `${item}`,
      'amount': groupedCategories[item].length,
    })
  }

  console.log('pieData: ', pieData);
  

  
  console.log("transactions data: ", props.data);

  const CustomTooltip = ({ active, payload, label }) => {
    
    if (active) {
      console.log('payload value: ', payload[0].value)
      console.log('total_transactions: ', total_transactions);
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
                <label>{`${((payload[0].value / total_transactions) * 100).toFixed()}%`}</label>
            </div>
        );
    }

    return null;
};

  const renderLabel = function(entry) {
    return entry.category;
  }
  
  return (    
    <>
    <div className={styles.pie_chart}>
    <PieChart width={600} height={400}>
      <Pie data={pieData} dataKey="amount" label={renderLabel} >
        { 
        pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
        }
      </Pie>
      <Tooltip content={<CustomTooltip />}/>
      
    </PieChart>            
    </div>
  </>
  )
}