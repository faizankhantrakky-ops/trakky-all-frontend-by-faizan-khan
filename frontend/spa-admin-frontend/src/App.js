import "./App.css";
import Sidebar from "./Components/Sidebar";
import { Routes, Route } from "react-router-dom";

import React from "react";
import search from "./svgs/search.svg";
import hamburger from "./svgs/hamburger.svg";
import profile from "./svgs/profile_icon.svg";
import down_arrow from "./svgs/down_arrow.svg";

//Rotes...
import Dashboard from "./Components/Dashboard";
import Spalist from "./Components/Spalist";
import Offerslist from "./Components/Offerslist";
import Services from "./Components/Services";
import Citylist from "./Components/Citylist";
import Arealist from "./Components/Arealist";
import Therapy from "./Components/Therapy";
import VendorList from "./Components/VendorList";
import AddVendor from "./Components/Forms/VendorForm";
import AddSpa from "./Components/Forms/SpaForm";
import AddArea from "./Components/Forms/AreaForm";
import AddCity from "./Components/Forms/CityForm";
import AddBlogs from "./Components/Forms/BlogForm";
import AddService from "./Components/Forms/ServiceForm";
import AddOffer from "./Components/Forms/OfferForm";
import AddTherapy from "./Components/Forms/TherapyForm";
import Customers from "./Components/Customers";
import Inquiry from "./Components/Inquiry";
import AddRoomImages from "./Components/AddRoomImages.jsx";
import RoomImages from "./Components/RoomImages";
import NewSpaRequests from "./Components/NewSpaRequest";
import DailyUpdateList from "./Components/DailyUpdateList";
import DailyUpdates from "./Components/Forms/DailyUpdates";


import Signin from "./Components/Signin";

import BlogList from "./Components/BlogList";
import PrivateRoute from "./Context/PrivateRoute";
import Modal from "./Components/UpdateModal";
import { useContext, useEffect } from "react";
import AuthContext from "./Context/AuthContext";
import CityAndAreaPriority from "./Components/PriorityManagement";
import NationalOfferList from "./Components/NationalOfferList.jsx";
import NationalOfferForm from "./Components/Forms/NationalOfferForm.jsx";
import UserReviews from "./Components/UserReviews.jsx";
import ListNationalTherapy from "./Components/ListNationalTherapy.jsx";
import AddNationalTherapy from "./Components/Forms/AddNationalTherapy.jsx";
import ContactUs from "./Components/ContactUs.jsx";

import MasterServiceList from "./Components/MasterServiceList.jsx";
import MasterService from "./Components/Forms/MasterService.jsx";
import TrashNewSpaRequests from "./Components/TrashNewSpaRequest.jsx";
import Promises from "./Components/Promises.jsx";
import AddPromises from "./Components/Forms/AddPromises.jsx";
import BestsellerMassages from "./Components/BestsellerMassages.jsx";
import AddBestsellerMassage from "./Components/Forms/AddBestsellerMassage.jsx";
import Memberships from "./Components/Memberships.jsx";
import AddMembership from "./Components/Forms/AddMembership.jsx";
import SpaProfileOffers from "./Components/SpaProfileOffersList.jsx";
import AddSpaProfileOffer from "./Components/Forms/AddSpaProfileOffer.jsx";
import SpaStats from "./Components/SpaStats.jsx";
import AddCityPageOffer1 from "./Components/Forms/AddCityPageOffer1.jsx";
import CityPageOffer1 from "./Components/CityPageOffer1.jsx";
import AddCityPageOffer3 from "./Components/Forms/AddCityPageOffer3.jsx";
import CityPageOffer2 from "./Components/CityPageOffer2.jsx";
import CityPageOffer3 from "./Components/CityPageOffer3.jsx";
import AddCityPageOffer2 from "./Components/Forms/AddCityPageOffer2.jsx";
import NationalPageOffer from "./Components/NationalPageOffer.jsx";
import AddNationalPageOffer from "./Components/Forms/AddNationalPageOffer.jsx";
import TrustedSpas from "./Components/TrustedSpas.jsx";
import AddTrustedSpas from "./Components/Forms/AddTrustedSpas.jsx";
import AddUser from "./Components/Forms/AddFakeUser.jsx";
import AddUserReviews from "./Components/Forms/AddUserReviews.jsx";
import ListBestSpa from "./Components/ListBestSpa.jsx";
import ListTopRatedSpa from "./Components/ListTopRatedSpa.jsx";
import ListLuxuriousSpa from "./Components/ListLuxuriousSpa.jsx";
import ListBodyMassageSpa from "./Components/ListBodyMassageSpa.jsx";
import ListBodyMassageCenter from "./Components/ListBodyMassageCenter.jsx";
import ListThaiBodyMassage from "./Components/ListThaiBodyMassage.jsx";
import ListBeautySpa from "./Components/ListBeautySpa.jsx";
import ListSpaForMen from "./Components/ListSpaForMen.jsx";
import ListSpaForWomen from "./Components/ListSpaForWomen.jsx";
import Logs from "./Components/Logs.jsx";
import AdminUserList from './Components/AdminUserList.jsx';
import AdminUserAdd from "./Components/AdminUserAdd.jsx";
import PosSpaREquest from "./Components/PosSpaRequest.jsx";
import MassageRequestPage from "./Components/MassageRequestPage.jsx";
import MembershipPackageRequest from "./Components/MembershipPackageRequest.jsx";
import OfferRequestList from "./Components/OfferRequestList.jsx";

const App = () => {
  const [hamburger_state, change_hamburger_state] = React.useState(false);
  const [profile_dropdown, change_profile_dropdown] = React.useState(false);

  const { user, logoutUser } = useContext(AuthContext);


  return (
    <>
      {user ? (
        <div id="main_root" className="">
          <div id="main" className="  ">
            <div
              id="sidebar"
              className={` ${hamburger_state ? "sidebar_open " : ""} `}
            >
              <Sidebar
                change_hamburger_state={change_hamburger_state}
                hamburger_state={hamburger_state}
              />
            </div>
            <div id="body_div" className="">
              <div
                id="header_div"
                className="  "
                onBlur={() => {
                  change_profile_dropdown(false);
                }}
              >
                <div id="searchbar_div" style={{ visibility: 'hidden' }}>
                  <img id="search_icon" src={search} alt="hamburger_icon"></img>
                  <input
                    id="searchbar"
                    type="text"
                    placeholder="Search for something...  "
                  ></input>
                </div>

                <div
                  id="profile_div"
                  className="  "
                  onClick={() => {
                    change_profile_dropdown(!profile_dropdown);
                  }}
                >
                  <img id="profile_img" src={profile} alt="profile"></img>
                  <div id="profile_dropdown" className="  ">
                    <span>SHIKHAR</span>
                    <img
                      id="down_arrow"
                      src={down_arrow}
                      alt="down_arrow"
                    ></img>
                  </div>

                  <div
                    className={` dropdown ${profile_dropdown
                      ? "dropdown_scale_up  "
                      : "dropdown_scale_down "
                      }`}
                  >
                    <div className=" dropdown_child ">
                      <div>Profile</div>
                      <div>Settings</div>
                      <div>
                        <button onClick={logoutUser}>logout</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="hamburger_div" className="  ">
                  <button
                    onClick={() => {
                      change_hamburger_state(!hamburger_state);
                    }}
                  >
                    <img
                      id="hamburger_icon"
                      src={hamburger}
                      alt="hamburger_icon"
                    ></img>
                  </button>
                </div>
              </div>
              <div id="route_body_div" className="  ">
                <Routes>
                  <Route
                    path="/signin"
                    element={
                      <Modal closeModal={() => { }}>
                        <Signin />
                      </Modal>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <PrivateRoute>
                        <Customers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/userreviews"
                    element={
                      <PrivateRoute>
                        <UserReviews />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/usercontactus'
                    element={
                      <PrivateRoute>
                        <ContactUs />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/cityandareapriority"
                    element={
                      <PrivateRoute>
                        <CityAndAreaPriority />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listspas"
                    element={
                      <PrivateRoute>
                        <Spalist />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/newsparequests"
                    element={
                      <PrivateRoute>
                        <NewSpaRequests />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/trash"
                    element={
                      <PrivateRoute>
                        <TrashNewSpaRequests />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addspa"
                    element={
                      <PrivateRoute>
                        <AddSpa />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/masterservices"
                    element={
                      <PrivateRoute>
                        <MasterServiceList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addmasterservices"
                    element={
                      <PrivateRoute>
                        <MasterService />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/spaposrequest"
                    element={
                      <PrivateRoute>
                        <PosSpaREquest />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/posmassagerequest'
                    element={
                      <PrivateRoute>
                        <MassageRequestPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/membershippackagerequest'
                    element={
                      <PrivateRoute>
                        <MembershipPackageRequest />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/offerrequest'
                    element={
                      <PrivateRoute>
                        <OfferRequestList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/listnationaltherapies'
                    element={
                      <PrivateRoute>
                        <ListNationalTherapy />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addnationaltherapy"
                    element={
                      <PrivateRoute>
                        <AddNationalTherapy />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addtherapy"
                    element={
                      <PrivateRoute>
                        <AddTherapy />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addservice"
                    element={
                      <PrivateRoute>
                        <AddService />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addoffer"
                    element={
                      <PrivateRoute>
                        <AddOffer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addcity"
                    element={
                      <PrivateRoute>
                        <AddCity />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/listdailyupdates'
                    element={
                      <PrivateRoute>
                        <DailyUpdateList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/adddailyupdates'
                    element={
                      <PrivateRoute>
                        <DailyUpdates />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addroomimages"
                    element={
                      <PrivateRoute>
                        <AddRoomImages />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addarea"
                    element={
                      <PrivateRoute>
                        <AddArea />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addblogs"
                    element={
                      <PrivateRoute>
                        <AddBlogs />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/listnationaloffers'
                    element={
                      <PrivateRoute>
                        <NationalOfferList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addnationaloffer"
                    element={
                      <PrivateRoute>
                        <NationalOfferForm />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listoffer"
                    element={
                      <PrivateRoute>
                        <Offerslist />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listservices"
                    element={
                      <PrivateRoute>
                        <Services />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listcities"
                    element={
                      <PrivateRoute>
                        <Citylist />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listmemberships"
                    element={
                      <PrivateRoute>
                        <Memberships />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addmembership"
                    element={
                      <PrivateRoute>
                        <AddMembership />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listbestsellermassages"
                    element={
                      <PrivateRoute>
                        <BestsellerMassages />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addbestsellermassages"
                    element={
                      <PrivateRoute>
                        <AddBestsellerMassage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path='/listroomimages'
                    element={
                      <PrivateRoute>
                        <RoomImages />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listareas"
                    element={
                      <PrivateRoute>
                        <Arealist />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listtherapies"
                    element={
                      <PrivateRoute>
                        <Therapy />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listblogs"
                    element={
                      <PrivateRoute>
                        <BlogList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listvendors"
                    element={
                      <PrivateRoute>
                        <VendorList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addvendor"
                    element={
                      <PrivateRoute>
                        <AddVendor />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addpromises"
                    element={
                      <PrivateRoute>
                        <AddPromises />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/spastats"
                    element={
                      <PrivateRoute>
                        <SpaStats />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listprofileoffers"
                    element={
                      <PrivateRoute>
                        <SpaProfileOffers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addprofileoffer"
                    element={
                      <PrivateRoute>
                        <AddSpaProfileOffer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/promises"
                    element={
                      <PrivateRoute>
                        <Promises />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addcitypageoffer1"
                    element={
                      <PrivateRoute>
                        <AddCityPageOffer1 />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/citypageoffer1"
                    element={
                      <PrivateRoute>
                        <CityPageOffer1 />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addcitypageoffer2"
                    element={
                      <PrivateRoute>
                        <AddCityPageOffer2 />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/citypageoffer2"
                    element={
                      <PrivateRoute>
                        <CityPageOffer2 />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addcitypageoffer3"
                    element={
                      <PrivateRoute>
                        <AddCityPageOffer3 />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/citypageoffer3"
                    element={
                      <PrivateRoute>
                        <CityPageOffer3 />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/trustedspas"
                    element={
                      <PrivateRoute>
                        <TrustedSpas />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addtrustedspas"
                    element={
                      <PrivateRoute>
                        <AddTrustedSpas />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/nationalpageoffer"
                    element={
                      <PrivateRoute>
                        <NationalPageOffer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/createuser"
                    element={
                      <PrivateRoute>
                        <AddUser />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/adduserreviews"
                    element={
                      <PrivateRoute>
                        <AddUserReviews />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/addnationalpageoffer"
                    element={
                      <PrivateRoute>
                        <AddNationalPageOffer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="logs"
                    element={
                      <PrivateRoute>
                        <Logs />
                      </PrivateRoute>
                    }
                  />
                  <Route path="listadminuser" element={
                    <AdminUserList />
                  }
                  />
                  <Route path="createadminuser" element={
                    <AdminUserAdd />} />


                  <Route path="/list-best-spa" element={<ListBestSpa />} />
                  <Route path="/list-top-rated-spa" element={<ListTopRatedSpa />} />
                  <Route path="/list-luxurious-spa" element={<ListLuxuriousSpa />} />
                  <Route path="/list-body-massage-spa" element={<ListBodyMassageSpa />} />
                  <Route path="/list-spa-body-massage-center" element={<ListBodyMassageCenter />} />
                  <Route path="/list-thai-body-massage" element={<ListThaiBodyMassage />} />
                  <Route path="/list-beauty-spa" element={<ListBeautySpa />} />
                  <Route path="/list-spa-for-men" element={<ListSpaForMen />} />
                  <Route path="/list-spa-for-women" element={<ListSpaForWomen />} />

                  <Route path="/inquiry" element={<Inquiry />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Signin />
      )}
    </>
  );
};

export default App;
