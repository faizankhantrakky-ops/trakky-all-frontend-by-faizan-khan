"use client";

import Link from "next/link";
import style from "../../styles/trending.module.css";
import Image from "next/image";

const Trending = ({ blogs, categories }) => {

  categories = categories?.filter((category) => {
    return blogs.some((blog) => {
      return blog.categories_names.includes(category.name);
    }
    );
  });

  return (
    <div className={style.trendingDiv}>
      {categories?.map((category) => (
        
        <div className={style.trandingSlice}>
          <div className={style.trandingSliceHeader}>
            <h3>{category.name}</h3>
            <Link href={`/categories/${category.slug}`}>View All</Link>
          </div>
          <div className={style.trandingSliceList}>
            {blogs
              .filter((blogs) => {
                return blogs.categories_names.includes(category.name);
              })
              .slice(0, 3)
              .map((blog, index) => (
                <Link
                  href={`/${blog?.slug}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <div className={style.trandingSliceListItem} key={index}>
                    <div className={style.trandingSliceListItemImg}>
                      <img
                        src={blog.image_blog.url}
                        alt="blog image"
                        width={300}
                        height={300}
                      />
                    </div>
                    <div className={style.trandingSliceListItemContent}>
                      <span className={style.trandingItemCategory}>{blog.categories_names.join(' , ')}</span>
                      
                      <h4 className={style.trandingItemTitle}>{blog.title}</h4>
                      <p className={style.trandingItemDate}>{blog.date } - {blog?.read_time ? blog.read_time + " min read" : "0 min read"}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trending;
