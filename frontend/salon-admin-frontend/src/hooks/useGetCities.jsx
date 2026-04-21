import { useState, useEffect, useContext } from "react";
import AuthContext, { AuthProvider } from "../Context/AuthContext";

const useGetCities = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [citiesData, setCitiesData] = useState([]);
  const [cityLoading, setCityLoading] = useState(true);
  const [cityError, setCityError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const getCities = () => {
      const requestOption = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch("https://backendapi.trakky.in/salons/city/", requestOption)
        .then((res) => res.json())
        .then((data) => {
          setCitiesData(data.payload);
        })
        .catch((err) => {
          setCityError(err.message);
        })
        .finally(() => {
          setCityLoading(false);
        });
    };

    getCities();
  }, [authTokens, logoutUser]);

  return { citiesData, cityLoading, cityError, selectedCity, setSelectedCity };
};

export default useGetCities;
