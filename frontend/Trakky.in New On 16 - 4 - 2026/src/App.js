import React, { lazy, Suspense } from "react";
import AuthContext from "./context/Auth.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/MainPage/Main.jsx";
import SalonProfile from "./Components/SalonPage/SalonProfile/SalonProfile.jsx";
import ScrollToTop from "./Components/Common/ScrollToTop.jsx";
import MainHome from "./Components/MainPage/MainHome.jsx";
import SalonRegistration from "./Components/Forms/SalonRegistration.jsx";
import ListPage from "./Components/listPage/ListPage.jsx";
import AreaListPage from "./Components/listPage/AreaListPage.jsx";
import AreaListPageN from "./Components/listPage/AreaListPageN.jsx";
import Error from "./Components/Error/error.jsx";
import CategoryListPage from "./Components/listPage/CategoryListPage.jsx";
import CategoryListPageN from "./Components/listPage/CategoryListPageN.jsx";
import OfferListPage from "./Components/listPage/OfferListPage.jsx";
import OfferListPageN from "./Components/listPage/OfferListPageN.jsx";
import UserProfile from "./Components/UserProfile/ProfilePage.jsx"
import ListPageN from "./Components/listPage/ListPageN.jsx";
// import ReelPlayer from "./Components/ReelPage/ReelPlayer.jsx";
// import ReelPlayerPage from "./Components/ReelPage/ReelPlayerPage.jsx";
import MyInfo from "./Components/UserProfile/MyInfo/MyInfo.jsx";
import Report from "./Components/UserProfile/Report/Report.jsx";
import Faqs from "./Components/UserProfile/Faqs/Faqs.jsx";
import Privacy from "./Components/UserProfile/Privacy/Privacy.jsx";
import Feedback from "./Components/UserProfile/Feedback/Feedback.jsx";
import MyBookings from "./Components/UserProfile/Booking/Bookings.jsx"
import RateUs from "./Components/UserProfile/RateUs/RateUs.jsx";
import TermsOfUse from "./Components/UserProfile/TermsOfUse/TermsOfUse.jsx";
import ReschedulePage from "./Components/UserProfile/Booking/Reschedule.jsx";
import ReferralPage from "./Components/UserProfile/ReferalPage/Referal.jsx";
import RedeemCoupon from "./Components/UserProfile/RedeemPage/RedeemCoupon.jsx";
import Termsofuse from "./Components/ContactUs/Termsofuse.jsx";
import Contactus from "./Components/ContactUs/Contactus.jsx";
import Vendor from "./Components/ContactUs/Vendor.jsx";
import PrivacyPolicy from "./Components/ContactUs/PrivacyPolicy.jsx";
import SalonProfilePage from "./Components/SalonPage/SalonProfilePage/SalonProfilePage.jsx";
import NewCity from './Components/NewCityPage/NewCity.jsx';
import MainHomeN from "./Components/MainPage/MainHomeN.jsx";
import ListPageSalonCategory from "./Components/listPage/ListPageSalonCategory.jsx";
import PrimaryOfferListPageN from "./Components/listPage/PrimaryOfferListPageN.jsx";
import Offerpage from "./Components/OfferPage/Offerpage.jsx";
import { Toaster } from "react-hot-toast";
import Cart from "../src/Components/Cart/Cart.jsx";
// import ReelCarousel from './Components/ReelPage/ReelPage.jsx';
import ReelPage from "./Components/ReelPage/ReelPage.jsx";
import FeedbackForm from './Components/Cart/FeedbackForm.jsx';
import Booking from "./Components/Booking/Booking.jsx";
import ReelCarousel from "./Components/ReelPage/GroomingStories.jsx";
import ChatBot from "./Components/MainPage/ChatBot/ChatBot.js";
import MyMembership from "./Components/UserProfile/MyMembership/MyMembership.jsx";
import Partnerwithus from "./Components/Partnerwithus/Partnerwithus.jsx";
import PaymentHistory from "./Components/UserProfile/PaymentHistory/PaymentHistory.jsx";
import GiftCard from "./Components/UserProfile/GiftCard/GiftCard.jsx";

function App() {
  const { user } = React.useContext(AuthContext);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" index exact element={<MainHomeN />} />
        <Route path="/cart" index exact element={<Cart />} />
        <Route path="/lets-start-with-us" index exact element={<Partnerwithus />} />
        <Route path="Booking" index exact element={<Booking />} />
        <Route path="/FeedbackForm" element={<FeedbackForm />} />
        <Route
          path="/salonRegistration"
          index
          exact
          element={<SalonRegistration />}
        />
        <Route
          path="/salonRegistration"
          index
          exact
          element={<SalonRegistration />}
        />

        <Route path="/:city/salons" index exact element={<NewCity />} />

        <Route
          path="/:city/categories/:slug"
          index
          exact
          element={<CategoryListPageN />}
        />
        <Route
          path="/:city/offers/:slug"
          index
          exact
          element={<OfferListPageN />}
        />

        <Route
          path="/reelpage"
          index
          exact
          element={<ReelPage />}
        />

        <Route
          path="/:city/salons/special-offers/:slug"
          index
          exact
          element={<PrimaryOfferListPageN />}
        />
        <Route
          path="/:city/topratedsalons"
          index
          exact
          element={
            <ListPageSalonCategory
              title="Top Rated Salons"
              subtitle="List of Top Rated Salons"
              name="topRatedSalons"
              description="Do you want to find the best, top-rated salon near you? Your search results are here! Trakky provides the best list of top-rated salons near you. Find the best service according to your needs with the best offers on Trakky."
            />
          }
        />
        <Route
          path="/:city/bridalsalons"
          index
          exact
          element={
            <ListPageSalonCategory
              title="Bridal Salons"
              subtitle="List of Bridal Salons"
              name="bridalSalons"
              description="Looking for bridal makeup that can help you look your best on your big day? With Trakky, a number of Bridal Makeup Studios are ready to serve you and help you achieve the best look you want."
            />
          }
        />
        <Route
          path="/:city/unisexsalons"
          index
          exact
          element={
            <ListPageSalonCategory
              name="unisexSalons"
              title="Unisex Salons"
              subtitle="List of Unisex Salons"
              description="Find the perfect Unisex salon for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that is right for you."
            />
          }
        />
        <Route
          path="/:city/kidsspecialsalons"
          index
          exact
          element={
            <ListPageSalonCategory
              name="kidsSpecialSalons"
              title="Kids Special Salons"
              subtitle="List of Kids Special Salons"
              description="Find the perfect kids special salon for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that is right for you."
            />
          }
        />
        <Route
          path="/:city/femalebeautyparlour"
          index
          exact
          element={
            <ListPageSalonCategory
              name="femaleBeautyParlour"
              title="Female Beauty Parlour"
              subtitle="List of Female Beauty Parlour"
              description="Find the perfect Female Beauty Parlour for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that is right for you."
            />
          }
        />
        <Route
          path="/:city/malesalons"
          index
          exact
          element={
            <ListPageSalonCategory
              name="maleSalons"
              title="Males Salons"
              subtitle="List of Male Salons"
              description="Find the perfect Male salon for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that is right for you."
            />
          }
        />
        <Route
          path="/:city/academysalons"
          index
          exact
          element={
            <ListPageSalonCategory
              name="academySalons"
              title="Academy Salons"
              subtitle="List of Academy Salons"
              description="If you are looking for a career in hairdressing, Salon Academy in Ahmedabad is the perfect place to start. They offer a hands-on learning environment where you will learn from experienced professionals. Enroll today and start your journey to becoming a hairdressing master at Trakky Ahmedabad!"
            />
          }
        />
        <Route
          path="/:city/makeupsalons"
          index
          exact
          element={
            <ListPageSalonCategory
              name="makeupSalons"
              title="Makeup Salons"
              subtitle="List of Makeup Salons"
              description="Find the perfect makeup salon for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that is right for you."
            />
          }
        />
        {/* <Route
          path="/:city/reelplayer"
          index
          exact
          element={
            <ReelPlayer
              name="reelplayer"
              title="Reel Player"
              subtitle="List of Reels"
            />
          }
        />
        <Route
          path="/:city/trakkyreel/:reelId"
          index
          exact
          element={
            <ReelPlayerPage
              name="reelplayerpage"
              title="Reel Player Page"
              subtitle="List of Reel player Page"
            />
          }
        /> */}
        <Route path="/:city/salons/reel/:reelId" element={<ReelCarousel />} />
        {/* <Route path="/ChatBot" element={<ChatBot />} /> */}
        <Route
          path="/:city/nearby"
          index
          exact
          element={
            <ListPageSalonCategory
              title="Salons Near You"
              subtitle="List of Nearby Salons"
              name="nearby"
              description="Do you want to find the best salon near you? Your search results are here! Trakky provides the best list of best salons near you. Find the best service according to your needs with the best offers on Trakky."
            />
          }
        />
        <Route
          path="/:city/list"
          index
          exact
          element={
            <ListPageN
            />
          }
        />

        {/* Experiment Area */}

        <Route
          path="/:city/salons/:area"
          index
          exact
          element={
            <AreaListPageN
              name="areaPage"
              title="Salons In"
              subtitle="List of Salons In"
            />
          }
        />

        <Route
          path="/:city/:area/salons/:slug"
          index
          exact
          element={<SalonProfilePage />}
        />

        <Route
          path="/:city/topratedsalons/:area"
          index
          exact
          element={
            <AreaListPageN
              name="topRatedSalons"
              title="Top Rated Salons In"
              subtitle="top rated"
              description="Do you want to find the best, top-rated salon near you? Your search results are here! Trakky provides the best list of top-rated salons near you. Find the best service according to your needs with the best offers on Trakky."
            />
          }
        />
        <Route
          path="/:city/bridalsalons/:area"
          index
          exact
          element={
            <AreaListPageN
              name="bridalSalons"
              title="Bridal Salons In"
              subtitle="bridal"
              description="Looking for bridal makeup that can help you look your best on your big day? With Trakky, a number of Bridal Makeup Studios are ready to serve you and help you achieve the best look you want."
            />
          } 
        />
        <Route
          path="/:city/academysalons/:area"
          index
          exact
          element={
            <AreaListPageN
              name="academySalons"
              title="Academy Salons In"
              subtitle="salon academy"
              description="If you're looking for a career in hairdressing, Salon Academy in Ahmedabad is the perfect place to start. They offer a hands-on learning environment where you'll learn from experienced professionals. Enroll today and start your journey to becoming a hairdressing master at Trakky Ahmedabad! "
            />
          }
        />
        <Route
          path="/:city/makeupsalons/:area"
          index
          exact
          element={
            <AreaListPageN
              name="makeupSalons"
              title="Makeup Salons In"
              subtitle="makeup"
              description="Find the perfect makeup salon for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that's right for you."
            />
          }
        />

        <Route
          path="/:city/unisexsalons/:area"
          index
          exact
          element={
            <AreaListPageN
              name="unisexSalons"
              title="Unisex Salons In"
              subtitle="unisex"
              description="Find the perfect Unisex salon for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that's right for you."
            />
          }
        />
        <Route
          path="/:city/femalebeautyparlour/:area"
          index
          exact
          element={
            <AreaListPageN
              name="femaleBeautyParlour"
              title="Female Beauty Parlour In"
              subtitle="female beauty parlour"
              description="Find the perfect Female Beauty Parlour for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that's right for you."
            />
          }
        />
        <Route
          path="/:city/kidsspecialsalons/:area"
          index
          exact
          element={
            <AreaListPageN
              name="kidsSpecialSalons"
              title="Kids Special Salons In"
              subtitle="best kids"
              description="Find the perfect kids special salon for you and achieve the look you want. With Trakky, a number of salons are ready to serve you with a variety of services to choose from, so you can find the one that's right for you."
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
          path="/merchant-page"
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

        <Route
          path="/:city/offerpage"
          element={<Offerpage />}

        />

        <Route
          path="/userProfile"
          element={<UserProfile />}
        >
          <Route path="my-info"

            element={<MyInfo />} />


          <Route path="payment-list"

            element={<PaymentHistory />} />

          <Route path="gift-card"

            element={<GiftCard />} />


          <Route path="my-membership"

            element={<MyMembership />} />

          <Route path="my-bookings"

            element={<MyBookings />} />

          <Route
            path="my-bookings/reschedule"
            element={ReschedulePage}
          />
          <Route path="Faqs"

            element={<Faqs />} />
          <Route path="privacy"

            element={<Privacy />} />

          <Route path="terms-of-use"

            element={<TermsOfUse />} />


          <Route path="report-salon"

            element={<Report />} />

          <Route
            path="refer"
            element={<ReferralPage />}

          />

          <Route
            path="redeem-coupon-list"
            element={<RedeemCoupon />}

          />


          <Route path="feedback"

            element={<Feedback />} />
          <Route path="rate-us"

            element={<RateUs />} />

        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;