import Link from "next/link";
import Image from "next/image";

// import Swiper core and required modules
import { Navigation,Autoplay, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import style from "../../styles/singalbloghome.module.css";

const SingleBlogHome = ({ blogs }) => {

  const blogLimit = blogs?.slice(0, 7);
  
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      // navigation
      autoplay={
        {
          delay: 5000,
          disableOnInteraction: false
        }
      }
      pagination={{ clickable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log("slide change")}
    >
      {
        blogLimit?.map((blog , index) => (
        <SwiperSlide key={index}>
        <Link
          href={`/${blog.slug}`}
          style={{
            textDecoration: "none",
          }}
          className={style.blogDiv}
        >
          <div className={style.blogContent}>
            <span>{blog.categories_names[0]}</span>
            <h3>{blog.title}</h3>
            <p>{blog.meta_description}</p>

            <button>Read Full Blog</button>
          </div>
          <div className={style.blogImage}>
            <img
              src={blog.image_blog?.url}
              alt="img"
              // width={1920}
              // height={1080}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </Link>
      </SwiperSlide>
        ))  
    }
    </Swiper>
  );
};

export default SingleBlogHome;
