import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    localStorage.getItem("spavendorAuthToken")
      ? jwtDecode(localStorage.getItem("spavendorAuthToken"))
      : null
  );
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("spavendorAuthToken")
      ? JSON.parse(localStorage.getItem("spavendorAuthToken"))
      : null
  );
  let [loading, setLoading] = useState(true);
  let [vendorData, setVendorData] = useState([])

  const fetchVendorData = async () => {

    if (!user || !user?.user_id) return

    const response = await fetch(`https://backendapi.trakky.in/spavendor/vendor/${user?.user_id}/`)
    if (response.ok) {
      const jsonData = await response.json()
      setVendorData(jsonData)
    }
    else {
      console.log('error')
    }
  }


  let loginUser = async ({ phone_number, password }) => {

    let url = "https://backendapi.trakky.in/spavendor/vendor/token/";

    let data = {
      phone_number: phone_number,
      password: password,
    };

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        return response;
      }
      if (response.status === 400) {
        return response;
      }

      if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        localStorage.setItem("spavendorAuthToken", JSON.stringify(data));
        console.log("spa vendor auth token set");
        setAuthTokens(data);
        setUser(jwtDecode(data.access_token));
        console.log("user set auth");
      } else {
        // alert("Something went wrong while logging in the user!");
      }

      return response;

    } catch (error) {
      console.log(error);
      return { status: 500, message: "Internal Server Error" };
    }
  };

  let logoutUser = useCallback(() => {
    localStorage.removeItem("spavendorAuthToken");
    setAuthTokens(null);
    setUser(null);
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
            "spavendorAuthToken",
            JSON.stringify({ ...authTokens, access_token: data.access })
          );
        } else {
          logoutUser();
        }
      }
    }
    catch (error) {
      console.log(error)
    }

    if (loading) {
      setLoading(false);
    }
  }, [authTokens, loading]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    // changePassword: changePassword,
    vendorData: vendorData
  };

  useEffect(() => {

    if (loading) {
      updateToken()
    }
    else {

      const REFRESH_INTERVAL = 1000 * 60 * 50 // 60 minutes
      let interval = setInterval(() => {
        if (authTokens) {
          updateToken()
        }
      }, REFRESH_INTERVAL)
      return () => clearInterval(interval)
    }

  }, [authTokens, loading, updateToken])

  useEffect(() => {

    if (user) {
      fetchVendorData()
    }

  }, [user]);

  

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
