import React from 'react';
import { ReactComponent as IconTransparentTree } from "../../assets/Icon_HalbTransparent.svg";

const IconTree = ({color}) => {
  return (
    <div className={`legend-icons ${color}`}>
      <IconTransparentTree />
      </div>
  );
};

export default IconTree;
