import React from "react";
import Footer from "../components/Footer";
import style from "../styles/blog.module.css";
import { getBlogBySlug, getBlogs } from "../api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProgressBar from "../components/ProgressBar";


const Blog = ({ blog, blogs }) => {

  const filteredBlogs = blogs.filter((b) => b.slug !== blog.slug);

  const categoryFilteredBlogs = filteredBlogs.filter((b) => b.categories_names.includes(blog.categories_names[0]));

  const suggestedBlogs = filteredBlogs.filter((blogs) => {
    return blogs.hashtags.some((hashtag) => blog.hashtags.includes(hashtag));
  });

  suggestedBlogs.push(...categoryFilteredBlogs);

  return (
    <>
      <ProgressBar />
      <Head>
        <title>{blog.meta_title}</title>
        <meta name="description" content={blog.meta_description} />
        <meta name="keywords" content={blog.meta_keywords} />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <div className={style.blogMainImage}>
        <img
          src={blog.image_blog.url}
          alt="blog image"
          // width={1920}
          // height={1080}
          layout='fill'
          objectFit='cover'
        />
        {<>
          <button
            onClick={() => {
              window.history.back();
            }
            }
            className={style.backButtonArrow}
          >
            <img src='/sidearrow.svg' alt="back" style={{
              fill: "white",
              filter: "none",
              height: "20px",
              cursor: "pointer",
            }} />
          </button>

          <div className={style.userDivActive}>
            {blog.categories_names.map((category) => (
              <span className={style.blogCategory}>{category}</span>
            ))}
            <h1>{blog.title}</h1>
          </div>
        </>
        }
      </div>
      <div className={style.blogContent}>
        <div className={style.userDetailsBigScreen}>
          {blog.categories_names.map((category) => (
            <span className={style.blogCategory}>{category}</span>
          ))}
          <h1>{blog.title}</h1>
        </div>
        <div className={style.blogUserDetails}>
          <div className={style.userInfo}>
            <span>{blog.author}</span>
            <span>Publish On {blog.date}</span>
            <span className={style.blogLength}>{blog?.read_time} min read</span>
          </div>
        </div>

        <div className={style.blogContentDetails}>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
        <div className={style.blogHashtags}>
          {blog.hashtags.map((tag) => (
            <span>{tag}</span>
          ))}
        </div>
       {suggestedBlogs?.length > 0 && <div className={style.relatedBlogs}>
          <h3>Related Blogs</h3>
          <Swiper slidesPerView={"auto"} className={style.relatedBlogContainer}>
            {
              suggestedBlogs.slice(0, 5)
                .map((blog, index) => (
                  <SwiperSlide
                    key={index}
                    className={style.relatedBlogCard}
                    style={{
                      backgroundImage: `linear-gradient(rgb(0, 0, 0, 0), rgb(0, 0, 0, 0.8)), url('${blog.image_blog.url}')`,
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
                      <div className={style.categoryTag}>
                        <span>{blog.categories_names[0]}</span>
                      </div>
                      <div className={style.blogTitle}>
                        <h3>{blog.title}</h3>
                      </div>
                      <div className={style.blogDetails}>
                        <div className={style.blogUserNameDate}>
                          <span>{blog.author}</span>
                          <span className={style.dot}></span>

                          <span>{blog.date}</span>
                          <span className={style.dot}></span>
                          <span>{blog.read_time} min read</span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>}
      </div>
      <Footer />
    </>
  );
};

// Implement getStaticPaths to generate paths at build time
export const getStaticPaths = async () => {
  const data = await getBlogs();
  const paths = data.blogs.map((blog) => ({
    params: { blogSlug: blog.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

// Implement getStaticProps to fetch data for each blog post
export async function getStaticProps() {
  try {
    const res = await fetch("http://your-api:8000/api/blogs")
    const data = await res.json()

    return {
      props: { data },
    }
  } catch (error) {
    console.log("API ERROR:", error)

    return {
      props: { data: [] }, // fallback
    }
  }
}

export default Blog;
