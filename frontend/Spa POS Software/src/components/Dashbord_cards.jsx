import React from 'react'
import "./css/Dashbord_cards.css"
const Dashbord_cards = (data) => {
  return (
    <div id="parent"  >
    <div id="ch1" >{data.name}</div>
    <div id="ch2"  >{data.number}</div>

  </div>
  )
}

export default Dashbord_cards