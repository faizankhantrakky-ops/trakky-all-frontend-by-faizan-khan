import React from "react";
import styles from "../styles/trending.module.css";
const Trending = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.heading}>
          <p className={styles.trend}>Trending in ahmadabad</p>
          <p className={styles.seemore}>See more</p>
        </div>
        <div className={styles.row}>
          <img className={styles.image} src="/Rectangle 2260.png" alt="img" />
          <div className={styles.pro}>
            <p className={styles.genre}>Mental Health</p>
            <p className={styles.disc}>
              Healing Stones: Finding the Right One for You
            </p>
            <p className={styles.date}>Fri, 28 Jan 2022</p>
          </div>
        </div>
        <div className={styles.row}>
          <img className={styles.image} src="/Rectangle 2260.png" alt="img" />
          <div className={styles.pro}>
            <p className={styles.genre}>Mental Health</p>
            <p className={styles.disc}>
              Healing Stones: Finding the Right One for You
            </p>
            <p className={styles.date}>Fri, 28 Jan 2022</p>
          </div>
        </div>
        <div className={styles.row}>
          <img className={styles.image} src="/Rectangle 2260.png" alt="img" />
          <div className={styles.pro}>
            <p className={styles.genre}>Mental Health</p>
            <p className={styles.disc}>
              Healing Stones: Finding the Right One for You
            </p>
            <p className={styles.date}>Fri, 28 Jan 2022</p>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.heading}>
          <p className={styles.trend}>Trending in bangalore</p>
          <p className={styles.seemore}>See more</p>
        </div>
        <div className={styles.row}>
          <img className={styles.image} src="/Rectangle 2260.png" alt="img" />
          <div className={styles.pro}>
            <p className={styles.genre}>Mental Health</p>
            <p className={styles.disc}>
              Healing Stones: Finding the Right One for You
            </p>
            <p className={styles.date}>Fri, 28 Jan 2022</p>
          </div>
        </div>
        <div className={styles.row}>
          <img className={styles.image} src="/Rectangle 2260.png" alt="img" />
          <div className={styles.pro}>
            <p className={styles.genre}>Mental Health</p>
            <p className={styles.disc}>
              Healing Stones: Finding the Right One for You
            </p>
            <p className={styles.date}>Fri, 28 Jan 2022</p>
          </div>
        </div>
        <div className={styles.row}>
          <img className={styles.image} src="/Rectangle 2260.png" alt="img" />
          <div className={styles.pro}>
            <p className={styles.genre}>Mental Health</p>
            <p className={styles.disc}>
              Healing Stones: Finding the Right One for You
            </p>
            <p className={styles.date}>Fri, 28 Jan 2022</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
