import React, { useState, useEffect, useContext } from "react";
import AsyncSelect from "react-select/async";
import { useLocation } from "react-router-dom";
import "./css/salonelist.css";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Tooltip } from "@mui/material";
import GeneralModal from "./generalModal/GeneralModal";

const CategoryRequestPage = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [selectedSalonId, setSelectSalonId] = useState("");

  const [categoryDataLoading, setCategoryDataLoading] = useState(false);

  const [categoryrequestData, setCategoryRequestData] = useState([]);

  const [approveCategoryModalOpen, setApproveCategoryModalOpen] =
    useState(false);
  const [approveCategoryData, setApproveCategoryData] = useState({});

  const [isCategoryExistInCity, setIsCategoryExistInCity] = useState(null);
  const [approveLoadingBtn, setApproveLoadingBtn] = useState(false);

  const [categoryCreateSlug, setCategoryCreateSlug] = useState("");
  const [categoryCreateImg, setCategoryCreateImg] = useState(null);

  const location = useLocation();
  //pagination
  const [page, setPage] = useState(1);

  const totalPages = 1;

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const loadSalons = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/salons/?name=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      if (selectedAreaName?.length > 0) {
        url += `&area=${selectedAreaName}`;
      }

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();

        const options = data?.results?.map((salon) => ({
          value: salon.id,
          label: salon.name,
        }));

        callback(options);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/city/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setCityPayload(data?.payload);
        let cityNames = data?.payload.map((item) => item.name);
        setCity(cityNames);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("Failed to fetch city data. Please try again later.");
    }
  };

  function getAreaNames(cityList) {
    if (!cityList) {
      return cityPayload?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      let cityName = selectedCity.toLowerCase();
      for (let city of cityPayload) {
        if (city?.name.toLowerCase() === cityName) {
          selectedAreas = selectedAreas?.concat(city.area_names);
          break;
        }
      }
      return selectedAreas;
    }
  }

  const getCategoryRequestData = async () => {
    setCategoryDataLoading(true);

    let url = "https://backendapi.trakky.in/salonvendor/category-request-admin/";

    // if (selectedCity && selectedAreaName && selectedSalonId) {
    //     url += `?city=${selectedCity}&area=${selectedAreaName}&salon_id=${selectedSalonId}`;
    // } else if (selectedCity && selectedAreaName) {
    //     url += `?city=${selectedCity}&area=${selectedAreaName}`;
    // } else if (selectedCity) {
    //     url += `?city=${selectedCity}`;
    // }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        setCategoryRequestData(data);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch category request data. Please try again later."
      );
    } finally {
      setCategoryDataLoading(false);
    }
  };

  const categoryExistInCity = async (salonId, categoryName, gender) => {
    if (!salonId || !categoryName || !gender) {
      return;
    }

    let url = `https://backendapi.trakky.in/salonvendor/check-category-exist-in-city/?salon_id=${salonId}&category_name=${encodeURIComponent(
      categoryName
    )}&gender=${gender}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setIsCategoryExistInCity(data?.exists);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch category request data. Please try again later."
      );
    }
  };

  useEffect(() => {
    getCategoryRequestData();
    getCity();
  }, []);

  useEffect(() => {
    setSelectedSalons("");

    if ((selectedCity != "" || selectedAreaName != "") && page === 1) {
    } else {
      setPage(1);
    }
  }, [selectedAreaName, selectedCity]);

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCity);
    setSelectedAreaName("");
    setAvailableAreaName(selectedAreas);
  }, [selectedCity, cityPayload]);

  const tableHeaders = [
    "Index",
    "Salon name",
    "Salon area,city",
    "Category name",
    "Gender",
    "From master",
    "Status",
    "Action",
  ];

  const handleApproveCategory = async (payload) => {
    setApproveLoadingBtn(true);

    let url = `https://backendapi.trakky.in/salonvendor/create-category/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        const data = await response.json();
        // toast.success(data?.message);
        setApproveCategoryModalOpen(false);
        setApproveCategoryData({});
        setCategoryCreateImg(null);
        setCategoryCreateSlug(null);
        getCategoryRequestData();
      }
    } catch (error) {
      toast.error("Failed to approve category. Please try again later.");
    } finally {
      setApproveLoadingBtn(false);
    }
  };

  const handleApproveCategoryAndMaster = async (payload) => {
    // console.log(payload);

    let formData = new FormData();
    formData.append("image", payload.image);
    formData.append("slug", payload.slug);
    formData.append("salon", payload.salon);
    formData.append("gender", payload.gender);
    formData.append("category_name", payload.category_name);

    setApproveLoadingBtn(true);

    let url = `https://backendapi.trakky.in/salonvendor/create-master-category-and-category/`;

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: formData,
      });

      if (response.status === 201) {
        const data = await response.json();
        // toast.success(data?.message);
        setApproveCategoryModalOpen(false);
        setApproveCategoryData({});
        setCategoryCreateImg(null);
        setCategoryCreateSlug(null);
        getCategoryRequestData();
      } else {
        toast.error("Failed to approve category. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to approve category. Please try again later.");
    } finally {
      setApproveLoadingBtn(false);
    }
  };

  const handleRejectCategory = async (id) => {
    try {
      let url = `https://backendapi.trakky.in/salonvendor/category-request-admin/${id}/`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
          category_status: "rejected",
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success("Category rejected successfully");
        getCategoryRequestData();
      } else {
        // throw new Error(`Error: ${response.status} - ${response.statusText}`);
        toast.error("Failed to reject category. Please try again later");
      }
    } catch (error) {
      console.error("Error rejecting category:", error);
      toast.error("Failed to reject category. Please try again later");
    }
  };
  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div
              className="tb-body-src-fil"
              style={{
                alignItems: "center",
              }}
            >
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              // onMouseEnter={() => setHovered(true)}
              // onMouseLeave={() => setHovered(false)}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    // disabled={dateFilter}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCity}
                    label="City"
                    onChange={(e) => {
                      setSelectedSalons([]);
                      setSelectedCity(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {city?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl
                  sx={{ margin: "8px 0", width: 110 }}
                  size="small"
                //   disabled={!selectedCity}
                >
                  <InputLabel id="demo-simple-select-label">Area</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedAreaName}
                    label="Area"
                    onChange={(e) => {
                      setSelectedAreaName(e.target.value);
                    }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {availableAreaName?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="input-box inp-salon col-1 col-2 relative min-w-[200px] z-10">
                <AsyncSelect
                  defaultOptions
                  loadOptions={loadSalons}
                  value={selectedSalons}
                  onChange={(selectedSalon) => {
                    setSelectedSalons(selectedSalon);
                    setSelectSalonId(selectedSalon.value);
                  }}
                  noOptionsMessage={() => "No salons found"}
                  isDisabled={selectedCity === ""}
                  placeholder="Search Salon..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#ccc",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#ccc",
                      },
                    }),
                  }}
                />
              </div>

              <div className="min-w-max text-sm">
                ( City & Area filter for search salon )
              </div>

            </div>
          </div>

          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    style={
                      header === "Description"
                        ? { maxWidth: "356px", minWidth: "356px" }
                        : {}
                    }
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody>
                {categoryDataLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center">
                      <div className=" text-center"> Loading...</div>
                    </td>
                  </tr>
                ) : categoryrequestData?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={8}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        No data found
                      </div>
                    </td>
                  </tr>
                ) : (
                  categoryrequestData?.map((category, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                        <td>{category?.salon_name}</td>
                        <td>
                          {category?.salon_area}, {category?.salon_city}
                        </td>
                        <td>{category?.category_name}</td>
                        <td>{category?.gender}</td>
                        <td>{category?.from_master ? "Yes" : "No"}</td>
                        <td>
                          {category?.category_status === "pending" ? (
                            <span className=" text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Pending
                            </span>
                          ) : category?.category_status === "approved" ? (
                            <span className=" text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Approved
                            </span>
                          ) : category?.category_status === "rejected" ? (
                            <span className=" text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Rejected
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {category?.category_status === "pending" ? (
                            <div className="tb-action flex gap-5 w-full justify-center items-center ">
                              <Tooltip
                                title="Approve"
                                arrow
                                sx={{
                                  backgroundColor: "black",
                                }}
                              >
                                <button
                                  className=""
                                  onClick={() => {
                                    setApproveCategoryData(category);
                                    setApproveCategoryModalOpen(true);
                                    categoryExistInCity(
                                      category?.salon,
                                      category?.category_name,
                                      category?.gender
                                    );
                                  }}
                                >
                                  <AddTaskIcon
                                    sx={{
                                      color: "green",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                              <Tooltip
                                title="Reject"
                                arrow
                                sx={{
                                  backgroundColor: "black",
                                }}
                              >
                                <button
                                  className=""
                                  onClick={() => {
                                    confirm({
                                      description: `Are you sure you want to reject category ${category?.category_name}?`,
                                    })
                                      .then(() => {
                                        handleRejectCategory(category?.id);
                                      })
                                      .catch(() => { });
                                  }}
                                >
                                  <DeleteForeverIcon
                                    sx={{
                                      color: "red",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                            </div>
                          ) : (
                            <div className="tb-action flex gap-5 w-full justify-center items-center ">
                              -
                            </div>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            Showing {categoryrequestData?.length} of{" "}
            {categoryrequestData?.length} entries
          </div>
          {(selectedCity ||
            selectedAreaName ||
            categoryrequestData.length !== 0) && (
              <div className="tb-more-results">
                <div className="tb-pagination">
                  <span id={parseInt(1)} onClick={handlePageChange}>
                    ««
                  </span>
                  {page > 1 && (
                    <span id={parseInt(page - 1)} onClick={handlePageChange}>
                      «
                    </span>
                  )}
                  {page > 2 && (
                    <span id={parseInt(page - 2)} onClick={handlePageChange}>
                      {page - 2}
                    </span>
                  )}
                  {page > 1 && (
                    <span id={parseInt(page - 1)} onClick={handlePageChange}>
                      {page - 1}
                    </span>
                  )}
                  <span
                    id={parseInt(page)}
                    onClick={handlePageChange}
                    className="active"
                  >
                    {page}
                  </span>
                  {page < totalPages && (
                    <span id={parseInt(page + 1)} onClick={handlePageChange}>
                      {page + 1}
                    </span>
                  )}
                  {page < totalPages - 1 && (
                    <span id={parseInt(page + 2)} onClick={handlePageChange}>
                      {page + 2}
                    </span>
                  )}
                  {page < totalPages && (
                    <span id={parseInt(page + 1)} onClick={handlePageChange}>
                      »
                    </span>
                  )}
                  <span id={parseInt(totalPages)} onClick={handlePageChange}>
                    »»
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>
      <GeneralModal
        open={approveCategoryModalOpen}
        handleClose={() => {
          setApproveCategoryModalOpen(false);
          setApproveCategoryData({});
          setIsCategoryExistInCity(null);
          setCategoryCreateImg(null);
          setCategoryCreateSlug(null);
        }}
      >
        <div className="">
          <div className="modal-header">
            <h2 className="modal-title text-center font-semibold leading-10 border-b border-gray-400">
              Approve Category
            </h2>
          </div>
          <div className=" flex gap-1 py-2 px-5 flex-col">
            <div className=" ">
              <span className=" font-semibold">Salon name: </span>
              {approveCategoryData?.salon_name},{" "}
              {approveCategoryData?.salon_area},{" "}
              {approveCategoryData?.salon_city}
            </div>
            <div className="">
              <span className=" font-semibold">Category name: </span>
              {approveCategoryData?.category_name}
            </div>

            <div className=" ">
              <span className=" font-semibold">Gender: </span>
              {approveCategoryData?.gender}
            </div>
            <hr className=" bg-black my-2 " />
            {approveCategoryData?.from_master ? (
              <>
                <div className="">
                  <span className=" font-semibold">
                    Category name exist in city :
                  </span>{" "}
                  {isCategoryExistInCity
                    ? "Yes"
                    : isCategoryExistInCity === false
                      ? "No"
                      : "Loading..."}
                </div>

                <hr className=" bg-black my-2" />

                <h3 className=" text-lg font-semibold text-center">
                  Category approval form
                </h3>

                <div className=" flex justify-center ">
                  {isCategoryExistInCity === false ? (
                    <div className=" w-full flex flex-col gap-2 items-center">
                      <div className=" w-full flex italic">
                        <ul className=" list-disc pl-4 text-sm">
                          <li className="">
                            category name doesn't exist in city. fill below form
                            to add category in that salon
                          </li>
                        </ul>
                      </div>
                      <div className=" w-full mb-1">
                        <label htmlFor="slug-cate">Category slug</label>
                        <input
                          type="text"
                          id="slug-cate"
                          className="w-full border border-gray-400 rounded-md px-2 py-1"
                          placeholder="Enter category slug"
                          value={categoryCreateSlug}
                          onChange={(e) =>
                            setCategoryCreateSlug(e.target.value)
                          }
                        />
                      </div>
                      <button
                        className={` bg-emerald-700 mt-2 px-3 rounded-md flex justify-center items-center text-white h-8 pb-1 ${approveLoadingBtn
                          ? "cursor-not-allowed opacity-50"
                          : ""
                          }`}
                        onClick={() => {
                          if (approveLoadingBtn) {
                            return;
                          }
                          handleApproveCategory({
                            add: false,
                            salon: approveCategoryData?.salon,
                            category_name: approveCategoryData?.category_name,
                            slug: categoryCreateSlug,
                            gender: approveCategoryData?.gender,
                          });
                        }}
                      >
                        {!approveLoadingBtn ? "Approve" : "Approving..."}
                      </button>
                    </div>
                  ) : isCategoryExistInCity == true ? (
                    <div className=" w-full flex flex-col gap-2 items-center">
                      <div className=" w-full flex italic">
                        <ul className=" list-disc pl-4 text-sm">
                          <li className="">
                            category name already exist in city. click below
                            approve button to add category in that salon
                          </li>
                        </ul>
                      </div>
                      <button
                        className={` bg-emerald-700 mt-3  px-3 rounded-md flex justify-center items-center text-white h-8 pb-1 ${approveLoadingBtn
                          ? "cursor-not-allowed opacity-50"
                          : ""
                          }`}
                        onClick={() => {
                          if (approveLoadingBtn) {
                            return;
                          }
                          handleApproveCategory({
                            add: true,
                            salon: approveCategoryData?.salon,
                            category_name: approveCategoryData?.category_name,
                            gender: approveCategoryData?.gender
                          });
                        }}
                      >
                        {!approveLoadingBtn ? "Approve" : "Approving..."}
                      </button>
                    </div>
                  ) : (
                    <div className=" w-full flex flex-col gap-2 items-center">
                      <div className=" w-full flex italic">
                        <ul className=" list-disc pl-4 text-sm">
                          <li className="">loading...</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className=" w-full flex flex-col gap-2 items-center">
                <h3 className=" text-lg font-semibold text-center">
                  Category & Master category approval form
                </h3>
                <div className=" w-full flex italic">
                  <ul className=" list-disc pl-4 text-sm">
                    <li className="">
                      Master cateogry doesn't exist. fill form to add master
                      category & category.
                    </li>
                  </ul>
                </div>
                <div className=" w-full">
                  <div className=" font-semibold my-2 underline underline-offset-8 mt-3">
                    Data for Master category :{" "}
                  </div>
                  <div className=" flex gap-2 flex-col w-full">
                    <div className=" w-full mb-1">
                      <label htmlFor="slug-cate">Gander</label>
                      <input
                        type="text"
                        id="slug-cate"
                        className="w-full border border-gray-400 rounded-md px-2 py-1 cursor-not-allowed bg-gray-100"
                        placeholder="gender"
                        value={approveCategoryData?.gender}
                        readOnly
                      />
                    </div>
                    <div className=" w-full mb-1">
                      <label htmlFor="img">
                        Category image{" "}
                        <span className="Note_Inp_Classs">
                          Recommended Image Ratio 1:1
                        </span>
                      </label>
                      <input
                        type="file"
                        name="img"
                        id="img"
                        placeholder="Enter Image"
                        accept="image/*"
                        onChange={(e) => {
                          setCategoryCreateImg(e.target.files[0]);
                        }}
                        style={{ width: "fit-content", cursor: "pointer" }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" w-full mt-4">
                  <div className=" font-semibold my-2 underline underline-offset-8">
                    Data for category :{" "}
                  </div>
                  <div className=" flex gap-2 flex-col w-full">
                    <div className=" w-full mb-1">
                      <label htmlFor="slug-cate">category slug</label>
                      <input
                        type="text"
                        id="slug-cate"
                        className="w-full border rounded-md px-2 py-1"
                        placeholder="Enter category slug"
                        value={categoryCreateSlug}
                        onChange={(e) => setCategoryCreateSlug(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className={` bg-emerald-700 mt-3  px-3 rounded-md flex justify-center items-center text-white h-8 pb-1 ${approveLoadingBtn ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  onClick={() => {
                    if (approveLoadingBtn) {
                      return;
                    }
                    handleApproveCategoryAndMaster({
                      salon: approveCategoryData?.salon,
                      category_name: encodeURIComponent(
                        approveCategoryData?.category_name
                      ),
                      slug: categoryCreateSlug,
                      image: categoryCreateImg,
                      gender: approveCategoryData?.gender,
                    });
                  }}
                >
                  {!approveLoadingBtn ? "Approve" : "Approving..."}
                </button>
              </div>
            )}
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default CategoryRequestPage;
