import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MyButton from "./Button";
import DownArrow from "./DownArrow";
import ProjectDescription from "./ProjectDescription";

const MyJumbotron = () => {
  const [isVisible, setIsVisible] = useState(true);

  const [backgroundStyle, setBackgroundStyle] = useState({
    background:
      'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("/header-overlay.jpg") no-repeat center center fixed',
    backgroundSize: "cover",
  });

  const fadeIn = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, transition: { duration: 2, staggerChildren: 1 , delay: 0.3,} },
  };

  const fadeInDelayButton = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, transition: { duration: 2, staggerChildren: 1 , delay: 0.9,} },
  };

  const fadeInDelayArrow = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, transition: { duration: 2, staggerChildren: 1 , delay: 2,} },
  };


  return (
    <AnimatePresence>

    <motion.div
      className="d-flex flex-column justify-content-center align-items-center text-light p-5"
      style={{
        minHeight: "100vh",
        ...backgroundStyle, // Apply dynamic background style
      }}
      // initial="hidden"
      // animate="visible"
  
    >
      {/* <motion.hr variants={fadeIn} className="border-dark" /> */}
      <motion.h1 variants={fadeIn} style={{ fontWeight: "500" }} initial="hidden" animate="visible">
        <div className="row fs-1 text-center" > SENSOREN LAND L(I)EBEN</div>
      </motion.h1>


      <motion.div variants={fadeInDelayButton} initial="hidden" animate="visible" className="d-flex row pt-2">
          <MyButton to="/dashboard" buttonText="Dashboard" className="fade-button" />
        </motion.div>
        <motion.div variants={fadeInDelayArrow} initial="hidden" animate="visible" className="" style={{flex: "0.1 0.1 auto"}}>

        <DownArrow />
        </motion.div>

    </motion.div>
    <ProjectDescription />

    </AnimatePresence>

  );
};

export default MyJumbotron;
