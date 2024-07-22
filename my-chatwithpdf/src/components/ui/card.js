import React from 'react';

export function Card({ children, className, ...props }) {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return <div className={`px-6 py-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className, ...props }) {
  return <h2 className={`text-xl font-bold ${className}`} {...props}>{children}</h2>;
}

export function CardContent({ children, className, ...props }) {
  return <div className={`px-6 py-4 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className, ...props }) {
  return <div className={`px-6 py-4 border-t ${className}`} {...props}>{children}</div>;
}