import React, { useState, useEffect } from 'react';

const OrientationLock = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [isSmallDevice, setIsSmallDevice] = useState(
    (window.innerWidth <= 768) || (window.innerWidth > window.innerHeight && window.innerHeight < 768)
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsSmallDevice(
        (window.innerWidth <= 576) || ((window.innerWidth > window.innerHeight) && window.innerHeight < 576)
      );
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isSmallDevice && !isPortrait ? (
        <div style={styles.landscapeWarning}>
          Die Anwendung wurde für die Hochformatansicht optimiert. Bitte drehen Sie Ihr Gerät.
          </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

const styles = {
  landscapeWarning: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#5D7280',
    color: 'lightgray',
    padding: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default OrientationLock;
