import React, { useState, useEffect, useContext } from "react";
import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";
import "./css/salonelist.css";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const UserReviews = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreTerm, setScoreTerm] = useState("");
  // const [cityTerm, setCityTerm] = useState("");
  const [areaTerm, setAreaTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  // const [uniqueCities, setUniqueCities] = useState([]);
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

        // Filter reviews by selected city
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
        getReviews();
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
        let city = data?.payload.map((item) => item.name);

        setCity(city);
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

    // if (cityTerm !== "") {
    //   filtered = filtered.filter((review) =>
    //     review.salon_city.toLowerCase() === cityTerm.toLowerCase()
    //   );
    // }

    if (areaTerm !== "") {
      filtered = filtered.filter((review) =>
        review.salon_area.toLowerCase().includes(areaTerm.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  }, [searchTerm, scoreTerm, areaTerm, allReviews]);

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCity}
                    label="City"
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {city?.map((item, index) => (
                      <MenuItem key={index} value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="Search by salon name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="area-inp"
                    placeholder="Search by area..."
                    value={areaTerm}
                    onChange={(e) => setAreaTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="score-inp"
                    placeholder="Search by score..."
                    value={scoreTerm}
                    onChange={(e) => setScoreTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="not-found">
                    <td colSpan={7}>Loading...</td>
                  </tr>
                ) : filteredReviews?.length > 0 ? (
                  filteredReviews.map((review, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{review?.name || "-"}</td>
                      <td>{review?.score || "-"}</td>
                      <td>{review?.salon_name || "-"}</td>
                      <td>{review?.salon_city || "-"}</td>
                      <td>{review?.salon_area}</td>
                      <td>
                        <AiFillDelete
                          onClick={() => deleteReview(review.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserReviews;
