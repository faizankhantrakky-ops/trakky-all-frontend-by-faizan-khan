import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import toast, { Toaster } from "react-hot-toast";
import AuthContext from '../../Context/Auth';

const CustomerEx = () => {
  const {authTokens, vendorData } = useContext(AuthContext);
  console.log(vendorData);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search input state

  useEffect(() => {
    getCustomerData();
  }, []);

  // useEffect(() => {
  //   if (vendorData && vendorData.spa) {
  //     getCustomerData(vendorData.spa); // Pass the spa ID to fetch data for that specific spa
  //   }
  // }, [vendorData]);

  const getCustomerData = async () => {
    setLoading(true);
    try {
      // Fetch experiences for the specific spa with Authorization header
      const response = await fetch(`https://backendapi.trakky.in/spas/client-image-pos/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.results);
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please check your authentication token.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete =(id) => {

  }


  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter experiences based on search query
// Filter experiences based on search query
const filteredExperiences = experiences.filter((exp) => {
  const name = exp?.service ? exp.service.toLowerCase() : '';
  const categoryName = exp?.category_data?.category_name ? exp.category_data.category_name.toLowerCase() : '';
  const address = exp.address ? exp.address.toLowerCase() : '';
  const area = exp.area ? exp.area.toLowerCase() : '';

  return (
    name.includes(searchQuery.toLowerCase()) ||
    categoryName.includes(searchQuery.toLowerCase()) ||
    address.includes(searchQuery.toLowerCase()) ||
    area.includes(searchQuery.toLowerCase())
  );
});

  return (
    <>
      <Toaster />
      <div className="bg-white p-6 rounded-lg w-full profile-preview-scroll">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer's Experience</h1>
          {/* <Button variant="contained" style={{ backgroundColor: 'black', color: 'white', boxShadow: 'none' }}>
            Add
          </Button> */}
        </div>

        <div className="flex justify-between items-center mb-6">
          <TextField
            variant="outlined"
            placeholder="Search by service name.."
            value={searchQuery} // Bind search input to state
            onChange={handleSearchChange} // Handle search input change
            className="w-full md:w-1/2"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* <Select
            variant="outlined"
            defaultValue="newest"
            className="w-48"
          >
            <MenuItem value="newest">Updated (newest first)</MenuItem>
            <MenuItem value="oldest">Updated (oldest first)</MenuItem>
          </Select> */}
        </div>

        {/* Add horizontal scrolling */}
      
          <TableContainer component={Paper}>
            <Table style={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>City</TableCell>
                  {/* <TableCell>Action</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                     <div className='flex justify-center w-full'>
                     <CircularProgress />
                     </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExperiences && filteredExperiences.length > 0 ? (
                    filteredExperiences.map((exp, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img src={exp.client_image} alt={exp.serviceName} className="w-20 h-20 object-cover rounded-md" />
                        </TableCell>
                        <TableCell>{exp.service}</TableCell>
                        <TableCell className="max-w-md">{exp?.category_data.category_name}</TableCell>
                        <TableCell className="max-w-md">{exp?.description}</TableCell>
                        <TableCell>{exp?.category_data.city}</TableCell>
                        {/* <TableCell>
                          <IconButton color="error" aria-label="delete"
                          onClick={()=> handleDelete(exp.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No customer experiences found.
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
      </div>
    </>
  );
};

export default CustomerEx;
