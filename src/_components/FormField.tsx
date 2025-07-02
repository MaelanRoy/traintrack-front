/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  type: string;
  name: string;
  placeholder: string;
  register: any;
  error: any;
}

const FormField: React.FC<FormFieldProps> = ({
  type,
  name,
  placeholder,
  register,
  error,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={name} className="text-base font-medium">
        {placeholder}
      </label>
      <Input
        id={name}
        className={error ? "border-rose-500" : ""}
        type={type}
        {...register(name)}
        placeholder={placeholder}
      />
      {error && <p className="text-rose-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default FormField;
