import React from "react";
import styles from "./Nav.module.css";
import white from "../../Assets/images/contactus/logo.png";
import { Link } from "react-router-dom";
function Nav() {
  return (
    <>
      <div className={styles.Contactus_nav_nav}>
        <div className={styles.Contactus_nav_logo}>
          <Link to="/">
            <img
              src={white}
              alt="Trakky salon booking platform logo"
              className={styles.Contactus_nav_img}
            />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Nav;
