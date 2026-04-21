import style from "../styles/footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={style.footerDiv}>
      <div className={style.mainFooter}>
        <div className={style.footerInformations}>
          <div className={style.footerCompanyLogo}>
            <img src="/logo text purple 2.svg" alt="" />
          </div>
          <div className={style.footerDescription}>
            <p>
              Discover beauty & wellness industry with trakky on the our blogs
              platform.
            </p>
          </div>
          <div className={style.footerSocialLinks}>
            <Link href={"https://g.co/kgs/spvB6L"} target="_blank">
              <img src="/google.svg" alt="" />
            </Link>
            <Link
              href={"https://www.facebook.com/Trakky.in"}
              target="_blank"
            >
              <img src="/facebook.svg" alt="" />
            </Link>
            <Link
              href={"https://www.instagram.com/trakky_india/"}
              target="_blank"
            >
              <img src="/instagram.svg" alt="" />
            </Link>
            <Link
              href={"https://twitter.com/trakky5?t=I9aYy64mlfcTN5Liu28tzQ&s=08"}
              target="_blank"
            >
              <img src="/twitter.svg" alt="" />
            </Link>
            <Link
              href={
                "https://api.whatsapp.com/send?phone=916355167304&text=Hi%2C%0AI%27m%20looking%20for%20salon%20services.%20Can%20you%20please%20suggest%20me%20salons%20in%20the%20area%2C%20along%20with%20their%20contact%20information.%0AI%27m%20also%20interested%20to%20get%20offers%20details!%0A%0AI%20am%20waiting%20for%20response.%0A%0AThanks."
              }
              target="_blank"
            >
              <img src="/whatsapp_icon.svg" alt="" />
            </Link>
          </div>
          <div className=" w-[100%] flex items-center" style={{
            fontFamily: "Inter",
            fontSize: "0.8rem",
          }}>
          Customer care: <a href="tel:916355167304" style={{textDecoration:"none" , color:"black"}}>  &nbsp;  +91 63551 67304</a>
          </div>
        </div>
        <div className={style.footerLinks}>
          <div className={style.footerCol}>
            <h3>Company</h3>
            <div className={style.footerColItem}>
              <Link href="https://trakky.in/salonRegistration">
                Register Salon
              </Link>
              <Link href="https://spa.trakky.in/spaRegistration">Register Spa</Link>
              <Link href="https://trakky.in">For Salons</Link>
              <Link href="https://spa.trakky.in">For Spas</Link>
              <Link href="/"> Contact us</Link>
            </div>
          </div>
          <div className={style.footerCol}>
            <h3>Categories</h3>
            <div className={style.footerColItem}>
              <Link href={`https://trakky.in/ahmedabad/bridalsalons`}>
                Best salons
              </Link>
              <Link href={`https://trakky.in/ahmedabad/bridalsalons`}>
                Bridal
              </Link>
              <Link href={`https://trakky.in/ahmedabad/academysalons`}>
                Salon Academy
              </Link>
              <Link href={`https://trakky.in/ahmedabad/makeupsalons`}>
                Makeup salons
              </Link>
              <Link href={`https://trakky.in/ahmedabad/topratedsalons`}>
                Top rated
              </Link>
            </div>
          </div>
          {/* <div className={style.footerCol}>
            <h3>Company</h3>
            <div className={style.footerColItem}>
              <Link href="/">Travelling </Link>
              <Link href="/"> About Locato </Link>
              <Link href="/"> Success </Link>
              <Link href="/">Information</Link>
            </div>
          </div> */}
          {/* <div className={style.footerCol}>
            <h3>Company</h3>
            <div className={style.footerColItem}>
              <Link href="/">About us</Link>
              <Link href="/">Blogs</Link>
              <Link href="/">Privacy Policy</Link>
              <Link href="/">Salon Services</Link>
            </div>
          </div> */}
        </div>
      </div>
      <div className={style.footercopywriteText}>
        © Copyright 2024 Trakky. All Rights Reserved by Trakky Techno Services
        Pvt Ltd. &nbsp;&nbsp; | &nbsp;&nbsp; Handcrafted in India by Trakky
      </div>
    </div>
  );
};

export default Footer;
