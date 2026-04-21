import React from 'react'

const DashSales = ({data}) => {
    console.log(data,'sales')
  return (
    <div className='flex gap-[20px] flex-wrap justify-center items-center p-[10px]'>
        <div className='DashCardPOS bg-white w-[200px] flex justify-center items-center flex-col p-[10px]'>
            <p>Total Bill Amount</p>
            {data["Total Bill Amount"]}
        </div>
        <div className=' DashCardPOS bg-white w-[200px] flex justify-center items-center flex-col p-[10px]'>
            <p>Total Bill Count</p>
            {data["Total Bill Count"]}
        </div>
        <div className='DashCardPOS bg-white w-[200px] flex justify-center items-center flex-col p-[10px]'>
            <p>Average Bill Amount</p>
            {data["Average Bill Amount"]}
        </div>
        <div className='DashCardPOS bg-white w-[200px] flex justify-center items-center flex-col p-[10px]'>
            <p>Unpaid Bill Amount</p>
            {data["Unpaid Bill Amount"]}
        </div>
        <div className='DashCardPOS bg-white w-[200px] flex justify-center items-center flex-col p-[10px]'>
            <p>Card Appointments</p>
            {data["Card Appointments"]}
        </div>
        <div className='DashCardPOS bg-white w-[200px] flex justify-center items-center flex-col p-[10px]'>
            <p>UPI Appointments</p>
            {data["UPI Appointments"]}
        </div>
        <div className='DashCardPOS bg-white w-[200px] flex justify-center items-center flex-col p-[10px]'>
            <p>Cash Appointments</p>
            {data["Cash Appointments"]}
        </div>
    </div>
  )
}

export default DashSales
