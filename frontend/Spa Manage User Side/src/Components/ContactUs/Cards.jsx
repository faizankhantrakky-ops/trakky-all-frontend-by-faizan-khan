import React from 'react';
import styles from './Cards.module.css';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Cards() {
  return (
    <div className={styles.Contactus_main}>
      {/* Report a Concern Section */}
      <div className={styles.Contactus_card}>
        <p className={styles.Contactus_heading}>Report a Concern</p>
        <p className={styles.Contactus_number}>
          <WhatsAppIcon /> <span style={{ paddingLeft: '5px' }}>
            <a href="tel:6355167304">+91 6355167304</a>
          </span>
        </p>
        <p className={styles.Contactus_number}>
          <WhatsAppIcon /> <span style={{ paddingLeft: '5px' }}>
            <a href="tel:9328382710">+91 9328382710</a>
          </span>
        </p>
        <p className={styles.Contactus_number}>
          <MailIcon /> <span style={{ paddingLeft: '5px' }}>customercare@trakky.in</span>
        </p>
      </div>

      {/* Partner Registration Section */}
      <div className={styles.Contactus_card}>
        <p className={styles.Contactus_heading}>
          For Partner Registration
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to='/vendor-page'>
            <button className={styles.Contactus_button}>Visit Now</button>
          </Link>
        </div>
      </div>

      {/* Feedback Section */}
      <div className={styles.Contactus_card}>
        <p className={styles.Contactus_heading}>Give Us Feedback</p>
        <form className={styles.Contactus_form}>
          <textarea
            className={styles.Contactus_textarea}
            placeholder="Your feedback..."
            rows="4"
          />
          <button type="submit" className={styles.Contactus_button} style={{
            display:'flex', 
            margin:"auto",
            marginTop:'10px'
          }}>Submit</button>
        </form>
      </div>
      {/* Social Media Section */}
      <div className={styles.Contactus_card}>
        <p className={styles.Contactus_heading}>Follow Us</p>
        <div className={styles.SocialMediaLinks}>
      <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
        <FaFacebook size={24} />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
        <FaInstagram size={24} />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
        <FaTwitter size={24} />
      </a>
    </div>
      </div>
    </div>
  );
}

export default Cards;
