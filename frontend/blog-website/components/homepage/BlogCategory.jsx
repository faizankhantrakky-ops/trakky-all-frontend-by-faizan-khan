"use client";

import React, { useState, useEffect } from "react";
import style from "../../styles/blogcategory.module.css";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const BlogCategory = ({ categories, blogs, active }) => {
  // Filter active category

  const activeCategory = categories?.find(
    (category) => category?.name?.toLowerCase() === active?.toLowerCase()
  ) || { name: "Home" };

  if (active === "Latest-post") {
    activeCategory.name = "Latest Post";
  }

  // Generate category options including "Home"
  const categoryOptions = [
    {
      name: "Home",
      slug: "",
    },
    ...(categories?.map((category) => ({
      name: category?.name,
      slug: category?.slug,
    })) || []),
  ];

  return (
    <div className={style.categoryMain}>
      <div className={style.categoryOptions}>
        <div className={style.categoryList}>
          {categoryOptions.map((category, index) => (
            <Link
              href={
                category.name === "Home" ? "/" : `/categories/${category.slug}`
              }
              style={{
                textDecoration: "none",
              }}
              key={index}
            >
              <div
                key={index}
                className={`${style.categoryItem} ${
                  activeCategory?.name === category.name ? style.active : ""
                }`}
              >
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Swiper slidesPerView={"auto"}>
        {blogs?.map((blog, index) => (
          <SwiperSlide
            key={index}
            className={style.blogMainCard}
            
            style={{
              backgroundImage: `linear-gradient(rgb(0, 0, 0, 0), rgb(0, 0, 0, 0.8)), url(${blog?.image_blog.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Link
              href={`/${blog?.slug}`}
              style={{
                textDecoration: "none",
              }}
            >
              {activeCategory.name !== "Home" && (
                <div className={style.categoryTag}>
                  <span>{activeCategory.name}</span>
                </div>
              )}
              <div className={style.blogTitle}>
                <h3>{blog?.title}</h3>
              </div>
              <div className={style.blogDetails}>
                <div className={style.blogUserNameDate}>
                  <span>{blog?.author}</span>
                  <span className={style.dot}></span>
                  <span className={style.dateBlog}>{blog?.date}</span>
                  <span className={style.dot}></span>
                  <span>
                    {blog?.read_time ? blog.read_time + " min read" : "0" + " min read"}
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* <div className={style.categoryLink}>
        <Link href="/">See More</Link>
      </div> */}
    </div>
  );
};

export default BlogCategory;
