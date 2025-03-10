import React from "react";

const MovementLogo = ({ className = "h-5 w-5" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" className="fill-primary-300" />
      <path
        d="M12 6L7 9V15L12 18L17 15V9L12 6Z"
        className="fill-white dark:fill-neutral-600"
      />
      <path
        d="M12 10L10 11V13L12 14L14 13V11L12 10Z"
        className="fill-primary"
      />
    </svg>
  );
};

export default MovementLogo;
