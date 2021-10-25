import React from 'react';
import styles from '../styles/PieChart.module.css'
// import { Pie } from 'react-chartjs-2';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';


const BalancesPieChart = (props) => {
  console.log(props.data);
  const COLORS = ['#0088FE', '#00C49F','#FFBB28', '#FF8042', '#AF19FF'];
  const labels = [];
  const granularData = []
  const pieData = []
  for (const item of props.data) { 
    pieData.push({
      "name": item.name,
      "current_balance": item.balances.current
    })
    labels.push(item.name)
    granularData.push(item.balances);
  } 
  const pie_data = {
    labels: labels,
    datasets: [
      {
        label: '$ Amount',
        data: granularData,
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#ffff', padding: '5px', border: '1px solid #cccc' }}>
                <label>{`${payload[0].name} : $${payload[0].value}`}</label>
            </div>
        );
    }

    return null;
};

  

  return ( 
    <>
      <div className={styles.pie_chart}>
      <PieChart width={400} height={400}>
        <Pie data={pieData} dataKey="current_balance" dataName="name" >
          { 
          pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip content={<CustomTooltip />}/>
        <Legend />
      </PieChart>            
      </div>
    </>

  )};

export default BalancesPieChart;