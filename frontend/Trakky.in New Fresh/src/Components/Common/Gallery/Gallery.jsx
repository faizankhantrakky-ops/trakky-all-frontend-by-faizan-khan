import React, { useState } from "react";
import "./Gallery.css";

import { IoMdClose } from "react-icons/io";

const Gallery = (props) => {
  var salon = props.salon;
  const data = [salon.main_image, ...salon.mul_images.map((obj) => obj.image)];

  const [model, setModel] = useState(false);
  const [tempimgSrc, setTempimgSrc] = useState("");

  const getImg = (imgSrc) => {
    setTempimgSrc(imgSrc);
    setModel(true);
  };

  return (
    <>
      <div className={model ? "model open" : "model"}>
        <img
          src={tempimgSrc}
          alt="Best Salon In Ahmedabad For Beauty, Hair, And Bridal Services"
        />
        <IoMdClose onClick={() => setModel(false)} />
      </div>

      <div className="gallery">
        {data.map((item, index) => {
          return (
            <div className="pics" key={index} onClick={() => getImg(item)}>
              <img
                src={item}
                alt="Top Salons In Ahmedabad For Beauty, Hair, And Bridal Services images"
                style={{
                  width: "100%",
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Gallery;
