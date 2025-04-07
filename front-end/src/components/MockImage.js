import React, {useState} from "react";
import Img from "../components/icons/logo.png";

const Image = ({ width = 400, height = 400, variant = "default" }) => {

  const [randomSeed] = useState(() => Math.floor(Math.random() * 10000));
  
  const imageClass = variant === "circular" ? "rounded-full" : "rounded-3xl";
  
  return (
    <div>
      <img
        className={imageClass}
        src={Img}
        alt="Random"
        width={width}
        height={height}
      />
    </div>
  );
};

export default Image;