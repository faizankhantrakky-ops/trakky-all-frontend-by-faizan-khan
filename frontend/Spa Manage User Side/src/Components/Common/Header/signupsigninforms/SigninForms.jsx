import React from "react";
import trakkywhite from "../../../../Assets/images/logos/Trakky logo white.png";
import trakkypurple from "../../../../Assets/images/logos/Trakky logo purple.png";
import trakkyblack from "../../../../Assets/images/logos/trakky_black_logo.png";
import close from "../../../../Assets/images/logos/close.svg";
import AuthContext from "../../../../context/Auth";
import {useEffect} from "react";

const SigninForms = ({ fun }) => {
  let { loginUser, logoutUser, isAuthenticated, signupUser, otpstage, setotpstage} =
    React.useContext(AuthContext);
  // const [City, setCity] = React.useState([]);
  // const [area, setarea] = React.useState([]);
  // const [skip, setSkip] = React.useState(false);
  const [signin, setsignin] = React.useState(true);
  const [otp, setotp] = React.useState(false);
  const [otp2, setotp2] = React.useState(false);
  const [formData,setFormData]=React.useState({
    "city":null,
    "area":null,
  }) 
  useEffect(()=>{
    return(
      setotp(false),
      setotp2(false),
      setotpstage(false)
    )
  },[])
  React.useEffect(() => {
    if (otpstage === true) {
      setotp2(true);
    } else {
      setotp2(false);
    }
  }, [otpstage]);

  const handlechange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  React.useEffect(() => {
    if (isAuthenticated) {
      fun();
    } else {
      setotp(false);
    }
  }, [isAuthenticated]);
  React.useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  // const getcity = async () => {
  //   const response = await fetch("https://backendapi.trakky.in/spas/city/");
  //   const data = await response.json();

  //   setCity(data.payload);
  // };

  // const getArea = () => {
  //   if(formData.city===null){
  //     return
  //   }
  //     const data = City.filter((item) => {
  //       return item.id === parseInt(formData.city);
  //     });
  //     setarea(data[0].area_names);
  // };

  // React.useEffect(() => {
  //   getArea();
  // }, [formData.city]);
 
  // React.useEffect(() => {
  //   getcity();
  // }, []);

  const otprequest = async (e) => {
    e.preventDefault();
    const response = await fetch("https://backendapi.trakky.in/spas/otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: e.target.phonenumber.value,
      }),
    });

    if (response.status === 200) {
      setotp(true);
      alert("OTP sent");
    } else {
      alert("error while sending otp please try again");
    }
  };
  const otprequesttwo = async (e) => {
    e.preventDefault();
    const response = await fetch("https://backendapi.trakky.in/spas/otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: e.target.phonenumber.value,
      }),
    });

    if (response.status === 200) {
      setotp2(true);
      alert("OTP sent");
    } else {
      alert("error while sending otp please try again");
    }
  };

  return (
    <div>

      <div className="   ">
        <div className=" w-[19rem] h-[35rem] md:w-[35rem] md:h-[33rem] lg:h-[37rem] bg-white  rounded-lg flex flex-col relative ">
          <img
            src={close}
            className=" w-[1.5rem] absolute top-0 right-0 m-3 "
            onClick={() => {
             fun();
             setotpstage(false);
             setotp(false);
             setotp(false);
            }}
            alt="close icon"
            srcSet=""
          />
          <div className="w-[100%] min-h-[6rem] h-[10%]  flex justify-center items-center  ">
            <div className="w-[28%]  flex justify-center items-center ">
              <img src={trakkypurple} className="   w-[100%]  " alt="logo" />

            </div>
              <div className=" text-start font-[400] ml-4 text-xl md:text-2xl text-black">
                For Spas
              </div>
          </div>
          <div className="w-[100%] h-[90%] flex justify-center items-start  ">
            <div className="  w-[90%]  md:w-[100%]  h-[100%] flex flex-col  justify-start items-center  ">
              <div className=" w-[100%]  h-[2rem] lg:h-[2.5rem] px-9  flex  justify-center items-center  ">
                <div
                  onClick={() => {
                    setsignin(true);
                    setotp2(false);
                  }}
                  className={`w-[20rem] h-[100%] rounded-md flex justify-center items-center ${
                    signin
                      ? "text-white bg-black shadow-md"
                      : "bg-white text-black  "
                  } transition-all duration-700  md:text-xl md:font-[500] `}
                >
                  Sign In
                </div>
                <div
                  onClick={() => {
                    setsignin(false);
                    setotp(false);
                  }}
                  className={`w-[20rem] h-[100%] rounded-md flex justify-center items-center ${
                    signin
                      ? "text-black bg-white "
                      : "text-white transition-all duration-700 bg-black shadow-md"
                  }  md:text-xl md:font-[500]`}
                >
                  Sign Up
                </div>
              </div>
              {signin ? (
                <form
                  action=""
                  className=" w-[100%] h-[calc(100%-4rem)]  gap-1 flex flex-col justify-start items-center  "
                  onSubmit={otp ? loginUser : otprequest}
                  method="post"
                >
                  <div className="w-[80%] flex justify-center flex-col items-center my-8 gap-3">
                    <div className=" text-xl lg:text-3xl font-[700] text-black">
                      {" "}
                      Login to account.
                    </div>
                    <div className=" text-black  text-[.7rem] ">
                      Witness The revolution of Grooming Industry.
                    </div>
                    <div>
                      <button className=" bg-white  px-3 py-2  text-black hidden  ">
                        continue with Google{" "}
                      </button>
                    </div>
                    <div className="text-black hidden "> ----or---- </div>
                  </div>

                  <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white ">
                    <input
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black  placeholder:opacity-80 focus:outline-black  "
                      name="phonenumber"
                      placeholder="Enter Contact Number  "
                      type="tel"
                      
                    />
                  </div>

                  {otp && (
                    <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white  ">
                      <input
                        className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black  placeholder:opacity-80 focus:outline-black "
                        name="otp"
                        type="text"
                        placeholder="Enter the OTP here"
                      />
                    </div>
                  )}
                  <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white ">
                    <button className="w-[100%] h-[100%] rounded-md bg-black " type="submit">
                      {otp ? "Verify OTP" : "send OTP"}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  action=""
                  className=" w-[100%] h-[calc(100%-4rem)]  gap-1 flex flex-col justify-start items-center  "
                  method="post"
                  onSubmit={otp2 ? loginUser : signupUser}
                >
                  <div className=" w-[80%] flex justify-center flex-col items-center mt-[2rem] gap-3">
                    <div className="text-xl lg:text-3xl font-[700] text-black">
                      {" "}
                      Create a new account.
                    </div>
                    <div className=" text-black text-[.7rem] ">
                      Witness The revolution of Grooming Industry.
                    </div>
                    <div>
                      <button className=" bg-black  px-3 py-2  text-white hidden  ">
                        continue with Google{" "}
                      </button>
                    </div>
                    <div className="text-black hidden "> ----or---- </div>
                  </div>
                  <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white ">
                    <input
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black  placeholder:opacity-80 focus:outline-black "
                      placeholder="Username"
                      type="text"
                      name="username"
                    />
                  </div>
                  <div className=" min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white ">
                    <input
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black  placeholder:opacity-80 focus:outline-black "
                      type="text"
                      placeholder="Contact Number"
                      name="phonenumber"
                    />
                  </div>
                  {/* <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white ">
                    <input
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black  placeholder:opacity-80 focus:outline-black "
                      type="email"
                      placeholder="Email address"
                      name="email"
                    />
                  </div>
                  <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white">
                    <select
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-3  placeholder:text-black  placeholder:opacity-80 focus:outline-black "
                      name="city"
                      id=""
                      value={formData.city}
                      onChange={handlechange}
                    >
                      <option disabled selected hidden value=""  className="text-[0.9rem]">
                        Select City
                      </option>
                      {City?.map((item) => {
                        return <option className="text-[0.9rem]" value={item.id}>{item.name}</option>;
                      })}
                    </select>
                  </div>
                  <div className="  min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white  ">
                    <select
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white px-3  placeholder:text-black placeholder:opacity-80 focus:outline-black"
                      name="area"
                      id=""
                      value={formData.area}
                      onChange={handlechange}
                    >
                      <option
                        className="text-[0.9rem]"
                        disabled
                        selected
                        hidden
                        value=""
                      >
                        Select Area
                      </option>
                      {area?.map((item,index) => {
                        return (
                          <option className="text-[0.9rem]" name="area" value={item} key={index}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div> */}
                  {otp2 && (
                    <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white ">
                      <input
                        className="w-[100%] text-[0.9rem] h-[90%] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black placeholder:opacity-80 focus:outline-black  "
                        type="text"
                        placeholder="Enter the OTP here"
                        name="otp"
                      />
                    </div>
                  )}
                  <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white ">
                    <button className="w-[100%] h-[100%] rounded-md bg-black" type="submit">
                      {" "}
                      ADD USER
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForms;
{
  /* {otp2?"Verify OTP":"send OTP"} */
}
