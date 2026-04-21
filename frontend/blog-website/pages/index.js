import BlogCategory from "../components/homepage/BlogCategory";
import CTA from "../components/homepage/CTA";
import Navbar from "../components/Navbar";
import SingleBlogHome from "../components/homepage/SingleBlogHome";
import Trending from "../components/homepage/Trending";
import LatestPost from "../components/homepage/LatestPost";
import Footer from "../components/Footer";
import Head from "next/head";
import { getSeoData, getBlogCategories, getBlogs , getCities } from "../api";

export default function Index(props) {


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
            <BlogCategory categories={props.blogcategory} blogs={props.blogs} />
          </div>
        </div>

        <div className="trandingSection">
          <Trending categories={props.blogcategory} blogs={props.blogs} />
        </div>

        <SingleBlogHome blogs={props.blogs} />

        <LatestPost blogs={props.blogs} />

        <CTA />


        <Footer />

      </div>
    </>
  );
}

export async function getStaticProps() {
  const page = "home";
  const seoData = await getSeoData(page);
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

