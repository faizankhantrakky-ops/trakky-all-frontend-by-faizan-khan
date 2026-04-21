import React, { useState, useContext, useEffect } from 'react';
import { Search } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/Auth';
import toast, { Toaster } from 'react-hot-toast';
import CircularProgress from "@mui/material/CircularProgress";
import { Delete, Edit } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from 'material-ui-confirm';
import './Inventory.css';

const SupplierList = ({ onEdit }) => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [SuppData, setSuppData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const confirm = useConfirm();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch data from the server initially
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://backendapi.trakky.in/spavendor/supplier/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSuppData(data);
          setFilterData(data);
        } else {
          toast.error('Error while fetching data');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data');
      }
      setLoading(false);
    };
  
    // Fetch data when the component mounts
    fetchData();
  
    // Handle the case where updated data is passed after editing
    if (location.state?.updatedSupplier) {
      const { updatedSupplier, isEdit } = location.state;
  
      // If it's an edit, update the supplier list with the new data
      if (isEdit) {
        setSuppData((prevSuppData) =>
          prevSuppData.map((supplier) =>
            supplier.id === updatedSupplier.id ? updatedSupplier : supplier
          )
        );
        setFilterData((prevFilterData) =>
          prevFilterData.map((supplier) =>
            supplier.id === updatedSupplier.id ? updatedSupplier : supplier
          )
        );
      }
    }
  }, [location.state]); 
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/spavendor/supplier/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuppData(SuppData.filter(supplier => supplier.id !== id));
        toast.success('Supplier deleted successfully');
      } else {
        toast.error('Error deleting supplier');
      }
    } catch (error) {
      toast.error('An error occurred while deleting supplier');
    }
  };
  const handleDeleteConfirmation = (id) => {
    confirm({ description: "Are you sure you want to delete this supplier?" })
      .then(() => handleDelete(id))
      .catch(() => console.log("Deletion cancelled."));
  };

  useEffect(() => {
    if (search === "") {
      setFilterData(SuppData);
    }
    else {
      setFilterData(SuppData.filter((item) =>
        item?.name.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, SuppData])

  const resetSearch = () => {
    setSearch("");
    setFilterData(SuppData);
  };
  // const handleEdit = (item) => {
  //   navigate('/sales/add-supplier', { state: { supplier: item } });
  // };

  return (
    <>
      <div className=" w-full h-14 px-3 flex py-2 gap-2 shrink-0">
        <input
          type="text"
          name="search"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" shrink grow h-full w-full max-w-[min(100%,400px)] rounded-xl outline-none active:outline-none focus:outline-none px-4"
          placeholder="Available Products..."
        />
        <button onClick={resetSearch} className=" bg-[#512DC8] h-full w-20 flex items-center justify-center text-center text-sm text-white rounded-xl border-2 border-[#EFECFF]">
          Reset
        </button>
      </div>

      <div className="w-full h-full pb-2 px-4  max-w-[100vw] md:max-w-[calc(100vw-288px)] overflow-auto">
        <table className=" border-collapse w-full bg-white rounded-lg text-center min-w-max">
          <tr>
            <th className=" border border-gray-200 p-2">Name</th>
            <th className=" border border-gray-200 p-2">Supplier Description</th>
            <th className=" border border-gray-200 p-2">
              First Name
            </th>
            <th className=" border border-gray-200 p-2">Last Name</th>
            <th className=" border border-gray-200 p-2">
              Mobile No
            </th>
            <th className=" border border-gray-200 p-2">Telephone</th>
            <th className=" border border-gray-200 p-2">Email</th>
            <th className=" border border-gray-200 p-2">Website</th>
            <th className=" border border-gray-200 p-2">Address</th>

            <th className=" border border-gray-200 p-2">Action</th>
          </tr>
          {loading ? (
            <tr className=" h-40 ">
              <td colSpan="11" className=" mx-auto">
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
                    {item.name}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.supplier_description}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.first_name}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.last_name}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.mobile_no}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.telephone}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.email}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.website}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    {item.address}
                  </td>
                  <td className=" border border-gray-200 p-2">
                    <div className=" flex items-center justify-center h-full gap-2">
                      <button  onClick={() => onEdit(item)}>
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
                  </td>
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
    </>
  );
};

export default SupplierList;
