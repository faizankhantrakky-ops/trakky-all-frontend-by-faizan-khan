import React, { useEffect, useState , useContext } from "react";
import crossIcon from "../../../Assets/images/icons/crossIcon_svg.svg";
import { Link, useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/Auth";



const CityAreaModal = ({ onClose , toastMessage }) => {
  const navigate = useNavigate();

  const params = useParams();

  const { setLatitude , setLongitude } = useContext(AuthContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [cityPayload, setCityPayload] = useState([]);
  const [city, setCity] = useState([]);
  const [area, setArea] = useState([]);
  const [selectedCity, SetSelectedCity] = useState(params?.city || "");
  const [selectedArea, setSelectedArea] = useState(
    searchParams.get("area") || ""
  );

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/spas/city/`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();
      if (response.ok) {
        let list = data?.payload.map((item) => {
          return item.name;
        });
        setCity(list);
        setCityPayload(data?.payload);

      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    let areaList = cityPayload?.find(
      (item) => item.name.toLowerCase() === selectedCity.toLowerCase()
    )?.area_names;
    setArea(areaList);
  }, [selectedCity, cityPayload]);


  const nevigateLink = (city, area) => {
    if (city && area) {
      return `/${city}/spas/${area}`;
    }
    if (city) {
      return `/${city}/spas/`;
    }
    return "/";
  };

  return (
    <>
    {/* <Toaster />  */}
    <div className="h-auto bg-white px-5 py-6 rounded-xl absolute left-[50%] -translate-x-1/2 top-24 max-w-[350px] w-full flex flex-col gap-3">
      <div className="h-0 w-full relative -mb-3">
        <div
          className="absolute left-1/2 -translate-x-1/2 h-9 w-9 bg-gray-200 rounded-3xl p-3 -top-20 cursor-pointer"
          onClick={() => {
            onClose();
          }}
        >
          <img src={crossIcon} alt="close icon" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="text-[#512DC8] text-center font-medium">
        Please select city & area for best result
      </div>
      <div className="flex flex-col gap-2 w-full my-2">
        <div className="h-10 border border-[#512DCB]  w-full flex gap-2 items-center px-3 rounded-xl text-[#512DCB]">
          <span className="border-e border-[#512DCB] pr-3 w-[80px] ">City</span>
          <select
            name=""
            id=""
            value={selectedCity}
            onChange={(e) => {
              SetSelectedCity(e.target.value);
              setSelectedArea("");
            }}
            className=" text-gray-600 h-full w-full border-none outline-none active:outline-none active:border-none focus:outline-none bg-transparent"
          >
            <option value="">Select City</option>
            {city?.length > 0 &&
              city?.map((item, index) => {
                return <option value={item?.toLowerCase()}>{item}</option>;
              })}
          </select>
        </div>
        <div className="h-10 border border-[#512DCB]  w-full flex gap-2 items-center px-3 rounded-xl text-[#512DCB]">
          <span className="border-e border-[#512DCB] pr-3 w-[80px] ">Area</span>

          <select
            name=""
            id=""
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
            }}
            className=" text-gray-600 h-full w-full border-none outline-none active:outline-none active:border-none focus:outline-none bg-transparent"
          >
            <option value="">Select Area</option>
            {area?.length > 0 &&
              area?.map((item, index) => {
                return <option value={item}>{item}</option>;
              })}
          </select>
        </div>
      </div>
      <button
        className="border-none outline-none bg-gradient-to-r from-[#512DC8] to-[#9E70FF] w-full h-10 rounded-2xl text-white"
        onClick={() => {
          navigate(nevigateLink(selectedCity, selectedArea));
          onClose();
        }}
      >
        Submit area & city
      </button>
      <div className="h-[1px] my-4 relative w-full bg-gray-300">
        <span className="bg-white absolute left-[50%] -translate-x-1/2 top-0 -translate-y-1/2 px-2 text-sm">
          OR
        </span>
      </div>
      <button
        className="border-none outline-none bg-gradient-to-r from-[#512DC8] to-[#9E70FF] w-full h-10 rounded-2xl text-white"
        onClick={() => {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Do something with the coordinates
                console.log(
                  "Latitude: " + latitude + ", Longitude: " + longitude
                );

                setLatitude(latitude);
                setLongitude(longitude);
          

                toastMessage("Location access granted successfully" , "success");

                onClose();
                
              },
              function (error) {
                console.error("Error getting user location:", error.message);
        
                toastMessage("Location access denied : give location access for better experience" , "error");

                onClose();
              }
            );
          } else {
            console.error("Geolocation is not supported by this browser.");

            const defaultLatitude = 0;
            const defaultLongitude = 0;

            console.log(
              "Using default coordinates - Latitude: " +
                defaultLatitude +
                ", Longitude: " +
                defaultLongitude
            );
          }
        }}
      >
        Give location access
      </button>
    </div>
    </>
  );
};

export default CityAreaModal;
