import React, {useState} from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../styles/Investments.module.css'

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default function Investments(props) {

  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (e) => {
    setActiveIndex(e.index);
    // console.log(e);
  }
  const { securities } = props.data; 
  let { holdings } = props.data;
  
  console.log("securities: ", securities);
  console.log("holdings: ", holdings);
  

  let chart_data = [];
  
  holdings.forEach((holding, holdingIndex) => {
    chart_data.push({
      'name': securities.filter(security => security.security_id === holding.security_id)[0].name,
      'quantity': holding.quantity,
      'price': holding.institution_price,
      'value': holding.quantity*holding.institution_price
    })
  })
  chart_data = chart_data.sort(function(a,b){ return b.value - a.value })
  let total_value = 0;
  for (let i = 0; i < chart_data.length; i++) {
    if (chart_data[i]['name'] === 'U S Dollar' ) { chart_data[i]['name'] = 'Cash' }
    total_value += chart_data[i].value;
    chart_data[i]['index'] = i;
  }
  console.log('chart_data: ', chart_data)
  let activeItem = chart_data[activeIndex];

  return (
    <div className="investments_container">
      <div>
        <h3 className={styles.title}> Portfolio Value: {formatter.format(total_value)} </h3>
      </div>
      <div className={styles.bar_chart}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart width={150} height={200} data={chart_data}>
            <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="value" onClick={(e)=>handleClick(e)} >
                {chart_data.map((entry, index) => (
                  <Cell cursor="pointer" fill={index===activeIndex ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
                ))}
              </Bar>              
              {/* <XAxis dataKey="name" /> */}
              <YAxis />
          </BarChart>
        </ResponsiveContainer>
        <p className="content">{`${activeItem.name}: ${formatter.format(activeItem.value)}`}</p>
      </div>
    </div>
  )
}

// import React, { PureComponent } from 'react';
// import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// export default class Investments extends PureComponent {
  

//   state = {
//     data: [
//       {
//         name: 'Page A',
//         uv: 4000,
//         pv: 2400,
//         amt: 2400,
//       },
//       {
//         name: 'Page B',
//         uv: 3000,
//         pv: 1398,
//         amt: 2210,
//       },
//       {
//         name: 'Page C',
//         uv: 2000,
//         pv: 9800,
//         amt: 2290,
//       },
//       {
//         name: 'Page D',
//         uv: 2780,
//         pv: 3908,
//         amt: 2000,
//       },
//       {
//         name: 'Page E',
//         uv: 1890,
//         pv: 4800,
//         amt: 2181,
//       },
//       {
//         name: 'Page F',
//         uv: 2390,
//         pv: 3800,
//         amt: 2500,
//       },
//       {
//         name: 'Page G',
//         uv: 3490,
//         pv: 4300,
//         amt: 2100,
//       },
//     ],
//     activeIndex: 0,
//   };

//   handleClick = (data, index) => {
//     this.setState({
//       activeIndex: index,
//     });
//   };

//   render() {
//     const { activeIndex, data } = this.state;
//     const activeItem = data[activeIndex];

//     return (
//       <div style={{ width: '100%' }}>
//         <p>Click each rectangle </p>
//         <ResponsiveContainer width="100%" height={500}>
//           <BarChart width={150} height={40} data={data}>
//             <Bar dataKey="uv" onClick={this.handleClick}>
//               {data.map((entry, index) => (
//                 <Cell cursor="pointer" fill={index === activeIndex ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//         <p className="content">{`Uv of "${activeItem.name}": ${activeItem.uv}`}</p>
//       </div>
//     );
//   }
// }