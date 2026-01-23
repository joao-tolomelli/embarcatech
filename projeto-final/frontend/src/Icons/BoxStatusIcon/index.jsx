import React from "react";

const BoxStatusIcon = ({ fill = "#10B981", isOpen = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24px"
      height="24px"
      className="w-full h-full"
    >
      {isOpen ? (
        // Desenho de Caixa ABERTA
        <path
          fill={fill}
          d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,3.5l6,2.67v4.6c0,0.41-0.25,0.77-0.62,0.91
          L12,13.5l-5.38-1.82C6.25,11.54,6,11.18,6,10.77v-4.6L12,3.5z M12,16l-4-2l4-2l4,2L12,16z"
        />
      ) : (
        // Desenho de Caixa FECHADA (Cubo)
        <path
          fill={fill}
          d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M12,18
          c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1s1,0.45,1,1v4C13,17.55,12.55,18,12,18z M18,9H6V7h12V9z"
        />
      )}
    </svg>
  );
};

export default BoxStatusIcon;