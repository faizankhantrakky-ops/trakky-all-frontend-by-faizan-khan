import React, { useState, useEffect } from 'react';
import './CartHero.css';
import { FaCreditCard, FaMoneyBillWave, FaTrash } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import Header from "../Common/Header/Header";
import Footer from "../Common/Footer/FooterN";

// abc 

const initialServices = [
  { id: 1, name: 'Oil Massage Therapy sfsc dfdsd fds fdfs', price: 999, image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Oil Massage Therapy', price: 700, image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Oil Massage Therapy', price: 460, image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Oil Massage Therapy', price: 460, image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Oil Massage Therapy', price: 460, image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Oil Massage Therapy', price: 460, image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Oil Massage Therapy', price: 460, image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Oil Massage Therapy', price: 460, image: 'https://via.placeholder.com/50' },
];

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 786);
  const [services, setServices] = useState(initialServices);
  const [quantities, setQuantities] = useState(initialServices.map(() => 1));
  const [selectedDate, setSelectedDate] = useState('');

  const handleQuantityChange = (index, increment) => {
    const newQuantities = [...quantities];
    newQuantities[index] += increment;
    if (newQuantities[index] < 1) newQuantities[index] = 1;
    setQuantities(newQuantities);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const totalAmount = services.reduce((total, service, index) => total + service.price * quantities[index], 0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 786);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDeleteService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    const updatedQuantities = quantities.filter((_, i) => i !== index);
    setServices(updatedServices);
    setQuantities(updatedQuantities);
  };
  return (
   <>
   <Header/>
    <div className="Card-main-alter-code-container">
      <div className='Card-main-alter-code-main-container'>
        <div className='Card-main-alter-code-card-services-container'>
          <div className="Card-main-alter-code-card-hero-title">
            <h2>Booking Services</h2>
          </div>
          <div className="Card-main-alter-code-hero-cad-bottom-border"></div>
          <div className="Card-main-alter-code-table-wrapper">
            <div className='Card-main-alter-code-header'>
              <div className='Card-main-alter-code-header-item'>Service</div>
              <div className='Card-main-alter-code-header-item'>Price</div>
            </div>
            {isMobile ? (
              <>
            {services.map((service, index) => (
              <div key={service.id} className='Card-main-alter-code-service-item-container'>
                <div className='Card-main-alter-code-service-item'>
                  <img src={service.image} alt={service.name} />
                </div>
                <div className='Card-main-horizanl-row'></div>
                <div className='Card-main-alter-code-service-price'>
                <div>
                    <p className=''>{service.name}</p>
                  </div>
                  ₹ {service.price}
                  <div className='Card-main-alter-code-quantity-control'>
                    <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                    <span>{quantities[index]}</span>
                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                    <button onClick={() => handleDeleteService(index)} className="Card-main-alter-code-delete-button"><FaTrash /></button>
                  </div>
                </div>
              </div>
            ))}
            </>
          ) :(
            <>
             {services.map((service, index) => (
              <div key={service.id} className='Card-main-alter-code-service-item-container'>
                <div className='Card-main-alter-code-service-item'>
                  <img src={service.image} alt={service.name} />
                  <div>
                    <p>{service.name}</p>
                  </div>
                </div>
                {/* <div className='Card-main-horizanl-row'></div> */}
                <div className='Card-main-alter-code-service-price'>
               
                  ₹ {service.price}
                  <div className='Card-main-alter-code-quantity-control'>
                    <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                    <span>{quantities[index]}</span>
                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                    <button onClick={() => handleDeleteService(index)} className="Card-main-alter-code-delete-button"><FaTrash /></button>
                  </div>
                </div>
              </div>
            ))}
            </>
          ) }
          </div>
        </div>

        <div className="Card-main-alter-code-booking">
          <div className='Card-main-alter-code-booking-name-container'>
            <h2>Booking</h2>
          </div>
          <div className="Card-main-alter-code-date-picker">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy/MM/dd"
              className="date-picker-input"
              placeholderText="Select a date"
            />
          </div>
          <div className='Card-main-alter-code-gired-table-container'>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="Card-main-alter-code-containe">
                10:00 pm
              </div>
            ))}
          </div>
          <div className="Card-main-alter-code-payment">
            <h3>Payment</h3>
            <div className='Card-main-alter-code-card-Total-first'>
              <p>Total ({services.length} service/s)</p>
              <p>₹ {totalAmount}</p>
            </div>
            <div className='Card-main-alter-code-card-Total'>
              <p>+Taxes:</p>
              <p>₹ 0</p>
            </div>
            <div className='Card-main-alter-code-card-Total'>
              <p>-Discount (0%):</p>
              <p>₹ 0</p>
            </div>
            <div className='Card-main-alter-code-card-Total-last'>
              <p>Payable Amount:</p>
              <p className='Card-main-alter-code-text-black'> ₹ {totalAmount}</p>
            </div>
            <button className="Card-main-alter-code-promo-button">Have a promo code?</button>
            <div className="Card-main-alter-code-payment-options">
              <div className="Card-main-alter-code-payment-h3">
                <h1>Payment Options</h1>
              </div>
              <label>
                <div className="Card-main-alter-code-payment-label-content">
                  <FaCreditCard className="Card-main-alter-code-payment-icon" />
                  Pay Online
                </div>
                <input type="radio" name="payment" defaultChecked />
              </label>
              <label>
                <div className="Card-main-alter-code-payment-label-content">
                  <FaMoneyBillWave className="Card-main-alter-code-payment-icon" />
                  Pay at Salon
                </div>
                <input type="radio" name="payment" />
              </label>
            </div>
            <button className="Card-main-alter-code-confirm-button">Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default App;
