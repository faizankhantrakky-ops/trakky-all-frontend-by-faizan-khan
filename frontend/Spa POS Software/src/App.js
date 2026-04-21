import React, { useEffect, useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavbarPos from "./components/NavbarPos";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Calendar from "./components/Calendar";
import Clients from "./components/Clients";
// import Catalogue from "./components/Catalogue/Catalogue";
import Catalogue from "./components/catalogueMenagement/Catalogue";
import Onlineprofile from "./components/Onlineprofile";
import Engage from "./components/Engage";
import Login from "./components/Login";
import AuthContext, { AuthProvider } from "./Context/Auth";
import AppointmentCard from "./components/Appointment/AppointmentCard";
import Inventory from "./components/Sales/Inventory";
import ProductStock from "./components/Sales/ProductStock";
import StockOrder from "./components/Sales/StockOrder";
import Supplier from "./components/Sales/Distributor.jsx";
import InventorySales from "./components/Sales/InventorySales.jsx";
import InventoryUse from "./components/Sales/InventoryUse.jsx";
import AvailableProducts from "./components/Sales/AvailableProducts";
import SelectSupplier from "./components/Sales/SelectSupplier";
import SelectLocation from "./components/Sales/SelectLocation";
import SelectProducts from "./components/Sales/SelectProducts";
import AddProducts from "./components/Sales/AddProducts";
import DailySheet from "./components/Team/DailySheet";
import RegisterStaff from "./components/Team/RegisterStaff";
import StaffRecord from "./components/Team/StaffRecord";

import InventoryMob from "./components/Sales/InventoryMob";
import Nopage from "./components/Nopage";
import DashSales from "./components/Home/DashSales";
import DashStaff from "./components/Home/DashStaff";
import DashClient from "./components/Home/DashClient";
import PackageList from "./components/catalogueMenagement/SpaMembershipPackageList.jsx";
import OffersList from "./components/catalogueMenagement/OffersList";
import MembershipType from "./components/catalogueMenagement/MembershipType";
import CustomerMembership from "./components/catalogueMenagement/CustomerMembership";
import CreateMembership from "./components/catalogueMenagement/form/CreateMembership";
import CreateMembershipType from "./components/catalogueMenagement/form/CreateMembershipType";
import CreateCustomerMembership from "./components/catalogueMenagement/form/CreateCustomerMembership";
import Dailyexpense from "./components/Dailyexpense";
import AppointmentToggle from "./components/Appointment/AppointmentToggle";
import AppointmentForm from "./components/Appointment/AppointmentForm/AppointmentForm";
import AppointmentTable from "./components/Appointment/AppointmentCard/AppointmentTable";
import SettingsMain from "./components/SettingMain.jsx";
import SellProduct from "./components/Sales/SellProduct";
import Dashboard from "./components/Dashboard";

import DashboardStaffDetails from "./components/dashboard/DashboardStaffDetails";
import DashboardClientDetails from "./components/dashboard/DashboardClientDetails";
import SalesDetails from "./components/dashboard/SalesDetails";
import DailyStaffmanage from "./components/Team/StaffManagementToggle";
import DailyExpenses from "./components/DailyExpenses/DailyExpense";
import DailyExpensesBody from "./components/DailyExpenses/DailyExpensesBody";
import Signup from "./components/Signup.jsx";
import SettingsManager from "./components/SettingsManager.js";
import Settings from "./components/Settings.js";
import ChangePassword from './components/Chnage-Password.jsx'
import Dashboard1 from "./components/Dashbord1.jsx";
import OffersRequest from "./components/catalogueMenagement/OffersRequest.jsx";
import PackagesRequest from "./components/catalogueMenagement/SpaMembershipPackagesRequest.jsx";
import SpaInventory from "./components/SpaPreview/SpaInventory.jsx";
import SpaProfilePreviewPage from "./components/SpaPreview/SpaProfilePreviewPage.jsx";
import SpaDetail from "./components/SpaPreview/SpaDetail.jsx";
import CustomerEx from "./components/SpaPreview/CustomerEx.jsx";
import CalendarMain from "./components/CalendarMain.jsx";
import InUseProduct from "./components/Sales/InUseProduct.jsx";
import AppointmentCardView from "./components/Appointment/AppointmentCard/AppointmentCardView.jsx";
import MassagesList from "./components/catalogueMenagement/MassagesList.jsx";
import MassagesRequest from "./components/catalogueMenagement/MassagesRequest.jsx";
import SpaMembershipPackageList from "./components/catalogueMenagement/SpaMembershipPackageList.jsx";
import SpaMembershipPackagesRequest from "./components/catalogueMenagement/SpaMembershipPackagesRequest.jsx";
import MemberShipmanage from "./components/dashboard/MemberShipmanage/MemberShipmanage.jsx";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user ? (
        <Router>
          <NavbarPos />
          <div
            style={{
              display: "flex",
              width: "100%",
              top: "70px",
            }}
            className="hide-custom"
          >
            <Sidebar />

            <Routes>
              <Route path="/daily-expense" element={
                <DailyExpenses children={<DailyExpensesBody />} />}
              />
              <Route path="/home" element={<Home />} />
              {/* <Route path="/" element={<Dashboard1 />} /> */}

              <Route
                path="/"
                element={
                  <Dashboard children={<SalesDetails />} />
                }
              />
              <Route
                path="/dashboard/staffdetails"
                element={
                  <Dashboard children={<DashboardStaffDetails />} />
                }
              />
              <Route
                path="/dashboard/membership"
                element={
                  <Dashboard children={<MemberShipmanage />} />
                }
              />
              <Route
                path="/dashboard/clientdetails"
                element={
                  <Dashboard children={<DashboardClientDetails />} />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path='/CalendarMain' element={<CalendarMain />} />

              <Route
                path="/appointment/create-appointment"
                element={
                  <AppointmentToggle children={<AppointmentForm />} />
                }
              />
              <Route
                path="/appointment/list-appointment/calender"
                element={
                  <AppointmentToggle children={<AppointmentTable />} />
                }
              />
              <Route
                path="/appointment/list-appointment/card"
                element={
                  <AppointmentToggle children={<AppointmentCardView />} />
                }
              />

              <Route
                path="/calendar/:date/appointments"
                element={<AppointmentCard />}
              />
              <Route path="/settings" element={<SettingsMain />}>
                <Route path="manager" element={<SettingsManager />} />
                <Route path="editInfo" element={<Settings />} />
                <Route path="Chnage-Password" element={<ChangePassword />} />
              </Route>

              <Route path="/ProfilePreview" element={<SpaInventory />}>
                <Route path="spa-profile-preview-page" element={<SpaProfilePreviewPage />} />
                <Route path='spa-Detail-preview-page' element={<SpaDetail />} />
                <Route path="customer-experience-preview-page" element={<CustomerEx />} />
              </Route>

              <Route path="/sales" element={<Inventory />}>
                <Route path="sell-product" element={<SellProduct />} />
                <Route path="product-stock" element={<ProductStock />} />
                <Route path="stock-order" element={<StockOrder />} />
                <Route
                  path="Available-products"
                  element={<AvailableProducts />}
                />
                <Route
                  path="Inventory-Sales"
                  element={<InventorySales />}
                />
                <Route
                  path="Inventory-Use"
                  element={<InventoryUse />}
                />
                <Route path="In-Inventory-Use" element={<InUseProduct />} />
                <Route path="supplier" element={<Supplier />} />
              </Route>
              <Route path="/Salesmob" element={<InventoryMob />} />
              <Route
                path="/sales/available-products"
                element={<AvailableProducts />}
              />
              <Route path="/sales/Supplier" element={<Supplier />} />
              <Route path="/sales/Stock-order" element={<StockOrder />} />
              <Route path="/sales/product-stock" element={<ProductStock />} />
              <Route
                path="/sales/Available-products/Add-products"
                element={<AddProducts />}
              />
              <Route
                path="/sales/stock-order/Select-Supplier"
                element={<SelectSupplier />}
              />
              <Route
                path="/sales/stock-order/:supplier/Select-location"
                element={<SelectLocation />}
              />
              <Route
                path="/sales/stock-order/:supplier/select-products"
                element={<SelectProducts />}
              />
              <Route path="/clients" element={<Clients />} />

              <Route path="/onlineProfile" element={<Onlineprofile />} />
              <Route path="/engage" element={<Engage />} />
              {/* <Route path="/team/*" element={<Team />}>
                <Route path="daily-sheet" element={<DailySheet />} />
                <Route path="register-staff" element={<RegisterStaff />}></Route>
                <Route path="staff-record" element={<StaffRecord />} />
                <Route
                  path=""
                  element={<Navigate to="/team/daily-sheet" replace />}
                />
              </Route> */}
              <Route
                path="/staffmanagement/staffform"
                element={
                  <DailyStaffmanage children={<RegisterStaff />} />
                }
              />
              <Route
                path="/staffmanagement/staffrecord"
                element={
                  <DailyStaffmanage children={<StaffRecord />} />
                }
              />
              <Route
                path="/staffmanagement/stafftable"
                element={
                  <DailyStaffmanage children={<DailySheet />} />
                }
              />



              <Route path="/catalogue"
                element={<Catalogue />}
              >
                <Route
                  path="massages"
                  element={
                    <MassagesList />
                  }
                />

                <Route
                  path="membership-packages"
                  element={
                    <SpaMembershipPackageList />
                  }
                />
                <Route
                  path="membership-packages-request"
                  element={
                    <SpaMembershipPackagesRequest />
                  }
                />
                <Route
                  path="offers"
                  element={
                    <OffersList />
                  }
                />
                <Route
                  path="offers-Request"
                  element={
                    <OffersRequest />
                  }
                />

                <Route
                  path="membership-type"
                  element={
                    <MembershipType />
                  }
                />
                <Route
                  path="membership-customer"
                  element={
                    <CustomerMembership />
                  }
                />
                <Route
                  path="create-membership-type"
                  element={
                    <CreateMembership children={<CreateMembershipType />} />
                  }
                />
                <Route
                  path="create-customer-membership"
                  element={
                    <CreateMembership children={<CreateCustomerMembership />} />
                  }
                />
                <Route path="massage-request" element={<MassagesRequest />} />
              </Route>


              <Route path="*" element={<Nopage />} />
            </Routes>
          </div>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="/Singup" element={<Signup />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
