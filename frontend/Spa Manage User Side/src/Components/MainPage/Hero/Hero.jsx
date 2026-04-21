import React from "react";
import "./Hero.css";

import Header from "../../Common/Header/Header";
import SearchBar from "./SearchBar";
import Typed from "typed.js";
import { useRef, useEffect ,useState} from "react";

import img1 from "../../../Assets/images/hero/6.jpg";
import img2 from "../../../Assets/images/hero/7.jpg";
import img3 from "../../../Assets/images/hero/8.jpg";
import img4 from "../../../Assets/images/hero/9.jpg";
import img5 from "../../../Assets/images/hero/10.jpg";


const Hero = () => {
  const el = useRef(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [img1, img2, img3, img4, img5];

  const changeImage = () => {
    const nextImageIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
  
    document.querySelector(".b-g-h-image")?.classList.add("b-g-h-hidden");
  
    setTimeout(() => {
      setCurrentImageIndex(nextImageIndex);
  
      const imageElement = document.querySelector(".b-g-h-image");
      // imageElement.onload = () => {
        imageElement?.classList.remove("b-g-h-hidden");
      // };
    },400);
   };

  useEffect(() => {
    const interval = setInterval(changeImage, 5000);
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const currentImage = images[currentImageIndex];


  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Get the best massage therapy spa here!",
        "Select best therapies according to your need",
        "One stop solution for your relaxation & refreshment needs.",
      ],
      typeSpeed: 10,
      backSpeed: 5,
      backDelay: 3000,
      loop: true,
      showCursor: false,
    });

    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <section>
      <div className="video-bg">
        {/* <video
          src={require(``)}
          className="video-bg"
          alt=""
        /> */}
        {/* <video className="video-bg video-hide" autoPlay loop muted >
          <source src={require(`./../../../Assets/videos/trakky.mp4`)} />
        </video> */}
          <img
          src={currentImage}
          alt={`Image ${currentImageIndex + 1}`}
          className="b-g-h-image"
        />
      </div>

      <Header page="home" />

      <div className="hero__container">
        <div className="sentence__container">
          <p>
            <span ref={el}></span>
          </p>
          {/* <p>Discover and book beauty & wellness professionals near you</p> */}
        </div>

        <SearchBar />
      </div>
    </section>
  );
};

export default Hero;
