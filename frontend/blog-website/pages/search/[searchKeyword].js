// pages/search/[searchKeyword].js

import style from '../../styles/index.module.css'
import Head from "next/head";
import Navbar from "../../components/Navbar";
import CTA from "../../components/homepage/CTA";
import Footer from "../../components/Footer";
import BlogCard from "../../components/blogpage/BlogCard";

import { getBlogCategories, getBlogsBySearch, getCities } from "../../api/index";

export default function Search(props) {
  
  return (
    <div
    className="blog-index-container"
    style={{
      overflowX: "hidden",
    }}>
      <div className="indexHeaderDiv" style={{
        height:"380px",
      }}>
        <Navbar blogs={props.blogs || []} cities={props.cities || []} />
      </div>
      <div className={style.searchResultTag}>
      {props?.params?.searchKeyword ?  props.params.searchKeyword : "Search Results"}
      </div>

      <BlogCard blogs={props.blogs || []} category={''} />

      <CTA />
      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
    // Here, you may fetch data from your API to determine the possible search keywords
    const possibleKeywords = ['beauty', 'beauty-salon', 'unisex-salon', 'salon-in-ahmedabad', 'salon-in-prahlad-nagar', 'male-salon', 'female-salon', 'salon-in-sindhu-bhavan', 'beauty-salon-in-bopal', 'beauty-salon-in-sindhu-bhavan', 'salon-in-bopal', 'spa-in-bopal', 'spa-in-sindhu-bhavan', 'spa-in-gota', 'salon-in-gota', 'spa-in-prahlad-nagar', 'salon-near-ashram-road', 'spa-near-ashram-road', 'best-salon-in-ahmedabad', 'spa-in-ahmedabad', 'best-spa-in-ahmedabad', 'spa-in-gandhinagar', 'best-spa-in-gandhinagar','salon']; 

    // Map the possible keywords to the required format for paths
    const paths = possibleKeywords.map(keyword => ({ params: { searchKeyword: keyword } }));

    return {
        paths,
        fallback: false,
      };
}

export async function getStaticProps({ params }) {
    const seoData = {
        meta_title: "Latest Post",
        meta_description: "Latest Post",
        meta_keywords: "Latest Post",
    }

    const blogCategories = await getBlogCategories();
    const blogs = await getBlogsBySearch(params?.searchKeyword.split('-').join(' ') || ''); 
    const cities = await getCities();
    return {
        props: {
            ...seoData,
            ...blogCategories,
            ...blogs,
            ...cities,
            params : params,
        },
    };
}
