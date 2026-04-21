import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
// import Skeleton  from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import "./CardSkeleton.css"
export const CardSkeleton = () => {
  return (

    <div className="container"  >
    <Skeleton sx={{borderRadius:"1rem"}}  variant="rounded" width={275} height={208} />
    <div className="subcontainer">
      <Skeleton variant="circular" width={42} height={42} />
      <Skeleton variant="circular" width={42} height={42} /> 
      <Skeleton variant="circular" width={42} height={42} /> 
      <Skeleton variant="circular" width={42} height={42} />
      <Skeleton variant="circular" width={42} height={42} />


    </div>
    <div className="textContainer">

    <Skeleton variant="text" width={190} sx={{ fontSize: '2rem',borderRadius:".5rem" }} />
    </div>
    <div className="textContainer">

    <Skeleton variant="text" width={210} sx={{ fontSize: '1.5rem',borderRadius:".5rem" }} />
    </div>
    <div className="endContainer">
      <Skeleton variant="rectangular" sx={{borderRadius:".8rem"}}  width={110} height={48} />
      <Skeleton variant="rounded" sx={{borderRadius:"3rem"}}  width={100} height={48} />
    </div>
    </div>



  )
}
export const OfferSkeleton = () => {
  return (
<Skeleton varient="rounded" width={240} sx={{height:"530px",borderRadius:"1rem", margin:"10px",   boxShadow:" 0 5px 20px hsla(52,20%,69%,.22)"}} />
  )
}
export const TherapySkeleton = () => {
  return (
    <div className="offercontainer">
    <Skeleton variant="rectangular" sx={{borderRadius:"5rem", boxShadow:" 0 5px 20px hsla(52,20%,69%,.22)"}}  width={160} height={208} />
    <div className="offersubcontainer">
      <div style={{width:"100%",display:"flex" , justifyContent:"center"}}>
  <Skeleton variant="text" width={160} sx={{ fontSize: '1rem',borderRadius:".8rem", boxShadow:" 0 5px 20px hsla(52,20%,69%,.22)" }} />
      </div>
      <div style={{width:"100%",display:"flex" , justifyContent:"center"}}>
  <Skeleton variant="text" width={100} sx={{ fontSize: '1rem',borderRadius:".8rem", boxShadow:" 0 5px 20px hsla(52,20%,69%,.22)" }} />
      </div>


    </div>
  </div>
  )
}


