import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SecondPage = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  };

  const textContainerStyle = {
    textAlign: 'center',
    maxWidth: '800px',
    background: 'rgba(255, 255, 255, 0.3)', // Adjust the alpha (fourth parameter) for transparency
    borderRadius: '10px', // Optional: Add border-radius for rounded corners
  };

  const textParagraphStyle = {
    textAlign: 'left',
    maxWidth: '800px',
  };

  const buttonStyle = {
    marginTop: '20px',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <motion.div
      style={containerStyle}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div style={textContainerStyle} >
        <motion.h1 variants={textVariants} className="title">
          Das Projekt
        </motion.h1>
        <motion.p variants={textVariants} style={textParagraphStyle} className="lead p-4">
          Die Streuobstwiese befindet sich in direkter Nähe zur Burg Lichtenberg in Thallichtenberg
          und umfasst 15 Äpfel- und Birnenbäume sowie 2 Insektennistkästen und eine Liegebank.
          <br /><br />
          Im Rahmen von LAND L(i)EBEN werden die Experimentierfläche und das umliegende Gelände nun
          mit verschiedenen Sensoren ausgestattet, um diverse Umweltwerte zu überwachen.        
        </motion.p>
        {/* <Link to="/Maps" style={buttonStyle}>
          Zeig auf der Karte!
        </Link> */}
      <div className="d-flex">
        <motion.div>
          <Link to="/Maps" className="text-decoration-none">
            <button
              type="button"
              className="btn btn-dark btn-lg me-2"
              style={buttonStyle}
            >           
            Zeig auf der Karte!
            </button>
          </Link>
        </motion.div>
        <motion.div>
          <a href="#hintergrund" className="text-decoration-none">
            <button
              type="button"
              className="btn btn-dark btn-lg me-2"
              style={buttonStyle}
            >
            Eingesetze Sensoren
            </button>
          </a>
        </motion.div>
      </div>
      </motion.div>
    </motion.div>
  );
};

export default SecondPage;
