import React from "react";
import styles from "./Navbar.module.css";
import image1 from "../../Assets/images/contactus/logo.png";
export default function Navbar() {
  return (
    <div className={styles.Vendor_navbar_main}>
      <div className={styles.Vendor_navbar}>
        <a href="https://spa.trakky.in/" target="_blank" rel="noreferrer">
          <img
            src={image1}
            alt="Trakky salon booking platform logo"
            className={styles.Vendor_navbar_img}
          />
        </a>
      </div>
      <div className={styles.Vendor_navbar_content}>
        <p className={styles.Vendor_navbar_p1}>
          Partner with us and unlock the full potential of your salon
        </p>
        <p className={styles.Vendor_navbar_p2}>
          Discover endless possibilities in the salon world by participating
          with us
        </p>
      </div>
    </div>
  );
}
