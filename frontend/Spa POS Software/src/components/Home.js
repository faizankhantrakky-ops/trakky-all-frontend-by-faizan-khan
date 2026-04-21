import React,{useContext, useEffect, useState} from "react";
import './Home.css'
import LineGraph from "./Home/LineGraph";
import BarGraph from "./Home/BarGraph";
import AppointmentActivity from "./Home/AppointmentActivity";
import TodayAppointment from "./Home/TodayAppointment";
import TopServices from "./Home/TopServices";
import Topmember from './Home/Topmember'
import AuthContext from "../Context/Auth";
import DashSales from "./Home/DashSales";
import DashStaff from "./Home/DashStaff";
import DashClient from "./Home/DashClient";
import { Navigate, useNavigate } from "react-router-dom";
function Home() {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [dashData , setDashdata] = useState([])
  const [activeTeam, setActiveTeam] = useState('Sales');
  const [staffData , setStaffData] = useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response = await fetch('https://backendapi.trakky.in/spavendor/dashboard/sales/',{
          method:'GET',
          headers:{
            authorization:`Bearer ${token}`,
            'Content-type':'application/json'
          }
        })
        if(response.ok){
          const responseData = await response.json()
          setDashdata(responseData)
        }
        else{
          console.log('error')
        }
      }
      catch(error){
        console.log(error)
      }
    }
    fetchData()
  },[token])

  const handleTeamClick = (team) => {
    setActiveTeam(team);
  };

  useEffect(()=>{
    const Staff = async ()=>{
      const response = await fetch('https://backendapi.trakky.in/spavendor/staff-monthly-detail/',{
        method:"GET",
        headers:{
          authorization:`Bearer ${token}`,
          'Content-type': 'application/json'
        }
      })
      if(response.ok){
        const responseData = await response.json()
        setStaffData(responseData)
      }
      else{
        console.log('error while fetching data')
      }
    }
    Staff()
  },[token])

  return (
    <>  
    <div className="POSgraphs flex flex-col items-center">
    <span className='w-full flex justify-center relative top-[25px]'><h1 className='text-[18px] font-semibold'>Dashboard</h1></span>
    <div className="w-full flex justify-start p-[10px] max-lg:justify-center">
    <div className="teamsTableNavigation">
      <div
        style={{cursor:'pointer', padding:'10px 15px'}}
        className={activeTeam === 'Sales' ? 'activeTeamsLink' : ''}
        onClick={() => handleTeamClick('Sales')}
      >
        Sales
      </div>
      <div
      style={{cursor:'pointer', padding:'10px 15px'}}
        className={activeTeam === 'Staff' ? 'activeTeamsLink' : ''}
        onClick={() => handleTeamClick('Staff')}
      >
        Staff
      </div>
      <div
      style={{cursor:'pointer', padding:'10px 15px'}}
        className={activeTeam === 'Client' ? 'activeTeamsLink' : ''}
        onClick={() => navigate('/clients')}
      >
        Client
      </div>
    </div>
    </div>
    <div>
      {activeTeam === 'Sales' ? <DashSales data={dashData}/> : activeTeam === 'Staff' ? <DashStaff data = {staffData}/> : activeTeam === 'Client' ? <DashClient/> : null}
    </div>
    {/* <LineGraph/>
    <BarGraph/>
    <AppointmentActivity/>
    <TodayAppointment/>
    <TopServices/>
    <Topmember/> */}
    </div>
    </>
  );
}

export default Home;
