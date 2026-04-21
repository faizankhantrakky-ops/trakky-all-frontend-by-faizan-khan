import React from 'react'

function TopServices() {
  return (
    <div className="HomeCardPOS">
        <h2>Top Services</h2>
        <div style={{ height: "240px", overflowX: "auto" }}>
            <table>
                <thead>
                    <tr className='Headingtable_POS'>
                    <th>Service</th>
                    <th>This Month</th>
                    <th>Last Month</th>
                    </tr>
                </thead>
                <tbody className='tablebodyPOS'>
                    <tr>
                        <td>Haircut</td>
                        <td className='TableDataPOS'>8</td>
                        <td className='TableDataPOS'>2</td>
                    </tr>
                    <tr>
                        <td>Blow dry</td>
                        <td className='TableDataPOS'>10</td>
                        <td className='TableDataPOS'>8</td>
                    </tr>
                    <tr>
                        <td>Beard Grooming</td>
                        <td className='TableDataPOS'>5</td>
                        <td className='TableDataPOS'>8</td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default TopServices