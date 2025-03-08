import React, {useState} from "react";
import "./MockImage.css";

const Image = ({ width = 400, height = 400,variant = "default"}) => {

  const [randomSeed] = useState(() => Math.floor(Math.random() * 10000));
  
  const ImgUrl = `https://picsum.photos/seed/${randomSeed}/${width}/${height}`;
  const imgClass = variant === "circular" ? "circular" : "image";
  
  return (
    <div>
      <img
        className={imgClass}
        src={ImgUrl}
        alt="Random image"
        width={width}
        height={height}
      />
    </div>
  );
};

export default Image;
