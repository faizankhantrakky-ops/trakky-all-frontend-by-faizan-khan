import Preview from "./Preview/Preview";
import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import UploadVect from "../assets/Upload_imageVector.png";
import Timerangepicker from "./Preview/Timerangepicker";
function Onlineprofile() {
  const fileInputreftwo = useRef()
  const fileInputref = useRef()
  const fileinputCustomerRef = useRef()
  const fileinputDailyUpdate = useRef()
  const[salonName,setSalonName] = useState('Sample Salon Name')
  const [profileOffer,setProfileOffer] = useState('Sample Profile Offer')
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [category,setCategory] = useState('')
  const [service,setService] = useState('')
  const [startTime,setStartTime] = useState(null)
  const [endTime,setEndTime] = useState(null)
  const [mainImage,setMainImage] = useState(null)
  const [CustExpImg,setCustExpImg] = useState(null)
  const [CustExpTitle,setCustExpTitle] = useState('')
  const [CustExpCaption,setCustExpcaption] = useState('')
  const [DailyUpdateImg,setDailyUpdateImg] = useState(null)
  const [DailyupdateTitle,setDailyupdateTitle] = useState('')
  const [DailyupdateCaption,setDailyupdatecaption] = useState('')
  function handleClick(){
    fileInputref.current.click()
  }
  function handleClicktwo(){
    fileInputreftwo.current.click()
  }

  function handleClickCustomerExp(){
    fileinputCustomerRef.current.click()
  }

  function handleClickDailyUpdate(){
    fileinputDailyUpdate.current.click()
  }
  return (
    <div className="p-[10px] pl-[82px] w-full flex flex-col max-sm:p-[10px] max-sm:pl-[10px]">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-2xl">Setup your profile page</p>
        <p className="text-[18px]">
          Setup your profile page on the Trakky website
        </p>
      </div>
      <div className="flex pt-[20px] gap-[30px] max-sm:flex-col max-sm:items-center max-sm:pt-[10px]">
        <div className="w-[50%] h-auto rounded-xl flex justify-center max-sm:w-full">
          <div className="flex-col bg-white flex items-center w-[90%] p-[25px] gap-[20px] rounded-[10px] h-max max-sm:p-[10px] max-sm:w-full">
            <div className=" border-2 h-max w-[90%] flex items-center p-[10px] flex-col gap-[15px] max-sm:w-full">
              <h1 className="text-[22px]">Salon Details</h1>
              <TextField
                id="outlined-basic"
                label="Salon Name"
                variant="outlined"
                className="w-[400px] max-xl:w-full"
                onChange={(e)=>{setSalonName(e.target.value)}}
              />
              <div className="flex w-full justify-center gap-[20px]">
                <span className="flex w-[190px]  max-xl:w-full">
                  <FormControl fullWidth className="w-[60%]">
                    <InputLabel id="demo-simple-select-label">Area</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={area}
                      label="area"
                      onChange={(e) => {
                        setArea(e.target.value);
                      }}
                    >
                      <MenuItem value={"Vasna"}>Vasna</MenuItem>
                      <MenuItem value={"Thaltej"}>Thaltej</MenuItem>
                      <MenuItem value={"Prahladnagar"}>Prahladnagar</MenuItem>
                    </Select>
                  </FormControl>
                </span>
                <span className="flex w-[190px] max-xl:w-full">
                  <FormControl fullWidth className="w-[60%]">
                    <InputLabel id="demo-simple-select-label">City</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={city}
                      label="city"
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                    >
                      <MenuItem value={"Ahmedabad"}>Ahmedabad</MenuItem>
                      <MenuItem value={"Gandhinagar"}>Gandhinagar</MenuItem>
                      <MenuItem value={"Baroda"}>Baroda</MenuItem>
                    </Select>
                  </FormControl>
                </span>
              </div>
              <div className="flex w-full justify-center gap-[20px]">
                <div className=" p-[10px] border-2 h-[130px] w-[190px] flex flex-col items-center gap-[5px] rounded-xl cursor-pointer max-xl:w-full" onClick={handleClick}>
                  <img src={UploadVect} alt="" className="h-auto w-[80px] max-sm:w-[60px]" />
                  <p>Main Image</p>
                  <p className="text-[14px] max-xl:text-[12px]">{mainImage ? mainImage.name : "upload image here"}</p>
                  <input ref={fileInputref} type="file" style={{ display: "none" }} onChange={(e)=>{setMainImage(e.target.files[0])}} />
                </div>
                <div className=" p-[10px] border-2 h-[130px] w-[190px] flex flex-col items-center gap-[5px] rounded-xl   max-xl:w-full" onClick={handleClicktwo}>
                  <img src={UploadVect} alt="" className="h-auto w-[80px] max-sm:w-[60px]" />
                  <p >Other Images</p>
                  <p className="text-[14px] max-xl:text-[10px]">upload other files here</p>
                  <input type="file" style={{ display: "none" }} ref={fileInputreftwo} />
                </div>
              </div>
              <TextField
                id="outlined-basic"
                label="profile offer text"
                variant="outlined"
                className="w-[400px]  max-xl:w-full"
                onChange={(e)=>{setProfileOffer(e.target.value)}}
              />
              <div className="w-full">
              <Timerangepicker start={setStartTime} end={setEndTime}/>
              </div>
              <div className="w-full flex justify-center">
              <button className="bg-[#512DC8] px-[60px] py-[10px] rounded-2xl text-white">Save</button>
              </div>
            </div>
            
            <div className=" border-2 h-max w-[90%] flex items-center p-[10px] flex-col gap-[15px] max-sm:w-full">
              <h1 className="text-[22px]">Customer's Experiance</h1>
              
              <div className="flex w-full justify-center gap-[20px]">
                <span className="flex w-[190px] max-xl:w-full">
                  <FormControl fullWidth className="w-[60%]">
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={category}
                      label="category"
                      onChange={(e) => {
                        setCategory(e.target.value);
                      }}
                    >
                      <MenuItem value={"Haircut"}>Haircut</MenuItem>
                      <MenuItem value={"Eyebrows"}>Eyebrows</MenuItem>
                      <MenuItem value={"Beard Styling"}>Beard Styling</MenuItem>
                    </Select>
                  </FormControl>
                </span>
                <span className="flex w-[190px]  max-xl:w-full">
                  <FormControl fullWidth className="w-[60%]">
                    <InputLabel id="demo-simple-select-label">Service</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={service}
                      label="service"
                      onChange={(e) => {
                        setService(e.target.value);
                      }}
                    >
                      <MenuItem value={"Service1"}>Service1</MenuItem>
                      <MenuItem value={"Service2"}>Service2</MenuItem>
                      <MenuItem value={"Serice3"}>Service3</MenuItem>
                    </Select>
                  </FormControl>
                </span>
              </div>
              <div className="flex w-full justify-center gap-[20px]">
                <div className=" p-[10px] border-2 h-[130px] w-[400px] flex flex-col items-center gap-[5px] rounded-xl cursor-pointer  max-xl:w-full" onClick={handleClickCustomerExp}>
                  <img src={UploadVect} alt="" className="h-auto w-[80px]" />
                  <p>Upload a file</p>
                  <p className="text-[14px]">{CustExpImg ? CustExpImg.name : "Upload customer experiance here"}</p>
                  <input ref={fileinputCustomerRef} type="file" style={{ display: "none" }} onChange={(e)=>{setCustExpImg(e.target.files[0])}} />
                </div>
              </div>
              <TextField
                id="outlined-basic"
                label="Title"
                variant="outlined"
                className="w-[400px] max-xl:w-full"
                onChange={(e)=>{setCustExpTitle(e.target.value)}}
              />
              <TextField
                id="outlined-basic"
                label="Caption"
                variant="outlined"
                className="w-[400px] max-xl:w-full"
                onChange={(e)=>{setCustExpcaption(e.target.value)}}
              />
              <button className="bg-[#512DC8] px-[60px] py-[10px] rounded-2xl text-white">Save</button>
            </div>

            <div className=" border-2 h-max w-[90%] flex items-center p-[10px] flex-col gap-[15px] max-sm:w-full">
              <h1 className="text-[22px]">Daily updates</h1>
              <div className="flex w-full justify-center gap-[20px]">
                <div className=" p-[10px] border-2 h-[130px] w-[400px] flex flex-col items-center gap-[5px] rounded-xl max-xl:w-full" onClick={handleClickDailyUpdate}>
                  <img src={UploadVect} alt="" className="h-auto w-[80px]" />
                  <p>Upload a file</p>
                  <p className="text-[14px]"> {DailyUpdateImg ? DailyUpdateImg.name : "Upload an update here"}</p>
                  <input ref={fileinputDailyUpdate} type="file" style={{ display: "none" }} onChange={(e)=>{setDailyUpdateImg(e.target.files[0])}}/>
                </div>
              </div>
              <TextField
                id="outlined-basic"
                label="Title"
                variant="outlined"
                className="w-[400px] max-xl:w-full"
                onChange={(e)=>{setDailyupdateTitle(e.target.value)}}
              />
              <TextField
                id="outlined-basic"
                label="Caption"
                variant="outlined"
                className="w-[400px] max-xl:w-full"
                onChange={(e)=>{setDailyupdatecaption(e.target.value)}}
              />
              <button className="bg-[#512DC8] px-[60px] py-[10px] rounded-2xl text-white">Save</button>
            </div>

          </div>
        </div>
        <div className="w-[50%] rounded-xl">
          <div className="flex flex-col items-center justify-center">
            <Preview area={area} city={city} name={salonName} profOffer={profileOffer} start={startTime} end={endTime} image={mainImage} custExp={CustExpImg} CustTit={CustExpTitle} DailyUpdateimg={DailyUpdateImg} DailyupdCap={DailyupdateCaption} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onlineprofile;
