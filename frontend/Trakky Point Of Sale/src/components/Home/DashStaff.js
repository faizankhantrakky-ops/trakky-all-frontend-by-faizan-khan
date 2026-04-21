import React from 'react'

const DashStaff = ({data}) => {
  return ( 
    <div className='listAppointmentPOS DashStaffPOS' style={{width:'92vw'}}>
      <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Address</th>
            <th>Salary</th>
            <th>Joining Date</th>
            <th>E-mail</th>
            <th>Gender</th>
            <th>Appointments</th>
        </tr>
        </thead>
        <tbody>
           {data.map((item,index)=>(
            <tr>
                <td>{item.staff.staffname}</td>
                <td>{item.staff.ph_number}</td>
                <td>{item.staff.address}</td>
                <td>{item.staff.salary}</td>
                <td>{item.staff.joining_date}</td>
                <td>{item.staff.email}</td>
                <td>{item.staff.gender}</td>
                <td>{item.staff.appointments}</td>
            </tr>
           ))}
        </tbody>
      </table>
    </div>
  )
}

export default DashStaff
