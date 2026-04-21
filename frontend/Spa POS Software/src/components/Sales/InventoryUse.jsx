import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../../Context/Auth";

const InventorySales = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterData, setFilteredData] = useState([]);
  const [inventoryUse, setInvertyUse] = useState([]);

  useEffect(() => {
    if (search === "") {
      setFilteredData(inventoryUse);
    } else {
      setFilteredData(
        inventoryUse.filter((item) =>
          item?.product_details?.product_name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, inventoryUse]);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/use-inventory/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setInvertyUse(responseData);
        setFilteredData(responseData);
        console.log(responseData);
      } else {
        console.log("Error while fetching data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearch("");
  };

  return (
    <>
      <div className=" w-full h-full bg-[#EFECFF]">
        <Toaster />
        <div class="flex items-center justify-between h-14 w-full md:h-16 px-2 md:px-6">
          <div class="h-5 w-5 flex items-center md:hidden">
            <ArrowBackIcon className="w-full" />
          </div>
          <div>
            <h1 class="text-lg font-bold md:text-xl">Sales Inventory</h1>
          </div>
          {window.innerWidth > 768 ? (
            <div class="flex gap-3 items-center">
              {/* <button
              class="rounded-md bg-black text-white px-4 py-2 text-sm"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleOpen(null);
              }}
            >
              Add
            </button> */}
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <button className="rounded-md border border-gray-300 p-1 ">
                <MoreVertIcon className="h-5 w-5" />
              </button>
              {/* <button
              className="rounded-md border border-gray-300 p-1"
              onClick={() => {
                handleOpen(null);
              }}
            >
              <AddIcon className="h-5 w-5" />
            </button> */}
            </div>
          )}
        </div>

        <div className=" w-full  h-[calc(100%-60px)] md:h-[calc(100%-68px)]  mt-1 ">
          <div className=" w-full h-full flex flex-col gap-2">
            <div className=" w-full h-14 px-3 flex py-2 gap-2 shrink-0">
              <input
                type="text"
                name="search"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" shrink grow h-full w-full max-w-[min(100%,400px)] rounded-xl outline-none active:outline-none focus:outline-none px-4"
                placeholder="Product name"
              />
              <button
                onClick={resetSearch}
                className=" bg-[#512DC8] h-full w-20 flex items-center justify-center text-center text-sm text-white rounded-xl border-2 border-[#EFECFF]"
              >
                Reset
              </button>
            </div>

            <div className="w-full h-full pb-2 px-4  max-w-[100vw] md:max-w-[calc(100vw-288px)] overflow-auto">
              <table className=" border-collapse w-full bg-white rounded-lg text-center min-w-max">
                <tr>
                  <th className=" border border-gray-200 p-2">Product name</th>
                  <th className=" border border-gray-200 p-2">Product Brand</th>
                  <th className=" border border-gray-200 p-2">Quantity</th>
                  <th className=" border border-gray-200 p-2">
                    Supply Price ( per unit )
                  </th>
                  <th className=" border border-gray-200 p-2">
                    Retail Price ( per unit )
                  </th>
                  <th className=" border border-gray-200 p-2">
                    low stock level
                  </th>
                  {/* <th className=" border border-gray-200 p-2">Action</th> */}
                </tr>
                {loading ? (
                  <tr className=" h-40 ">
                    <td colSpan="6" className=" mx-auto">
                      {" "}
                      <CircularProgress
                        sx={{
                          color: "#000",
                          margin: "auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : filterData?.length > 0 ? (
                  filterData?.map((item) => {
                    return (
                      <tr key={item?.id}>
                        <td className=" border border-gray-200 p-2">
                          {item.product_details?.product_name}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {item.product_details?.brand_name ?? "-"}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {item.quantity}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {item.supply_price_per_unit}
                        </td>
                        <td className=" border border-gray-200 p-2">
                          {item.retail_price_per_unit}
                        </td>
                        <td
                          className={`border border-gray-200 p-2 ${
                            item?.run_low_quantity ? "text-red-500" : ""
                          }`}
                        >
                          {item.product_details?.low_stock_level}
                        </td>

                        {/* <td className=" border border-gray-200 p-2">
                        <div className=" flex items-center justify-center h-full gap-2">
                          <button onClick={() => handleEditOpen(item)}>
                            <Edit />
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteConfirmation(item.id);
                            }}
                          >
                            <Delete />
                          </button>
                        </div>
                      </td> */}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className=" p-2">
                      No data found
                    </td>
                  </tr>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventorySales;
