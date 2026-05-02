const fs = require("fs");

let cities = [];
let areas = [];
let salonData = [];
let salonApiCount = 1;

let listOfLinks = [];
let categoryData = [];
let offerData = [];

// Sure, here are all the fixed links with parameters:
//
// Homepage: https://trakky.in/
// Salon Registration: https://trakky.in/salonRegistration
// Salon List by City: https://trakky.in/:city/salons
// Category List: https://trakky.in/:city/categories/:slug
// Offer List: https://trakky.in/:city/offers/:slug
// Top Rated Salons: https://trakky.in/:city/topratedsalons
// Bridal Salons: https://trakky.in/:city/bridalsalons
// Unisex Salons: https://trakky.in/:city/unisexsalons
// Kids Special Salons: https://trakky.in/:city/kidsspecialsalons
// Female Beauty Parlour: https://trakky.in/:city/femalebeautyparlour
// Male Salons: https://trakky.in/:city/malesalons
// Academy Salons: https://trakky.in/:city/academysalons
// Makeup Salons: https://trakky.in/:city/makeupsalons
// Salons Near You: https://trakky.in/:city/nearby
// Salon List by Area: https://trakky.in/:city/salons/:area
// Salon Profile: https://trakky.in/:city/:area/salons/:slug
// Top Rated Salons by Area: https://trakky.in/:city/topratedsalons/:area
// Bridal Salons by Area: https://trakky.in/:city/bridalsalons/:area
// Academy Salons by Area: https://trakky.in/:city/academysalons/:area
// Makeup Salons by Area: https://trakky.in/:city/makeupsalons/:area
// Unisex Salons by Area: https://trakky.in/:city/unisexsalons/:area
// Female Beauty Parlour by Area: https://trakky.in/:city/femalebeautyparlour/:area
// Kids Special Salons by Area: https://trakky.in/:city/kidsspecialsalons/:area
// Terms of Use: https://trakky.in/terms-of-use
// Contact Us: https://trakky.in/contactus
// Vendor Page: https://trakky.in/vendor-register
// Privacy Policy: https://trakky.in/privacypolicy
// Error Page: https://trakky.in/* (for any other routes)

const getCities = async () => {
  let url = `https://backendapi.trakky.in/spas/city/`;

  let payload;
  let city = [];

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();

  if (response.ok) {
    payload = await data?.payload;

    city = await payload?.map((city) => {
      return city.name;
    });

    city = city?.map((city) => {
      return city.toLowerCase();
    });

    areas = payload?.map((city) => {
      return {
        [city?.name]: city.area_names.map((area) => {
          return area.toLowerCase().split(" ").join("-");
        }),
      };
    });

    return { city, areas };
  }
};

const getSalons = async (url = `https://backendapi.trakky.in/spas/`) => {
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();

  if (response.ok) {
    let Sdata = data?.results;

    let salonDataSlice = Sdata?.map((salon) => {
      return {
        id: salon.id,
        city: salon.city?.toLowerCase().split(" ").join("-"),
        area: salon.area?.toLowerCase().split(" ").join("-"),
        slug: salon.slug,
      };
    });

    salonData = [...salonData, ...salonDataSlice];

    if (data?.next) {
      console.log(data?.next);
      salonApiCount++;

      console.log(salonApiCount);
      await getSalons(data?.next);
    }

    return salonData;
  }
};

const getCategory = async () => {
  let url = `https://backendapi.trakky.in/salons/category/`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();

  if (response.ok) {
    let category = data?.map((category) => {
      return {
        id: category.id,
        slug: category.slug,
        city: category.city?.toLowerCase().split(" ").join("-"),
      };
    });

    return category;
  }
};

const getOffers = async () => {
  let url = `https://backendapi.trakky.in/salons/offer/`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await response.json();

  if (response.ok) {
    let offers = data?.map((offer) => {
      return {
        id: offer.id,
        slug: offer.slug,
        city: offer.city?.toLowerCase().split(" ").join("-"),
      };
    });

    return offers;
  }
};

const fixedLinks = () => {
  let links = [
    "https://trakky.in/",
    "https://trakky.in/salonRegistration",
    "https://trakky.in/terms-of-use",
    "https://trakky.in/contactus",
    "https://trakky.in/vendor-register",
    "https://trakky.in/privacypolicy",
  ];

  return links;
};

const listSalonByCity = () => {
  let links = [];
  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/salons`);
  });

  return links;
};

const ListSalonServicesLink = () => {
  let links = [];

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/topratedsalons/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/bridalsalons/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/unisexsalons/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/kidsspecialsalons/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/femalebeautyparlour/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/malesalons/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/academysalons/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/makeupsalons/`);
  });

  cities?.map((city) => {
    links.push(`https://trakky.in/${city}/nearby/`);
  });

  return links;
};

const listSalonByArea = () => {
  let links = [];

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/salons/${area}`);
    });
  });

  return links;
};

const listSalonProfileLink = () => {
  let links = [];

  salonData?.map((salon) => {
    links.push(
      `https://trakky.in/${salon.city}/${salon.area}/salons/${salon.slug}`
    );
  });

  return links;
};

const ListSalonServicesLinkByArea = () => {
  let links = [];

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/topratedsalons/${area}`);
    });
  });

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/bridalsalons/${area}`);
    });
  });

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/academysalons/${area}`);
    });
  });

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/makeupsalons/${area}`);
    });
  });

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/unisexsalons/${area}`);
    });
  });

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/femalebeautyparlour/${area}`);
    });
  });

  areas?.map((area) => {
    let city = Object.keys(area)[0];
    area[city]?.map((area) => {
      links.push(`https://trakky.in/${city}/kidsspecialsalons/${area}`);
    });
  });

  return links;
};

const generateCategoryLinks = () => {
  let links = [];

  let category = categoryData;

  category?.map((category) => {
    links.push(
      `https://trakky.in/${category.city}/categories/${category.slug}`
    );
  });

  return links;
};

const generateOfferLinks = () => {
  let links = [];

  let offers = offerData;
  offers?.map((offer) => {
    links.push(`https://trakky.in/${offer.city}/offers/${offer.slug}`);
  });

  return links;
};

const generateLinks = async () => {
  let links = [];

  let fixed = fixedLinks();

  let citySalon = listSalonByCity();

  let citySalonServices = ListSalonServicesLink();

  let areaSalon = listSalonByArea();

  let salonProfile = listSalonProfileLink();

  let salonServicesByArea = ListSalonServicesLinkByArea();

  let category = generateCategoryLinks();

  let offer = generateOfferLinks();

  links = [
    ...fixed,
    ...citySalon,
    ...citySalonServices,
    ...areaSalon,
    ...salonProfile,
    ...salonServicesByArea,
    ...category,
    ...offer,
  ];

  return links;
};

getCities().then((data) => {
  cities = data.city;
  areas = data.areas;

  getSalons().then((data) => {
    salonData = data;

    getCategory().then((data) => {
      categoryData = data;

      getOffers().then((data) => {
        offerData = data;

        generateLinks().then((links) => {
          listOfLinks = links.join("\n");
          console.log("Writing to file", listOfLinks);

          fs.writeFile("links.txt", listOfLinks, (err) => {
            if (err) {
              console.error("Error writing to file:", err);
              return;
            }
            console.log("Value has been written to output.txt");
          });
        });
      });
    });
  });
});
