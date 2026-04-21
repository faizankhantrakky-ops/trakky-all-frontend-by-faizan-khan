import React from 'react';
import SpaForm from './SpaFrom/SpaFrom';
import MobilePreview from './MobilePreview/MobilePreview';

const SpaProfilePreviewPage = () => {
  return (
    <>
   <div className="w-full md:w-[calc(100vw-288px)] overflow-auto profile-preview-scroll">
   <div className="p-5"> 
        <h2 className="text-2xl font-bold">Setup your profile page</h2>
        <p className="text-gray-500">Setup your profile page on the Trakky website</p>
      </div>
    <div className="flex gap-0 sm:gap-12 p-5">
      <SpaForm />
      {/* <MobilePreview /> */}
  </div>
   </div>
    </>
  );
}

export default SpaProfilePreviewPage;
