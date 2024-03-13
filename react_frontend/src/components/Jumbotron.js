import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MyButton from "./Button";

const MyJumbotron = () => {
  const [isVisible, setIsVisible] = useState(true);

  const [backgroundStyle, setBackgroundStyle] = useState({
    background:
      'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("/header-overlay.jpg") no-repeat center center fixed',
    backgroundSize: "cover",
  });

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, staggerChildren: 0.5 } },
  };

  const fadeOut = {
    hidden: { opacity: 1 },
    visible: { opacity: 0, transition: { duration: 1 } },
  };

  const handleFadeOut = () => {
    setIsVisible(false); // Update state to trigger fade-out animation
    console.log(isVisible);
  };


  const handleButtonClick = () => {
    const buttons = document.querySelectorAll('.fade-button');
    buttons.forEach((button, index) => {
      setTimeout(() => {
        button.classList.add('fade-out');
        if (index === buttons.length - 1) {
          // Remove buttons from the DOM after the last button's animation
          setTimeout(() => {
            buttons.forEach((btn) => {
              btn.remove();
            });
          }, 500 * buttons.length); // Wait for the total animation duration
        }
      }, index * 500); // Delay each button by 0.5 seconds (500 milliseconds)
    });
  };
  


  return (
    <motion.div
      className="d-flex flex-column justify-content-center align-items-start text-light p-5"
      style={{
        minHeight: "100vh",
        ...backgroundStyle, // Apply dynamic background style
      }}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      exit={fadeOut}
    >
      <motion.hr variants={fadeIn} className="border-dark" />
      <motion.h1 variants={fadeIn} style={{ fontWeight: "normal" }}>
        <div className="row"> Sensorikfläche an der Burg Lichtenberg</div>
      </motion.h1>


            <div className="d-flex row ">
                             <motion.div className="col-sm-6 p-1" variants={fadeIn}>

              <button className="fade-button" onClick={handleButtonClick}>Das Projekt</button>
              </motion.div>
              <motion.div className="col-sm-6 p-1" variants={fadeIn}>

              <button className="fade-button" to="/dashboard">Dashboard</button>
              </motion.div>
              {/* <div className="col-sm-6 p-1">
                <MyButton
                  // buttonAction={handleFadeOut}
                  buttonText="Das Projekt"
                  className="fade-button"
                  onClick={handleButtonClick}
                />
              </div>
              <div className="col-sm-6 p-1">
                <MyButton to="/dashboard" buttonText="Dashboard" className="fade-button"
 />
              </div> */}
            </div>

    </motion.div>
  );
};

export default MyJumbotron;
