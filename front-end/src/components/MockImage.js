import React, {useState} from "react";

const Image = ({ width = 400, height = 400,variant = "default"}) => {

  const [randomSeed] = useState(() => Math.floor(Math.random() * 10000));
  
  const ImgUrl = `https://picsum.photos/seed/${randomSeed}/${width}/${height}`;
  const imageClass = variant === "circular" ? "rounded-full" : "rounded-lg";
  
  return (
    <div>
      <img
        className={imageClass}
        src={ImgUrl}
        alt="Random image"
        width={width}
        height={height}
      />
    </div>
  );
};

export default Image;
