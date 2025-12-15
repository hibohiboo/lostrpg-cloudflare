import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  children,
  className = '',
}) => (
  <div className={className}>
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && '*'}
    </label>
    {children}
  </div>
);

interface InputFieldProps {
  type?: 'text' | 'number' | 'password' | 'date';
  value: string | number | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  required?: boolean;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  maxLength,
  required,
  className = '',
}) => (
  <input
    type={type}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    min={min}
    max={max}
    maxLength={maxLength}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
  />
);

interface TextAreaFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  value,
  onChange,
  rows = 2,
  placeholder,
  className = '',
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
  />
);

interface SelectFieldProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  required?: boolean;
  className?: string;
}

export const SelectField = <T extends string>({
  value,
  onChange,
  options,
  required,
  className = '',
}: SelectFieldProps<T>) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as T)}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
