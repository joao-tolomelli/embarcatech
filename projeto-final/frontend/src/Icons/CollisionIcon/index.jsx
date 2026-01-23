import React from 'react';

const CollisionIcon = ({ fill = "#10B981" }) => { // Default verde
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24px"
      height="24px"
      className="w-full h-full"
    >
      <path
        fill={fill}
        d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z"
      />
      {/* Desenho de impacto estilizado */}
      <path 
        fill={fill} 
        d="M15.5,15.5l2.5,2.5 M15.5,8.5l2.5-2.5 M8.5,15.5l-2.5,2.5 M8.5,8.5l-2.5-2.5" 
        stroke={fill} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CollisionIcon;