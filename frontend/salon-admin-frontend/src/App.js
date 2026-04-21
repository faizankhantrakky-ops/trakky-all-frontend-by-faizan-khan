import "./App.css";
import Sidebar from "./Components/Sidebar";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import React, { useEffect } from "react";
import search from "./svgs/search.svg";
import hamburger from "./svgs/hamburger.svg";
import profile from "./svgs/profile_icon.svg";
import down_arrow from "./svgs/down_arrow.svg";

//Rotes...
import Dashboard from "./Components/Dashboard";
import Salonlist from "./Components/Salonlist";
import Offerslist from "./Components/Offerslist";
import Services from "./Components/Services";
import Citylist from "./Components/Citylist";
import Arealist from "./Components/Arealist";
import Category from "./Components/Category";
import AddSalon from "./Components/Forms/SalonForm";
import AddArea from "./Components/Forms/AreaForm";
import AddCity from "./Components/Forms/CityForm";
import AddBlogs from "./Components/Forms/BlogForm";
import AddService from "./Components/Forms/ServiceForm";
import AddOffer from "./Components/Forms/OfferForm";
import AddCategory from "./Components/Forms/CategoryForm";
import VendorList from "./Components/VendorList";
import Signin from "./Components/Signin";
import AddVendor from "./Components/Forms/VendorForm";
import BlogList from "./Components/BlogList";
import PrivateRoute from "./Context/PrivateRoute";
import Modal from "./Components/UpdateModal";
import MasterCategory from "./Components/MasterCategory";
import MasterServices from "./Components/MasterServices";
import MasterServiceForm from "./Components/Forms/MasterServiceForm";
import MasterCategoryForm from "./Components/Forms/MasterCategoryForm";
import Customers from "./Components/Customers";
import AddClientWorkPhoto from "./Components/AddClientWorkPhoto";
import CityAndAreaPriority from "./Components/PriorityManagement";
import Logs from "./Components/Logs";
import BlogCategory from "./Components/Forms/BlogCategory";
import BlogCategoryList from "./Components/BlogCategoryList";
import SeoManagement from "./Components/Forms/SeoManagement";
import TrashNewSalonRequests from "./Components/TrashNewSalonRequests.jsx";
import ServicePackages from "./Components/ServicePackages.jsx";
import PackageForm from "./Components/Forms/ServicePackageForm.jsx";

import { useContext } from "react";
import AuthContext from "./Context/AuthContext";
import Inquiry from "./Components/Inquiry";
import ClientWorkPhotoList from "./Components/ClientWorkPhotoList";
import NewSalonRequests from "./Components/NewSalonRequests";
import DailyUpdates from "./Components/Forms/DailyUpdates";
import DailyUpdateList from "./Components/DailyUpdateList";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ListNationalOffer from './Components/ListNationalOffer.jsx';
import AddNationalOffer from "./Components/Forms/AddNationalOffer"
import BlogUserEmails from "./Components/BlogUserEmails.jsx";
import UserReviews from "./Components/UserReviews.jsx";
import ListNationalCategory from "./Components/ListNationalCategory.jsx";
import AddNationalCategory from "./Components/Forms/AddNationalCategory.jsx";
import ContactUs from "./Components/ContactUs.jsx";
import CollaboratedSalons from "./Components/CollaboratedSalons.jsx";
import AddCollaborated from "./Components/Forms/AddCollaboratedSalons.jsx";
import OfferTags from "./Components/OfferTagsList.jsx";
import AddOfferTags from "./Components/Forms/AddOfferTags.jsx";
import NationalHeroOffers from "./Components/NationalHeroOffers.jsx";
import AddNationalHeroOffers from "./Components/Forms/AddNationalHeroOffers.jsx";
import FeatureThisWeek from "./Components/FeatureThisWeek.jsx";
import AddFeatureThisWeek from "./Components/Forms/AddFeatureThisWeek.jsx";
import Ratings from "./Components/SalonRatings.jsx";
import AddSalonProfileOffer from "./Components/Forms/AddSalonProfileOffer.jsx";
import SalonProfileOffer from "./Components/SalonProfileOffer.jsx";
import AddPrimaryCityOffers from "./Components/Forms/AddPrimaryCityOffers.jsx";
import PrimaryCityOffers from "./Components/PrimaryCityOffers.jsx";
import CustomPermissions from "./Components/CustomPermissions.jsx";
import AddUser from "./Components/Forms/AddFakeUser.jsx";
import AddSalonScore from "./Components/Forms/AddSalonScore.jsx";
import Bridal from "./Components/ListBridal.jsx";
import CategoryRequests from "./Components/CategoryRequests.jsx";
import Academy from "./Components/ListAcademySalons.jsx";
import Makeup from "./Components/ListMakeup.jsx";
import FemaleBeauty from "./Components/ListFemaleBeauty.jsx";
import Kids from "./Components/ListKidsSpecial.jsx";
import ListMale from "./Components/ListMale.jsx";
import ListUnisex from "./Components/ListUnisex.jsx";
import PermissionData from "./Components/PermissionData.jsx";
import AdminUserAdd from "./Components/AdminUserAdd.jsx";
import AdminUserList from "./Components/AdminUserList.jsx";
import ListTopRated from "./Components/ListTopRated.jsx";
import CategoryRequestPage from "./Components/CategoryRequestPage.jsx";
import ServiceRequestPage from "./Components/ServiceREquestPage.jsx";
import Productmasterlist from "./Components/ProductMasterList.jsx";
import ProductMasterFrom from "./Components/Forms/ProductMasterFrom.jsx";
import SalonProductFrom from "./Components/Forms/SalonProductFrom.jsx";
import SalonProductList from "./Components/SalonProductList.jsx";
import PosRequest from "./Components/PosRequest.jsx";
import OfferServicesReqPage from "./Components/OfferServicesReqPage.jsx";
import PackageServiceReqPage from "./Components/PackageServiceReqPage.jsx";
import MainSalonOffers from "./Components/MainSalonOffers.jsx";
import AddMainSalonOffers from "./Components/Forms/AddMainSalonOffers.jsx";
import ListServiceDetails from "./Components/ListServiceDetails.jsx";
import AddServiceDetails from "./Components/Forms/AddServiceDetails.jsx";
import OverviewList from "./Components/OverviewList.jsx";
import AddOverview from "./Components/Forms/OverviewForm.jsx";
import Selectmode from "./Components/Selectmode/Selectmode.jsx";
import Listserviceimages from "./Components/Listserviceimages/Listserviceimages.jsx";
import Addserviceimage from "./Components/Listserviceimages/Addserviceimage/Addserviceimage.jsx";
import AddSalonProfileOfferWithTheme from "./Components/Forms/AddSalonProfileOfferWithTheme.jsx";
import SalonProfileOfferWithTheme from "./Components/Forms/SalonProfileOfferWithTheme.jsx";
import Couponlist from "./Components/Couponlist/Couponlist.jsx";
import Addcoupon from "./Components/Couponlist/Addcoupon/Addcoupon.jsx";
import Personaladdcoupon from "./Components/Couponlist/Personaladdcoupon/Personaladdcoupon.jsx";
import Salonwithprofileoffer from "./Components/Salonwithprofileoffer.jsx";

function App() {
  const [hamburger_state, change_hamburger_state] = React.useState(false);
  const [profile_dropdown, change_profile_dropdown] = React.useState(false);

  const { user, logoutUser, userPermissions } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (userPermissions.status != null) {
      setLoading(false);
    }
  }, [userPermissions]);

  console.log(userPermissions);
  console.log(loading, user);

  // Agar current route "/selectmode" hai to sirf Selectmode component show karo
  if (location.pathname === "/selectmode") {
    return <Selectmode />;
  }

  return (
    <>
      {user ? (loading ? <div className="loader">loading...</div> :
        (
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
                  <div id="searchbar_div">
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
                    <img id="profile_img" src={profile} alt="My Profile"></img>
                    <div id="profile_dropdown" className="  ">
                      <span>Shikhar</span>
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
                          <button onClick={logoutUser}>Logout,</button>
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
                      path="/usercontactus"
                      element={
                        <PrivateRoute>
                          <ContactUs />
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
                      path="/cityandareapriority"
                      element={
                        <PrivateRoute>
                          <CityAndAreaPriority />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listsalons"
                      element={
                        <PrivateRoute>
                          <Salonlist />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listbridal"
                      element={
                        <PrivateRoute>
                          <Bridal />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/academysalons"
                      element={
                        <PrivateRoute>
                          <Academy />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/makeup"
                      element={
                        <PrivateRoute>
                          <Makeup />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/femalebeautyparlour"
                      element={
                        <PrivateRoute>
                          <FemaleBeauty />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/kidsspecial"
                      element={
                        <PrivateRoute>
                          <Kids />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/malesalons"
                      element={
                        <PrivateRoute>
                          <ListMale />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/unisexsalons"
                      element={
                        <PrivateRoute>
                          <ListUnisex />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/topratedsalons"
                      element={
                        <PrivateRoute>
                          <ListTopRated />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/newsalonrequests"
                      element={
                        <PrivateRoute>
                          <NewSalonRequests />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/trash"
                      element={
                        <PrivateRoute>
                          <TrashNewSalonRequests />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addsalon"
                      element={
                        <PrivateRoute>
                          <AddSalon />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listnationalcategories"
                      element={
                        <PrivateRoute>
                          <ListNationalCategory />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addnationalcategory"
                      element={
                        <PrivateRoute>
                          <AddNationalCategory />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addcategory"
                      element={
                        <PrivateRoute>
                          <AddCategory />
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
                      path="/listnationaloffer"
                      element={
                        <PrivateRoute>
                          <ListNationalOffer />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="addnationaloffer"
                      element={
                        <PrivateRoute>
                          <AddNationalOffer />
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
                      path="/addarea"
                      element={
                        <PrivateRoute>
                          <AddArea />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/bloguseremails"
                      element={
                        <PrivateRoute>
                          <BlogUserEmails />
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
                      path="/addblogcategory"
                      element={
                        <PrivateRoute>
                          <BlogCategory />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/blogcategories"
                      element={
                        <PrivateRoute>
                          <BlogCategoryList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/blogseomanagement"
                      element={
                        <PrivateRoute>
                          <SeoManagement />
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
                      path="/listofservices"
                      element={
                        <PrivateRoute>
                          <Services />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/list-service-details"
                      element={
                        <PrivateRoute>
                          <ListServiceDetails />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/master-overview-details"
                      element={
                        <PrivateRoute>
                          <OverviewList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/add-master-overview"
                      element={
                        <PrivateRoute>
                          <AddOverview />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/add-service-details"
                      element={
                        <PrivateRoute>
                          <AddServiceDetails />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listservicepackages"
                      element={
                        <PrivateRoute>
                          <ServicePackages />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addservicepackages"
                      element={
                        <PrivateRoute>
                          <PackageForm />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/collaborated"
                      element={
                        <PrivateRoute>
                          <CollaboratedSalons />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addcollaborated"
                      element={
                        <PrivateRoute>
                          <AddCollaborated />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/nationalherooffers"
                      element={
                        <PrivateRoute>
                          <NationalHeroOffers />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addnationalherooffers"
                      element={
                        <PrivateRoute>
                          <AddNationalHeroOffers />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/featuredthisweek"
                      element={
                        <PrivateRoute>
                          <FeatureThisWeek />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addfeaturedthisweek"
                      element={
                        <PrivateRoute>
                          <AddFeatureThisWeek />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listoffertags"
                      element={
                        <PrivateRoute>
                          <OfferTags />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addoffertags"
                      element={
                        <PrivateRoute>
                          <AddOfferTags />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listmainoffers"
                      element={
                        <PrivateRoute>
                          <MainSalonOffers />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addmainoffers"
                      element={
                        <PrivateRoute>
                          <AddMainSalonOffers
                          />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/ratings"
                      element={
                        <PrivateRoute>
                          <Ratings />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/logs"
                      element={
                        <PrivateRoute>
                          <Logs />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/pos-salon-request"
                      element={
                        <PrivateRoute>
                          <PosRequest />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/mastercategories" element={<MasterCategory />} />
                    <Route path="/masterservices" element={<MasterServices />} />
                    <Route path="/masterservicesform" element={<MasterServiceForm />} />
                    <Route path="/mastercategoryform" element={<MasterCategoryForm />} />
                    <Route path="/addclientworkphotos" element={<AddClientWorkPhoto />} />

                    <Route path="/productmasterservicesfrom" element={<ProductMasterFrom />} />
                    <Route path="/SalonProductFrom" element={<SalonProductFrom />} />
                    <Route path="/productmasterlist" element={<Productmasterlist />} />
                    <Route path="/SalonProductList" element={<SalonProductList />} />
                    <Route path="/salonwithprofileoffer" element={<Salonwithprofileoffer />} />

                    <Route
                      path="/listclientworkphotos"
                      element={
                        <PrivateRoute>
                          <ClientWorkPhotoList />
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
                      path="/listcities"
                      element={
                        <PrivateRoute>

                          <Citylist />

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
                      path="/createuser"
                      element={
                        <PrivateRoute>
                          <AddUser />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/categoryrequest"
                      element={
                        <PrivateRoute>
                          <CategoryRequests />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addsalonscores"
                      element={
                        <PrivateRoute>
                          <AddSalonScore />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listcategories"
                      element={
                        <PrivateRoute>
                          <Category />
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
                      path="/addsalonprofileoffer"
                      element={
                        <PrivateRoute>
                          <AddSalonProfileOffer />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/salonprofileoffer"
                      element={
                        <PrivateRoute>
                          <SalonProfileOffer />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/salonprofileofferwiththeme"
                      element={
                        <PrivateRoute>
                          <SalonProfileOfferWithTheme />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addsalonprofileofferwiththeme"
                      element={
                        <PrivateRoute>
                          <AddSalonProfileOfferWithTheme />
                        </PrivateRoute>
                      }
                    />


                    <Route
                      path="/cityOffers"
                      element={
                        <PrivateRoute>
                          <PrimaryCityOffers />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addcityOffers"
                      element={
                        <PrivateRoute>
                          <AddPrimaryCityOffers />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/list-service-images"
                      element={
                        <PrivateRoute>
                          <Listserviceimages />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/add-service-image"
                      element={
                        <PrivateRoute>
                          <Addserviceimage />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/inquiry" element={<Inquiry />} />
                    {
                      userPermissions?.data?.[0]?.access?.includes("super-permission") ?
                        <Route path="/custompermissions" element={<CustomPermissions />} />
                        :
                        null
                    }
                    {
                      userPermissions?.data?.[0]?.access?.includes("super-permission") ?
                        <Route path="/permissions-data" element={<PermissionData />} />
                        :
                        null
                    }
                    {
                      userPermissions?.data?.[0]?.access?.includes("user-creation-permission") ?
                        <Route path="/createadminuser" element={<AdminUserAdd />} />
                        :
                        null
                    }
                    {
                      userPermissions?.data?.[0]?.access?.includes("user-creation-permission") ?
                        <Route path="/listadminuser" element={<AdminUserList />} />
                        :
                        null

                    }

                    <Route path="/list-category-request" element={<CategoryRequestPage />} />
                    <Route path="/list-service-request" element={<ServiceRequestPage />} />
                    <Route path="/list-offer-request" element={<OfferServicesReqPage />} />
                    <Route path="/list-package-request" element={<PackageServiceReqPage />} />
                    <Route path="/coupon-list" element={<Couponlist />} />
                    <Route path="/add-coupon"
                     element={<Addcoupon />} />
                    <Route path="/personal-add-coupon"
                     element={<Personaladdcoupon />} />

                    <Route path="*" element={<h1>404 Not Found</h1>} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        ))
        :
        (
          <Signin />
        )}
    </>
  );
}

export default App;