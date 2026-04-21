export const getCity = async () => {
  try {
    let url = "https://backendapi.trakky.in/salons/city/";

    const response = await fetch(url);

    if (response.status === 200) {
      const data = await response.json();
      const payload = data?.payload || [];
      const cityNames = payload.map((item) => item.name);

      return { cityPayloadData: payload, cityName: cityNames };
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching city data:", error.message);
    throw new Error("Failed to fetch city data. Please try again later.");
  }
};

export const getAreaNames = (cityPayloadData, cityName) => {
  console.log("payload", cityName);
  try {
    if (!cityPayloadData) {
      throw new Error("City payload data is not available.");
    }

    if (!cityName) {
      return cityPayloadData.flatMap((city) => city?.area_names || []);
    } else {
      const selectedCity = cityPayloadData.find(
        (city) => city.name === cityName
      );
      if (!selectedCity) {
        throw new Error(`City '${cityName}' not found in the payload data.`);
      }
      console.log("selectedCity.area_names: ", selectedCity.area_names)
      return selectedCity.area_names || [];
    }
  } catch (error) {
    console.error("Error in getAreaNames function:", error.message);
    return [];
  }
};
