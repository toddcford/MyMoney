import react, {useState} from 'react'
import styles from '../styles/TransactionsPieChart.module.css'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const LIABILITY_ACCOUNTS = ['Plaid Credit Card', 'Plaid Student Loan' ,'Plaid Mortgage']

export default function LiabilitiesPieChart(props) {

  const COLORS = ['#0088FE', '#00C49F','#FFBB28', '#FF8042', '#AF19FF'];

  const liabilities_data = props.data.filter(item => LIABILITY_ACCOUNTS.includes(item.name))
  console.log('liabilities_data: ', liabilities_data)

  const pieData = []
  for (const item of liabilities_data) { 
    pieData.push({
      "name": item.name,
      "current_balance": item.balances.current
    })
    
  } 
  const CustomTooltip = ({ active, payload, label }) => {
    
    if (active) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
                <label> ${payload[0].value} </label>
            </div>
        );
    }

    return null;
};
const renderLabel = function(entry) {
  return entry.name;
}

  return (
    <>
      <div className={styles.pie_chart}>
      <PieChart width={700} height={400}>
        <Pie data={pieData} dataKey="current_balance" label={renderLabel} >
          { 
          pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip content={<CustomTooltip />}/>
        <Legend />
      </PieChart>            
      </div>
    </>
  )

}