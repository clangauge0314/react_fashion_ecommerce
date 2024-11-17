import React from "react";

const Button = ({ text, textColor, handler = () => {} }) => {
  return (
    <button
      className={`bg-sky-600 ${textColor} cursor-pointer hover:scale-105 duration-300 py-2 px-8 rounded-xl z-10`}
    >
      {text}
    </button>
  );
};

export default Button;
