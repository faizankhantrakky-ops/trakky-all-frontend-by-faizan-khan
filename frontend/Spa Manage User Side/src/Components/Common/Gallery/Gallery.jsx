import React, { useState } from "react";
import "./Gallery.css";

import { IoMdClose } from "react-icons/io";

const Gallery = (props) => {
  var spa = props.spa;
  const data = [spa.main_image, ...spa.mul_images.map((obj) => obj.image)];

  const [model, setModel] = useState(false);
  const [tempimgSrc, setTempimgSrc] = useState("");

  const getImg = (imgSrc) => {
    setTempimgSrc(imgSrc);
    setModel(true);
  };

  return (
    <>
      <div className={model ? "model open" : "model"}>
        <img src={tempimgSrc} alt=" spa image" />
        <IoMdClose onClick={() => setModel(false)} />
      </div>

      <div className="gallery">
        {data.map((item, index) => {
          return (
            <div className="pics" key={index} onClick={() => getImg(item)}>
              <img
                src={item}
                alt="spa image"
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
