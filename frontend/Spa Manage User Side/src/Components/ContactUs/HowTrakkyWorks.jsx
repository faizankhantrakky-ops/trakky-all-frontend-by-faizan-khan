import React from "react";
import styles from "./HowTrakkyWorks.module.css";
import photo1 from "../../Assets/images/contactus/step-1.png";
import photo2 from "../../Assets/images/contactus/step-2.png";
import photo3 from "../../Assets/images/contactus/step-3.png";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailIcon from '@mui/icons-material/Mail';
export default function HowTrakkyWorks() {
  return (
    <div className={styles.HowTrakkyWorks_main_div}>
      <div className={styles.HowTrakkyWorks_content}>
        <p className={styles.HowTrakkyWorks_p1}>Get More Customers For Your Spa With Trakky</p>
        <div className={styles.HowTrakkyWorks_card}>
          <div className={styles.HowTrakkyWorks_ind_card}>
            <div className={styles.HowTrakkyWorks_card_img}>
              <div className={styles.HowTrakkyWorks_image}>
                <img src={photo1} alt="photo" />
              </div>
            </div>
            <div className={styles.HowTrakkyWorks_card_content}>
              <p className={styles.HowTrakkyWorks_p2}>Step 1</p>
              <p className={styles.HowTrakkyWorks_p3}>Call Us</p>
              <p className={styles.HowTrakkyWorks_p4}>
               
                <span style={{paddingLeft:'5px'}}><a href="tel:6355167304" className={styles.HowTrakkyWorks_a}>+91 6355167304 </a></span>
              <br/>
              <span style={{paddingLeft:'5px'}}> <a href="tel:9328382710" className={styles.HowTrakkyWorks_a}>+91 9328382710</a></span>
              </p>
            </div>
          </div>
          <div className={styles.HowTrakkyWorks_ind_card}>
            <div className={styles.HowTrakkyWorks_card_img}>
              <div className={styles.HowTrakkyWorks_image}>
                <img src={photo2} alt="photo" />
              </div>
            </div>
            <div className={styles.HowTrakkyWorks_card_content}>
              <p className={styles.HowTrakkyWorks_p2}>Step 2</p>
              <p className={styles.HowTrakkyWorks_p3}>Become Trakky Partner</p>
              <p className={styles.HowTrakkyWorks_p4}>
                Registered your Spa on Trakky and get verified 
              </p>
            </div>
          </div>
          <div className={styles.HowTrakkyWorks_ind_card}>
            <div className={styles.HowTrakkyWorks_card_img}>
              <div className={styles.HowTrakkyWorks_image}>
                <img src={photo3} alt="photo" />
              </div>
            </div>
            <div className={styles.HowTrakkyWorks_card_content}>
              <p className={styles.HowTrakkyWorks_p2}>Step 3</p>
              <p className={styles.HowTrakkyWorks_p3}>Get More Customers</p>
              <p className={styles.HowTrakkyWorks_p4}>
              Get more customers by collaborating with Trakky
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
