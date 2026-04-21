import React from "react";
import "./Marque.css";
import Marquee from "react-fast-marquee";
import one from "../../Assets/images/contactus/Spa_Logos/1.svg";
import two from "../../Assets/images/contactus/Spa_Logos/2.svg";
import three from "../../Assets/images/contactus/Spa_Logos/3.svg";
import four from "../../Assets/images/contactus/Spa_Logos/4.svg";
import five from "../../Assets/images/contactus/Spa_Logos/5.svg";
import six from "../../Assets/images/contactus/Spa_Logos/6.svg";
import seven from "../../Assets/images/contactus/Spa_Logos/7.svg";
import eight from "../../Assets/images/contactus/Spa_Logos/8.svg";
import nine from "../../Assets/images/contactus/Spa_Logos/9.svg";
import ten from "../../Assets/images/contactus/Spa_Logos/10.svg";
import eleven from "../../Assets/images/contactus/Spa_Logos/11.svg";
import twelve from "../../Assets/images/contactus/Spa_Logos/12.svg";
import thirteen from "../../Assets/images/contactus/Spa_Logos/13.svg";
import fourteen from "../../Assets/images/contactus/Spa_Logos/14.svg";
import fifteen from "../../Assets/images/contactus/Spa_Logos/15.svg";
function Marque() {
  const item = [
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    eleven,
    twelve,
    thirteen,
    fourteen,
    fifteen,
  ];
  return (
    <div className="Vendor_marques" id="our-partners">
      <div className="Vendor_faqtitle">Our Trusted Partners</div>
      <Marquee className="Vendor_marquee" speed="70">
        {item.map((item) => {
          return <img src={item} alt="" className="Vendor_img-marq" />;
        })}
      </Marquee>
    </div>
  );
}

export default Marque;
