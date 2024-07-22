import React from 'react';

export function Button({ children, className, variant = 'default', ...props }) {
  const baseClasses = 'px-4 py-2 rounded-md transition-colors duration-200';
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50',
    link: 'text-blue-500 hover:text-blue-600 underline',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}