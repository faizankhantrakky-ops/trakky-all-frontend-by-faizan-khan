import React, { useEffect, useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import NavbarPos from "./components/NavbarPos";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Calendar from "./components/Calendar";
import Clients from "./components/Clients.js";
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
import ServiceList from "./components/catalogueMenagement/ServiceList";
import CategoriesList from "./components/catalogueMenagement/CategoriesList";
import PackageList from "./components/catalogueMenagement/PackageList";
import OffersList from "./components/catalogueMenagement/OffersList";
import GiftCardList from "./components/catalogueMenagement/GiftCardList";
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
import CategoryRequest from "./components/catalogueMenagement/CategoryRequest";
import ServiceRequestPage from "./components/catalogueMenagement/ServiceRequest";
import Signup from "./components/Signup.jsx";
import SettingsManager from "./components/SettingsManager.js";
import Settings from "./components/Settings.js";
import ChangePassword from "./components/Chnage-Password.jsx";
import Dashboard1 from "./components/Dashbord1.jsx";
import OffersRequest from "./components/catalogueMenagement/OffersRequest.jsx";
import PackagesRequest from "./components/catalogueMenagement/PackagesRequest.jsx";
import SalonInventory from "./components/SalonPreview/SalonInventory.jsx";
import SalonProfilePreviewPage from "./components/SalonPreview/SalonProfilePreviewPage.jsx";
import SalonDetail from "./components/SalonPreview/SalonDetail.jsx";
import CustomerEx from "./components/SalonPreview/CustomerEx.jsx";
import CalendarMain from "./components/CalendarMain.jsx";
import InUseProduct from "./components/Sales/InUseProduct.jsx";
import AppointmentCardView from "./components/Appointment/AppointmentCard/AppointmentCardView.jsx";
import WhatsappMessageRemider from "./components/WhatsappMessageRemider.jsx";
import DailyUpdates from "./components/SalonPreview/DailyUpdates.jsx";
import CustomTax from "./components/CustomTax.jsx";
import ParchasedWalletList from "./components/catalogueMenagement/ParchasedWalletList.jsx";
import PurchaseWallet from "./components/catalogueMenagement/PurchaseWallet.jsx";
import BookingFromTrakky from "./components/Appointment/BookingFromTrakky/BookingFromTrakky.jsx";
import DailyReports from "./components/DailyReports/DailyReports.jsx";
import Paymentreport from "./components/DailyReports/Paymentreport/Paymentreport.jsx";
import Customersegment from "./components/Customersegment/Customersegment.jsx";
import Attendencedetails from "./components/Team/Attendencedetails/Attendencedetails.jsx";
import PaymentMethod from "./components/Team/PaymentMethod/PaymentMethod.jsx";
import Managetemplates from "./components/Team/Managetemplates/Managetemplates.jsx";
import FormForGiftCard from "./components/catalogueMenagement/GiftCard/FormForGiftCard/FormForGiftCard.jsx";
import ListofGiftCard from "./components/catalogueMenagement/GiftCard/ListofGiftCard/ListofGiftCard.jsx";
import Userpermissions from "./components/Userpermissions/Userpermissions.jsx";
import Addpermission from "./components/Userpermissions/Addpermission/Addpermission.jsx";
import StickyNotes from "./components/StickyNotes/StickyNotes.jsx";
import Versioninfo from "./components/Team/Versioninfo/Versioninfo.jsx";
import AppointmentHistory from "./components/Appointment/AppointmentHistory/AppointmentHistory.jsx";
import ReportSetting from "./components/ReportSetting/ReportSetting.jsx";
import TestingComponent from "./components/TestingComponent/TestingComponent.jsx";
import Automationreport from "./components/Automationreport/Automationreport.jsx";
import Customerloyalty_Layout from "./components/Customerloyalty_Layout/Customerloyalty_Layout.jsx";
import FinancialTracking from "./components/FinancialTracking/FinancialTracking.jsx";
import LoyaltyLayout from "./components/TestingComponent/LoyaltyLayout/LoyaltyLayout.jsx";
import MainDashBaord from "./components/TestingComponent/MainDashBaord/MainDashBaord.jsx";
import Feedback_loyalty from "./components/TestingComponent/Feedback_loyalty/Feedback_loyalty.jsx";
import StaffPerformance from "./components/TestingComponent/StaffPerformance/StaffPerformance.jsx";
import CustomerLoyalty from "./components/TestingComponent/CustomerLoyalty/CustomerLoyalty.jsx";
import ComplaintsTracking from "./components/TestingComponent/ComplaintsTracking/ComplaintsTracking.jsx";
import HowItWorks from "./components/Team/HowItWorks/HowItWorks.jsx";
import ManageBranch from "./components/ManageBranch/ManageBranch.jsx";
import AddNewBranch from "./components/ManageBranch/AddNewBranch/AddNewBranch.jsx";



function AppContent() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      const checkMidnightLogout = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();
        // Check if it's exactly midnight (00:00:00)
        if (currentHour == 0 && currentMinute == 0 && currentSecond == 0) {
          logoutUser();
          navigate("/login");
        }
      };
      // Check every second to catch midnight precisely
      const interval = setInterval(checkMidnightLogout, 1000);
      return () => clearInterval(interval);
    }
  }, [user, logoutUser, navigate]);
  return (
    <>
      {user ? (
        <>
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
              <Route
                path="/daily-expense-list"
                element={<DailyExpenses children={<DailyExpensesBody />} />}
              />

              <Route
                path="/account-manager/main-dahbaord"
                element={<FinancialTracking />}
              />
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Dashboard1 />} />
              <Route path="/login" element={<Login />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/CalendarMain" element={<CalendarMain />} />
              <Route
                path="/appointment/add-new-appointment"
                element={<AppointmentToggle children={<AppointmentForm />} />}
              />
              <Route
                path="/appointment/list-appointment/calender"
                element={<AppointmentToggle children={<AppointmentTable />} />}
              />
              <Route
                path="/appointment/list-appointment/card"
                element={
                  <AppointmentToggle children={<AppointmentCardView />} />
                }
              />
              <Route
                path="/appointment/list-appointment/history"
                element={
                  <AppointmentToggle children={<AppointmentHistory />} />
                }
              />
              <Route
                path="/appointment/bookings-from-trakky-platform"
                element={<AppointmentToggle children={<BookingFromTrakky />} />}
              />
              <Route
                path="/calendar/:date/appointments"
                element={<AppointmentCard />}
              />
              <Route path="/settings" element={<SettingsMain />}>
                <Route path="manager" element={<SettingsManager />} />
                <Route path="branch-management" element={<ManageBranch />} />
                <Route path="create-branch" element={<AddNewBranch />} />
                <Route path="report-setting" element={<ReportSetting />} />
                <Route
                  path="automation-report-genrattion"
                  element={<Automationreport />}
                />
                <Route path="loyalty" element={<TestingComponent />} />
                <Route path="payment-method" element={<PaymentMethod />} />
                <Route path="template-manage" element={<Managetemplates />} />
                <Route path="editInfo" element={<Settings />} />
                <Route path="chanage-password" element={<ChangePassword />} />
                <Route
                  path="whatsapp-message-remider"
                  element={<WhatsappMessageRemider />}
                />
                <Route path="custom-tax" element={<CustomTax />} />
                <Route path="version-info" element={<Versioninfo />} />
                <Route path="how-it-works" element={<HowItWorks />} />
              </Route>

              <Route path="/ProfilePreview" element={<SalonInventory />}>
                <Route
                  path="salon-profile-preview-page"
                  element={<SalonProfilePreviewPage />}
                />
                <Route
                  path="salon-preview-page"
                  element={<SalonDetail />}
                />
                <Route
                  path="customer-experience-page"
                  element={<CustomerEx />}
                />
                <Route
                  path="daily-updates-preview-page"
                  element={<DailyUpdates />}
                />
              </Route>
              <Route path="/sales" element={<Inventory />}>
                <Route path="selling-product" element={<SellProduct />} />
                <Route path="product-stock" element={<ProductStock />} />
                <Route path="stock-order" element={<StockOrder />} />
                <Route
                  path="Available-products"
                  element={<AvailableProducts />}
                />
                <Route path="Inventory-Sales" element={<InventorySales />} />
                <Route path="Inventory-Use" element={<InventoryUse />} />
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
              <Route path="/client-directory" element={<Clients />} />
              <Route path="/onlineProfile" element={<Onlineprofile />} />
              <Route path="/engage" element={<Engage />} />

              <Route
                path="/staffmanagement/staffform"
                element={<DailyStaffmanage children={<RegisterStaff />} />}
              />
              <Route
                path="/staffmanagement/staffrecord"
                element={<DailyStaffmanage children={<StaffRecord />} />}
              />
              <Route
                path="/staffmanagement/stafftable"
                element={<DailyStaffmanage children={<DailySheet />} />}
              />
              <Route
                path="/staffmanagement/attendencedetails"
                element={<DailyStaffmanage children={<Attendencedetails />} />}
              />

              <Route path="/catalogue" element={<Catalogue />}>
                {/* //Addedd New Foe the Gift Card */}
                <Route path="gift-card" element={<FormForGiftCard />} />
                <Route path="gift-card-list" element={<ListofGiftCard />} />
                <Route path="services" element={<ServiceList />} />
                <Route path="categories" element={<CategoriesList />} />
                <Route path="packages" element={<PackageList />} />
                <Route path="packages-request-from-vendor" element={<PackagesRequest />} />
                <Route path="offers" element={<OffersList />} />
                <Route path="offers-Request" element={<OffersRequest />} />
                <Route path="gift-cards-list" element={<GiftCardList />} />
                <Route path="purchase-wallet-list" element={<PurchaseWallet />} />
                <Route
                  path="purchase-wallet-list"
                  element={<ParchasedWalletList />}
                />
                <Route path="type-membership" element={<MembershipType />} />
                <Route
                  path="membership-customer"
                  element={<CustomerMembership />}
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
                <Route path="category-request" element={<CategoryRequest />} />
                <Route
                  path="service-request"
                  element={<ServiceRequestPage />}
                />
              </Route>

              {/* Loayalty Define */}

              <Route path="/loyalty" element={<LoyaltyLayout />}>
                <Route index element={<MainDashBaord />} />{" "}
                {/* Default route */}
                <Route path="dashboard" element={<MainDashBaord />} />
                <Route path="feedback" element={<Feedback_loyalty />} />
                <Route
                  path="staff-performance"
                  element={<StaffPerformance />}
                />
                <Route path="customer-loyalty" element={<CustomerLoyalty />} />
                <Route
                  path="customers-complains-tracking"
                  element={<ComplaintsTracking />}
                />
              </Route>

              
              <Route
                path="/customer-loyalty"
                element={<Customerloyalty_Layout />}
              >
                <Route path="gift-card-list" element={<ListofGiftCard />} />
                <Route path="gift-card" element={<FormForGiftCard />} />
                <Route path="gift-cards-list" element={<GiftCardList />} />
                <Route path="add-purchase-wallet-list" element={<PurchaseWallet />} />
                <Route
                  path="purchase-wallet-list"
                  element={<ParchasedWalletList />}
                />

                <Route path="type-membership" element={<MembershipType />} />
                <Route
                  path="membership-customer"
                  element={<CustomerMembership />}
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
                <Route path="category-request" element={<CategoryRequest />} />
                <Route
                  path="service-request"
                  element={<ServiceRequestPage />}
                />
              </Route>
                   
              <Route path="*" element={<Nopage />} />
              <Route path="/daily-business-report" element={<DailyReports />} />

              <Route
                path="/daily-business-report/payment-report"
                element={<Paymentreport />}
              />  
              <Route path="/customer-segment" element={<Customersegment />} />
              <Route path="/user-permissions" element={<Userpermissions />} />
              <Route path="/assign-permission" element={<Addpermission />} />
              <Route path="/sticky-notes" element={<StickyNotes />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/Singup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
}



function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
export default App;
