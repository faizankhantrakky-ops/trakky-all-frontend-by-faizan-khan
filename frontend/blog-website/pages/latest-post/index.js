import React from "react";
import Navbar from "../../components/Navbar";
import BlogCategory from "../../components/homepage/BlogCategory";
import CTA from "../../components/homepage/CTA";
import Footer from "../../components/Footer";
import BlogCard from "../../components/blogpage/BlogCard";
import Head from "next/head";
import { getSeoData, getBlogCategories, getCities, getBlogs } from "../../api";

import style from '../../styles/index.module.css'

const LatestPost = (props) => {

    const activeCategory = "Latest-post";

    return (
        <>
            <Head>
                <title>{props.meta_title}</title>
                <meta name="description" content={props.meta_description} />
                <meta name="keywords" content={props.meta_keywords} />
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <div className="blog-index-container" style={{
                overflowX: "hidden",

            }}>
                <div className="indexHeaderDiv">
                    <Navbar blogs={props.blogs} cities={props.cities} categories={props.blogcategory} />
                </div>

                <div className="blogCategories">
                    <div className="blogCategoriesContent">
                        <BlogCategory
                            categories={props.blogcategory}
                            blogs={props.blogs}
                            active={`${activeCategory}`}
                        />
                    </div>
                </div>
                <div className={style.searchResultTag}>
                     Latest Post
                </div>
                <BlogCard blogs={props.blogs} category={`${activeCategory}`} />

                <CTA />
                <Footer />
            </div>
        </>
    );
};


export async function getStaticProps({ params }) {
    const page = "latestPost";
    //   const seoData = await getSeoData(page);
    const seoData = {
        meta_title: "Latest Post",
        meta_description: "Latest Post",
        meta_keywords: "Latest Post",
    }

    const blogCategories = await getBlogCategories();
    const blogs = await getBlogs();
    const cities = await getCities();
    return {
        props: {
            ...seoData,
            ...blogCategories,
            ...blogs,
            ...cities,
        },
    };
}

export default LatestPost;
