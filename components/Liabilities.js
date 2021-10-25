import react from 'react'
import LiabilitiesPieChart from './LiabilitiesPieChart'
 
export default function Liabilities(props) {
  return (
    <LiabilitiesPieChart data={props.data}/>
  )
}