import React from 'react'
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const InventoryMob = () => {
  return (
    <div className="p-[10px] bg-white w-full flex flex-col gap-[10px] h-[100vh]">
    <h1 className="text-[22px] font-semibold">Product Management</h1>
    <Divider />
    <Link to="/sales/available-products">
      <span className='flex items-center justify-between p-[10px]'>
        <p>Product Menu</p>
        <KeyboardArrowRightIcon />
      </span>
    </Link>
    <Divider />
    <Link to="/sales/Inventory-Sales">
      <span className='flex items-center justify-between p-[10px]'>
        <p>Sales Inventory</p>
        <KeyboardArrowRightIcon />
      </span>
    </Link>
    <Divider />
    <Link to="/sales/Inventory-Use">
      <span className='flex items-center justify-between p-[10px]'>
        <p>Use Inventory</p>
        <KeyboardArrowRightIcon />
      </span>
    </Link>
    <Divider />
    <Link to="/sales/In-Inventory-Use">
      <span className='flex items-center justify-between p-[10px]'>
        <p>In use Product</p>
        <KeyboardArrowRightIcon />
      </span>
    </Link>
    <Divider />
    <Link to="/sales/stock-order">
      <span className='flex items-center justify-between p-[10px]'>
        <p>Product Order</p>
        <KeyboardArrowRightIcon />
      </span>
    </Link>
    <Divider />
    <Link to="/sales/Supplier">
      <span className='flex items-center justify-between p-[10px]'>
        <p>Distributor</p>
        <KeyboardArrowRightIcon />
      </span>
    </Link>
    <Divider />
    <Link to="/sales/sell-product">
      <span className='flex items-center justify-between p-[10px]'>
        <p>Sell Products</p>
        <KeyboardArrowRightIcon />
      </span>
    </Link>
    <Divider />
  </div>
  )
}

export default InventoryMob
