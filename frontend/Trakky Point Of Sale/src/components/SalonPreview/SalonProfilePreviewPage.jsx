import React from 'react';
import SalonForm from './SalonFrom/SalonFrom';
import MobilePreview from './MobilePreview/MobilePreview';

const SalonProfilePreviewPage = () => {
  return (
    <>
   <div className="w-full md:w-[calc(100vw-288px)] overflow-auto profile-preview-scroll">
   <div className="p-5"> 
        <h2 className="text-2xl font-bold">Setup Your Profile Page</h2>
        <p className="text-gray-500">Setup Your Profile Page On The Trakky Website</p>
      </div>
    <div className="flex gap-0 sm:gap-12 p-5">
      <SalonForm />
      {/* <MobilePreview /> */}
  </div>
   </div>
    </>
  );
}

export default SalonProfilePreviewPage;
