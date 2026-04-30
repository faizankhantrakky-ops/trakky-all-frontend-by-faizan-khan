const getSalonsNearYou = async (latitude, longitude, page = 1, city, area) => {
  // Default Location → Sindhu Bhavan Pakwan
  const defaultLat = 23.0386;
  const defaultLng = 72.5118;

  const lat = latitude ? Number(latitude) : defaultLat;
  const lng = longitude ? Number(longitude) : defaultLng;

  let url = `https://backendapi.trakky.in/salons/nearby-salon/?latitude=${lat}&longitude=${lng}&page=${page}&verified=true`;

  const requestOption = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getTopRatedSalons = async (city, area, page, latitude, longitude) => {
  // Default Location → Sindhu Bhavan Pakwan
  const defaultLat = 23.0386;
  const defaultLng = 72.5118;

  const lat = latitude ? Number(latitude) : defaultLat;
  const lng = longitude ? Number(longitude) : defaultLng;

  let otherUrl = `https://backendapi.trakky.in/salons/list/?page=${page}&distance=within_5&latitude=${lat}&longitude=${lng}`;

  if (city) {
    otherUrl += `&city=${encodeURIComponent(String(city).toLowerCase())}`;
  }

  const requestOption = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(otherUrl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getBridalSalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";
  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  url += `&page=${page}&bridal=true&verified=true`;

  let otherUrl = "https://backendapi.trakky.in/salons/salon-bridal/data/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    otherUrl += `?city=${city}&area=${area}`;
  } else if (city) {
    otherUrl += `?city=${city}`;
  }

  otherUrl += `&page=${page}`;

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestOption);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();

    console.log("RAW API RESPONSE:", data); // ← yeh daalo
    console.log("Results:", data?.results); // check length
    console.log("Has results key?", "results" in data);

    return data;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err; // important: throw karo taaki thunk reject ho
  }
};

const getUnisexSalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";
  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  url += `&page=${page}&unisex_salon=true&verified=true`;

  let otherUrl = "https://backendapi.trakky.in/salons/salon-unisex/data/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    otherUrl += `?city=${city}&area=${area}`;
  } else if (city) {
    otherUrl += `?city=${city}`;
    // otherUrl += `&page=${page}`;
  }

  otherUrl += `&page=${page}`;

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(otherUrl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getKidsSalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";
  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  url += `&page=${page}&kids_special_salons=true&verified=true`;

  let otherUrl = "https://backendapi.trakky.in/salons/salon-kids-special/data/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    otherUrl += `?city=${city}&area=${area}`;
  } else if (city) {
    otherUrl += `?city=${city}`;
  }

  otherUrl += `&page=${page}`;

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(otherUrl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const gettheFemaleBeautySalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";
  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  let otherUrl =
    "https://backendapi.trakky.in/salons/salon-female-beauty-parlour/data/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    otherUrl += `?city=${city}&area=${area}`;
  } else if (city) {
    otherUrl += `?city=${city}`;
  }

  otherUrl += `&page=${page}`;

  url += `&page=${page}&female_beauty_parlour=true&verified=true`;

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(otherUrl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getAcademySalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";
  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  url += `&page=${page}&salon_academy=true&verified=true`;

  let otherUrl = "https://backendapi.trakky.in/salons/salon-academy/data/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    otherUrl += `?city=${city}&area=${area}`;
  } else if (city) {
    otherUrl += `?city=${city}`;
  }

  otherUrl += `&page=${page}`;

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(otherUrl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getMakeupSalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";
  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  url += `&page=${page}&makeup=true`;

  let otherUrl = "https://backendapi.trakky.in/salons/salon-makeup/data/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    otherUrl += `?city=${city}&area=${area}`;
  } else if (city) {
    otherUrl += `?city=${city}`;
  }

  otherUrl += `&page=${page}`;

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(otherUrl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getAllAreaSalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  url += `&page=${page}&verified=true`;

  const requestOption = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestOption);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // ← Yahaan filter laga do
    if (data && data.results) {
      data.results = data.results.filter((salon) => salon.open === true);

      data.count = data.results.length;

      // Agar next/previous link mein filter nahi chahiye to unko bhi adjust kar sakte ho
      // lekin zyadatar cases mein sirf results filter karna kaafi hota hai
    }

    return data;
  } catch (err) {
    console.log("Error in getAllAreaSalons:", err);
    return { results: [], count: 0, next: null, previous: null }; // safe empty response
  }
};

const getCategories = async (city) => {
  let url = "https://backendapi.trakky.in/salons/category/";

  if (city) {
    url += `?city=${city}`;
  }

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getOffers = async (city) => {
  let offerurl = "https://backendapi.trakky.in/salons/offer/";

  if (city) {
    offerurl += `?city=${city}`;
  }

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(offerurl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getMaleSalons = async (city, area, page) => {
  let url = "https://backendapi.trakky.in/salons/filter/";
  if (city && area) {
    url += `?city=${city}&area=${area}`;
  } else if (city) {
    url += `?city=${city}`;
  } else {
    url = "https://backendapi.trakky.in/salons/?verified=true";
  }

  url += `&page=${page}&male_salons=true&verified=true`;

  let otherUrl = "https://backendapi.trakky.in/salons/salon-male/data/";

  // Fix for "science-city" → "Science City"
  if (area && area.toLowerCase() === "science-city") {
    area = "Science City";
  }

  if (city && area) {
    otherUrl += `?city=${city}&area=${area}`;
  } else if (city) {
    otherUrl += `?city=${city}`;
  }

  const requestOption = {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(otherUrl, requestOption);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export {
  getSalonsNearYou,
  getTopRatedSalons,
  getBridalSalons,
  getUnisexSalons,
  getKidsSalons,
  gettheFemaleBeautySalons,
  getAcademySalons,
  getMakeupSalons,
  getAllAreaSalons,
  getCategories,
  getOffers,
  getMaleSalons,
};



