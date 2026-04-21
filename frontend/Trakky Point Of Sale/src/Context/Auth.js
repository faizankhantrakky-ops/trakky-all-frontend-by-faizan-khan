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
      : null,
  );

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("salonVendorAuthToken")
      ? JSON.parse(localStorage.getItem("salonVendorAuthToken"))
      : null,
  );

  let [loading, setLoading] = useState(true);
  let [vendorData, setVendorData] = useState([]);

  // This function fetches vendor data from the backend API
  const fetchVendorData = async () => {
    // If user does not exist OR user_id is missing,
    // stop the function immediately (do nothing)
    if (!user || !user?.user_id) return;

    // Make an API request to fetch vendor details
    // using the logged-in user's user_id
    const response = await fetch(
      `https://backendapi.trakky.in/salonvendor/vendor/${user?.user_id}/`,
    );

    // Check if the API request was successful (status 200-299)
    if (response.ok) {
      // Convert the response into JSON format
      const jsonData = await response.json();

      // Store the fetched vendor data into state
      setVendorData(jsonData);

      // Log the data in the browser console (for debugging)
      console.log(jsonData);
    } else {
      // If the API request failed, log an error message
      console.log("error");
    }
  };

  // This function handles user login using phone number and password
  let loginUser = async ({ phone_number, password }) => {
    // Check if the user has an active internet connection
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return; // Stop execution if offline
    }

    // API endpoint for getting login token
    let url = "https://backendapi.trakky.in/salonvendor/vendor/token/";

    // Prepare login data to send to backend
    let data = {
      phone_number,
      password,
    };

    try {
      // Send POST request to backend with login credentials
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Tell server we are sending JSON
        },
        body: JSON.stringify(data), // Convert JS object to JSON string
      });

      // Convert response into JSON format
      let result = await response.json();

    
      // If response status is not OK (not 200–299)
      if (!response.ok) {
        return {
          status: response.status,
          message: result.error || result.detail || "Login Failed",
        };
      }



      //For the Multiple Brach
         if (result?.branchid) {
      localStorage.setItem("branchId", result.branchid);
    }



      

      // Save authentication token in localStorage
      localStorage.setItem("salonVendorAuthToken", JSON.stringify(result));

      // Store tokens in React state
      setAuthTokens(result);

      // Decode access token and store user details in state
      setUser(jwtDecode(result.access_token));

      // Return success response
      return {
        status: 200,
        data: result,
      };
    } catch (error) {
      // If any unexpected error occurs (network/server crash etc.)
      console.log(error);

      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  };

  // Memoized logout function using useCallback
  // This ensures the function is not recreated on every render
  let logoutUser = useCallback(() => {
  

    // Remove only the authentication token from localStorage
    localStorage.removeItem("salonVendorAuthToken");

    // Clear ALL data stored in localStorage (full reset)
    localStorage.clear();

    // Clear all sessionStorage data as well
    sessionStorage.clear();

    // Reset authentication tokens in React state
    setAuthTokens(null);

    // Remove current logged-in user data from state
    setUser(null);

    // Clear vendor data from state (reset to empty array)
    setVendorData([]);

    // Reset loading state (usually used to re-check auth or reinitialize app)
    setLoading(true);

    // Log confirmation in console for debugging
    console.log("Complete Logout executed - All data Cleared");
  }, []); // Empty dependency array → function will not change between renders

  // Memoized function to refresh the access token
  const updateToken = useCallback(async () => {
    try {
      // Check if authTokens exist before trying to refresh
      if (authTokens) {
        // Send POST request to refresh the access token
        const response = await fetch(
          "https://backendapi.trakky.in/api/token/refresh/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Sending JSON data
            },
            // Send refresh token in request body
            body: JSON.stringify({ refresh: authTokens?.refresh_token }),
          },
        );

        // Convert response into JSON format
        const data = await response.json();

        // If refresh request is successful
        if (response.status === 200) {
          // Update authTokens state with new access token
          setAuthTokens({ ...authTokens, access_token: data.access });

          // Decode new access token and update user state
          setUser(jwtDecode(data.access));

          // Update localStorage with new access token
          localStorage.setItem(
            "salonVendorAuthToken",
            JSON.stringify({ ...authTokens, access_token: data.access }),
          );
        } else {
          // If refresh token is invalid or expired → logout user
          logoutUser();
        }
      }
    } catch (error) {
      // Catch any unexpected errors (network/server issues)
      console.log(error);
    }

    // After first token check, stop loading state
    if (loading) {
      setLoading(false);
    }
  }, [authTokens, loading]);
  // Dependencies: Recreate function if authTokens or loading changes

  // Automatic Midnight Logout (12:00 AM) - Checks every minute
  useEffect(() => {
    if (!user) return;

    const checkMidnightLogout = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Check if it's exactly 12:00 AM (midnight)
      if (currentHour === 0 && currentMinute === 0) {
        toast.error("Session Expired at Midnight. Please log in again.", {
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
    const intervalId = setInterval(checkMidnightLogout, 60000);

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
