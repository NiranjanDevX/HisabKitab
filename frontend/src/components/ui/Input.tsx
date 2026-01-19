import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5 font-['Inter']">
                {label && (
                    <label className="block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            block w-full px-4 py-2.5 bg-gray-900/50 border rounded-lg
            text-white placeholder-gray-500
            transition-all duration-200 outline-none
            ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                        }
            backdrop-blur-md hover:bg-gray-800/50
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
