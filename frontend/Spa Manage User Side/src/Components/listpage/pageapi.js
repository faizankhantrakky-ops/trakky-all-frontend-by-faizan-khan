const getNearBySpas = async (latitude = 0, longitude = 0, page) => {
    try {
        const response = await fetch(`https://backendapi.trakky.in/spas/nearby-spa/?latitude=${Number(
            latitude
        )}&longitude=${Number(longitude)}&page=${page}&verified=true`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
    }
};


const getBestSpas = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/?verified=true";

   if (city) {
        url += `&city=${city}`;
    }
    if (area) {
        url += `&area=${area}`;
    }
    
    url += `&best_spa=true&page=${page}`;

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
    }

    catch (err) {
        console.log(err);
    }


}

const getThaiBodyMassage = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/?verified=true";

   if (city) {
        url += `&city=${city}`;
    }
    if (area) {
        url += `&area=${area}`;
    }
    
    url += `&Thai_body_massage=true&page=${page}`;

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
    }

    catch (err) {
        console.log(err);
    }


}

const getTopRatedSpas = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {
        url = "https://backendapi.trakky.in/spas/?verified=true";
    }

    url += `&top_rated=true&verified=true&page=${page}`;

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
    }
    catch (err) {
        console.log(err);
    }
};

const getLuxuriosSpas = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {

        url = "https://backendapi.trakky.in/spas/?verified=true";

    }

    url += `&luxurious=true&verified=true&page=${page}`;

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
    }
    catch (err) {
        console.log(err);
    }

};

const getBeautySpas = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {

        url = "https://backendapi.trakky.in/spas/?verified=true";

    }

    url += `&Beauty=true&verified=true&page=${page}`;

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
    }
    catch (err) {
        console.log(err);
    }

};
const getBodyMassageSpas = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {

        url = "https://backendapi.trakky.in/spas/?verified=true";

    }

    url += `&Body_massage_spas=true&verified=true&page=${page}`;

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
    }
    catch (err) {
        console.log(err);
    }

};
const getBodyMassageCenters = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {

        url = "https://backendapi.trakky.in/spas/?verified=true";

    }

    url += `&Body_massage_center=true&verified=true&page=${page}`;

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
    }
    catch (err) {
        console.log(err);
    }

};
const getMenSpas = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {

        url = "https://backendapi.trakky.in/spas/?verified=true";

    }

    url += `&Spas_for_men=true&verified=true&page=${page}`;

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
    }
    catch (err) {
        console.log(err);
    }

};
const getWomenSpas = async (city, area, page) => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {

        url = "https://backendapi.trakky.in/spas/?verified=true";

    }

    url += `&Spas_for_women=true&verified=true&page=${page}`;

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
    }
    catch (err) {
        console.log(err);
    }

};

const getAllAreaSpas = async (city, area, page) => {

    let url = "https://backendapi.trakky.in/spas/filter/";

    if (city && area) {

        url += `?city=${city}&area=${area}`;

    } else if (city) {

        url += `?city=${city}`;

    } else {
        url = "https://backendapi.trakky.in/spas/?verified=true";
    }

    url += `&page=${page}`;

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

const getTherapy = async (city) => {
    let url = "https://backendapi.trakky.in/spas/therapy/";

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
    let url = "https://backendapi.trakky.in/spas/offer/";

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

export {
    getNearBySpas,
    getTopRatedSpas, getLuxuriosSpas, getAllAreaSpas,
    getBeautySpas, getBodyMassageSpas, getBodyMassageCenters,
    getMenSpas,getWomenSpas ,
    getThaiBodyMassage,
    getBestSpas,
    getTherapy ,
    getOffers
};
