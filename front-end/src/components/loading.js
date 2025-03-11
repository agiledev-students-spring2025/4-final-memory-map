import React, { useState, useEffect } from "react";
import styles from "./DotsAnimation.module.scss";

const DotsAnimation = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 500);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Loading
        <span className={`${styles.dots} ${animate ? styles["dots--animate"] : ""}`}>
          <span className={`${styles.dot} ${styles.z}`} />
          <span className={`${styles.dot} ${styles.f}`} />
          <span className={`${styles.dot} ${styles.s}`} />
          <span className={`${styles.dot} ${styles.l}`} />
        </span>
      </h1>
    </div>
  );
};

export default DotsAnimation;
