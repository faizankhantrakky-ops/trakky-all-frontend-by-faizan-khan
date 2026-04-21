import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Components/MainPage/Main.jsx";
import SalonList from "../Components/SalonPage/SalonList/SalonList.jsx";
import SalonProfile from "../Components/SalonPage/SalonProfile/SalonProfile.jsx";
import ScrollToTop from '../Components/Common/ScrollToTop/ScrollToTop.jsx'
import OfferSalonList from '../Components/SalonPage/SalonList/OfferSalonList.jsx'
// import ReelPlayerPage from '../Components/ReelPage/ReelPlayerPage.jsx';
const Router = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" index exact Component={Home} />
        <Route path="/salonnearyou" index exact element={<SalonList name="Salon Near You" url="salonNearYou" />} />
        <Route path="/topratedsalons" index exact element={<SalonList name="Top Rated Salons" url="topRatedSalons" />} />
        <Route path="/bridalsalons" index exact element={<SalonList name="Bridal Salons" url="bridalSalons" />} />
        <Route path="/academysalons" index exact element={<SalonList name="Bridal Salons" url="academySalons" />} />
        <Route path="/makeupsalons" index exact element={<SalonList name="Bridal Salons" url="makeupSalons" />} />
        <Route path="/salons/:slug" index exact element={<SalonProfile />} />
        <Route path="/offer/:slug" index exact element={<OfferSalonList />} />
        {/* <Route path="/:city/trakkyreel/:reelId" element={<ReelPlayerPage />} /> */}

        {/* Experiment */}
        {/* <Route path="/:city" element={<Home />} /> */}

      </Routes>
    </BrowserRouter>
  );
};

export default Router;
