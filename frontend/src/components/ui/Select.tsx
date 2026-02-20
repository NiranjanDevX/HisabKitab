import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <select
                        ref={ref}
                        className={cn(
                            "block w-full px-5 py-3.5 bg-white/[0.03] border rounded-2xl",
                            "text-white appearance-none font-bold text-sm",
                            "transition-all duration-300 outline-none cursor-pointer",
                            error
                                ? 'border-rose-500/50 focus:border-rose-500'
                                : 'border-white/[0.05] focus:border-primary-500/50 focus:bg-white/[0.05]',
                            "backdrop-blur-xl",
                            className
                        )}
                        {...props}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-dark-900 text-white">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-primary-500 transition-colors">
                        <ChevronDown size={18} />
                    </div>
                </div>
                {error && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
