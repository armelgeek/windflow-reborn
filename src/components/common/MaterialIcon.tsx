import React from 'react';

interface MaterialIconProps {
  icon: string;
  css?: string;
  className?: string;
  onClick?: () => void;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  icon, 
  css, 
  className, 
  onClick 
}) => {
  return (
    <i 
      className={`material-icons ${css || ''} ${className || ''}`} 
      onClick={onClick}
    >
      {icon}
    </i>
  );
};

export default MaterialIcon;