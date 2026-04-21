import React from "react";
import "./css/Dashbord_cards.css";
import { useNavigate } from "react-router-dom";

const Dashbord_cards = (data) => {
  const { name, number, dateState } = data;
  const navigate = useNavigate();

  const handleClick = (cardName) => {
    const routes = {
      "Total Converted Leads": "/convertedlead",
      "Total Inquiry Leads": "/inquiriesleads",
      "Total Budget Spent": "/CustomerInquires",
      "Total Collaborated Salons": "/collaborated",
    };

    if (routes[cardName]) {
      navigate(routes[cardName], { state: { dateState } });
    }
  };

  return (
    <div className="stat-card" onClick={() => handleClick(name)}>
      <div className="stat-card-title">{name}</div>
      <div className="stat-card-value">{number}</div>
    </div>
  );
};

export default Dashbord_cards;