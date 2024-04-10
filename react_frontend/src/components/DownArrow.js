import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const DownArrow = () => {

    const arrowRef = useRef(null);
    const [viewportHeight, setViewportHeight] = useState(0);
  
    useEffect(() => {
      const handleResize = () => {
        setViewportHeight(window.innerHeight);
      };
  
      // Initial setup
      handleResize();
  
      // Add event listener for window resize
      window.addEventListener("resize", handleResize);
  
      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);


  return (
    <motion.div
    ref={arrowRef}

      style={{
        width: 0,
        height: 0,
        borderTop: "10px solid white",
        borderBottom: "10px solid transparent", // Adjust color as needed
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
      }}
      animate={{
        y: [0.38* viewportHeight, 0.43* viewportHeight , 0.38* viewportHeight], // Animate the arrow slightly up and down
      }}
      transition={{
        duration: 2, // Duration for one loop
        repeat: Infinity, // Repeat infinitely
        repeatType: "reverse", // Reverse animation direction at the end of each loop
      }}
    />
  );
};

export default DownArrow;
