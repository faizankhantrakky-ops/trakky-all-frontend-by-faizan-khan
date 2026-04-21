import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import OfferSalonModal from '../../../SalonPage/SalonProfilePage/ModalComponent/OfferSalonModal';

const MemberShipList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const salon = {
    name: "Trakky Premium Salon",
    area: "Andheri West",
    city: "Mumbai"
  };

  const memberships = [
    {
      id: 1,
      mainImage: 'https://trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics/nationalhero/667b4c3d-2e0e-4447-9632-5f85cc1bb23f.webp',
      subImage1: 'https://placehold.co/300x300/png?text=Free+Cut',
      subImage2: 'https://placehold.co/300x300/png?text=20%+Off',
      name: "Gold Membership",
      actual_price: 1999,
      discount_price: 999,
      terms_and_conditions: "<ul><li>Valid for 3 months</li><li>Includes 2 free haircuts</li><li>20% off on all services</li></ul>",
      image: 'https://trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics/nationalhero/667b4c3d-2e0e-4447-9632-5f85cc1bb23f.webp'
    },
    {
      id: 2,
      mainImage: 'https://trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics/nationalhero/67b8b3e0-00fd-437b-85ed-c51912d3cae2.webp',
      subImage1: 'https://placehold.co/300x300/png?text=Free+Color',
      subImage2: 'https://placehold.co/300x300/png?text=15%+Off',
      name: "Silver Membership",
      actual_price: 1499,
      discount_price: 799,
      terms_and_conditions: "<ul><li>Valid for 2 months</li><li>Free hair color once</li><li>15% off on spa</li></ul>",
      image: 'https://trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics/nationalhero/67b8b3e0-00fd-437b-85ed-c51912d3cae2.webp'
    },
    {
      id: 3,
      mainImage: 'https://trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics/nationalhero/273f59a8-a416-4057-ac38-fe73ea6ae79c.webp',
      subImage1: 'https://placehold.co/300x300/png?text=Free+Spa',
      subImage2: 'https://placehold.co/300x300/png?text=25%+Off',
      name: "Platinum Membership",
      actual_price: 2999,
      discount_price: 1499,
      terms_and_conditions: "<ul><li>Valid for 6 months</li><li>Free spa session</li><li>25% off on all services</li></ul>",
      image: 'https://trakky-image-h6bea2g2ahf5hkav.z01.azurefd.net/trakky-new-pics/nationalhero/273f59a8-a416-4057-ac38-fe73ea6ae79c.webp'
    },
  ];

  const openModal = (offer) => {
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOffer(null);
  };

  return (
    <>
      {/* Slider - Unchanged */}
      <div className="max-w-[100%] mt-5 mx-[15px] md:max-w-[600px] md:mx-auto">
        <Swiper
          slidesPerView={1}
          navigation
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Navigation, Autoplay]}
          className="w-full"
        >
          {memberships.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center p-2">
                <div 
                  className="w-full max-w-[600px] mb-3 cursor-pointer" 
                  onClick={() => openModal(item)}
                >
                  <img
                    src={item.mainImage}
                    alt="Membership banner"
                    className="w-full h-auto rounded-lg object-cover shadow-sm"
                    style={{ borderRadius: '11px' }}
                  />
                </div>

                <div className="flex gap-3 w-full justify-center">
                  <div className="w-1/2 cursor-pointer" onClick={() => openModal(item)}>
                    <img
                      src={item.subImage1}
                      alt="Benefit 1"
                      className="w-full h-full rounded-lg object-cover shadow-sm aspect-square"
                      style={{ borderRadius: '11px' }}
                    />
                  </div>
                  <div className="w-1/2 cursor-pointer" onClick={() => openModal(item)}>
                    <img
                      src={item.subImage2}
                      alt="Benefit 2"
                      className="w-full h-full rounded-lg object-cover shadow-sm aspect-square"
                      style={{ borderRadius: '11px' }}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Sheet Modal - FULL WIDTH, NO LEFT SHIFT */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50" 
          onClick={closeModal}
        />

        {/* Modal Panel - Full Width Container */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
            modalOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{ 
            width: '100%', 
            maxHeight: '90vh',
            margin: 0
          }}
        >
          {/* Drag Handle */}
         
          {/* Scrollable Content - FULL WIDTH FOR OfferSalonModal */}
          <div 
            className="overflow-y-auto" 
            style={{ 
              maxHeight: 'calc(90vh - 40px)',
              paddingLeft: '0px',
              paddingRight: '0px'
            }}
          >
            {selectedOffer && (
              <div className="w-full">
                {/* OfferSalonModal - Full Width, No Padding */}
                <OfferSalonModal
                  data={selectedOffer}
                  handleClose={closeModal}
                  salon={salon}
                  type="offer"
                  onBookNow={() => closeModal()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberShipList;