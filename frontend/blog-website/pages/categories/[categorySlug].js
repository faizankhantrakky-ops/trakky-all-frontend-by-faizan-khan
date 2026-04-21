import React from "react";
import Navbar from "../../components/Navbar";
import BlogCategory from "../../components/homepage/BlogCategory";
import LatestPost from "../../components/homepage/LatestPost";
import CTA from "../../components/homepage/CTA";
import Footer from "../../components/Footer";
import BlogCard from "../../components/blogpage/BlogCard";
import Head from "next/head";
import { getSeoData, getBlogCategories, getBlogByCategory, getCities, getBlogs } from "../../api";
import { useRouter } from "next/router";

const Category = (props) => {
  const router = useRouter();
  const { categorySlug } = router.query;

  // capitalize first letter of category
  const activeCategory = categorySlug.replace(/-/g, " ");
  console.log(props.blogs.length)
  console.log(props.allBlogs.length)

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
        <Navbar blogs={props.blogs} cities={props.cities} categories={props.blogcategory}/>
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

      <BlogCard blogs={props.blogs} category={`${activeCategory}`} />

      <LatestPost blogs={props.allBlogs} />

      <CTA />
      <Footer />
    </div>
    </>
  );
};

export async function getStaticPaths() {
  const blogCategories = await getBlogCategories();
  const paths = blogCategories.blogcategory.map((category) => ({
    params: { categorySlug: category.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({params}) {
  const page = "categoryList";
  const seoData = await getSeoData(page);
  const blogCategories = await getBlogCategories();
  const blogs = await getBlogByCategory(params.categorySlug , blogCategories.blogcategory);
  const cities = await getCities();
  const allBlogs = await getBlogs();
  return {
    props: {
      ...seoData,
      ...blogCategories,
      ...blogs,
      ...cities,
      // ...allBlogs,
      allBlogs: allBlogs.blogs,
    },
  };
}

export default Category;
