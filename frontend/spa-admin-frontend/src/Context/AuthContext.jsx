import { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("spaAdminAuthTokens")
      ? jwtDecode(localStorage.getItem("spaAdminAuthTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("spaAdminAuthTokens")
      ? JSON.parse(localStorage.getItem("spaAdminAuthTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    const response = await fetch("https://backendapi.trakky.in/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    let data = await response.json();

    if (data) {
      localStorage.setItem("spaAdminAuthTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      setIsAuthenticated(true);
      navigate("/");
    } else {
      alert("Something went wrong while logging in the user!");
    }
  };

  let logoutUser = useCallback(() => {
    // e.preventDefault()
    localStorage.removeItem("spaAdminAuthTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/signin");
    setIsAuthenticated(false);
  }, [navigate]);

  const updateToken = useCallback(async () => {
    try
    {
        if (authTokens) {

    
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
      setAuthTokens({ ...authTokens, access: data.access });
      setUser(jwtDecode(data.access));
      setIsAuthenticated(true);
      localStorage.setItem(
        "spaVendorAuthTokens",
        JSON.stringify({ ...authTokens, access: data.access })
      );
    } else {
      logoutUser();
    }}
  }
  catch(error){
    console.log(error)
  }

    if (loading) {
      setLoading(false);
    }
  }, [authTokens, loading, logoutUser]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    isAuthenticated: isAuthenticated,
  };

  useEffect(()=>{

    if(loading)
    {
        updateToken()
    }
    else{

    const REFRESH_INTERVAL = 1000 * 60 * 60 // 60 minutes
    let interval = setInterval(()=>{
        if(authTokens){
            updateToken()
        }
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
}

},[authTokens, loading , updateToken])


    //Forcefully Logout after 45 Minutes
    // useEffect(() => {
    //   const logoutInterval = setTimeout(() => {
    //     logoutUser();
    //   } , 1000 * 60 * 45 ) // 45 Minutes
    //   return () => clearTimeout(logoutInterval);
    // })



  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
