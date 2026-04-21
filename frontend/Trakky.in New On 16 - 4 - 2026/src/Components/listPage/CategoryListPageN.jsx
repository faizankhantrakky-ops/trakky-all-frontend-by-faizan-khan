import React, { useEffect, useState } from "react";
import ListCard from "./listCard/ListCard";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import FooterN from "../Common/Footer/FooterN";
import Slider from "../Common/Slider/Slider";
import { capitalizeAndFormat } from "../functions/generalFun";
import OfferComponentN from "./OfferComponentN";
import { useSelector, useDispatch } from "react-redux";

import { fetchCategories } from "../../Store/categorySlice";
import "./listpagen.css";
import Header from "../Common/Navbar/Header";
import OtherListCard from "./listCard/OtherListCard";
import { Helmet} from "react-helmet";

// Meta data mapping based on category slugs
const categoryMetaData = {
  // Hair Services - Female
  "hair-cut-and-styling-female": {
    title: "Top Female Hair Cut & Styling Salons in {city} | Trakky",
    description:
      "Book the best female hair cut & styling salons in {city}. Enjoy exclusive offers, expert hair stylists, and top-rated salons near you. Find your perfect hairstyle today!",
    keywords:
      "female haircut {city}, best hair salon {city}, women hair styling {city}, salon near you",
  },
  "hair-colour-female": {
    title: "Top Female Hair Colour Salons in {city} | Trakky",
    description:
      "Book the best female hair colour salons in {city}. Get expert hair colouring services, latest trends, and amazing offers at top-rated salons near you. Transform your look today!",
    keywords:
      "female hair colour {city}, best hair colouring salon {city}, women hair color experts {city}, salon near you",
  },
  "hair-spa-female": {
    title: "Premium Female Hair Spa in {city} | Trakky",
    description:
      "Treat your hair with the best female hair spa salons in {city}. Deep conditioning, nourishing masks, scalp care & steam therapy. Book now to revive dull hair and enjoy natural sheen!",
    keywords:
      "female hair spa {city}, best women hair spa salon {city}, hair treatment salon {city}, salon near you",
  },
  "hair-treatment-female": {
    title: "Best Hair Treatment for Women in {city} | Top Salons Near You",
    description:
      "Discover the best hair treatments for women in {city}. Explore top salons offering keratin, smoothening, coloring & more. Book your salon appointment online today!",
    keywords:
      "female hair treatment {city}, best women hair salon {city}, women keratin treatment {city}, salon near you",
  },
  "hair-extension-female": {
    title: "Premium Female Hair Extensions in {city} | Trakky",
    description:
      "Upgrade your look with high-quality female hair extensions in {city}. Get clip-in, tape-in, or weft human hair from expert stylists. Book now for beautiful, natural-looking hair today!",
    keywords:
      "female hair extensions {city}, best women hair extension salon {city}, human hair extensions {city}, salon near you",
  },
  "hair-ritual-ahmedabad": {
    title: "Hair Rituals in {city} | Luxury Hair Spa & Treatments",
    description:
      "Indulge in premium hair rituals in {city}. Deep conditioning, scalp therapy, hair spa & custom treatments to revive, nourish and restore your hair. Book online today!",
    keywords:
      "hair rituals {city}, luxury hair spa {city}, hair treatment salon {city}, salon near you",
  },

  // Hair Services - Male
  "hair-cut-and-beard-male": {
    title: "Expert Male Haircut & Beard salons in {city} | Trakky",
    description:
      "Book top male haircut & beard grooming services in {city}. Get precision cuts, stylish beard trimming & shape-ups by experienced barbers. Find your perfect look today!",
    keywords:
      "male haircut {city}, men beard grooming {city}, best barber salon {city}, salon near you",
  },
  "hair-colour-male": {
    title: "Best Hair Colouring for Men salons in {city} | Trakky",
    description:
      "Discover premium male hair colour salons in {city}. Book expert hair colouring, highlights, and styling at top salons near you.",
    keywords:
      "male hair colour {city}, best men hair colouring salon {city}, men highlights salon {city}. salon near you",
  },
  "hair-spa-male": {
    title: "Top Male Hair Spa Salons in {city} | Trakky",
    description:
      "Book the best male hair spa salons in {city}. Enjoy relaxing hair spa treatments, expert care, and exclusive offers at top-rated salons near you. Rejuvenate your hair today!",
    keywords:
      "male hair spa {city}, best men hair spa salon {city}, men hair care salon {city}, salon near you",
  },
  "hair-treatment-male": {
    title: "Best Male Hair Treatment Services in {city} | Trakky",
    description:
      "Get expert male hair treatment in {city} - deep conditioning, keratin, anti-dandruff & hair loss solutions. Book at top salons near you today for healthier, stronger hair!",
    keywords:
      "male hair treatment {city}, best men hair care salon {city}, salon near you",
  },

  // Face & Skin Treatments - Female
  "face-treatment-female": {
    title: "Top Female Face Treatment salons in {city} | Trakky",
    description:
      "Discover premium face treatment services for women in {city} - acne solutions, anti‑aging facials, glow treatments & more. Book expert services at trusted clinics near you today!",
    keywords:
      "female face treatment {city}, best women facial salon {city}, ladies skin care treatment {city}, salon near you",
  },
  "facial-female": {
    title: "Top Female Facial salons in {city} | Trakky",
    description:
      "Book premium female facial salons in {city} - deep cleansing, anti-aging, glow facials & skincare treatments by expert beauticians. Reveal radiant skin today!",
    keywords:
      "female facial {city}, best women facial salon {city}, ladies skincare treatment {city}, salon near you",
  },
  "skin-treatments-female": {
    title: "Book Female Skin Treatment salons in {city} | Trakky",
    description:
      "Explore premium skin treatments for women in {city} - acne solutions, anti-aging facials, pigmentation correction & more. Book expert salons at trusted clinics near you today!",
    keywords:
      "female skin treatment {city}, best women facial salon {city}, ladies skincare clinic {city}, salon near you",
  },
  "skin-care-female": {
    title: "Best Skin Care salon for Women in {city} | Trakky",
    description:
      "Explore the best skin care salons for women in {city}. Find expert salons for facials, clean-ups, skin brightening & more. Book your salon session online today!",
    keywords:
      "women skin care {city}, best female facial salon {city}, ladies skincare clinic {city}, salon near you",
  },

  // Face & Skin Treatments - Male
  "face-treatments-male": {
    title: "Best Male Face Treatment Salons in {city} | Trakky",
    description:
      "Book top male face treatment salons in {city}. Get professional skincare services, expert facials, and exclusive offers at trusted salons near you. Refresh your look today!",
    keywords:
      "male face treatment {city}, best men facial salon {city}, men skincare salon {city}, salon near you",
  },
  "facial-male": {
    title: "Top Male Facial Services in {city} | Trakky",
    description:
      "Book the best male facial salons in {city} for skin rejuvenation, deep cleansing & grooming. Enjoy expert care, exclusive offers & top-rated services near you. Reveal your best skin today!",
    keywords:
      "male facial {city}, best men facial salon {city}, men skincare treatment {city}, salon near you",
  },
  "skin-treatment-male": {
    title: "Best Male Skin Treatment Services in {city} | Trakky",
    description:
      "Looking for expert male skin treatments in {city}? Book top salon services like acne treatment, pigmentation correction & skin rejuvenation at trusted clinics. Get cleaner, healthier skin today!",
    keywords:
      "male skin treatment {city}, best men skincare salon {city}, men facial & skin care {city}, salon near you",
  },
  "skin-care-male": {
    title: "Book Male Skin Care salons in {city} | Trakky",
    description:
      "Discover premium male skin care salons in {city} - acne solutions, anti‑aging facials, pigmentation correction & more. Book expert services at trusted clinics near you today!",
    keywords:
      "male skin care {city}, best men facial salon {city}, men skincare treatment {city}, salon near you",
  },

  // Waxing & Hair Removal
  "waxing-female": {
    title: "Premium Female Waxing Salons in {city} | Trakky",
    description:
      "Book the best female waxing salons in {city} for smooth, safe hair removal. Explore top-rated salons, expert beauty salons & offers near you. Get flawless skin today!",
    keywords:
      "female waxing {city}, best women waxing salon {city}, ladies hair removal salon {city}, salon near you",
  },
  "waxing-male": {
    title: "Best Male Waxing Salons in {city} | Trakky",
    description:
      "Book top male waxing salons in {city} for smooth, professional hair removal. Enjoy expert services, hygiene-focused treatments, and exclusive offers near you. Get flawless skin today!",
    keywords:
      "male waxing {city}, best men waxing salon {city}, men hair removal salon {city}, salon near you",
  },
  "eyebrow-and-waxing-female": {
    title: "Eyebrow & Waxing Services for Women in {city} | Top Salon",
    description:
      "Looking for eyebrow shaping, waxing & grooming for women in {city}? Discover expert hair removal services at leading salons. Book your appointment online today!",
    keywords:
      "female massage {city}, women relaxation massage {city}, salon near you",
  },
  "eyebrow-and-waxing-male": {
    title: "Eyebrow & Waxing Services for Men in {city} | Top Salon",
    description:
      "Looking for eyebrow shaping, waxing & grooming for men in {city}? Discover expert male hair removal services at leading salons. Book your appointment online today!",
    keywords:
      "male massage {city}, men relaxation massage {city}, salon near you",
  },

  // Nail Services
  "manicure-and-padicure-female": {
    title: "Premium Women's Manicure & Pedicure in {city} | Trakky",
    description:
      "Discover premium manicure and pedicure salons for women in {city}. Enhance your nail health and beauty with professional treatments at trusted salons.",
    keywords:
      "women manicure pedicure {city}, best ladies nail salon {city}, female nail care {city}, salon near you",
  },
  "manicure-and-padicure-male": {
    title: "Best Male Manicure & Pedicure Services in {city} | Trakky",
    description:
      "Book top male manicure & pedicure salons in {city}. Get expert nail care, foot treatments, and grooming in clean, professional salons with great offers near you. Treat your hands & feet today!",
    keywords:
      "male manicure pedicure {city}, best men nail salon {city}, men nail care {city}, salon near you",
  },
  "nail-services-female": {
    title: "Women's Nail Services in {city} | Manicure, Pedicure & More",
    description:
      "Pamper your nails with top nail services for women in {city} - manicure, pedicure, nail art, gel, acrylic & more. Book your salon appointment online today!",
    keywords:
      "women nail services {city}, best female manicure pedicure {city}, ladies nail salon {city} , salon near you",
  },

  // Makeup & Bridal
  "makeup-female": {
    title:
      "Professional Makeup Services for Women in {city} | Bridal & Party Makeup",
    description:
      "Looking for expert makeup services in {city}? From bridal glam to party looks - our top salons offer customized makeup, airbrush, HD, and more. Book your dream look today!",
    keywords:
      "women makeup {city}, bridal & party makeup {city}, best female makeup artist {city}, salon near you",
  },
  "bridal-package-female": {
    title: "Best Female Bridal Packages in {city} | Trakky",
    description:
      "Discover premium bridal makeup services for women in {city} - make-up, hair styling. Book the perfect all-in-one bridal salon services near you at great value!",
    keywords:
      "female bridal packages {city}, best bridal makeup salon {city}, bridal hair styling {city}, salon near you",
  },
  "groom-makeup-ahmedabad": {
    title: "Best Groom Makeup Services in {city} | Trakky",
    description:
      "Get professional groom makeup services in {city} - HD makeup, hair styling & skin prep for your wedding day. Book experienced artists & exclusive packages near you for a flawless look!",
    keywords:
      "groom makeup {city}, best men makeup artist {city}, wedding groom makeup {city}, salon near you",
  },
  "groom-services-male": {
    title: "Premium Male Groom Makeup Services in {city} | Trakky",
    description:
      "Discover top male groom makeup services in {city}. Book with Trakky to get expert care, hygiene assurance & exclusive deals near you!",
    keywords:
      "male groom makeup {city}, best men makeup artist {city}, groom makeup salon {city}, salon near you",
  },

  // Massage & Spa
  "massage-services-female": {
    title: "Relaxing Female Massage Services in {city} | Trakky",
    description:
      "Pamper yourself with top female massage services in {city}. Choose from Swedish, aromatherapy, deep tissue & full-body treatments by certified therapists. Book now for relaxation & rejuvenation near you!",
    keywords:
      "female massage {city}, ladies relaxation massage {city}, salon near you",
  },
  "massage-services-male": {
    title: "Top Male Massage Services in {city} | Trakky",
    description:
      "Indulge in premium male massage services in {city} - deep tissue, full body & pain-relief massages, expert therapists, clean & comfortable ambience. Book now to relax and rejuvenate!",
    keywords:
      "male massage {city}, best men massage salon {city}, salon near you",
  },

  // Eyelash Services
  "eyelashes-extensions-female": {
    title: "Eyelash Extensions for Women in {city} | Best Eye Lash Salons",
    description:
      "Get stunning eyelash extensions in {city} - classic, volume, hybrid styles at top salons. Safe, long-lasting lashes tailored for you. Book now!",
    keywords:
      "eyelash extensions {city}, best women eyelash salon {city}, ladies lash extension {city}, salon near you",
  },

  // Package Deals
  "sider-package-female": {
    title: "Best Sider Packages for Women in {city} | Salon Deals & Bundles",
    description:
      "Discover exclusive women's sider packages in {city} - hair, skin, makeup combos at top salons. Book your complete beauty package online today!",
    keywords:
      "women salon packages {city}, best female beauty packages {city}, ladies hair skin makeup bundles {city}, salon near you",
  },
};

const getCategoryMetaData = (categorySlug, city) => {
  const metaData = categoryMetaData[categorySlug] || {
    title: `Book best salons in ${city}.`,
    description: `Checkout best salons in ${city}. Get trusted salon services with trakky near your location with best exclusive offers available on trakky.`,
    keywords: `best salons ${city}, beauty services ${city}, hair salon ${city}, skin care ${city}, salon near you`,
  };

  return {
    title: metaData.title.replace(/{city}/g, city),
    description: metaData.description.replace(/{city}/g, city),
    keywords: metaData.keywords.replace(/{city}/g, city),
  };
};

const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();
  const dispatch = useDispatch();

  const slug = params?.slug;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const categoryState = useSelector((state) => state.categories);
  const [CategoryName, setCategoryName] = useState("Services");
  const [metaData, setMetaData] = useState({ title: "", description: "" });

  useEffect(() => {
    if (slug) {
      const category = categoryState?.data?.find((item) => {
        return item.slug?.toLowerCase() === slug.toLowerCase();
      });

      if (category) {
        setCategoryName(category.category_name);

        // Set meta data based on category slug
        const city = capitalizeAndFormat(params?.city);
        const categoryMeta = getCategoryMetaData(slug, city);
        setMetaData(categoryMeta);
      }
    }
  }, [slug, categoryState, params?.city]);

  const [categoryData, setCategoryData] = useState({ loading: true, data: [] });

  const getCategoryData = async () => {
    const requestOption = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    setCategoryData((prev) => ({ ...prev, loading: true }));

    try {
      // Get city from URL params and capitalize or format it
      const formattedCity = capitalizeAndFormat(params?.city);

      const response = await fetch(
        `https://backendapi.trakky.in/salons/salonwithcategory/?category_slug=${slug}&page=${page}&city=${formattedCity}`,
        requestOption
      );

      const data = await response.json();

      setCategoryData((prev) => ({
        loading: false,
        data: [...prev.data, ...data?.results],
      }));

      setHasMore(!!data?.next);
    } catch (err) {
      console.error("Error fetching category data:", err);
      setCategoryData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    setPage(1);
    setCategoryData({ loading: true, data: [] });
    setHasMore(false);
  }, [slug, params?.city]);

  useEffect(() => {
    getCategoryData();
  }, [slug, params?.city, page]);

  useEffect(() => {
    if (
      categoryState?.city == null ||
      categoryState.city.toLowerCase() !=
        capitalizeAndFormat(params.city).toLowerCase()
    ) {
      dispatch(fetchCategories({ city: capitalizeAndFormat(params.city) }));
    }
  }, [params.city]);

  return (
    <>
      <Helmet>
        <title>
          {metaData.title ||
            `Book best ${CategoryName} salons in ${capitalizeAndFormat(
              params?.city
            )}.`}
        </title>
        <meta
          name="description"
          content={
            metaData.description ||
            `Checkout best ${CategoryName} salons in ${capitalizeAndFormat(
              params?.city
            )}. Get trusted salon services with trakky near your location with best exclusive offers available on trakky.`
          }
        />
        <meta
          name="keywords"
          content={
            metaData.keywords ||
            `${CategoryName} salons ${capitalizeAndFormat(
              params?.city
            )}, best ${CategoryName} services ${capitalizeAndFormat(
              params?.city
            )}, ${CategoryName} near me ${capitalizeAndFormat(params?.city)}`
          }
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/categories/${slug}`}
        />
      </Helmet>
      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />
        <OfferComponentN title={"Grab The Best Offers"} />
        <div className="N-listpage-heading">
          <h1> List of {CategoryName} salons </h1>
        </div>

        {categoryData?.data.length > 0 && (
          <div className="N-lp-card-listing-container">
            {categoryData?.data.map((item, index) => {
              return <OtherListCard key={index} data={item} />;
            })}
          </div>
        )}

        {hasMore &&
          (!categoryData.loading ? (
            <div className="N-lp-load-more">
              <button
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
              >
                View More
              </button>
            </div>
          ) : (
            <div className="N-lp-load-more">
              <div className="N-lp-loader"></div>
            </div>
          ))}

        <PopularArea />
        <FooterN city={params?.city || "ahmedabad"} />
      </div>
    </>
  );
};

export default ListPage;

const OfferContainer = React.memo(() => {
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const city = capitalizeAndFormat(params?.city);

  const path = window.location.pathname.split("/").pop();

  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch(`https://backendapi.trakky.in/salons/offer/?city=${city}`, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getOffer();
  }, [path, params?.city]);

  return (
    offersData?.length > 0 && (
      <div className="slider__outer-container offer__container">
        <div className="slider__header" style={{ margin: 0 }}>
          <h2 className="lp-offer-header">Grab the best deals</h2>
        </div>
        {!loading ? <Slider cardList={offersData} _name={"offer"} /> : <></>}
      </div>
    )
  );
});