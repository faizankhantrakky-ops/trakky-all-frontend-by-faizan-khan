import React, { useEffect, useState } from "react";
import "./listpage.css";
import { Link, useParams, useLocation } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Slider from "../Common/Slider/Slider";
import { capitalizeAndFormat } from "../functions/generalFun";
import {
  getAllAreaSpas,
  getBeautySpas,
  getBodyMassageSpas,
  getLuxuriosSpas,
  getMenSpas,
  getWomenSpas,
  getTopRatedSpas,
  getBodyMassageCenters,
  getBestSpas,
  getThaiBodyMassage,
} from "./pageapi";

import OtherListCard from "./listcard/OtherListCard";
import Header from "../Common/Navbar/Header";
import FooterN from "../Common/Footer/FooterN";
import smallAndFormat from "../Common/functions/smallAndFormat";
import { Helmet } from "react-helmet-async";

/* ──────────────────────── SEO MetaData (Exact Titles + URLs) ──────────────────────── */
const metaData = {
  // Ahmedabad Areas - Already Present
  Prahladnagar: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Prahladnagar Spa Near Me & Body Massage Spa",
      description: "Experience a top-rated spa in Prahladnagar that makes you feel pampered. Book the best spa near me for indulgent massage near me and full body massage spa today."
    }
  },
  "Sindhubhavan Road": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Sindhubhavan Road Spa Near Me & Body Massage Spa",
      description: "Enjoy a top-rated spa in Sindhubhavan Road with expert massage near me services. Find the best spa near me that offers full body massage spa in Ahmedabad today."
    }
  },
  Nikol: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Nikol Spa Near Me & Body Massage Spa",
      description: "Discover a top-rated spa in Nikol, Ahmedabad offering expert massage near me services. Book the best spa near me for a soothing body massage spa today."
    }
  },
  Navrangpura: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Navrangpura Spa Near Me & Body Massage Spa",
      description: "Unwind at a top-rated spa in Navrangpura offering soothing massage near me services. Book the best spa near me for a relaxing body massage spa today."
    }
  },
  "Vaishnodevi Circle": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Vaishnodevi Circle Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Vaishnodevi Circle offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Ellisbridge: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Ellis Bridge Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Ellis Bridge offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Shahibag: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Shahibag Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Shahibag offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Bopal: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Bopal Spa Near Me & Body Massage Spa",
      description: "Discover a top-rated spa in Bopal offering rejuvenating massage near me services. Book the best spa near me for a relaxing body massage spa experience today."
    }
  },
  Sola: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Sola Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Sola offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Paldi: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Paldi Spa Near Me & Body Massage Spa",
      description: "Discover a top-rated spa in Paldi offering rejuvenating massage near me services. Book the best spa near me for a relaxing body massage spa experience today."
    }
  },
  "Ashram Road": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Ashram Road Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa on Ashram Road offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Gurukul: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Gurukul Spa Near Me & Body Massage Spa",
      description: "Discover a top-rated spa in Gurukul offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Satellite: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Satellite Spa Near Me & Body Massage Spa",
      description: "Discover a top-rated spa in Satellite offering rejuvenating massage near me services. Book the best spa near me for a relaxing body massage spa experience today."
    }
  },
  Chandkheda: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Chandkheda Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Chandkheda offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Gota: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Gota Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Gota offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Thaltej: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Thaltej Spa Near Me & Body Massage Spa",
      description: "Discover a top-rated spa in Thaltej offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  "C.G. Road": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | C.G. Road Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa on C.G. Road offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Memnagar: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Memnagar Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Memnagar offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Bodakdev: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Bodakdev Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Bodakdev offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Shilaj: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Shilaj Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Shilaj offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Jagatpur: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Jagatpur Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Jagatpur offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Vastrapur: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Vastrapur Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Vastrapur offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  "SG Highway": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | SG Highway Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa on SG Highway offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Panchvati: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Panchvati Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Panchvati offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Usmanpura: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Usmanpura Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Usmanpura offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  "Nehru Nagar": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Nehru Nagar Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Nehru Nagar offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  "Income Tax": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Income Tax Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Income Tax offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Ambawadi: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Ambawadi Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Ambawadi offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Ambli: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Ambli Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Ambli offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Sanidhya: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Sanidhya Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Sanidhya offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Naranpura: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Naranpura Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Naranpura offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Maninagar: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Maninagar Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Maninagar offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  "Science City": {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Science City Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Science City offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Shela: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Shela Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Shela offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Makarba: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Makarba Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Makarba offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },
  Tapovan: {
    ahmedabad: {
      title: "Best Spa in Ahmedabad | Tapovan Spa Near Me & Body Massage Spa",
      description: "Relax at a top-rated spa in Tapovan offering rejuvenating massage near me services. Book the best spa near me for a soothing body massage spa experience today."
    }
  },

  // GANDHINAGAR AREAS - FULLY ADDED
  Kudasan: {
    gandhinagar: {
      title: "Best Spa in Gandhinagar | Kudasan Spa Near Me & Body Massage Spa",
      description: "Experience a top-rated spa in Kudasan that makes you feel pampered. Book the best spa near me for indulgent massage near me and full body massage spa today."
    }
  },
  Sargasan: {
    gandhinagar: {
      title: "Best Spa in Gandhinagar | Sargasan Spa Near Me & Body Massage Spa",
      description: "Experience a top-rated spa in Sargasan that makes you feel pampered. Book the best spa near me for indulgent massage near me and full body massage spa today."
    }
  },
  Kalol: {
    gandhinagar: {
      title: "Best Spa in Gandhinagar | Kalol Spa Near Me & Body Massage Spa",
      description: "Experience a top-rated spa in Kalol that makes you feel pampered. Book the best spa near me for indulgent massage near me and full body massage spa today."
    }
  },
  Infocity: {
    gandhinagar: {
      title: "Best Spa in Gandhinagar | Infocity Spa Near Me & Body Massage Spa",
      description: "Experience a top-rated spa in Infocity that makes you feel pampered. Book the best spa near me for indulgent massage near me and full body massage spa today."
    }
  },
  "Sector-11": {
    gandhinagar: {
      title: "Best Spa in Gandhinagar | Sector-11 Spa Near Me & Body Massage Spa",
      description: "Experience a top-rated spa in Sector-11 that makes you feel pampered. Book the best spa near me for indulgent massage near me and full body massage spa today."
    }
  },
};
/* ───────────────────────────────────────────────────────────── */

const AreaListPage = ({ name }) => {
  const params = useParams();
  const location = useLocation();

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [city, setCity] = useState(params?.city?.toLowerCase());
  const [area, setArea] = useState(params?.area);
  const [type, setType] = useState("");

  // Generate correct canonical URL
  const currentUrl = `https://spa.trakky.in${location.pathname}`;

  // Normalize area name for metaData lookup
  const normalizedArea = area
    ? area
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : "";

  // Special case: "Ellisbridge" → "Ellis Bridge", "Sector-11" → "Sector-11"
  const displayArea = normalizedArea === "Ellisbridge" ? "Ellis Bridge" : normalizedArea;

  // Get SEO data
  const seoData = metaData[displayArea]?.[city] || {
    title: `Best Spa in ${capitalizeAndFormat(city)} | ${displayArea} Spa Near Me & Body Massage Spa`,
    description: `Find top-rated spas in ${displayArea}, ${capitalizeAndFormat(city)}. Book the best spa near me for a relaxing body massage today.`,
  };

  /* ────── FORCE DYNAMIC META (100% Override) ────── */
  useEffect(() => {
    const oldMeta = document.querySelector('meta[name="description"]');
    if (oldMeta) oldMeta.remove();

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = seoData.description;
    document.head.appendChild(meta);

    return () => {
      if (document.head.contains(meta)) document.head.removeChild(meta);
    };
  }, [seoData.description]);

  /* ────── Detect active tab ────── */
  useEffect(() => {
    const seg = location.pathname.split("/");
    const cityIdx = seg.indexOf(params.city);
    if (cityIdx !== -1 && cityIdx + 1 < seg.length) {
      setType(seg[cityIdx + 1]);
    }
  }, [location.pathname, params.city]);

  const NavOptions = [
    { tag: "All", link: "spas" },
    { tag: "Top Rated Spas", link: "topratedspas" },
    { tag: "Luxurious Spas", link: "luxuriousspas" },
    { tag: "Best Spas", link: "bestspas" },
    { tag: "Beauty Spas", link: "beautyspas" },
    { tag: "Thai Body Massage Spas", link: "thaimassage" },
    { tag: "Men Spas", link: "menspas" },
    { tag: "Women Spas", link: "womenspas" },
    { tag: "Body Massage Spas", link: "bodymassagespas" },
    { tag: "Body Massage Center", link: "bodymassagecenter" },
  ];

  /* ────── Data Fetching ────── */
  useEffect(() => {
    setListData([]);
    async function fetchData() {
      setIsDataLoading(true);
      let data = [];

      switch (name) {
        case "areapage":
          data = await getAllAreaSpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "beautySpas":
          data = await getBeautySpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "bodyMassageSpas":
          data = await getBodyMassageSpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "topRatedSpas":
          data = await getTopRatedSpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "luxuriousSpas":
          data = await getLuxuriosSpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "menSpas":
          data = await getMenSpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "womenSpas":
          data = await getWomenSpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "bodyMassageCenters":
          data = await getBodyMassageCenters(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "bestSpas":
          data = await getBestSpas(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        case "thaiBodyMassage":
          data = await getThaiBodyMassage(capitalizeAndFormat(city), capitalizeAndFormat(displayArea), page);
          break;
        default:
          break;
      }

      if (Array.isArray(data.results)) {
        setListData((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setHasMore(!!data.next);
      }
      setIsDataLoading(false);
    }

    fetchData();
  }, [page, city, area, name, displayArea]);

  const handleLoadMore = () => setPage((p) => p + 1);

  useEffect(() => {
    setArea(params?.area);
    setListData([]);
    setPage(1);
  }, [params?.area]);

  useEffect(() => setCity(params?.city?.toLowerCase()), [params?.city]);

  // Dynamic Heading
  const getHeading = () => {
    const areaFormatted = smallAndFormat(area);
    const cityFormatted = capitalizeAndFormat(city);

    const tabLabels = {
      areapage: `List of spas In ${areaFormatted}`,
      bodyMassageCenters: `List of Body Massage Centers in ${areaFormatted}, ${cityFormatted}`,
      menSpas: `List of spas for men in ${areaFormatted}, ${cityFormatted}`,
      womenSpas: `List of spas for women in ${areaFormatted}, ${cityFormatted}`,
      topratedspas: `List of Top Rated Spas in ${areaFormatted}, ${cityFormatted}`,
      luxuriousspas: `List of Luxurious Spas in ${areaFormatted}, ${cityFormatted}`,
      bestspas: `List of Best Spas in ${areaFormatted}, ${cityFormatted}`,
      beautyspas: `List of Beauty Spas in ${areaFormatted}, ${cityFormatted}`,
      thaimassage: `List of Thai Body Massage Spas in ${areaFormatted}, ${cityFormatted}`,
      bodymassagespas: `List of Body Massage Spas in ${areaFormatted}, ${cityFormatted}`,
      bodymassagecenter: `List of Body Massage Centers in ${areaFormatted}, ${cityFormatted}`,
    };

    return tabLabels[name] || `List of spas in ${areaFormatted}, ${cityFormatted}`;
  };

  return (
    <>
      {/* Helmet */}
      <Helmet prioritizeSeoTags>
        <title>{seoData.title}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
      </Helmet>

      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color" />
        <Header />

        {/* Nav Tabs */}
        <div className="L-list-page-option-n-filter">
          {city &&
            area &&
            NavOptions.map((item, idx) => (
              <div
                key={idx}
                className={
                  item.link === type
                    ? "!bg-[#512DC8] !text-white text-sm sort-box"
                    : "sort-box"
                }
              >
                <Link
                  to={`/${encodeURIComponent(city)}/${item.link}/${encodeURIComponent(area)}`}
                  className="text-inherit"
                >
                  {item.tag}
                </Link>
              </div>
            ))}
        </div>

        {/* Page Heading */}
        <div className="N-listpage-heading">
          <h1>{getHeading()}</h1>
        </div>

        {/* Card List */}
        <div className="N-lp-card-listing-container">
          {isDataLoading && page === 1 ? (
            <div className="N-lp-load-more">
              <div className="N-lp-loader" />
            </div>
          ) : listData?.length > 0 ? (
            listData.map((item, i) => <OtherListCard key={i} data={item} />)
          ) : (
            <div className="mx-auto h-20 flex items-center font-semibold">
              No spa found
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="lp-load-more">
            {isDataLoading ? (
              <div className="lp-loader" />
            ) : (
              <button onClick={handleLoadMore}>View More spa</button>
            )}
          </div>
        )}

        <PopularArea />
        <FooterN city={params?.city || "ahmedabad"} />
      </div>
    </>
  );
};

export default AreaListPage;

/* ──────────────────────── OfferContainer ──────────────────────── */
const OfferContainer = () => {
  const [offersData, setOffersData] = useState([]);
  const params = useParams();
  const city = capitalizeAndFormat(params?.city);
  const area = capitalizeAndFormat(params?.area);

  const getOffer = () => {
    fetch(`https://backendapi.trakky.in/spas/offer/?city=${city}&area=${area}`)
      .then((r) => r.json())
      .then(setOffersData)
      .catch(console.error);
  };

  useEffect(() => getOffer(), [city, area]);

  return (
    offersData.length > 0 && (
      <div className="slider__outer-container offer__container" style={{ width: "100%" }}>
        <div className="slider__header" style={{ margin: 0 }}>
          <h2>Grab the best deals</h2>
        </div>
        <Slider cardList={offersData} _name={"offer"} />
      </div>
    )
  );
};  