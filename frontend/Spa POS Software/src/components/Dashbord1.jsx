import React, { useContext, useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./Dashbord1.css";
import AuthContext from "../Context/Auth";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";

const Dashboard = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);
  const [dashbordCount, setDashbordCount] = useState([]);
  const [totalAppointmentsData, setTotalAppointmentsData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [topTeamMembersData, setTopTeamMembersData] = useState([]);
  const [bestSellingServicesData, setBestSellingServicesData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [salesMonths, setSalesMonths] = useState([]);
  const [revenueMonths, setRevenueMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Name Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/vendor/${user.user_id}/`
      );
      if (response.ok) {
        const jsonData = await response.json();
        setUserData(jsonData);
      } else {
        console.log("error");
      }
    };
    fetchData();
  }, [user.user_id]);

  // Fetch Dashbord Count Data 
  useEffect(() => {
    const fetchDashbordCount = async () => {
      setLoading(true);
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/dashboard/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      if (response.ok) {
        const jsonData = await response.json();
        setDashbordCount(
          jsonData.map((item) => ({
            title: item.label.charAt(0).toUpperCase() + item.label.slice(1),
            value: item.count_label,
            description:
              item.timestamp_label.charAt(0).toUpperCase() +
              item.timestamp_label.slice(1),
          }))
        );
      } else {
        console.log("error");
      }
      setLoading(false);
    };
    fetchDashbordCount();
  }, []);

  // Fetch DashBord Chart And List Print 
  useEffect(() => {
    const fetchDashbordChart = async () => {
      setLoading(true);
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/dashboard-graph/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      if (response.ok) {
        const jsonData = await response.json();

        // Update Sales Data
        setSalesData(
          jsonData.sales_overview.total_sales.length > 0
            ? jsonData.sales_overview.total_sales
            : [0]
        );
        setSalesMonths(
          jsonData.sales_overview.months.length > 0
            ? jsonData.sales_overview.months
            : ["No Data"]
        );

        // Update Revenue Data
        setRevenueData(
          jsonData.revenue_overview.total_revenue.length > 0
            ? jsonData.revenue_overview.total_revenue
            : [0]
        );
        setRevenueMonths(
          jsonData.revenue_overview.months.length > 0
            ? jsonData.revenue_overview.months
            : ["No Data"]
        );

        setTotalAppointmentsData(
          jsonData.appointments_overview.today.map((appointment) => ({
            date: appointment.appointment_date,
            time: "", // If you have time data, map it here
            client: appointment.customer_name,
            price: appointment.appointment_price,
          }))
        );

        // Set upcoming appointments data (next 7 days)
        setAppointmentsData(
          jsonData.appointments_overview.next_7_days.map((appointment) => ({
            date: appointment.appointment_date,
            time: "", // If you have time data, map it here
            client: appointment.customer_name,
            price: appointment.appointment_price,
          }))
        );

        // Set Best Selling Services Data
        setBestSellingServicesData(
          jsonData.best_selling_services.services.map((service, index) => ({
            service: service || "Unknown Service", // If the service name is empty
            thisMonth: jsonData.best_selling_services.this_month[index],
            lastMonth: jsonData.best_selling_services.last_month[index],
          }))
        );

        // Set Top Performing Team Members Data
        setTopTeamMembersData(
          jsonData.top_performers.staff_names.map((staff, index) => ({
            staff_names: staff || "Unknown", // If the staff name is empty
            total_revenue: jsonData.top_performers.total_revenue[index],
            appointment_count: jsonData.top_performers.appointment_count[index],
          }))
        );
      } else {
        console.log("error");
      }
      setLoading(false);
    };
    fetchDashbordChart();
  }, []);

  // Sales Chart
  const SalesChart = () => {
    const options = {
      chart: {
        type: "line",
        height: 350,
      },
      series: [
        {
          name: "Sales",
          data: salesData, // Dynamic sales data
        },
      ],
      xaxis: {
        categories: salesMonths, // Dynamic sales months
      },
    };

    return loading ? (
      <Skeleton height={350} width="100%" />
    ) : (
      <Chart
        options={options}
        series={options.series}
        type="bar"
        height={350}
      />
    );
  };

  // Revenue Chart
  const RevenueChart = () => {
    const options = {
      chart: {
        type: "bar",
        height: 350,
      },
      series: [
        {
          name: "Revenue",
          data: revenueData, // Dynamic revenue data
        },
      ],
      xaxis: {
        categories: revenueMonths, // Dynamic revenue months
      },
    };

    return loading ? (
      <Skeleton height={350} width="100%" />
    ) : (
      <Chart
        options={options}
        series={options.series}
        type="line"
        height={350}
      />
    );
  };

  // Sleleton For Chart And List Table
  const renderSkeleton = () => (
    <div className="p-4 border-b flex justify-between items-center">
      <Skeleton variant="rectangular" width={150} height={20} />
      <Skeleton variant="rectangular" width={80} height={20} />
    </div>
  );

  return (
    <div className="p-6 ml-0 sm:ml-20 w-full max-w-full">
      {/* Navbar */}
      <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center">
        {/* Display Skeleton for Welcome Text if loading */}
        {loading ? (
          <Skeleton width={200} height={24} />
        ) : (
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Welcome, {userData?.ownername}
          </h1>
        )}

        {/* Display Skeleton for Button if loading */}
        {loading ? (
          <Skeleton width={150} height={40} className="mt-2 sm:mt-0" />
        ) : (
          <Link
            to={"/appointment/create-appointment"}
            className="mt-2 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Add Appointment
          </Link>
        )}
      </div>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <Skeleton
                  variant="text"
                  width="60%"
                  height={30}
                  className="mb-2"
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={60}
                  className="mb-2"
                />
                <Skeleton variant="text" width="40%" height={30} />
              </div>
            ))
          : dashbordCount.map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm transition hover:shadow-xl"
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {card.title || "default"}
                </h3>
                <p className="text-2xl font-bold text-gray-600 mt-2">
                  {card.value || "0"}
                </p>
                <p className="text-gray-500 mt-1">
                  {card.description || "None"}
                </p>
              </div>
            ))}
      </div>

      {/* Sales and Revenue Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">
            Sales Overview
          </h3>
          <SalesChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">
            Revenue Overview
          </h3>
          <RevenueChart />
        </div>
      </div>

      {/* Appointments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Total Appointments (Today) */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-auto">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Total Appointments (Today)
            </h3>
          </div>
          <div className="total-appoinmnet-scrollbar h-[300px] overflow-y-auto">
            {loading ? (
              // Render skeleton while loading
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index}>{renderSkeleton()}</div>
                ))}
              </>
            ) : totalAppointmentsData.length > 0 ? (
              totalAppointmentsData.map((appointment, index) => (
                <div
                  key={index}
                  className="p-4 border-b flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {appointment.date}
                    </p>
                    <p className="text-gray-500">{appointment.client}</p>
                  </div>
                  <p className="font-bold text-gray-800">{appointment.price}</p>
                </div>
              ))
            ) : (
              <div className="h-[300px] flex flex-col justify-center items-center">
                <p className="text-gray-800">Your schedule is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments (Next 7 Days) */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-auto">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Upcoming Appointments
            </h3>
          </div>
          <div className="total-appoinmnet-scrollbar h-[300px] overflow-y-auto">
            {loading ? (
              // Render skeleton while loading
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index}>{renderSkeleton()}</div>
                ))}
              </>
            ) : appointmentsData.length > 0 ? (
              appointmentsData.map((appointment, index) => (
                <div
                  key={index}
                  className="p-4 border-b flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {appointment.date}
                    </p>
                    <p className="text-gray-500">{appointment.client}</p>
                  </div>
                  <p className="font-bold text-gray-800">{appointment.price}</p>
                </div>
              ))
            ) : (
              <div className="h-[300px] flex flex-col justify-center items-center">
                <p className="text-gray-500">No Appointments Scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Appointments and Top Performing Team Members Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Best Selling Services */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-auto">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Best Selling Services
            </h3>
          </div>
          <div className="total-appoinmnet-scrollbar h-[300px] overflow-y-auto">
            {loading ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Service</th>
                    <th>This Month</th>
                    <th>Last Month</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <React.Fragment key={index}>
                      {renderSkeleton(3)}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : bestSellingServicesData.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Service</th>
                    <th>This Month</th>
                    <th>Last Month</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellingServicesData.map((service, index) => (
                    <tr key={index} className="border-t text-gray-700">
                      <td className="py-2">{service.service}</td>
                      <td>{service.thisMonth}</td>
                      <td>{service.lastMonth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-[300px] flex flex-col justify-center items-center">
                <p className="text-gray-500">No sales this month</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Team Members */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-auto">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Top Performing Team Members
            </h3>
          </div>
          <div className="total-appoinmnet-scrollbar h-[300px] overflow-y-auto">
            {loading ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Name</th>
                    <th>Total Sales</th>
                    <th>Total Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <React.Fragment key={index}>
                      {renderSkeleton(3)}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : topTeamMembersData.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Name</th>
                    <th>Total Sales</th>
                    <th>Total Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {topTeamMembersData.map((member, index) => (
                    <tr key={index} className="border-t text-gray-700">
                      <td className="py-2">{member.staff_names}</td>
                      <td>{member.total_revenue}</td>
                      <td>{member.appointment_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-[300px] flex flex-col justify-center items-center">
                <p className="text-gray-500">No team members found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
