import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
function TableAddProduct(props) {
    const {close} =  props
   console.log(props.close)
  return (
    <>
    <div className='HeaderTableAddproductPOS'>
        <span onClick={close}>
            <CloseIcon/>
        </span>
        <span className='AddproductPOSinsideTable'>
            Add Product     
        </span>
    </div>
    <div className='TaglinePOSAddProducts'>
        <span>
            Add Products
        </span>
        <span>
        Select products to add to the order
        </span>
    </div>
        <div className="tablebodyAddproductPOS">
        
            <table style={{borderSpacing:'0',borderCollapse:'collapse'}}>
                <thead>
                    <th>
                        Product Name
                    </th>
                    <th>
                        Category
                    </th>
                    <th>
                        Quantity
                    </th>
                    <th>
                        Product Cost
                    </th>
                </thead>
                <tbody>
                    <tr>
                        <td>Coconut Oil</td>
                        <td>Hair & Oil</td>
                        <td>0</td>
                        <td>₹600</td>
                    </tr>
                    <tr>
                        <td>Coconut Oil</td>
                        <td>Hair & Oil</td>
                        <td>0</td>
                        <td>₹600</td>
                    </tr>
                    <tr>
                        <td>Coconut Oil</td>
                        <td>Hair & Oil</td>
                        <td>0</td>
                        <td>₹600</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </>
  )
}

export default TableAddProduct