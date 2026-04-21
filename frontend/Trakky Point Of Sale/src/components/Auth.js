import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    localStorage.getItem("salonVendorAuthToken")
      ? jwtDecode(localStorage.getItem("salonVendorAuthToken"))
      : null
  );

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("salonVendorAuthToken")
      ? JSON.parse(localStorage.getItem("salonVendorAuthToken"))
      : null
  );

  let [loading, setLoading] = useState(true);
  let [vendorData, setVendorData] = useState([]);

  const fetchVendorData = async () => {
               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
    if (!user || !user?.user_id) return;

    const response = await fetch(
      `https://backendapi.trakky.in/salonvendor/vendor/${user?.user_id}/`
    );
    if (response.ok) {
      const jsonData = await response.json();
      setVendorData(jsonData);
      console.log(jsonData);
    } else {
      console.log("error");
    }
  };

  let loginUser = async ({ phone_number, password }) => {

               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
  
 let url = "https://backendapi.trakky.in/salonvendor/vendor/token/";

  let data = {
    phone_number,
    password,
  };

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let result = await response.json(); // ✅ yahan JSON read karo

    // ✅ ERROR HANDLING
    if (!response.ok) {
      return {
        status: response.status,
        message: result.error || result.detail || "Login Failed",
      };
    }

    // ✅ SUCCESS
    localStorage.setItem(
      "salonVendorAuthToken",
      JSON.stringify(result)
    );
    setAuthTokens(result);
    setUser(jwtDecode(result.access_token));

    return {
      status: 200,
      data: result,
    };

  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};


  let logoutUser = useCallback(() => {
    // Full cleanup on logout
    localStorage.removeItem("salonVendorAuthToken");
    localStorage.clear(); // Clear all localStorage for complete reset
    sessionStorage.clear(); // Clear sessionStorage too
    setAuthTokens(null);
    setUser(null);
    setVendorData([]);
    setLoading(true); // Reset loading state
    // Optional: Clear any other app state if needed
    console.log("Complete logout executed - all data cleared");
  }, []);

  const updateToken = useCallback(async () => {
    try {
      if (authTokens) {
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
          localStorage.setItem(
            "salonVendorAuthToken",
            JSON.stringify({ ...authTokens, access_token: data.access })
          );
        } else {
          logoutUser();
        }
      }
    } catch (error) {
      console.log(error);
    }

    if (loading) {
      setLoading(false);
    }
  }, [authTokens, loading]);

  // Automatic Midnight Logout (12:00 AM) - Checks every minute
  useEffect(() => {
    if (!user) return;

    const checkMidnightLogout = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Check if it's exactly 12:00 AM (midnight)
      if (currentHour === 0 && currentMinute === 0) {
        toast.error("Session expired at midnight. Please log in again.", {
          duration: 5000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
        logoutUser();
      }
    };

    // Check every minute (more efficient than every second)
    const intervalId = setInterval(checkMidnightLogout, 60000); // 60 seconds

    // Initial check
    checkMidnightLogout();

    return () => clearInterval(intervalId);
  }, [user, logoutUser]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    // changePassword: changePassword,
    vendorData: vendorData,
    setVendorData: setVendorData,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    } else {
      const REFRESH_INTERVAL = 1000 * 60 * 50; // 50 minutes
      let interval = setInterval(() => {
        if (authTokens) {
          updateToken();
        }
      }, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [authTokens, loading, updateToken]);

  useEffect(() => {
    if (user) {
      fetchVendorData();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};