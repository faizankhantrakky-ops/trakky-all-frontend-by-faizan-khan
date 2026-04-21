import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Components/MainPage/Main.jsx";
import SpaList from "../Components/SpaPage/SpaList/SpaList.jsx";
import SpaProfile from "../Components/SpaPage/SpaProfile/SpaProfile.jsx";
import ScrollToTop from '../Components/Common/ScrollToTop/ScrollToTop.jsx'
import OfferSpaList from '../Components/SpaPage/SpaList/OfferSpaList.jsx'

const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" index exact Component={Home} />
        <Route path="/spanearyou" index exact element={<SpaList  name="Spa Near You" url="spaNearYou"/>} />
        <Route path="/topratedspas" index exact element={<SpaList  name="Top Rated Spas" url="topRatedSpas"/>} />
        <Route path="/luxuriousspas" index exact element={<SpaList name="Luxurious Spas" url="luxuriousSpas"/>} />
        <Route path="/spas/:slug" index exact element={<SpaProfile />} />
        <Route path="/offer/:slug" index exact element={<OfferSpaList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
