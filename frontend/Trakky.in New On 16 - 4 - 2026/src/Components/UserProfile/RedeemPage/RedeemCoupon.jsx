import React from 'react';
import './RedeemCoupon.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RedeemCoupon = () => {
  const CouponCard = ({ title, description, validity }) => {
    // Generate random color gradient
    const randomColor1 = getRandomColor();
    const randomColor2 = getRandomColor();
    const gradientStyle = {
      background: `linear-gradient(135deg, ${randomColor1}, ${randomColor2})`,
    };

    const handleCopyToClipboard = () => {
      navigator.clipboard.writeText('TRAKKYDUSSHERA');
      toast.success('Coupon code copied to clipboard!');
    };

    return (
      <div className="coupon-card" onClick={handleCopyToClipboard} style={gradientStyle}>
        <div className="coupon-title">
          <h3>{title}</h3>
          <h2 className="offerName">
            TRAKKYDUSSHERA
          </h2>
        </div>
        - - - - - - - - - - -
        <div className="coupon-description">
          <p>{description}</p>
          <p>Valid Till: {validity}</p>
        </div>
        <div className="circle1"></div>
        <div className="circle2"></div>

      </div>
    );
  };

  return (
    <>

      <div className="coupon-section">
        <h1>Redeem Coupon</h1>
        {/* <div className="coupon-input-cards">
      <div className="coupon-input">
        <input type="text" placeholder="Enter coupon code" />
      </div>
      <h1>Available Coupons</h1>
      <div className="coupon-container">
        
        <CouponCard
          title="Get 10% off"
          description="Get 10% off any hair styling service at Ascendtis Salon"
          validity="15th October"
        />
        <CouponCard
          title="Get 10% off"
          description="Get 10% off any hair styling service at Ascendtis Salon"
          validity="15th October"
        />
        <CouponCard
          title="Get 10% off"
          description="Get 10% off any hair styling service at Ascendtis Salon"
          validity="15th October"
        />
         <CouponCard
          title="Get 10% off"
          description="Get 10% off any hair styling service at Ascendtis Salon"
          validity="15th October"
        />
         <CouponCard
          title="Get 10% off"
          description="Get 10% off any hair styling service at Ascendtis Salon"
          validity="15th October"
        />
         <CouponCard
          title="Get 10% off"
          description="Get 10% off any hair styling service at Ascendtis Salon"
          validity="15th October"
        />
      

      </div>
      </div> */}

        <div>
          No Coupons Available
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

// Function to generate random color from given palette
const getRandomColor = () => {
  const colors = ['#512CB8', '#F4AD42', '#2CBB32']; // Orange, Purple, Green
  return colors[Math.floor(Math.random() * colors.length)];
};

export default RedeemCoupon;
