import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`
      bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 
      rounded-2xl p-6 shadow-2xl transition-all duration-300
      hover:shadow-primary-900/5 hover:border-gray-700/50
      ${className}
    `}>
            {title && (
                <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            )}
            {children}
        </div>
    );
};
