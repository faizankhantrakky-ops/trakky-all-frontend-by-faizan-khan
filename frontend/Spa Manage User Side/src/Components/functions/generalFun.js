const capitalizeAndFormat = (str) => {
  return str
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getNearByCoordinates = (city) => {
  return new Promise((resolve, reject) => {
    let LatLong = {
      latitude: 23.0225,
      longitude: 72.5714,
    };

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        navigator.geolocation.getCurrentPosition((position) => {
          LatLong = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(LatLong);
        });
      } else if (result.state === "prompt") {
        navigator.geolocation.getCurrentPosition((position) => {
          LatLong = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(LatLong);
        });
      } else if (result.state === "denied") {
        if (city.toLowerCase() == "ahmedabad") {
          LatLong = {
            latitude: 23.0225,
            longitude: 72.5714,
          };
          resolve(LatLong);
        } else if (city.toLowerCase() == "bangalore") {
          LatLong = {
            latitude: 12.9716,
            longitude: 77.5946,
          };
          resolve(LatLong);
        } else if (city.toLowerCase() == "gandhinagar") {
          LatLong = {
            latitude: 23.2156,
            longitude: 72.6369,
          };
          resolve(LatLong);
        } 
      }
    });
  });
};

const getCoordinateByCity = async(city) => {
  let res = await new Promise((resolve, reject) => {
    let LatLong = {
      latitude: 23.0225,
      longitude: 72.5714,
    };

    if (city.toLowerCase() == "ahmedabad") {
      LatLong = {
        latitude: 23.0225,
        longitude: 72.5714,
      };
      resolve(LatLong);
    } else if (city.toLowerCase() == "bangalore") {
      LatLong = {
        latitude: 12.9716,
        longitude: 77.5946,
      };
      resolve(LatLong);
    } else if (city.toLowerCase() == "gandhinagar") {
      LatLong = {
        latitude: 23.2156,
        longitude: 72.6369,
      };
      resolve(LatLong);
    } 
  });

  return res;
};

 
export { capitalizeAndFormat , getNearByCoordinates , getCoordinateByCity};