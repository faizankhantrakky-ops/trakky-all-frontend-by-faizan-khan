import React from "react";
import "./footern.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import TrakkyLogo from "../../../Assets/images/logos/Trakky logo purple.png";
import GoogleIcon from "../../../Assets/images/icons/google.svg";
// import FacebookIcon from "../../../Assets/images/icons/facebook.svg";
import InstagramIcon from "../../../Assets/images/icons/instagram.svg";
import TwitterIcon from "../../../Assets/images/icons/twitter.svg";
import Whatsappicon from "../../../Assets/images/icons/whatsapp_icon.svg";

const FooterN = (params) => {

  let city = params?.city || "ahmedabad";
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <div className="N-footer-container">
        <div className="N-footer-datails">
          <Link to="/" className="N-f-d-logo">
            <img src={TrakkyLogo} alt="Trakky salon booking platform logo" />
          </Link>

          <p>Book a salon appointment and receive great grooming services in our luxurious, trusted & top-rated salons.</p>
          <p style={{
            textAlign: "center",
            width: "100%",
            fontWeight: "500",
          }}>Social Links</p>
          <div className="N-socia-media-container ">
            <Link to={"https://g.co/kgs/spvB6L"} target="_blank">
              <img src={GoogleIcon} alt="visit Our Site On Google" />
            </Link>
            {/* <Link
            to={"https://www.facebook.com/Trakky.in"}
            target="_blank"
          >
            <img src={FacebookIcon} alt="" />
          </Link> */}
            <Link to={"https://www.instagram.com/trakky_india/"} target="_blank">
              <img src={InstagramIcon} alt="Visit Trakky Instagram Page" />
            </Link>
            <Link
              to={"https://twitter.com/trakky5?t=I9aYy64mlfcTN5Liu28tzQ&s=08"}
              target="_blank"
            >
              <img src={TwitterIcon} alt="Visit Trakky Twitter Page" />
            </Link>
            <Link
              to={
                "https://api.whatsapp.com/send?phone=916355167304&text=Hi%2C%0AI%27m%20looking%20for%20salon%20services.%20Can%20you%20please%20suggest%20me%20salons%20in%20the%20area%2C%20along%20with%20their%20contact%20information.%0AI%27m%20also%20interested%20to%20get%20offers%20details!%0A%0AI%20am%20waiting%20for%20response.%0A%0AThanks."
              }
              target="_blank"
            >
              <img src={Whatsappicon} alt="Connect With Trakky" />
            </Link>
          </div>
          <div className="N-customer-care-div ">
            Customer care: <a href="tel:916355167304">+91 63551 67304</a>
          </div>
        </div>
        <div className="N-footer-links">
          <div>
            <div className="col-1">
              <p>Company</p>

              <ul>
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
            <div className="col-2">
              <p>Support</p>
              <ul>
                <li>
                  <Link to={"/contactus"}>Contact Us</Link>
                </li>
                <li>
                  <Link to={"/merchant-page"}>Partner With Us</Link>
                </li>
                <li>
                  <Link to={"/privacypolicy"}>Privacy Policy</Link>
                </li>
                <li>
                  <Link to={"/terms-of-use"}>Terms of Use</Link>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <p>City</p>
              <ul>
                <li>
                  <Link to={"/ahmedabad/salons"}>Ahmedabad</Link>
                </li>
                <li>
                  <Link to={"/gandhinagar/salons"}>Gandhinagar</Link>
                </li>
                {/* <li>
                <Link to={"/bangalore/salons"}>Bangalore</Link>
              </li> */}

              </ul>
            </div>
            <div className="col-2">
              <p>Salon Categories</p>
              <ul>
                <li>
                  <Link to={`/${city}/topratedsalons`}>Top Rated Salons</Link>
                </li>
                <li>
                  <Link to={`/${city}/bridalsalons`}>Bridal Salons</Link>
                </li>
                <li>
                  <Link to={`/${city}/unisexsalons`}>Unisex Salons</Link>
                </li>
                <li>
                  <Link to={`/${city}/kidsspecialsalons`}>Kids Special Salons</Link>
                </li>
              </ul>
            </div>
          </div>
          {/* <div>
          <div className="col-3">
            {" "}
            <p>Support</p>
            <ul>
              <li>
                <Link to={"/contactus"}>Contact Us</Link>
              </li>
              <li>
                <Link to={"/merchant-page"}>Partner With Us</Link>
              </li>
              <li>
                <Link to={"/privacypolicy"}>Privacy Policy</Link>
              </li>
              <li>
                <Link to={"/terms-of-use"}>Terms of Use</Link>
              </li>
            </ul>
          </div>
          <div className="col-4">
            <p>Support</p>
            <ul>
              <li>
                <Link to={"/contactus"}>Contact Us</Link>
              </li>
              <li>
                <Link to={"/merchant-page"}>Partner With Us</Link>
              </li>
              <li>
                <Link to={"/privacypolicy"}>Privacy Policy</Link>
              </li>
              <li>
                <Link to={"/terms-of-use"}>Terms of Use</Link>
              </li>
            </ul>
          </div>
        </div> */}
        </div>

      </div>
      <div className="N-footer-copyright">
        <p>
          © Copyright 2025 <Link onClick={handleLogoClick} to={"/"}>Trakky</Link>. All Rights Reserved by
          <Link onClick={handleLogoClick} to={"/"}>Trakky</Link> Techno Services Pvt Ltd. | Handcrafted in India by{" "}
          <Link onClick={handleLogoClick} to={"/"}>Trakky</Link>
        </p>
      </div>
    </>
  );
};

export default FooterN;
