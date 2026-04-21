import React from "react";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------
   1. Route mapping (kept outside the component)
   ------------------------------------------------- */
const ROUTES = {
  "Total Salons": "/listsalons",
  "Total Collaborated Salons": "/collaborated",
  "Total Salon Requests": "/newsalonrequests",
  "Total Scores": "/userreviews",
  "Total Users": "/customers",
  "Total Inquiries": "/inquiry",
  "Total POS Vendors": "/listvendors",
  "Total National Categories": "/listnationalcategories",
  "Total Cities": "/listcities",
  "Total Areas": "/listareas",
  "Total Categories": "/listcategories",
  "Total Services": "/listofservices",
  "Total Packages": "/listservicepackages",
  "Total Salon Client Images": "/listclientworkphotos",
  "Total Salon Profile Offers": "/salonprofileoffer",
  "Total Master Categories": "/mastercategories",
  "Total Master Services": "/masterservices",
  "Total Blogs": "/listblogs",
  "Total Daily Updates": "/listdailyupdates",
  "Total National Hero Offers": "/nationalherooffers",
  "Total Features This Week": "/featuredthisweek",
  "Total Salon City Offers": "/cityOffers",
  "Total Bridal Salons": "/listbridal",
  "Total Makeup Salons": "/makeup",
  "Total Unisex Salons": "/unisexsalons",
  "Total Top Rated Salons": "/topratedsalons",
  "Total Academy Salons": "/academysalons",
  "Total Female Beauty Parlours": "/femalebeautyparlour",
  "Total Kids Salons": "/kidsspecial",
  "Total Male Salons": "/malesalons",
};

/* -------------------------------------------------
   2. Bottom-border colour per card (Tailwind classes)
   ------------------------------------------------- */
const BORDER_MAP= {
  "Total Salons": "border-b-indigo-600",
  "Total Collaborated Salons": "border-b-violet-600",
  "Total Salon Requests": "border-b-red-600",
  "Total Scores": "border-b-amber-600",
  "Total Users": "border-b-emerald-600",
  "Total Inquiries": "border-b-purple-600",
  "Total POS Vendors": "border-b-orange-600",
  "Total National Categories": "border-b-cyan-600",
  "Total Cities": "border-b-indigo-500",
  "Total Areas": "border-b-lime-600",
  "Total Categories": "border-b-pink-600",
  "Total Services": "border-b-teal-600",
  "Total Packages": "border-b-rose-600",
  "Total Salon Client Images": "border-b-violet-500",
  "Total Salon Profile Offers": "border-b-sky-600",
  "Total Master Categories": "border-b-blue-600",
  "Total Master Services": "border-b-green-600",
  "Total Blogs": "border-b-amber-500",
  "Total Daily Updates": "border-b-fuchsia-600",
  "Total National Hero Offers": "border-b-red-500",
  "Total Features This Week": "border-b-purple-500",
  "Total Salon City Offers": "border-b-orange-500",
  "Total Bridal Salons": "border-b-pink-500",
  "Total Makeup Salons": "border-b-rose-500",
  "Total Unisex Salons": "border-b-blue-500",
  "Total Top Rated Salons": "border-b-yellow-600",
  "Total Academy Salons": "border-b-emerald-500",
  "Total Female Beauty Parlours": "border-b-pink-400",
  "Total Kids Salons": "border-b-cyan-500",
  "Total Male Salons": "border-b-indigo-400",
};


const DashboardCard = ({
  name,
  number,
  dateState,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const route = ROUTES[name];
    if (route) {
      navigate(route, { state: { dateState } });
    }
  };

  const borderClass = BORDER_MAP[name] ?? "border-b-gray-500";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={`
        rounded-t-3xl
        group flex flex-col items-center justify-center
        w-72 h-32 p-4 rounded-sm bg-white
        shadow-lg transition-all duration-300 ease-in-out
        cursor-pointer select-none
        border-b-4 ${borderClass}
        hover:-translate-y-1 hover:shadow-xl
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-${borderClass.split("-")[2]}-300
      `}
    >
      {/* Card label */}
      <div className="text-xs font-semibold text-gray-600 tracking-wide text-center">
        {name}
      </div>

      {/* Card value */}
      <div className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">
        {number}
      </div>
    </div>
  );
};

export default DashboardCard;