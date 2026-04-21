const capitalizeAndFormat = (str) => {

  if (!str) return str;

  return str
    ?.split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
 

const getNearByCoordinates = async (city) => {
  // let res = await new Promise((resolve, reject) => {

  //   // Default Location → Sindhu Bhavan Pakwan Char Rasta
  //   let LatLong = {
  //     latitude: 23.0386,
  //     longitude: 72.5118,
  //   };

  //   if (!navigator.geolocation) {
  //     resolve(LatLong);
  //     return;
  //   }

  //   navigator.permissions
  //     .query({ name: "geolocation" })
  //     .then((result) => {

  //       // If user allows GPS
  //       if (result.state === "granted" || result.state === "prompt") {
  //         navigator.geolocation.getCurrentPosition(
  //           (position) => {
  //             LatLong = {
  //               latitude: position.coords.latitude,
  //               longitude: position.coords.longitude,
  //             };
  //             resolve(LatLong);
  //           },
  //           () => {
  //             // If GPS fails → Sindhu Bhavan
  //             resolve(LatLong);
  //           }
  //         );
  //       }

  //       // If GPS denied → Sindhu Bhavan
  //       else if (result.state === "denied") {
  //         resolve(LatLong);
  //       }
  //     })
  //     .catch(() => {
  //       resolve(LatLong);
  //     });
  // });

  // return res;
};

const getCoordinateByCity = async (city) => {
  let res = await new Promise((resolve) => {

    // Default → Sindhu Bhavan Pakwan Char Rasta
    let LatLong = {
      latitude: 23.0386,
      longitude: 72.5118,
    };

    const cityName = city?.toLowerCase();

    if (cityName === "ahmedabad") {
      LatLong = {
        latitude: 23.0386,
        longitude: 72.5118,
      };
    } 
    else if (cityName === "bangalore") {
      LatLong = {
        latitude: 12.9716,
        longitude: 77.5946,
      };
    } 
    else if (cityName === "gandhinagar") {
      LatLong = {
        latitude: 23.2156,
        longitude: 72.6369,
      };
    }

    resolve(LatLong);
  });

  return res;
};


export { capitalizeAndFormat , getNearByCoordinates , getCoordinateByCity };
