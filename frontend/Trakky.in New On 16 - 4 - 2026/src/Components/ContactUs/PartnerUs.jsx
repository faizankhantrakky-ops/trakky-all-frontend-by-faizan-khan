// PartnerUs.jsx
import React from "react";
import styles from "./PartnerUs.module.css";
import { Link } from "react-router-dom";

export default function PartnerUs() {
  return (
    <div className={styles.Vendor_partnerus_main}>
      <div className={styles.Vendor_partnerus_content}>
        <p className={styles.Vendor_partnerus_p1}>How to get more customers?</p>
        <p className={styles.Vendor_partnerus_p2}>
          Create your salon profile and start receiving customers online
        </p>
        <Link to="/salonRegistration" rel="noreferrer">
          <button className={styles.Vendor_partnerus_button}>Register Salon</button>
        </Link>
      </div>
    </div>
  );
}
