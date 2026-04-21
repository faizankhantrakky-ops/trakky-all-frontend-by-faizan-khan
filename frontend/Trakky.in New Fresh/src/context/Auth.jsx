import { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import toast from "react-hot-toast";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  useEffect(() => {
    console.log("Getting location");
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      console.log("Latitude is :", position.coords.latitude);
    });
  }, []);

  let [user, setUser] = useState(() =>
    localStorage.getItem("salonUserAuthTokens")
      ? jwtDecode(localStorage.getItem("salonUserAuthTokens"))
      : null
  );

  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("salonUserAuthTokens")
      ? JSON.parse(localStorage.getItem("salonUserAuthTokens"))
      : null
  );

  let [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //   const navigate = useNavigate();

  let [userData, setUserData] = useState({});

  const fetchUserData = async () => {
    let url = `https://backendapi.trakky.in/salons/salonuser/${user.user_id}/`;

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
      "https://backendapi.trakky.in/salons/salonuser/token",
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
      localStorage.setItem("salonUserAuthTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access_token));
      setIsAuthenticated(true);
      //   navigate("/", { replace: true });
    } else {
      alert("Something went wrong while logging in the user! and saving data");
    }
  };

const otprequest = async (phonenumber, refferalCode, gender) => {
  // Optional: You can also validate gender here
  if (!gender || !["male", "female", "other"].includes(gender.toLowerCase())) {
    toast.error("Please select a valid gender");
    return false;
  }

  try {
    const response = await fetch("https://backendapi.trakky.in/salons/otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phonenumber,
        referral_code: refferalCode || "", // optional field
        gender: gender.toLowerCase()     // Sending gender
      }),
    });

    const data = await response.json(); // Parse JSON to get error message if any

    if (response.status === 200) {
      toast.success("OTP sent successfully!");
      return true;
    } else {
      // Handle backend errors properly
      const errorMsg = data?.error || data?.message || "Failed to send OTP";
      toast.error(errorMsg);
      return false;
    }
  } catch (err) {
    console.error("OTP Request Error:", err);
    toast.error("Network error. Please check your connection.");
    return false;
  }
};

  // let signupUser = async (phonenumber) => {
  //   const response = await fetch(
  //     "https://backendapi.trakky.in/salons/salonuser/",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         phone_number: phonenumber,
  //       }),
  //     }
  //   );
  //   if (response.status === 401) {
  //     toast.error("error while registering the user please try again");
  //     return;
  //   }
  //   if (response.status === 201) {
  //     toast.success(
  //       "user registered successfully,OTP sent to registered Phone number for verification"
  //     );

  //     otprequest(phonenumber);
  //   }

  //   if (response.status === 400) {
  //     toast.error("user already exists");
  //   }

  //   // let data = await response.json();

  //   // if (data) {
  //   //   localStorage.setItem("salonUserAuthTokens", JSON.stringify(data));
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
    localStorage.removeItem("salonUserAuthTokens");
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
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      }
    );

    const data = await response.json();
    if (response.status === 200) {
      setAuthTokens({ ...authTokens, access_token: data.access });
      setUser(jwtDecode(data.access));
      setIsAuthenticated(true);
      localStorage.setItem(
        "salonUserAuthTokens",
        JSON.stringify({ ...authTokens, access_token: data.access })
      );
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  }, [authTokens, loading, logoutUser]);

  // let loginUserWithWhatsApp = async (phoneNumber, otp) => {
  //   try {
  //     // Make a request to your backend to authenticate the user using WhatsApp
  //     const response = await fetch("YOUR_BACKEND_ENDPOINT_HERE", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         phone_number: phoneNumber,
  //         otp: otp,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.status === 200) {
  //       // If authentication is successful, save tokens and user information
  //       localStorage.setItem("salonUserAuthTokens", JSON.stringify(data));
  //       setAuthTokens(data);
  //       setUser(jwtDecode(data.access_token));
  //       setIsAuthenticated(true);
  //       toast.success("OTP verified, Welcome to Trakky");
  //       // Optionally, redirect the user to the desired page
  //       // navigate("/", { replace: true });
  //     } else if (response.status === 401) {
  //       // If OTP is invalid, notify the user
  //       toast.error("Invalid OTP. Please try again.");
  //     } else {
  //       // Handle other possible cases or errors
  //       toast.error(
  //         "Error while logging in with WhatsApp. Please try again later."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     // Handle error cases
  //     toast.error(
  //       "An error occurred while logging in with WhatsApp. Please try again later."
  //     );
  //   }
  // };

  const [userFavorites, setUserFavorites] = useState([]);

  const fetchUserFavorites = async () => {
    let url = `https://backendapi.trakky.in/salons/userfavorite/`;

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
    // signupUser: signupUser,
    userData: userData,
    // otpstage: otpstage,
    fetchUserData,
    userFavorites: userFavorites,
    fetchUserFavorites: fetchUserFavorites,
    // setotpstage: setotpstage,
    location: {
      latitude: latitude,
      longitude: longitude,
    },
    otprequest: otprequest,
    // vendor: vendor
  };

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 30; // 15 minutes
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
