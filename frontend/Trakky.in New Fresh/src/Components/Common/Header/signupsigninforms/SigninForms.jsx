import React from "react";
import trakkywhite from "../../../../Assets/images/logos/Trakky logo white.png";
import trakkypurple from "../../../../Assets/images/logos/Trakky logo purple.png";
import trakkyblack from "../../../../Assets/images/logos/trakky_black_logo.png";
import close from "../../../../Assets/images/logos/close.svg";
import AuthContext from "../../../../context/Auth";
import toast, { Toaster } from "react-hot-toast";
// import WhatsappForm from "../../whatsapp/WhatsappForm";

const SigninForms = ({ fun }) => {
  let {
    loginUser,
    logoutUser,
    isAuthenticated,
    signupUser,
    otpstage,
    setotpstage,
  } = React.useContext(AuthContext);
  // const [City, setCity] = React.useState([]);
  // const [skip, setSkip] = React.useState(false);
  // const [area, setarea] = React.useState([]);
  const [signin, setsignin] = React.useState(true);
  const [otp, setotp] = React.useState(false);
  const [otp2, setotp2] = React.useState(false);
  const [phonenumber, setPhonenumber] = React.useState();
  const [formData, setFormData] = React.useState({
    city: null,
    area: null,
  });

  const regex = {
    phonenumber: /^[0-9]{10}$/,
    email: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
    username: /^[a-zA-Z0-9_-]{3,16}$/,
    password: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
    otp: /^[0-9]{6}$/,
  };

  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesignusubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const phonenumber = e.target.phonenumber.value;
    // const email = e.target.email.value;
    // const city = e.target.city.value;
    // const area = formData.area;
    if (!regex.username.test(username)) {
      toast.error("Please enter a valid username");
      return;
    }
    if (!regex.phonenumber.test(phonenumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // signupUser(username, phonenumber);
    signupUser(phonenumber);
  };

  const handleloginUser = (e) => {
    e.preventDefault();
    const phonenumber = e.target.phonenumber.value;
    const otp = e.target.otp.value;
    if (!regex.phonenumber.test(phonenumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!regex.otp.test(otp)) {
      toast.error("OTP Length must be 6");
      return;
    }
    // if(!regex.password.test(otp)){
    //   toast.error("Please enter a valid OTP")
    //   return
    // }
    // if (btnClick) {
    //   // setSkip(true);
    //   loginUser(phonenumber, otp);
    // } else {
    //   loginUser(phonenumber, otp);
    // }
    loginUser(phonenumber, otp);
  };
  React.useEffect(() => {
    if (otpstage === true) {
      setotp2(true);
    } else {
      setotp2(false);
    }
  }, [otpstage]);
  React.useEffect(() => {
    if (isAuthenticated) {
      fun();
      setotp(false);
    } else {
      setotp(false);
    }
  }, [isAuthenticated]);
  React.useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  // const getcity = async () => {
  //   const response = await fetch("https://backendapi.trakky.in/salons/city/");
  //   const data = await response.json();
  //   setCity(data.payload);
  // };

  // const getArea = () => {
  //   if (formData.city === null) {
  //     return;
  //   }
  //   const data = City.filter((item) => {
  //     return item.id === parseInt(formData.city);
  //   });
  //   setarea(data[0].area_names);
  // };

  // React.useEffect(() => {
  //   getArea();
  // }, [formData.city]);

  // React.useEffect(() => {
  //   getcity();
  // }, []);

  const otprequest = async (e) => {
    e.preventDefault();
    if (!regex.phonenumber.test(e.target.phonenumber.value)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const response = await fetch("https://backendapi.trakky.in/salons/otp/", {
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
      toast.success("OTP sent");
    } else {
      toast.error("error while sending otp please try again");
    }
  };
  const handleOtpRequest = () => {
    const response = otprequest();
    if (response.status === 400) {
      signupUser(phonenumber);
    }
  };
  const otprequesttwo = async (e) => {
    e.preventDefault();
    const response = await fetch("https://backendapi.trakky.in/salons/otp/", {
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
      <div className="">
        <div className=" w-[19rem] h-[35rem] md:w-[35rem] md:h-[33rem] lg:h-[37rem] bg-white  rounded-lg flex flex-col relative ">
          <img
            src={close}
            className=" w-[1.5rem] absolute top-0 right-0 m-3 "
            onClick={() => {
              fun();
              setotp(false);
              setotp2(false);
              setotpstage(false);
            }}
            alt="close Button"
            srcSet=""
          />

          <div className="w-[100%] min-h-[6rem] h-[10%]  flex justify-center items-center  ">
            <div className="w-[28%]  flex justify-center items-center  ">
              <img
                src={trakkypurple}
                className="  w-[100%]  "
                alt="Trakky salon booking platform logo"
              />
            </div>
            <div className="   text-start font-[400] ml-4 text-xl md:text-2xl text-black ">
              For Salons
            </div>
          </div>
          <div className="w-[100%] h-[90%] flex justify-center items-start  ">
            <div className=" w-[90%]  md:w-[100%]  h-[100%] flex flex-col  justify-start items-center  ">
              <div className=" w-[100%]  h-[2rem] lg:h-[2.5rem] px-9 flex  justify-center items-center  ">
                <div
                  onClick={() => {
                    setsignin(true);
                    setotp2(false);
                  }}
                  className={`w-[20rem] h-[100%]  rounded-lg flex justify-center items-center ${
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
                  className={`w-[20rem] h-[100%]  rounded-lg flex justify-center items-center ${
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
                  onSubmit={otp ? handleloginUser : handleOtpRequest}
                  method="post"
                >
                  <div className="w-[80%] flex justify-center flex-col items-center mb-[1rem] mt-[2rem] gap-3">
                    <div className="  text-xl lg:text-3xl font-[700] text-black">
                      {" "}
                      Login to account.
                    </div>
                    <div className=" text-black  text-[.7rem] ">
                      Witness The revolution of Grooming Industry.
                    </div>
                    <div>
                      <button className="hidden px-3 py-2 text-black bg-white ">
                        continue with Google{" "}
                      </button>
                    </div>
                    <div className="hidden text-black "> ----or---- </div>
                  </div>

                  <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white ">
                    <input
                      className="w-[100%] h-[90%] text-[0.9rem] rounded-md border-black border-2 text-black bg-white  px-4  placeholder:text-black  placeholder:opacity-80 focus:outline-black "
                      name="phonenumber"
                      placeholder="Enter Contact Number  "
                      type="text"
                    />
                  </div>

                  {otp && (
                    <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white  ">
                      <input
                        className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black placeholder:opacity-80 focus:outline-black "
                        name="otp"
                        type="text"
                        placeholder="Enter the OTP here"
                      />
                    </div>
                  )}
                  <div className="min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white ">
                    <button
                      className="w-[100%] h-[100%] bg-black rounded-md "
                      type="submit"
                    >
                      {otp ? "Verify OTP" : "send OTP"}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  action=""
                  className=" w-[100%] h-[calc(100%-4rem)]  gap-1 flex flex-col justify-start items-center  "
                  method="post"
                  onSubmit={otp2 ? handleloginUser : handlesignusubmit}
                >
                  <div className="w-[80%] flex justify-center flex-col items-center mt-[2rem]  gap-3">
                    <div className=" text-xl lg:text-3xl font-[700] text-black">
                      Create a new account.
                    </div>
                    <div className=" text-black text-[.7rem] ">
                      Witness The revolution of Grooming Industry.
                    </div>
                    <div>
                      <button className="hidden px-3 py-2 text-white bg-black ">
                        continue with Google{" "}
                      </button>
                    </div>
                    <div className="hidden text-black "> ----or---- </div>
                  </div>
                  <div className="min-w-[230px] min-h-[35px]  w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white  ">
                    <input
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black  placeholder:opacity-80 focus:outline-black "
                      placeholder="Username"
                      type="text"
                      name="username"
                    />
                  </div>
                  <div className=" min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white  ">
                    <input
                      className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black placeholder:opacity-80 focus:outline-black "
                      type="number"
                      placeholder="Contact Number"
                      name="phonenumber"
                      onWheel={() => document.activeElement.blur()}
                      onKeyDownCapture={(event) => {
                        if (
                          event.key === "ArrowUp" ||
                          event.key === "ArrowDown"
                        ) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {/*    <div className=" min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white  ">
                      <input
                        className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black placeholder:opacity-80 focus:outline-black "
                        type="email"
                        placeholder="Email address"
                        name="email"
                      />
                    </div>
                    <div className=" min-w-[230px] min-h-[35px]  w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white  ">
                      <select
                        className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white px-3  placeholder:text-black placeholder:opacity-80 focus:outline-black"
                        name="city"
                        id=""
                        value={formData.city}
                        onChange={handlechange}
                      >
                        <option
                          className="text-[0.9rem]"
                          disabled
                          selected
                          hidden
                        >
                          Select City
                        </option>
                        {City?.map((item) => {
                          return (
                            <option className="text-[0.9rem]" value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className=" min-w-[230px] min-h-[35px]  w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.5rem] text-white  ">
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
                        {area?.map((item, index) => {
                          return (
                            <option
                              className="text-[0.9rem]"
                              name="area"
                              value={index}
                              key={index}
                            >
                              {item}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                      */}
                  {otp2 && (
                    <div className=" min-w-[230px] min-h-[35px] w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white  ">
                      <input
                        className="w-[100%] h-[90%] text-[0.9rem] border-black border-2 text-black rounded-md bg-white  px-4  placeholder:text-black placeholder:opacity-80 focus:outline-black "
                        type="text"
                        placeholder="Enter the OTP here"
                        name="otp"
                      />
                    </div>
                  )}
                  <div className=" min-w-[230px] min-h-[35px]  w-[70%]  h-[2rem] lg:w-[60%] lg:h-[2.8rem] text-white  ">
                    <button
                      className="w-[100%] h-[100%] bg-black rounded-md "
                      type="submit"
                    >
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
