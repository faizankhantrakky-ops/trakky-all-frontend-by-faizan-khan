"use client";

import React, { useState, useEffect } from "react";
import style from "../../styles/latestpost.module.css";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const LatestPost = ({ blogs }) => {
  const latestBlogs = blogs?.slice(0, 10);

  const [swiper, setSwiper] = useState(null);

  // useEffect(() => {
  // if (swiper && swiper !== null) {
  //   const interval = setInterval(() => {
  //     swiper?.slideNext();
  //   }, 2500);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }
  // }, [swiper]);
  console.log("image", blogs?.image_blog)

  return (
    <div className={style.latestPostDiv}>
      <div className={style.latestPostHeader}>
        <h3>
          Latest <span style={{ color: "#592DC8" }}>Posts</span>
        </h3>
        <Link href={'/latest-post'} className={style.latestPostHeaderLink}>
          <span>View All</span>
          <img src="/forwardarrow.svg" alt="img" /></Link>

      </div>

      <Swiper
        slidesPerView={"auto"}
        className={style.latestPostList}
        onSwiper={(swiper) => setSwiper(swiper)}
      >
        {latestBlogs?.map((blog, index) => (
          <>
            <SwiperSlide className={style.latestPostListItem} key={index}>
              <Link
                href={`/${blog?.slug}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <div className={style.latestPostListItemImg}>
                  <img
                    src={blog?.image_blog?.url}
                    alt="img"
                    // width={1920}
                    // height={1080}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <div className={style.latestPostListItemContent}>
                  <h4 className={style.latestPostItemTitle}>{blog?.title}</h4>
                  <p className={style.latestPostItemDate}>
                    {blog?.date} - {blog?.read_time} min read
                  </p>
                  <p className={style.latestPostItemPara}>
                    {blog?.meta_description}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </div>
  );
};

export default LatestPost;
