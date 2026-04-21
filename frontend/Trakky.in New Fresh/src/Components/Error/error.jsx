import React from "react";
import { useEffect } from "react";
import { Helmet} from "react-helmet";
import styles from "./error.module.css";
import { Link } from "react-router-dom";
const Error = () => {
  useEffect(() => {
    document.title = "Page Not Found";
    document.description =
      "We can't seem to find the page you're looking for. Please check the URL for any typos.";
  }, []);

  return (
    <section className={styles.body}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h1>:) Page Not Found</h1>
          <p>
            We can't seem to find the page you're looking for. Please check the
            URL for any typos.
          </p>
          <ul className={styles.menu}>
            <li>  ~
              <a className={styles.link} href="#">
                Go to Homepage
              </a>
            </li>
            <li>
              <a className={styles.link} href="#">
                Visit our Blog
              </a>
            </li>
            <li>
              <a className={styles.link} href="#">
                Contact support
              </a>
            </li>
          </ul>
        </div>
        <div>
          <img
            className={styles.image}
            src="https://omjsblog.files.wordpress.com/2023/07/errorimg.png"
            alt="Failed to load content"
          />
        </div>
      </div>
    </section>
  );
};

export default Error;
