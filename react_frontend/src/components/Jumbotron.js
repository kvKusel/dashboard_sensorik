import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MyButton from "./Button";
import DownArrow from "./DownArrow";
import ProjectDescription from "./ProjectDescription";
import headerImage from '../assets/header_image.webp';
import headerImageMobile from '../assets/header_image_mobile.jpg';


const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);


const MyJumbotron = () => {
  const [isVisible, setIsVisible] = useState(true);

  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const image = windowWidth < 576 ? headerImageMobile : headerImage;
    const backgroundAttachment = isSafari ? 'scroll' : 'fixed';

    setBackgroundStyle({
      background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${image}) no-repeat center bottom ${backgroundAttachment}`,
      backgroundSize: "cover",
    });
  }, [windowWidth, headerImage, headerImageMobile]);


  const fadeIn = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, transition: { duration: 2, staggerChildren: 1 , delay: 0.3,} },
  };

  const fadeInDelayButton = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, transition: { duration: 2, staggerChildren: 1 , delay: 0.8,} },
  };

  const fadeInDelayArrow = {
    hidden: { opacity: 0, },
    visible: { opacity: 1, transition: { duration: 2, staggerChildren: 1 , delay: 0.8,} },
  };


  return (
    <AnimatePresence>
<div>
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
        <div className="row fs-1 text-center" > SENSORNETZ LAND L(i)EBEN</div>
      </motion.h1>


      <motion.div variants={fadeInDelayButton} initial="hidden" animate="visible" className="d-flex row pt-2">
          <MyButton to="/dashboard" buttonText="Dashboard" className="fade-button" />
        </motion.div>
        <motion.div variants={fadeInDelayArrow} initial="hidden" animate="visible" className="" style={{flex: "0.1 0.1 auto"}}>

        <DownArrow />
        </motion.div>

    </motion.div>
    <div id='project-description'>
    <ProjectDescription />
    <div className="row d-flex mt-5 mx-0 " style={{width: "100%",}}>
 
    <div
              className="col-12 col-md-6 d-flex justify-content-center "
              style={{
                flex: "1 1 auto",

           
              }}
            >
      <Link to="/impressum" style={{ textDecoration: 'none', color: 'inherit' }}>
        <p>Impressum</p>
      </Link>
            </div>



            <div
              className="col-12 col-md-6 d-flex justify-content-center"
              style={{
                flex: "1 1 auto",

           
              }}
            >
      <Link to="/datenschutzbestimmungen" style={{ textDecoration: 'none', color: 'inherit' }}>
        <p>Datenschutzbestimmungen</p>
      </Link>            </div>

</div>
    </div>
    </div>
    </AnimatePresence>
    // </div>
  );
};

export default MyJumbotron;
