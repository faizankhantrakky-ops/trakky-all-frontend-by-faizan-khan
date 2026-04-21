import React from "react";
import HowTrakkyWorks from "./HowTrakkyWorks";
import Marque from "./Marque";
import Navbar from "./Navbar";
import Hero from '../parterPage/Hero/Hero';
import PartnerUs from "./PartnerUs";
import Review from "./Review";
import Faqs from "./Faqs";
import Footer from '../Common/Footer/FooterN'
import './Vendor.css'
function Vendor() {
  return (
    <div>
      <Navbar />
      <Hero/>
      <HowTrakkyWorks />
      <PartnerUs />
      <Marque />
      <Review />
      <Faqs />
      <Footer />
    </div>
  );
}

export default Vendor;
