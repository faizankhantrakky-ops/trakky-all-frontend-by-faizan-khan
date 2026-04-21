import React from "react";
import "./css/Dashbord_cards.css";
import { useNavigate } from "react-router-dom";

const Dashbord_cards = (data) => {
  const navigate = useNavigate();

  const handleClick = (cardName) => {
    const routes = {
      "Total Spas": "/listspas",
      "Total Services": "/listservices",
      "Total Vendors": "/listvendors",
      "Total Users": "/customers",
      "Total Cities": "/listcities",
      "Total Inquiries": "/inquiry",
      "Total Blogs": "/listblogs",
      "Total Therapies": "/listtherapies",
    };

    if (routes[cardName]) {
      navigate(routes[cardName]);
    }
  };

  return (
    <div id="parent" onClick={() => handleClick(data.name)}>
      <div id="ch1">{data.name}</div>
      <div id="ch2">{data.number}</div>
    </div>
  );
};

export default Dashbord_cards;
