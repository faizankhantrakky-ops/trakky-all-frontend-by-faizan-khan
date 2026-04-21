import React, { useState, useContext, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import AuthContext from "../Context/AuthContext"; // Assuming your context is in this path
import toast, { Toaster } from "react-hot-toast";

const CustomPermissions = ({
  permissionsData,
  selectedUserData,
  objId,
  closeEditModal,
  toastMessageHandler,
}) => {
  const permissions = [
    {
      name: "General",
      detail:
        "Dashboard, Customers, Create User, Salon Scores, Trakky Ratings, Contact Us",
      value: "general-permission",
    },
    {
      name: "Inquiry",
      detail: "Inquiry permissions ",
      value: "inquiry-permission",
    },
    { name: "Salon", detail: "Salon permissions ", value: "salons-permission" },
    {
      name: "Salons Categories",
      detail: "Salon Categories permissions ",
      value: "salons-category-permission",
    },
    {
      name: "Priority Management",
      detail: "Priority Management permissions ",
      value: "salon-priority-management-permission",
    },
    {
      name: "Master service/category",
      detail: "Master service/category permissions ",
      value: "master-permission",
    },
    {
      name: "product permission",
      detail: "product permission ",
      value: "master-product-permission",
    },
    {
      name: "Category",
      detail: "Category permissions ",
      value: "category-permission",
    },
    {
      name: "Services",
      detail: "Services permissions ",
      value: "service-permission",
    },
    {
      name: "National/City Hero Offers",
      detail: "National/City Hero Offers permissions ",
      value: "national-city-hero-offers-permission",
    },
    {
      name: "City Offers",
      detail: "City Offers permissions ",
      value: "city-offers-permission",
    },
    {
      name: "Salon Specific",
      detail: "Salon Specific permissions ",
      value: "salon-specific-permission",
    },
    {
      name: "National Specific",
      detail: "National Specific permissions ",
      value: "national-specific-permission",
    },
    {
      name: "Daily Updates",
      detail: "Daily Updates permissions ",
      value: "daily-updates-permission",
    },
    {
      name: "Client Work Photos",
      detail: "Client Work Photos permissions ",
      value: "client-work-photos-permission",
    },
    {
      name: "Cities/Areas",
      detail: "Cities/Areas permissions ",
      value: "city-area-permission",
    },
    { name: "Blogs", detail: "Blogs permissions ", value: "blogs-permission" },
    {
      name: "Vendors",
      detail: "Vendors permissions ",
      value: "vendor-permission",
    },
    { name: "Logs", detail: "Logs permissions ", value: "logs-permission" },
    { name: "Pos salon Request", detail: "Pos Salon requst permissions ", value: "pos-salon-requst-permission" },
    {
      name: "Pos Requests",
      detail: "Pos Requests permissions ",
      value: "pos-request-permission",
    },
  ];

  const { authTokens } = useContext(AuthContext); // Get the authTokens from context
  const [selectedUser, setSelectedUser] = useState(selectedUserData || "");
  const [selectedPermissions, setSelectedPermissions] = useState(
    permissionsData || []
  );

  const [allUsers, setAllUsers] = useState([]);

  const getUsersData = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.ok) {
        const result = await response.json();

        let filteredUsers = result.filter((user) => user.is_superuser);

        console.log("Success:", result);
        setAllUsers(filteredUsers);
      } else {
        toast.error(
          `Error fetching users data : ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      // console.error("Error:", error);
      toast.error(`Error fetching users data : ${error.message} `, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handlePermissionChange = (event) => {
    const { value } = event.target;
    setSelectedPermissions((prev) =>
      prev.includes(value)
        ? prev.filter((perm) => perm !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      user: selectedUser,
      access: selectedPermissions,
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/custom-user-permissions${selectedUserData ? `/${objId}/` : "/"}`,
        {
          method: selectedUserData ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.status === 400) {
        toast.error(result?.user);
      }

      if (response.ok) {

        if (selectedUserData) {
          toastMessageHandler("Permission Updated Successfully", "success");
          closeEditModal();
        }

        console.log("Success:", result);
        setSelectedPermissions([]);
        setSelectedUser("");


        // Optionally display a success message or perform further actions
      } else {
        console.error("Error:", response.statusText);
        // Optionally display an error message

      }
    } catch (error) {
      console.error("Error:", error);
      // Optionally display an error message
    }
  };



  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <>
      <Toaster />
      <div className="p-2 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-center">
              Add Custom Permissions
            </h3>
          </div>
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-full flex justify-between items-center">
                <div className=" text-xl font-semibold">Permissions</div>

                <FormControl
                  variant="outlined"
                  sx={{
                    margin: "8px 2px",
                    minWidth: 140,
                    width: "fit-content",
                    maxWidth: 240,
                  }}
                  size="small"
                >
                  <InputLabel id="user-select-label">Select User</InputLabel>
                  <Select
                    labelId="user-select-label"
                    label="Select User"
                    value={selectedUser}
                    onChange={handleUserChange}
                    disabled={selectedUserData}
                  >
                    {allUsers.map((user, index) => (
                      <MenuItem key={index} value={user.id}>
                        {user?.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {permissions.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start space-x-2"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission.value)}
                        onChange={handlePermissionChange}
                        value={permission.value}
                      />
                    }
                    label={permission.name}
                    data-tooltip-id={`tooltip-${index}`}
                    data-tooltip-content={permission.detail}
                    className="my-anchor-element"
                  />
                  <Tooltip
                    id={`tooltip-${index}`}
                    type="dark"
                    effect="float"
                    style={{
                      zIndex: 9999,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomPermissions;
