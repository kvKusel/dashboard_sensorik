import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import mapImage from '../assets/map_intro.png';

const MapOverview = () => {

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
    };  

  const imageStyle = {
    width: '100%', // Make the image responsive
    maxHeight: '400px', // Set a maximum height if needed
    objectFit: 'cover', // Preserve aspect ratio and cover the container
    marginBottom: '20px', // Add some spacing below the image
  };

  const buttonStyle = {
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
      <motion.div style={textContainerStyle}>
        <motion.h1 variants={textVariants} className="title">
          Zur Experimentierfläche
        </motion.h1>
        <img src={mapImage} alt="Map Introduction" style={imageStyle} />
        <motion.p variants={textVariants} className="description p-5">
          {/* Placeholder text (if needed) */}
        </motion.p>
        <Link to="/second" style={buttonStyle}>
          Zurück
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default MapOverview;
