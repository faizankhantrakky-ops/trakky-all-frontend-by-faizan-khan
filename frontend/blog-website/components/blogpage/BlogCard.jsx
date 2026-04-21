import React from "react";
import style from "../../styles/blogcard.module.css";
import Image from "next/image";
import Link from "next/link";

const BlogCard = ({blogs,category}) => {
    // Function to truncate the string to a specified number of characters
    const truncateString = (str, maxLength) => {
      return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
    };
  return (
    <div className={style.blogCardContainer}>
      {blogs.map((blog) => {
        return (
          <div className={style.blogCard}>
            <div className={style.BLogCardContent}>
              <span>{category}</span>
              <h3>{blog.title}</h3>
              <p>{truncateString(blog.meta_description,250)}</p>
              <Link
            href={`/${blog?.slug}`}
            style={{
              textDecoration: "none",
            }}
            >
              <button>Read Full Blog</button>
              </Link>
            </div>
            <div className={style.blogCardImage}>
             {
              
               <img
               src={blog.image_blog.url}
               alt="blog image"
              //  width={300}
              layout="fill"
              objectFit="cover"
             />
             }
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogCard;
