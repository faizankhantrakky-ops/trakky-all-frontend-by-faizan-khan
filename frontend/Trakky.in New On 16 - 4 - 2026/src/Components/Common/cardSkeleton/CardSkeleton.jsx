import React from 'react'
import Skeleton from '@mui/material/Skeleton';

import "./CardSkeleton.css"
export const CardSkeleton = () => {
  return (

    <div className="container" style={{margin:"1rem 0.5" , width:"320px"}}>
    <Skeleton sx={{borderRadius:"1rem"}}  variant="roundped" width={276} height={185 } />
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
<Skeleton varient="rounded" width={240} sx={{height:"530px",borderRadius:"1rem",boxShadow:" 0 5px 20px hsla(52,20%,69%,.22)",marginLeft:"10px",marginRight:"10px"}} />
  )
}
export const SalonServicesSkeleton = () => {
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

export const SalonCardMobileSkeleton=({key})=>{
  return(
    <div className="w-[100%] mb-[20px]  min-w-[320px] h-[170px] max-w-[360px] rounded-lg overflow-hidden  bg-white flex flex-col shadow-xl  border-[2px] border-[#dfdfdf] ">
        <div className="h-[calc(170px-35px)] w-full  flex" >
          <div className="w-[50%] h-full mt-1 ml-1  flex flex-col  justify-start  ">
            <div className="w-[170px] h-[120px]  rounded-xl loader_anim   relative" >
            
            </div>
    
          </div>
          <div className="w-[50%] h-full  flex flex-col justify-start  items-start text-xs font-[80] text-ellipsis overflow-hidden  mt-1 ml-2   ">
            <p className=" line-clamp-1 text-[.8rem] mt-[4px]  font-[600] loader_anim w-[6rem] h-[1rem]  "></p>
            <p className=" text-[.75rem] font-[400] h-[16px] line-clamp-1 loader_anim  mt-[8px] w-[5rem]  "></p>
            <div className="h-[30px] w-full flex   items-start  my-[3px] ">
                <div  className="w-[30px] h-[30px] mr-[.2rem]  loader_anim  rounded-full " ></div>
                <div  className="w-[30px] h-[30px] mr-[.2rem]  loader_anim  rounded-full " ></div>
                <div  className="w-[30px] h-[30px] mr-[.2rem]  loader_anim  rounded-full " ></div>
                <div  className="w-[30px] h-[30px] mr-[.2rem]  loader_anim  rounded-full " ></div>
                <div  className="w-[30px] h-[30px] mr-[.2rem]  loader_anim  rounded-full " ></div>
              
          
              </div>
            <p className="font-[400] flex items-center mt-[6px] gap-1 justify-start loader_anim  w-[4rem] h-[1rem] " ></p>
            
            <div className="flex justify-between  mt-[6px] loader_anim  w-[5rem] h-[1rem] " > 
           
             </div>
         
            {/* <div className="bg-[#eee]  w-[80px] h-[20px] font-[400]  rounded-sm flex justify-center items-center">
              <span>09:00 - 20:00</span>
            </div> */}
          </div>

        </div>
        <div className="h-[35px] w-full flex  " >
          <div className="w-[50%] h-full loader_anim  flex justify-center font-bold  items-center  border-r-[2px] border-r-gray-300 " ></div>
          <div className="w-[50%] h-full bg-[#F8F8F8] flex justify-center font-bold items-center loader_anim  " ></div>

        </div>
      </div>
  )
}
export const SalonCardSkeleton=({key})=>{
  return(
    <div className="salon_card">
      <div className="image__container loader_anim ">

        
      </div>

      <div className="salon_information__container">
        <div className="row1">
          <div className="salon_name">
            <h2>
             <p style={{width:"160px",height:"20px",borderRadius:"2px"}} className="loader_anim"></p>
            </h2>
          
            <p>
            
              <p style={{width:"120px",height:"20px",borderRadius:"2px"}} className="loader_anim"></p>
            </p>
          </div>
          <div className="salon_offer_tag__box">
          <div style={
                {
                  width:"40px",
                  height:"40px",
                  borderRadius:"50%",
                  marginRight:"5px"
                }
                
              }className="loader_anim"></div>
          </div>
        </div>

        <div className="row2">
          <div className="salon_icon__box">
          
            <ul style={{ display: "flex", alignItems: "center" }}>
              <div style={
                {
                  width:"30px",
                  height:"30px",
                  borderRadius:"50%",
                  marginRight:"5px"
                }
                
              }className="loader_anim"></div>
              <div style={
                {
                  width:"30px",
                  height:"30px",
                  borderRadius:"50%",
                  marginRight:"5px"
                }
                
              }className="loader_anim"></div>
              <div style={
                {
                  width:"30px",
                  height:"30px",
                  borderRadius:"50%",
                  marginRight:"5px"
                }
                
              }className="loader_anim"></div>
              <div style={
                {
                  width:"30px",
                  height:"30px",
                  borderRadius:"50%",
                  marginRight:"5px"
                }
                
              }className="loader_anim"></div>
              <div style={
                {
                  width:"30px",
                  height:"30px",
                  borderRadius:"50%",
                  marginRight:"5px"
                }
                
              }className="loader_anim"></div>
              
            </ul>
          </div>
          <div className="salon_price_tag">
          <p style={{width:"120px",height:"25px",borderRadius:"2px"}} className="loader_anim"></p>
          </div>
        </div>
        <div className="row3">
          <div className="salon_rating__box">
           
            <p className="time_tag loader_anim ">
             
            </p>
          </div>
          <div className="salon_booking_buttons ">
            <p  className="loader_anim" ></p>
            <p
              className="loader_anim"  
            ></p>
          </div>
        </div>
      </div>
    </div>
  )
}


