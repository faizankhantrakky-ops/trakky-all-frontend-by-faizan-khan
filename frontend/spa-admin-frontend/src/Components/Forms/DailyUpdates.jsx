import React from "react";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import "../css/form.css";
import toast, { Toaster } from "react-hot-toast";

const DailyUpdates = ({ dailyData, handleClose, handleModalClose }) => {
  const { authTokens } = useContext(AuthContext);

  const [spasData, setSpasData] = useState([]);
  const [selectSpaId, setSelectSpaId] = useState(dailyData?.spa_id || "");
  const [spaSearch, setSpaSearch] = useState(dailyData?.spa_name || "");
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [updateDesc, setUpdateDesc] = useState(
    dailyData?.daily_update_description || ""
  );

  const [img, setImg] = useState("");

  // Debounced search function
  const handleSearch = (searchTerm) => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Don't search if no term or already selected
    if (!searchTerm.trim() || selectSpaId) {
      setSpasData([]);
      setLoading(false);
      return;
    }

    // Set loading state
    setLoading(true);

    // Set new timeout for debouncing
    const timeout = setTimeout(async () => {
      try {
        const requestOption = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(
          `https://backendapi.trakky.in/spas/search/?query=${encodeURIComponent(searchTerm)}`,
          requestOption
        );
        
        if (response.ok) {
          const data = await response.json();
          setSpasData(data?.data || []);
        } else {
          setSpasData([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSpasData([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce delay

    setSearchTimeout(timeout);
  };

  useEffect(() => {
    handleSearch(spaSearch);
    
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [spaSearch]);

  // Clear search results when spa is selected
  useEffect(() => {
    if (selectSpaId) {
      setSpasData([]);
      setLoading(false);
    }
  }, [selectSpaId]);

  // Set initial data for edit mode
  useEffect(() => {
    if (dailyData && dailyData.spa_name && dailyData.spa_area) {
      setSpaSearch(`${dailyData.spa_name} - ${dailyData.spa_area}`);
      setSelectSpaId(dailyData.spa_id);
    }
  }, [dailyData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate spa selection
    if (!selectSpaId) {
      toast.error("Please select a spa", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "white",
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append("daily_update_description", updateDesc);
    img !== "" && formData.append("daily_update_img", img);
    formData.append("spa_id", selectSpaId);

    if (dailyData) {
      const requestOption = {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      };

      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/daily-updates/${dailyData?.id}/`,
          requestOption
        );

        if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.daily_update_img !== undefined
              ? errorData.daily_update_img
              : "";
          errorMessage += " ";
          if (errorMessage.length === 0) {
            errorMessage += `Something Went Wrong : ${response.status}`;
          }
          toast.error(`${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#ef4444",
              color: "white",
            },
          });
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else if (response.ok) {
          toast.success("Daily Work Update Successfully", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#22c55e",
              color: "#fff",
            },
          });
          setImg("");
          setSelectSpaId("");
          setSpaSearch("");
          setUpdateDesc("");
          handleClose();
          handleModalClose();
        } else {
          console.log("Empty Response !!");
          toast.error("Something went wrong", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#ef4444",
              color: "#fff",
            },
          });
          handleClose();
          handleModalClose();
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("An error occurred while processing your request", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      }
    } else {
      // Disable the submit button to prevent multiple submissions
      e.target
        .querySelector('button[type="submit"]')
        .setAttribute("disabled", "true");

      const loadingToastId = toast.loading("Submitting...", {
        duration: null,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      const requestOption = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      };

      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/daily-updates/`,
          requestOption
        );
        if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.daily_update_img !== undefined
              ? errorData.daily_update_img
              : "";
          errorMessage += " ";
          if (errorMessage.length === 0) {
            errorMessage += `Something Went Wrong : ${response.status}`;
          }
          toast.error(`${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#ef4444",
              color: "white",
            },
          });
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else if (response.ok) {
          // Success handling
          toast.success("Daily Work Added Successfully", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#22c55e",
              color: "#fff",
            },
          });
          setImg("");
          e.target.querySelector("#img").value = "";
          setSelectSpaId("");
          setSpaSearch("");
          setUpdateDesc("");
        } else {
          // Handle empty response
          toast.error("Something went wrong", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#ef4444",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        // Handle fetch error
        console.error("Fetch error:", error);
        toast.error("An error occurred while processing your request", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      } finally {
        // Enable the submit button after submission process completes
        e.target
          .querySelector('button[type="submit"]')
          .removeAttribute("disabled");

        // Hide loading toast
        toast.dismiss(loadingToastId);
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Daily Updates</h3>
          </div>

          <div className="row">
            <div className="input-box inp-spa col-1 col-2 relative">
              <label htmlFor="spas">Select Spa</label>

              <input
                required
                type="text"
                name="spas"
                placeholder="Search Spa"
                id="spas"
                value={spaSearch}
                onChange={(e) => {
                  setSelectSpaId("");
                  setSpaSearch(e.target.value);
                }}
                disabled={!!dailyData}
              />
              
              {/* Search Results Dropdown */}
              {spaSearch.length > 0 && !selectSpaId && (
                <div className="spa-search-result-main">
                  {loading ? (
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <div className="loading-spinner" style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        border: '2px solid #ccc',
                        borderTopColor: '#333',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                        marginRight: '8px'
                      }}></div>
                      Searching...
                    </div>
                  ) : spasData.length > 0 ? (
                    spasData.map((spa, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectSpaId(spa.id);
                          setSpaSearch(`${spa.name} - ${spa.area}`);
                        }}
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        {spa.name} - {spa.area}
                      </div>
                    ))
                  ) : (
                    !loading && (
                      <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
                        No spa found
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="update_desc">Daily Update Description</label>
              <textarea
                name="update_desc"
                id="update_desc"
                value={updateDesc}
                onChange={(e) => setUpdateDesc(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>Image {!dailyData && <span className="text-red-500">*</span>}</label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Client Work Image"
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
                style={{ cursor: "pointer", width: "fit-content" }}
                required={!dailyData}
              />
            </div>
          </div>
          <div className="submit-btn row">
            <button type="submit" onSubmit={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
      </div>
      
      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default DailyUpdates;