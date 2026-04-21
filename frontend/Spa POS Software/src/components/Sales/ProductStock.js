import React, { useEffect } from "react";
import { Search } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
const ProductStock = () => {
  return (
    <div className="flex flex-col gap-[15px]">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-[10px]">
      <div className=" pr-1 flex items-center mb-4 w-full">
      <TextField
          variant="outlined"
          placeholder="Search..."
          sx={{ width: 400, borderRadius: '16px', backgroundColor: 'white' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            style: { borderRadius: '16px' }
          }}
        />
      </div>
      <div className="flex max-sm:w-full max-sm:justify-end ">
      <button className="px-[15px] py-[10px] bg-[red] text-white rounded-xl">Add product stock record</button>
      </div>
      </div>
      <div className='w-full flex justify-center mt-4'>
      <div className="listAppointmentPOS">
          <table>
            <thead>
              <tr>
                <th>Product stock name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Started on</th>
                <th>Completed on</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Shampoo stock order</td>
                <td>Spa1</td>
                <td><span className="p-[6px] bg-[green] text-[white] rounded-[8px]">Completed</span></td>
                <td>22/5/2024</td>
                <td>25/5/2024</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
    </div>
  );
};

export default ProductStock;
