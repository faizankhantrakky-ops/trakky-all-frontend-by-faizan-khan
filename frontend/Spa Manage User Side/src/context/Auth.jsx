import { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
    useEffect(() => {
      console.log("first location")
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("location :: ",position)
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }, []);



  let [user, setUser] = useState(() =>
    localStorage.getItem("spauserAuthTokens")
      ? jwtDecode(localStorage.getItem("spauserAuthTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("spauserAuthTokens")
      ? JSON.parse(localStorage.getItem("spauserAuthTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

let [userData, setUserData] = useState({});

const fetchUserData = async () => {
  console.log("fetchUserData" , user);
  let url = `https://backendapi.trakky.in/spas/spauser/${user.user_id}/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens?.access_token}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      setUserData(data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

let loginUser = async (phonenumber, otp) => {
  const response = await fetch(
    "https://backendapi.trakky.in/spas/spauser/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phonenumber,
        otp: otp,
      }),
    }
  );
  const data = await response.json();
  if (data["error"] === "Invalid OTP.") {
    toast.error(data["error"]);
    return;
  }
  if (response.status === 200) {
    toast.success("OTP verified,Welcome to trakky ");
  }
  // if(response.status===201)
  // {
  //   alert("OTP verified")
  // }

  if (data) {
    localStorage.setItem("spauserAuthTokens", JSON.stringify(data));
    setAuthTokens(data);
    setUser(jwtDecode(data.access_token));
    setIsAuthenticated(true);
    //   navigate("/", { replace: true });
  } else {
    alert("Something went wrong while logging in the user! and saving data");
  }
};

const otprequest = async (phonenumber , refferalCode) => {
  const response = await fetch("https://backendapi.trakky.in/spas/otp/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number: phonenumber,
      referral_code: refferalCode,
    }),
  });
  if (response.status === 200) {
    toast.success("OTP sent");
    return true;
  } else {
    if (response.status === 400) {
      console.log(response)
      let data = await response.json();
      if (data?.error) {
        toast.error(data.error);
        return false;
      }
    }
    toast.error("error while sending otp please try agaifffn");
    return false;
  }
};
  // let signupUser = async (e) => {
  //   e.preventDefault();
    
  //   const response = await fetch("https://backendapi.trakky.in/spas/spauser/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       phone_number: e.target.phonenumber.value,
  //       username:e.target.username.value,
  //       // email:e.target.email.value,
  //       // city:parseInt(e.target.city.value),
  //       // area:e.target.area.value,

      
       
  //     }),
  //   });
  //   if (response.status === 401) {
  //     alert("error while registering the user please try again");
  //     return;
  //   }
  //   if(response.status===201){
  //     otprequest(e)
      
  //   }

  //   if(response.status===400){
  //     // alert("user with this email , phone number  already exist")
  //     response.json().then((data)=>{
  //       alert(data.message)
  //     }
  //     )
  //   }
  //   // let data = await response.json();

  //   // if (data) {
  //   //   localStorage.setItem("sapuserAuthTokens", JSON.stringify(data));
  //   //   setAuthTokens(data);
  //   //   setUser(jwtDecode(data.access_token));
  //   //   setIsAuthenticated(true);
  //   //   navigate("/", { replace: true });
  //   // } else {
  //   //   alert("Something went wrong while logging in the user!");
  //   // }
  // };



  let logoutUser = useCallback(() => {
    // e.preventDefault()
    localStorage.removeItem("spauserAuthTokens");
    setAuthTokens(null);
    setUser(null);
    // navigate("/", { replace: true });
    setIsAuthenticated(false);
  }, []);

  const updateToken = useCallback(async () => {
    const response = await fetch(
      "https://backendapi.trakky.in/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh_token }),
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      setAuthTokens({ ...authTokens, access_token: data.access });
      setUser(jwtDecode(data.access));
      setIsAuthenticated(true);
      localStorage.setItem(
        "sapuserAuthTokens",
        JSON.stringify({ ...authTokens, access_token: data.access })
      );
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  }, [authTokens, loading, logoutUser]);

  const [userFavorites, setUserFavorites] = useState([]);

  const fetchUserFavorites = async () => {
    let url = `https://backendapi.trakky.in/spas/userfavorite/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserFavorites(data);
      }

      if (response.status === 404) {
        setUserFavorites([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if ((authTokens?.access || authTokens?.access_token) && user.user_id) {
      fetchUserData();
    }

    if (authTokens?.access || authTokens?.access_token) {
      fetchUserFavorites();
    }
  }, [authTokens, user]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    setLatitude: setLatitude,
    setLongitude: setLongitude,
    isAuthenticated: isAuthenticated,
    userData: userData,
    fetchUserData,
    userFavorites: userFavorites,
    fetchUserFavorites: fetchUserFavorites,
    // signupUser:signupUser, 
    otprequest:otprequest,
    location:
    {
      latitude:latitude,
      longitude:longitude
    }
    // vendor: vendor
  };

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 30; 
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [authTokens, loading, updateToken]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
