import React, { useEffect, useState } from "react";
import "./listpage.css";
import { useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import { capitalizeAndFormat } from "../functions/generalFun";
import OtherListCard from "./listcard/OtherListCard";
import Header from "../Common/Navbar/Header";
import FooterN from "../Common/Footer/FooterN";
import smallAndFormat from "../Common/functions/smallAndFormat";
import { Helmet } from "react-helmet-async"; // Use react-helmet-async for better SSR

const MassagesComp = () => {
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const city = params?.city?.toLowerCase();
  const slug = params?.name;
  const formattedCity = smallAndFormat(city);
  const formattedName = smallAndFormat(slug);

  // Keywords for EVERY page
  const keywords = "best spa near me, top-rated spa, massage near me, best spa in ahmedabad, body massage spa";

  // SEO Data (exact as per your list) — NO FALLBACK TO INDEX.HTML
  const seoData = {
    "shirodhara-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Shirodhara Therapy & Massage Near Me",
        description: "Relax at a top-rated spa in Ahmedabad with authentic Shirodhara therapy. Book your body massage now the best spa near me for wellness & peace."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar | Shirodhara Therapy & Massage Near Me",
        description: "Relax at a top-rated spa in Gandhinagar with authentic Shirodhara therapy. Book your body massage spa now the best spa near me for wellness & peace."
      }
    },
    "traditional-thai-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Traditional Thai Massage Near Me",
        description: "Experience a body massage at its best with Traditional Thai Therapy in Ahmedabad. Visit a top-rated spa near me for massage near me & wellness today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Traditional Thai Massage Near Me",
        description: "Experience a body massage spa at its best with Traditional Thai Therapy in Gandhinagar. Visit a top-rated spa near me for massage near me & wellness today."
      }
    },
    "oil-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Oil Massage Near Me Body Massage Spa",
        description: "Visit a top-rated spa in Ahmedabad for luxurious oil massage therapy. Relax & unwind at the best spa near me with quality body massage services today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar | Oil Massage Near Me Body Massage Spa",
        description: "Visit a top-rated spa in Gandhinagar for luxurious oil massage therapy. Relax & unwind at the best spa near me with quality body massage spa services today."
      }
    },
    "couple-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Couple Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with couple massage therapy in Ahmedabad. Book the best spa near me offering massage near me for romance & relaxation."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Couple Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with couple massage therapy in Gandhinagar. Book the best spa near me offering massage near me for romance & relaxation."
      }
    },
    "jacuzzi-massage-theraphy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Jacuzzi Massage Near Me & Body Massage Spa",
        description: "Indulge at a top-rated spa near me with soothing jacuzzi massage therapy in Ahmedabad. Relax, unwind and choose the best spa near me for body massage wellness."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Jacuzzi Massage Near Me & Body Massage Spa",
        description: "Indulge at a top-rated spa near me with soothing jacuzzi massage therapy in Gandhinagar. Relax, unwind and choose the best spa near me for body massage spa & wellness."
      }
    },
    "hammam-water-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Hammam Water Massage Near Me",
        description: "Rejuvenate at a top-rated spa in Ahmedabad with Hammam water massage. Book the best spa near me for body massage spa & massage near me experiences today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Hammam Water Massage Near Me",
        description: "Rejuvenate at a top-rated spa in Gandhinagar with Hammam water massage. Book the best spa near me for body massage spa & massage near me experiences today."
      }
    },
    "hot-oil-body-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Hot Oil Body Massage Near Me",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating hot oil body massage therapy. Book the best spa near me for a soothing massage near me today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Hot Oil Body Massage Near Me",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating hot oil body massage therapy. Book the best spa near me for a soothing massage near me today."
      }
    },
    "cream-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Cream Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with luxurious cream massage therapy in Ahmedabad. Book the best spa near me for a rejuvenating body massage today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Cream Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with luxurious cream massage therapy in Gandhinagar. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "balinese-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Balinese Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with authentic Balinese massage therapy. Book the best spa near me for a rejuvenating body massage today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar | Balinese Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with authentic Balinese massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "aroma-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Aroma Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with soothing aroma massage therapy in Ahmedabad. Book the best spa near me for a rejuvenating body massage spa today"
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar | Aroma Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with soothing aroma massage therapy in Gandhinagar. Book the best spa near me for a rejuvenating body massage spa today"
      }
    },
    "four-hand-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Four Hand Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with synchronized four hand massage therapy in Ahmedabad. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar | Four Hand Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with synchronized four hand massage therapy in Gandhinagar. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "lomi-lomi-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Lomi Lomi Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with authentic Lomi Lomi massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar | Lomi Lomi Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with authentic Lomi Lomi massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "signature-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Signature Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with our Signature Massage Therapy in Ahmedabad. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Signature Massage Near Me & Body Massage Spa",
        description: "Indulge in a top-rated spa experience with our Signature Massage Therapy in Gandhinagar. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "abhyang-malish":{
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Abhyang Malish Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with traditional Abhyang Malish therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Abhyang Malish Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with traditional Abhyang Malish therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "deep-tissue-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Deep Tissue Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with therapeutic deep tissue massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Deep Tissue Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with therapeutic deep tissue massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "swedish-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Swedish Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with soothing Swedish massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Swedish Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagarwith soothing Swedish massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "gel-body-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Gel Body Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with soothing gel body massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Gel Body Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with soothing gel body massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "couple-normal": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Couple Normal Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with soothing couple normal massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Couple Normal Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with soothing couple normal massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "couple-special": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Couple Special Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with exclusive Couple Special Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Couple Special Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with exclusive Couple Special Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "couple-jacuzzi": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Couple Jacuzzi Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with luxurious couple jacuzzi massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Couple Jacuzzi Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with luxurious couple jacuzzi massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "couple-maharaja": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Couple Maharaja Massage Near Me & Body Massage Spa",
        description: "Experience royal treatment at a top-rated spa in Ahmedabad with the luxurious Couple Maharaja Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Couple Maharaja Massage Near Me & Body Massage Spa",
        description: "Experience royal treatment at a top-rated spa in Gandhinagar with the luxurious Couple Maharaja Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "shirodhara": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Shirodhara Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with soothing Shirodhara massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Shirodhara Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with soothing Shirodhara massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "hot-stone-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Hot Stone Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with soothing hot stone massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Hot Stone Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with soothing hot stone massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "purna-vedic-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Purna Vedic Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating Purna Vedic Massage Therapy. Book the best spa near me for a holistic body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Purna Vedic Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating Purna Vedic Massage Therapy. Book the best spa near me for a holistic body massage spa today."
      }
    },
    "dry-body-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Dry Body Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with invigorating dry body massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Dry Body Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with invigorating dry body massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "body-scrubs-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Body Scrub Massage Near Me & Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating body scrub massage therapy. Book the best spa near me for a refreshing spa experience today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Body Scrub Massage Near Me & Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating body scrub massage therapy. Book the best spa near me for a refreshing spa experience today."
      }
    },
    "lounge-room-premium-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Lounge Room Premium Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with exclusive lounge room premium massage therapy. Book the best spa near me for a luxurious body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Lounge Room Premium Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with exclusive lounge room premium massage therapy. Book the best spa near me for a luxurious body massage spa today."
      }
    },
    "ark-special-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | ARK Special Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with ARK Special Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| ARK Special Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with ARK Special Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "candle-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Candle Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with soothing candle massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Candle Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with soothing candle massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "potli-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Potli Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating Potli Massage Therapy. Book the best spa near me for a holistic body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Potli Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating Potli Massage Therapy. Book the best spa near me for a holistic body massage spa today."
      }
    },
    "scrub-body-massage-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Scrub Body Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating scrub body massage therapy. Book the best spa near me for a refreshing body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Scrub Body Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating scrub body massage therapy. Book the best spa near me for a refreshing body massage spa today."
      }
    },
    "the-spa-special-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | The Spa Special Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with The Spa Special Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| The Spa Special Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with The Spa Special Massage Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "signature-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Signature Therapy Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with our exclusive Signature Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Signature Therapy Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with our exclusive Signature Therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "hot-oil-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Hot Oil Therapy Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with soothing hot oil therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Hot Oil Therapy Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with soothing hot oil therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "balinese-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Balinese Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating Balinese Massage Therapy. Book the best spa near me for a holistic body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Balinese Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating Balinese Massage Therapy. Book the best spa near me for a holistic body massage spa today."
      }
    },
    "swedish-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Swedish Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating Swedish Massage Therapy. Book the best spa near me for a relaxing body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Swedish Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating Swedish Massage Therapy. Book the best spa near me for a relaxing body massage spa today."
      }
    },
    "aroma-therapy-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Aroma Therapy Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating aroma therapy massage. Book the best spa near me for a relaxing body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Aroma Therapy Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating aroma therapy massage. Book the best spa near me for a relaxing body massage spa today."
      }
    },
    "traditional-thai-massage": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Traditional Thai Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with authentic traditional Thai massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Traditional Thai Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with authentic traditional Thai massage therapy. Book the best spa near me for a rejuvenating body massage spa today."
      }
    },
    "head-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Head Therapy Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating head therapy massage. Book the best spa near me for a relaxing body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Head Therapy Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating head therapy massage. Book the best spa near me for a relaxing body massage spa today."
      }
    },
    "foot-reflexology": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Foot Reflexology Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad with rejuvenating Foot Reflexology massage. Book the best spa near me for a relaxing body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Foot Reflexology Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar with rejuvenating Foot Reflexology massage. Book the best spa near me for a relaxing body massage spa today."
      }
    },
    "neck-&-shoulder-therapy": {
      ahmedabad: {
        title: "Best Spa in Ahmedabad | Neck & Shoulder Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Ahmedabad offering soothing neck & shoulder therapy. Book the best spa near me for a relaxing body massage spa today."
      },
      gandhinagar: {
        title: "Best Spa in Gandhinagar| Neck & Shoulder Massage Near Me & Body Massage Spa",
        description: "Experience a top-rated spa in Gandhinagar offering soothing neck & shoulder therapy. Book the best spa near me for a relaxing body massage spa today."
      }
    }
  };

  // Get current SEO — NO FALLBACK TO INDEX.HTML
  const currentSeo = seoData[slug]?.[city] || {
    title: `Best Spa in ${capitalizeAndFormat(city)} | ${formattedName} Near Me`,
    description: `Relax at a top-rated spa in ${capitalizeAndFormat(city)} with ${formattedName}. Book the best spa near me for wellness & peace.`
  };

  // Canonical URL
  const canonicalUrl = `https://spa.trakky.in/${city}/massages/${slug}`;

  // API Call
  const getTrustedSpa = async (page) => {
    const url = `https://backendapi.trakky.in/spas/spa-master-service-filter/?city=${city}&page=${page}&master_service=${params?.id}&verified=true`;
    setIsDataLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        if (page === 1) setListData(data?.results || []);
        else setListData((prev) => [...prev, ...(data?.results || [])]);
        setHasMore(!!data?.next);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    getTrustedSpa(1);
  }, [params?.id, city]);

  useEffect(() => {
    if (page > 1) getTrustedSpa(page);
  }, [page]);

  // FORCE REMOVE OLD META TAGS FROM index.html
  useEffect(() => {
    const oldMeta = document.querySelector('meta[name="description"]');
    if (oldMeta && oldMeta.getAttribute("content") !== currentSeo.description) {
      oldMeta.remove();
    }
  }, [currentSeo.description]);

  return (
    <>
      {/* Helmet — 100% OVERRIDE */}
      <Helmet prioritizeSeoTags>
        <title>{currentSeo.title}</title>
        <meta name="description" content={currentSeo.description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={currentSeo.title} />
        <meta property="og:description" content={currentSeo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Trakky Spa" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentSeo.title} />
        <meta name="twitter:description" content={currentSeo.description} />
      </Helmet>

      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />

        <div className="N-listpage-heading">
          <h1>List of {formattedName} spas in {formattedCity}</h1>
        </div>

        <div className="N-lp-card-listing-container">
          {isDataLoading && listData.length === 0 ? (
            <div className="N-lp-load-more">
              <div className="N-lp-loader"></div>
            </div>
          ) : listData?.length > 0 ? (
            listData.map((item, index) => <OtherListCard key={index} data={item} />)
          ) : (
            <div className="mx-auto h-20 flex items-center font-semibold">No spa found</div>
          )}
        </div>

        {hasMore && (
          <div className="lp-load-more">
            {isDataLoading ? (
              <div className="lp-loader"></div>
            ) : (
              <button onClick={() => setPage((prev) => prev + 1)}>View More</button>
            )}
          </div>
        )}

        <PopularArea />
        <FooterN city={city || "ahmedabad"} />
      </div>
    </>
  );
};

export default MassagesComp;