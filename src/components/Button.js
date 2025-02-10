import React from "react";

const Button = ({ onClick, children, variant = "primary" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-12 py-2 rounded  ${
        variant === "secondary" ? "bg-gray-300" : "bg-blue-500 text-white"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
