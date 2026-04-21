import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/MainPage/Main.jsx";
import SpaProfile from "./Components/SpaPage/SpaProfile/SpaProfile.jsx";
import ScrollToTop from "./Components/Common/ScrollToTop.jsx";
import OfferSpaList from "./Components/SpaPage/SpaList/OfferSpaList.jsx";
import SpaList from "./Components/SpaPage/SpaList/SpaList.jsx";
import TherapySpaList from "./Components/SpaPage/SpaList/TherapySpaList.jsx";
import MainHome from "./Components/MainPage/MainHome.jsx";
import SpaRegistration from "./Components/forms/SpaRegistration.jsx";
import ListPage from "./Components/listpage/ListPage.jsx";
import AreaListPage from "./Components/listpage/AreaListPage.jsx";
import Error from "./Components/Error/error.jsx";
import OfferListPage from "./Components/listpage/OfferListPage.jsx";
import TherapyListPage from './Components/listpage/TherapyListPage.jsx'
import Vendor from './Components/ContactUs/Vendor.jsx'
import Contactus from './Components/ContactUs/Contactus.jsx'
import PrivacyPolicy from './Components/ContactUs/PrivacyPolicy.jsx'
import Termsofuse from './Components/ContactUs/Termsofuse.jsx'
import NNationalPage from "./Components/NNationalPage/NNationalPage.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Feedback from "./Components/UserProfile/Feedback/Feedback.jsx";
import UserProfile from "./Components/UserProfile/ProfilePage.jsx";
import MyInfo from "./Components/UserProfile/MyInfo/MyInfo.jsx";
import MyBookings from "./Components/UserProfile/Booking/Bookings.jsx"
import NProfilePage from "./Components/NProfilePage/NProfilePage.jsx";
import Privacy from "./Components/UserProfile/Privacy/Privacy.jsx";
import RateUs from "./Components/UserProfile/RateUs/RateUs.jsx";
import TermsOfUse from "./Components/UserProfile/TermsOfUse/TermsOfUse.jsx";
import CityPage from "./Components/NCityPage/CityPage.jsx";

import ListPageSpaCate from "./Components/listpage/ListPageSpaCategory.jsx";
import TrustedSpa from "./Components/listpage/TrustedSpa.jsx";
import WalkInOffers from "./Components/listpage/WalkInOffersPage.jsx";
import MassagesComp from "./Components/listpage/Massages.jsx";
import Report from "./Components/UserProfile/Report/Report.jsx";
import ReferralPage from "./Components/UserProfile/ReferalPage/Referal.jsx";
import RedeemCoupon from "./Components/UserProfile/RedeemPage/RedeemCoupon.jsx";

// Spa User Side Code
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" index exact element={<NNationalPage />} />
        <Route path="/:city/spas" index exact element={<CityPage />} />
        <Route
          path="/spaRegistration"
          index
          exact
          element={<SpaRegistration />}
        />

        <Route
          path="/:city/spas-we-trust"
          index
          exact
          element={
            <TrustedSpa />
          }
        />

        <Route
          path="/:city/walk-in-offers"
          index
          exact
          element={
            <WalkInOffers />
          }
        />

          <Route
            path="/:city/massages/:name/:id"
            index
            exact
            element={<MassagesComp />}
          />

        <Route path="/offers/:slug" index exact element={<OfferSpaList />} />
        <Route
          path="/therapies/:slug"
          index
          exact
          element={<TherapySpaList />}
        />

        <Route
          path="/:city/offers/:slug"
          index
          exact
          element={<OfferListPage />}
        />
        <Route
          path="/:city/therapies/:slug"
          index
          exact
          element={<TherapyListPage />}
        />

        <Route
          path="/:city/topratedspas"
          index
          exact
          element={

            <ListPageSpaCate
              title="Top Rated Spas"
              subtitle="List of Top Rated Spas"
              name='topRatedSpas'
            />

          }
        />
        <Route
          path="/:city/luxuriousspas"
          index
          exact
          element={
            <ListPageSpaCate
              title="Luxurious Spas"
              subtitle="List of Luxurious Spas"
              name='luxuriousSpas'
            />
          }
        />
        <Route
          path="/:city/beautyspas"
          index
          exact
          element={
            <ListPageSpaCate
              title="Beauty Spas"
              subtitle="List of Beauty Spas"
              name='beautySpas'
            />
          }
        />
        <Route
          path="/:city/bodyMassagespas"
          index
          exact
          element={
            <ListPageSpaCate
              title="Body Massage Spas"
              subtitle="List of Body Massage Spas"
              name='bodyMassageSpas'
            />
          }
        />
        <Route
          path="/:city/bodyMassagecenter"
          index
          exact
          element={
            <ListPageSpaCate
              title="Body Massage Centers"
              subtitle="List of Body Massage Centers"
              name='bodyMassageCenters'
            />
          }
        />
        <Route
          path="/:city/menspas"
          index
          exact
          element={
            <ListPageSpaCate
              title="Spas for Men"
              subtitle="List of Men Spas"
              name='menSpas'
            />
          }
        />
        <Route
          path="/:city/womenspas"
          index
          exact
          element={
            <ListPageSpaCate
              title="Spas for Women"
              subtitle="List of Women Spas"
              name='womenSpas'
            />
          }
        />
        <Route
          path="/:city/thaimassage"
          index
          exact
          element={
            <ListPageSpaCate
              title="Thai Body Massage"
              subtitle="List of Thai Body Massage"
              name='thaiBodyMassage'
            />
          }
        />
        <Route
          path="/:city/bestspas"
          index
          exact
          element={
            <ListPageSpaCate
              title="Best Spas"
              subtitle="List of Best Spas"
              name='bestSpas'
            />
          }
        />
        <Route
          path="/:city/nearby"
          index
          exact
          element={
            <ListPageSpaCate
              title="Spas Near You"
              subtitle="List of Spas Near You"
              name='nearby'
            />
          }
        />

        {/* Experiment Area */}


        <Route
          path="/:city/spas/:area"
          index
          exact
          element={
            // <SpaList name="Salon in" url="areapage" />
            <AreaListPage
              title="Spas In"
              subtitle="Spas"
              name='areapage'
            />
          }
        />
        <Route
          path="/:city/:area/spas/:slug"
          index
          exact
          element={<NProfilePage />}
        />
        <Route
          path="/:city/:area/offers/:slug"
          index
          exact
          element={<OfferSpaList />}
        />
        <Route
          path="/:city/:area/therapies/:slug"
          index
          exact
          element={<TherapySpaList />}
        />

        <Route
          path="/:city/topratedspas/:area"
          index
          exact
          element={
            <AreaListPage
              title="Top Rated Spas In"
              subtitle="top rated"
              name='topRatedSpas'
            />
          }
        />
        <Route
          path="/:city/luxuriousspas/:area"
          index
          exact
          element={
            <AreaListPage
              title="Luxurious Spas In"
              subtitle="luxurious"
              name='luxuriousSpas'
            />
          }
        />
        <Route
          path="/:city/beautyspas/:area"
          index
          exact
          element={
            <AreaListPage
              title="Beauty Spas In"
              subtitle="beauty"
              name='beautySpas'
            />
          }
        />
        <Route
          path="/:city/menspas/:area"
          index
          exact
          element={
            <AreaListPage
              title="Men Spas In"
              subtitle="Men's"
              name='menSpas'
            />
          }
        />
        <Route
          path="/:city/womenspas/:area"
          index
          exact
          element={
            <AreaListPage
              title="Women Spas In"
              subtitle="Women's"
              name='womenSpas'
            />
          }
        />
        <Route
          path="/:city/bodymassagecenter/:area"
          index
          exact
          element={
            <AreaListPage
              title="Body Massage Centers In"
              subtitle="body massage centers"
              name='bodyMassageCenters'
            />
          }
        />
        <Route
          path="/:city/bodymassagespas/:area"
          index
          exact
          element={
            <AreaListPage
              title="Body Massage Spas In"
              subtitle="body massage"
              name='bodyMassageSpas'
            />
          }
        />

        <Route
          path="/:city/bestspas/:area"
          index
          exact
          element={
            <AreaListPage
              title="Best Spas In"
              subtitle="best"
              name='bestSpas'
            />
          }
        />

        <Route
          path="/:city/thaimassage/:area"
          index
          exact
          element={
            <AreaListPage
              title="Thai Body Massage In"
              subtitle="thai body massage"
              name='thaiBodyMassage'
            />
          }
        />



        <Route
          path="/terms-of-use"
          element={
            <Termsofuse />
          }
        />
        <Route
          path="/contactus"
          element={
            <Contactus />
          }
        />
        <Route
          path="/Vendor-page"
          element={
            <Vendor />
          }
        />
        <Route
          path="/privacypolicy"
          element={
            <PrivacyPolicy />
          }
        />


        <Route path="/" element={<PrivateRoute />}>
          <Route path="userProfile" element={<UserProfile />}>
            <Route path="my-info" element={<MyInfo />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="rate-us" element={<RateUs />} />
            <Route path="report-spa" element={<Report />} />
            <Route
              path="refer"
              element={<ReferralPage />}

            />
             <Route
            path="redeem-coupon"
            element={<RedeemCoupon />}

          />
          </Route>
        </Route>


        <Route
          path="*"
          element={<Error />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
