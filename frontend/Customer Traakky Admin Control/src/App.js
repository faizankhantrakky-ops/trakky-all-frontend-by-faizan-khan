import "./App.css";
import Sidebar from "./Components/Sidebar";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import React, { useEffect } from "react";
import search from "./svgs/search.svg";
import hamburger from "./svgs/hamburger.svg";
import profile from "./svgs/profile_icon.svg";
import down_arrow from "./svgs/down_arrow.svg";

//Rotes...
import Dashboard from "./Components/Dashboard";
// import Salonlist from "./Components/Salonlist";
// import Offerslist from "./Components/Offerslist";
// import Services from "./Components/Services";
// import Citylist from "./Components/Citylist";
// import Arealist from "./Components/Arealist";
// import Category from "./Components/Category";
// import AddSalon from "./Components/Forms/SalonForm";
// import AddArea from "./Components/Forms/AreaForm";
// import AddCity from "./Components/Forms/CityForm";
// import AddBlogs from "./Components/Forms/BlogForm";
// import AddService from "./Components/Forms/ServiceForm";
// import AddOffer from "./Components/Forms/OfferForm";
// import AddCategory from "./Components/Forms/CategoryForm";
import VendorList from "./Components/VendorList";
import Signin from "./Components/Signin";
import AddVendor from "./Components/Forms/VendorForm";
// import BlogList from "./Components/BlogList";
import PrivateRoute from "./Context/PrivateRoute";
import Modal from "./Components/UpdateModal";
// import MasterCategory from "./Components/MasterCategory";
// import MasterServices from "./Components/MasterServices";
// import MasterServiceForm from "./Components/Forms/MasterServiceForm";
// import MasterCategoryForm from "./Components/Forms/MasterCategoryForm";
// import Customers from "./Components/Customers";
// import AddClientWorkPhoto from "./Components/AddClientWorkPhoto";
// import CityAndAreaPriority from "./Components/PriorityManagement";
import Logs from "./Components/Logs";
// import BlogCategory from "./Components/Forms/BlogCategory";
// import BlogCategoryList from "./Components/BlogCategoryList";
import SeoManagement from "./Components/Forms/SeoManagement";
import TrashNewSalonRequests from "./Components/TrashNewSalonRequests.jsx";
import ServicePackages from "./Components/ServicePackages.jsx";
import PackageForm from "./Components/Forms/ServicePackageForm.jsx";

import { useContext } from "react";
import AuthContext from "./Context/AuthContext";
// import Inquiry from "./Components/Inquiry";
// import ClientWorkPhotoList from "./Components/ClientWorkPhotoList";
// import NewSalonRequests from "./Components/NewSalonRequests";
// import DailyUpdates from "./Components/Forms/DailyUpdates";
// import DailyUpdateList from "./Components/DailyUpdateList";
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import ListNationalOffer from './Components/ListNationalOffer.jsx';
// import AddNationalOffer from "./Components/Forms/AddNationalOffer"
// import BlogUserEmails from "./Components/BlogUserEmails.jsx";
// import UserReviews from "./Components/UserReviews.jsx";
// import ListNationalCategory from "./Components/ListNationalCategory.jsx";
// import AddNationalCategory from "./Components/Forms/AddNationalCategory.jsx";
// import ContactUs from "./Components/ContactUs.jsx";
// import CollaboratedSalons from "./Components/CollaboratedSalons.jsx";
// import AddCollaborated from "./Components/Forms/AddCollaboratedSalons.jsx";
// import OfferTags from "./Components/OfferTagsList.jsx";
// import AddOfferTags from "./Components/Forms/AddOfferTags.jsx";
// import NationalHeroOffers from "./Components/NationalHeroOffers.jsx";
// import AddNationalHeroOffers from "./Components/Forms/AddNationalHeroOffers.jsx";
// import FeatureThisWeek from "./Components/FeatureThisWeek.jsx";
// import AddFeatureThisWeek from "./Components/Forms/AddFeatureThisWeek.jsx";
// import Ratings from "./Components/SalonRatings.jsx";
// import AddSalonProfileOffer from "./Components/Forms/AddSalonProfileOffer.jsx";
// import SalonProfileOffer from "./Components/SalonProfileOffer.jsx";
// import AddPrimaryCityOffers from "./Components/Forms/AddPrimaryCityOffers.jsx";
// import PrimaryCityOffers from "./Components/PrimaryCityOffers.jsx";
import CustomPermissions from "./Components/CustomPermissions.jsx";
import AddUser from "./Components/Forms/AddFakeUser.jsx";
// import AddSalonScore from "./Components/Forms/AddSalonScore.jsx";
// import Bridal from "./Components/ListBridal.jsx";
// import CategoryRequests from "./Components/CategoryRequests.jsx";
// import Academy from "./Components/ListAcademySalons.jsx";
// import Makeup from "./Components/ListMakeup.jsx";
// import FemaleBeauty from "./Components/ListFemaleBeauty.jsx";
// import Kids from "./Components/ListKidsSpecial.jsx";
// import ListMale from "./Components/ListMale.jsx";
// import ListUnisex from "./Components/ListUnisex.jsx";
import PermissionData from "./Components/PermissionData.jsx";
import AdminUserAdd from "./Components/AdminUserAdd.jsx";
import AdminUserList from "./Components/AdminUserList.jsx";
// import ListTopRated from "./Components/ListTopRated.jsx";
// import CategoryRequestPage from "./Components/CategoryRequestPage.jsx";
// import ServiceRequestPage from "./Components/ServiceREquestPage.jsx";
// import Productmasterlist from "./Components/ProductMasterList.jsx";
// import ProductMasterFrom from "./Components/Forms/ProductMasterFrom.jsx";
// import SalonProductFrom from "./Components/Forms/SalonProductFrom.jsx";
// import SalonProductList from "./Components/SalonProductList.jsx";
import PosRequest from "./Components/PosRequest.jsx";
// import OfferServicesReqPage from "./Components/OfferServicesReqPage.jsx";
import PackageServiceReqPage from "./Components/PackageServiceReqPage.jsx";
// import MainSalonOffers from "./Components/MainSalonOffers.jsx";
// import AddMainSalonOffers from "./Components/Forms/AddMainSalonOffers.jsx";
// import ListServiceDetails from "./Components/ListServiceDetails.jsx";
// import AddServiceDetails from "./Components/Forms/AddServiceDetails.jsx";
// import OverviewList from "./Components/OverviewList.jsx";
// import AddOverview from "./Components/Forms/OverviewForm.jsx";
import CustomerInquires from "./Components/CustomerInquires.jsx";
import LeadSheetReport from "./Components/LeadSheet_Report.jsx";
import Addlead from "./Components/Forms/AddLeadReport.jsx";
import CollaboratedSalons from "./Components/CollaboratedSalons.jsx";
import AddCollaborated from "./Components/Forms/AddCollaboratedSalons.jsx";
import ConvertedLead from "./Components/ConvertedLead.jsx";
import ConvertedLeadForm from "./Components/Forms/ConvertedLeadForm.jsx";
import CustomerInquiriesForm from "./Components/Forms/CustomerInquiriesForm.jsx";
import InquiryLeads from "./Components/InquiryLeads.jsx";
import InquiriesLeadsForm from "./Components/Forms/InquiriesLeadsForm.jsx";
import CustomerSegmentation from "./Components/CustomerSegmentation.jsx";
import SalonOfferBooking from "./Components/SalonOfferBooking.jsx";
import ChatBotHistory from "./Components/ChatBot_History.jsx";
import Appointments from "./Components/Appointments/Appointments.jsx";
import MembershipList from "./Components/MembershipList/MembershipList.jsx";
import AddMembership from "./Components/MembershipList/AddMembership/AddMembership.jsx";
import CustomerMembership from "./Components/CustomerMembership/CustomerMembership.jsx";
import Automationlist from "./Components/Automationlist/Automationlist.jsx";

function App() {
  const [hamburger_state, change_hamburger_state] = React.useState(false);
  const [profile_dropdown, change_profile_dropdown] = React.useState(false);

  // const [user, setUser] = useState(null);

  const { user, logoutUser, userPermissions } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userPermissions.status != null) {
      setLoading(false);
    }
  }, [userPermissions]);

  console.log(userPermissions);
  console.log(loading, user);

  return (
    <>
      {" "}
      {user ? (
        loading ? (
          <div className="loader">loading...</div>
        ) : (
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
                    <img
                      id="search_icon"
                      src={search}
                      alt="hamburger_icon"
                    ></img>
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
                      className={` dropdown ${
                        profile_dropdown
                          ? "dropdown_scale_up  "
                          : "dropdown_scale_down "
                      }`}
                    >
                      <div className=" dropdown_child ">
                        <div>Profile</div>
                        <div>Settings</div>
                        <div>
                          <button onClick={logoutUser}>Logout</button>
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
                        <Modal closeModal={() => {}}>
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
                      path="/membership-list"
                      element={
                        <PrivateRoute>
                          <MembershipList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/add-membership"
                      element={
                        <PrivateRoute>
                          <AddMembership />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/customer-membership"
                      element={
                        <PrivateRoute>
                          <CustomerMembership />
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
                      path="/blogseomanagement"
                      element={
                        <PrivateRoute>
                          <SeoManagement />
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
                      path="/CustomerInquires"
                      element={
                        <PrivateRoute>
                          <CustomerInquires />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/CustomerInquiresForm"
                      element={
                        <PrivateRoute>
                          <CustomerInquiriesForm />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/inquiriesleads"
                      element={
                        <PrivateRoute>
                          <InquiryLeads />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/inquiriesleadsform"
                      element={
                        <PrivateRoute>
                          <InquiriesLeadsForm />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/LeadSheet_Report"
                      element={
                        <PrivateRoute>
                          <LeadSheetReport />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addlead"
                      element={
                        <PrivateRoute>
                          <Addlead />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/convertedlead"
                      element={
                        <PrivateRoute>
                          <ConvertedLead />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/addconvertedlead"
                      element={
                        <PrivateRoute>
                          <ConvertedLeadForm />
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
                      path="/customersegmentation"
                      element={
                        <PrivateRoute>
                          <CustomerSegmentation />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/salonofferbooking"
                      element={
                        <PrivateRoute>
                          <SalonOfferBooking />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/chatbotuserhistory"
                      element={
                        <PrivateRoute>
                          <ChatBotHistory />
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
                    <Route
                      path="/addnewuser"
                      element={
                        <PrivateRoute>
                          <AddUser />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/listofvendor"
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

                    {/* New Routes Adjust new From the Faizan Side */}

                    <Route
                      path="/Appointments"
                      element={
                        <PrivateRoute>
                          <Appointments />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/automation-list"
                      element={
                        <PrivateRoute>
                          <Automationlist />
                        </PrivateRoute>
                      }
                    />

                    {/* <Route path="/custompermissions" element={<CustomPermissions />} />
                    <Route path="/permissions-data" element={<PermissionData />} />  */}
                    {userPermissions?.data?.[0]?.access?.includes(
                      "super-permission"
                    ) ? (
                      <Route
                        path="/custompermissions"
                        element={<CustomPermissions />}
                      />
                    ) : null}
                    {userPermissions?.data?.[0]?.access?.includes(
                      "super-permission"
                    ) ? (
                      <Route
                        path="/permissions-data"
                        element={<PermissionData />}
                      />
                    ) : null}
                    {userPermissions?.data?.[0]?.access?.includes(
                      "user-creation-permission"
                    ) ? (
                      <Route
                        path="/createadminuser"
                        element={<AdminUserAdd />}
                      />
                    ) : null}
                    {userPermissions?.data?.[0]?.access?.includes(
                      "user-creation-permission"
                    ) ? (
                      <Route
                        path="/listadminuser"
                        element={<AdminUserList />}
                      />
                    ) : null}
                    <Route
                      path="/list-package-request"
                      element={<PackageServiceReqPage />}
                    />

                    <Route path="*" element={<h1>Page Not Found</h1>} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <Signin />
      )}
    </>
  );
}

export default App;
