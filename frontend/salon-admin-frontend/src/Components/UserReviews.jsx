import React, { useState, useEffect, useContext } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const UserReviews = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreTerm, setScoreTerm] = useState("");
  const [areaTerm, setAreaTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);

  const tableHeaders = ["Sr no.", "Name", "Score", "Salon Name", "City", "Area", "Action"];

  const getReviews = async (city = "") => {
    setLoading(true);
    let url = "https://backendapi.trakky.in/salons/score/";

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        let data = await response.json();
        const filteredByCity = city
          ? data.filter((review) => review.salon_city === city)
          : data;

        setAllReviews(filteredByCity);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", { duration: 4000, position: "top-center" });
      }
    } catch (error) {
        toast.error("Something went wrong", { duration: 4000, position: "top-center" });
        console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews(selectedCity);
  }, [selectedCity]);

  const deleteReview = async (id) => {
    try {
      let confirmPromise = window.confirm("Are you sure you want to delete this review?");
      if (!confirmPromise) return;

      let response = await fetch(`https://backendapi.trakky.in/salons/score/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        toast.success("Review Deleted Successfully", { duration: 4000, position: "top-center" });
        getReviews(selectedCity);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong: ${response.status}`, { duration: 4000, position: "top-center" });
      }
    } catch (error) {
      toast.error("Something went wrong", { duration: 4000, position: "top-center" });
      console.log("Error: ", error);
    }
  };

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        let cityList = data?.payload.map((item) => item.name);
        setCity(cityList);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    let filtered = allReviews;

    if (searchTerm !== "") {
      filtered = filtered.filter((review) =>
        review.salon_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (scoreTerm !== "") {
      filtered = filtered.filter((review) =>
        review.score.toString().includes(scoreTerm)
      );
    }

    if (areaTerm !== "") {
      filtered = filtered.filter((review) =>
        review.salon_area.toLowerCase().includes(areaTerm.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  }, [searchTerm, scoreTerm, areaTerm, allReviews]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 p-3 font-sans ">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header & Filters */}
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Reviews</h2>
            
            <div className="flex flex-col lg:flex-row gap-3">
              {/* City Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">All Cities</option>
                  {city.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search by Salon Name */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by salon name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Search by Area */}
              <div className="w-full lg:w-48">
                <input
                  type="text"
                  placeholder="Search by area..."
                  value={areaTerm}
                  onChange={(e) => setAreaTerm(e.target.value)}
                  className="w-full h-11 px-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Search by Score */}
              <div className="w-full lg:w-40">
                <input
                  type="text"
                  placeholder="Score..."
                  value={scoreTerm}
                  onChange={(e) => setScoreTerm(e.target.value)}
                  className="w-full h-11 px-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                        <p className="text-sm font-medium">Loading reviews...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredReviews.length > 0 ? (
                  filteredReviews.map((review, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-700">{index + 1}</td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">
                        {review?.name || "-"}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {review?.score || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">
                        {review?.salon_name || "-"}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">
                        {review?.salon_city || "-"}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">
                        {review?.salon_area || "-"}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                          title="Delete Review"
                        >
                          <AiFillDelete className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                        <p className="text-base font-medium">
                          {searchTerm || scoreTerm || areaTerm || selectedCity
                            ? "No reviews match your filters."
                            : "No reviews found."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <strong>{filteredReviews.length}</strong> of{" "}
              <strong>{allReviews.length}</strong> reviews
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserReviews;