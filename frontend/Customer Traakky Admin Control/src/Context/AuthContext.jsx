import { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("salonAdminAuthTokens")
      ? jwtDecode(localStorage.getItem("salonAdminAuthTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("salonAdminAuthTokens")
      ? JSON.parse(localStorage.getItem("salonAdminAuthTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  let [userPermissions, setUserPermissions] = useState({
    status: null,
    data: [],
  });

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

    if (response.ok) {
      localStorage.setItem("salonAdminAuthTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      setIsAuthenticated(true);
      navigate("/");
    } else {
      if (
        data &&
        data.detail === "No active account found with the given credentials"
      ) {
        // alert("No active account found with the given credentials");
        toast.error("No active account found with the given credentials", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error("Something went wrong while logging in the user!");
      }
    }
  };

  const getPermissionData = async ({ id }) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/custom-user-permissions/?user_id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status == 404) {
        setUserPermissions(
          {
            status: 404,
            data: [],
          }
        );
      }

      if (response.status === 200) {
        // setUserPermissions(data);
        setUserPermissions({
          status: 200,
          data: data,
        });
      } else {

        setUserPermissions({
          status: response.status,
          data: [],
        });

        console.log("Error Fetching Data With Status", response.status)
      }
    } catch (error) {
      console.log("Error Fetching Data", error)
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      getPermissionData({ id: user.user_id })
    }
  }, [user])

  let logoutUser = useCallback(() => {
    // e.preventDefault()
    localStorage.removeItem("salonAdminAuthTokens");
    setAuthTokens(null);
    setUser(null);
    setUserPermissions({
      status: null,
      data: [],
    });
    setIsAuthenticated(false);
    navigate("/signin");
  }, [navigate]);

  const updateToken = useCallback(async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setAuthTokens({ ...authTokens, access: data.access });
        setUser(jwtDecode(data.access));
        setIsAuthenticated(true);
        localStorage.setItem(
          "salonAdminAuthTokens",
          JSON.stringify({ ...authTokens, access: data.access })
        );
      }
    } catch (error) {
      logoutUser();
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  }, [authTokens, loading, logoutUser]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    isAuthenticated: isAuthenticated,
    userPermissions: userPermissions,
  };

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 60;
    // const REFRESH_INTERVAL = 1000 * 30;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [authTokens, loading, updateToken]);

  //Forccefully Logout after 45 minutes
  // remove for now as it is causing issue
  // useEffect(() => {
  //   const logoutInterval = setTimeout(() => {
  //     logoutUser();
  //   }, 1000 * 60 * 45); // 45 Minutes

  //   return () => clearTimeout(logoutInterval);
  // } , [])

  return (
    <>
      <Toaster />
      <AuthContext.Provider value={contextData}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
