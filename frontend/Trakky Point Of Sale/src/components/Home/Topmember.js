import React from 'react'

function Topmember() {
  return (
    <div className="HomeCardPOS">
    <h2>Top Members</h2>
    <div style={{ height: "240px", overflowX: "auto" }}>
        <table>
            <thead>
                <tr className='Headingtable_POS'>
                <th style={{paddingRight:'280px'}}>Team Member</th>
                <th>This Month</th>
                <th>Last Month</th>
                </tr>
            </thead>
            <tbody className='tablebodyPOS'>
                <tr>
                    <td>Priyansh Bhavsar</td>
                    <td className='TableDataPOS'>₹1200</td>
                    <td className='TableDataPOS'>₹1600</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
  )
}

export default Topmember