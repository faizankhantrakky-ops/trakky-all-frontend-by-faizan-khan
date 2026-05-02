import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

import TrakkyLogo from "../../../Assets/images/logos/Trakky logo purple.png";
import GoogleIcon from "../../../Assets/images/icons/google.svg";
import FacebookIcon from "../../../Assets/images/icons/facebook.svg";
import InstagramIcon from "../../../Assets/images/icons/instagram.svg";
import TwitterIcon from "../../../Assets/images/icons/twitter.svg";
import Whatsappicon from "../../../Assets/images/icons/whatsapp_icon.svg"

const Footer = ({city}) => {
  return (
    <div className="footer__container">
      <div className="footer__main_container">
        <div className="footer__column1">
          <Link to="/">
            <img src={TrakkyLogo} alt="Trakky" />
          </Link>

          <p>Experience best Salon Services with Salons of Trakky</p>

          <div className="social_media__container ">
            <ul>
              <li style={{ marginLeft: 0 }}>
                <Link to={"https://g.co/kgs/spvB6L"} target="_blank">
                  <img src={GoogleIcon} alt="" />
                </Link>
              </li>
              <li>
                <Link
                  to={"https://www.facebook.com/Trakky.in"}
                  target="_blank"
                >
                  <img src={FacebookIcon} alt="" />
                </Link>
              </li>
              <li>
                <Link
                  to={"https://www.instagram.com/trakky_india/"}
                  target="_blank"
                >
                  <img src={InstagramIcon} alt="" />
                </Link>
              </li>
              <li>
                <Link
                  to={
                    "https://twitter.com/trakky5?t=I9aYy64mlfcTN5Liu28tzQ&s=08"
                  }
                  target="_blank"
                >
                  <img src={TwitterIcon} alt="" />
                </Link>
              </li>
              <li>
                <Link
                  to={
                    "https://api.whatsapp.com/send?phone=916355167304&text=Hi%2C%0AI%27m%20looking%20for%20salon%20services.%20Can%20you%20please%20suggest%20me%20salons%20in%20the%20area%2C%20along%20with%20their%20contact%20information.%0AI%27m%20also%20interested%20to%20get%20offers%20details!%0A%0AI%20am%20waiting%20for%20response.%0A%0AThanks."
                  }
                  target="_blank"
                >
                  <img src={Whatsappicon} alt="" />
                </Link>
              </li>
            </ul>
          </div>
          <div className=" w-[100%]  text-[.8rem] flex items-center font-semibold customer_care_div ">
          Customer care: <a href="tel:916355167304">+91 63551 67304</a>
          </div>
        </div>
        {/* <div className="footer__column2">
          <p>Catogories</p>

          <ul>
            <li>
              <Link to={"/salonnearyou"}>Salon near you</Link>
            </li>
            <li>
              <Link to={"/toprated"}>Top rated</Link>
            </li>
            <li>
              <Link to={"/bridal"}>Luxurious</Link>
            </li>
            <li>
              <Link to={"/trending"}>Trending</Link>
            </li>
          </ul>
        </div> */}
        {/* <div className="footer__column3">
          <p>What we offer</p>

          <ul>
            <li>
              <Link to={"/"}>Services</Link>
            </li>
            <li>
              <Link to={"/offers"}>Offers</Link>
            </li>
            <li>
              <Link to={"/bridalsalon"}>Best salons</Link>
            </li>
            <li>
              <Link to={"/"}>Help Center</Link>
            </li>
          </ul>
        </div> */}
        <div className="footer__column4">
          <p>Company</p>

          <ul>
            {/* <li><a href="#categories">Categories</a></li> */}

            <li>
              <Link to="/salonRegistration">Register Salon</Link>
            </li>

            <li>
              <Link to={"https://blogs.trakky.in"}>Blogs</Link>
            </li>

            <li>
              <Link to={"https://spa.trakky.in"}>For Spas</Link>
            </li>
          </ul>
        </div>
        <div className="footer__column5">
          <p>Support</p>

          <ul>
            <li>
              <Link to={"/contactus"}>Contact Us</Link>
            </li>
            <li>
              <Link to={"/vendor-register"}>Partner With Us</Link>
            </li>
            <li>
              <Link to={"/privacypolicy"}>Privacy Policy</Link>
            </li>
            <li>
              
              <Link to={"/terms-of-use"}>Terms of Use</Link>
            </li>
          </ul>
        </div>
      </div>
            <div className="w-[100%] flex md:hidden justify-center items-center my-[20px]">Customer care: +9163551 67304</div>
      <div className="footer__copyright">
        <p>
          © Copyright 2024 <Link to={"/"}>Trakky</Link>. All Rights Reserved by
          Trakky Techno Services Pvt Ltd. | Handcrafted in India by{" "}
          <Link to={"/"}>Trakky</Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
