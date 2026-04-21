import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';

const Booking = () => {
  return (
   <>
  <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-2xl">
      <div className="flex items-center justify-between shadow-lg p-3 rounded-sm">
        <div className="flex items-center">
          <img src="/api/placeholder/40/40" alt="Service icon" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h3 className="font-semibold text-sm">Dry massage th</h3>
            <p className="text-gray-500 text-xs">2 services</p>
          </div>
        </div>
        <div className="flex items-center flex-col">
  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex flex-col items-center">
    ₹389
    <span>View Cart</span>
  </button>
</div>

      </div>
    </div>
   </>
  );
};

export default Booking;