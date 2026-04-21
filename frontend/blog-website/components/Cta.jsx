import React from "react";
import styles from "../styles/cta.module.css";

const CTA = () => {
  return (
    <section className={styles.cta}>
      <section className={styles.wrapper}>
        <form
          method="post"
          action="https://backendapi.trakky.in/salons/email/"
          encType="multipart/form-data"
        >
          <img
            className={styles.mailImg}
            src="./IconFrame.png"
            alt="Mail Icon"
          />
          <div className={styles.ctaContentWrapper}>
            <p className={styles.ctaText}>Do cool things with us.</p>
            <div className={styles.abc}>
              <p className={styles.ctaDesc}>
                Stay in the loop with updates from our team and community. Once
                a month.
              </p>
            </div>
          </div>
          <input type="email" placeholder="Enter your email" name="email" />
          <button type="submit" className={styles.subButton}>
            <p className={styles.buttonText}>Subscribe to newsletter</p>
          </button>
        </form>
      </section>
    </section>
  );
};

export default CTA;
