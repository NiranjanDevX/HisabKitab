import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5 font-['Inter']">
                {label && (
                    <label className="block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
            block w-full px-4 py-2.5 bg-gray-900/50 border rounded-lg
            text-white appearance-none
            transition-all duration-200 outline-none
            ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                        }
            backdrop-blur-md hover:bg-gray-800/50
            ${className}
          `}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
