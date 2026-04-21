import React, { useState } from 'react'
import './Mainappointment.css'
import Addappointment from './Addappointment';
import Appointment from './Appointment';
export default function MainAppointment() {
  const [active, setactive] = useState("Appointments");
  return (
    <>
      <div className='mainAppointmentoutermostsect_POS' style={{ padding: "10px 10px 25px 82px", width: '100%', display: 'flex', flexFlow: 'column', gap: '20px' }}>
       <span className='w-full flex justify-center'><h1 className='text-[18px] font-semibold'>Appointment Management</h1></span> 
        <div className='btngrpAppointmentMainPOS'>
          <button
            className={`homebtnAppointmentsPOS1 ${active === "Appointments" ? "POSactiveAppointmentpage" : ""
              }`}
            onClick={() => {
              setactive("Appointments");
            }}
          >
            Appointments
          </button>

          <button
            className={`homebtnAppointmentsPOS2 ${active === "Add_Appointment" ? "POSactiveAppointmentpage" : ""
              }`}
            onClick={() => {
              setactive("Add_Appointment");
            }}
          >
            Add Appointment
          </button>
        </div>
        {active === 'Appointments' ? <Appointment /> : <Addappointment />}
      </div>
    </>
  )
}
