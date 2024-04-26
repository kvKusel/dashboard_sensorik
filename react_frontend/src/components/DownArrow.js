import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const DownArrow = () => {
  const arrowRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToProjectDescription = () => {
      const element = document.getElementById('project-description');
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
      <motion.div
          ref={arrowRef}
          onClick={scrollToProjectDescription}
          style={{
              cursor: 'pointer', // Make it clear this is clickable
              width: 0,
              minHeight: "80px",
              borderTop: "10px solid white",
              borderBottom: "10px solid transparent",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
          }}
          animate={{
              y: [0.38 * viewportHeight, 0.43 * viewportHeight, 0.38 * viewportHeight],
          }}
          transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
          }}
      />
  );
};


export default DownArrow;
