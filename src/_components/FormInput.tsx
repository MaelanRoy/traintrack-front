/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import FileUpload from "@/_components/fileUpload";

// Interface simplifiée pour les options
interface FormOption {
  value: any;
  label: string;
}

// Types pour les différents types d'input
type InputType =
  | "input"
  | "textarea"
  | "number"
  | "email"
  | "password"
  | "multiselect"
  | "select"
  | "fileupload";

interface FormInputProps {
  type: InputType;
  name: string;
  title?: string;
  placeholder?: string;
  control: any;
  rules?: any;
  errors: any;
  required?: boolean;
  step?: string;
  rows?: number;
  className?: string;
  options?: FormOption[];
  gap?: string; // Nouvelle prop pour contrôler le gap
}

// Utilitaires pour la sérialisation/désérialisation
const serializeValue = (value: any): string => {
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value || "");
};

const deserializeValue = (value: string): any => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

// Utilitaire pour obtenir le label d'un item
const getItemLabel = (item: any): string => {
  if (typeof item === "object" && item !== null) {
    return item.name || item.label || "Item";
  }
  return String(item);
};

const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  title,
  placeholder,
  control,
  rules,
  errors,
  required = false,
  step,
  rows = 3,
  className = "",
  options = [],
  gap,
}) => {
  const error = errors[name];

  const gapClass = gap || (type === "fileupload" ? "gap-0" : "gap-3");

  const renderField = (field: any) => {
    const combinedClassName = `${
      error ? "border-rose-500" : ""
    } ${className}`.trim();

    switch (type) {
      case "textarea":
        return (
          <Textarea
            {...field}
            value={field.value || ""}
            id={name}
            placeholder={placeholder}
            className={combinedClassName}
            rows={rows}
          />
        );

      case "number":
        return (
          <Input
            {...field}
            value={field.value || ""}
            id={name}
            type="number"
            step={step}
            placeholder={placeholder}
            className={combinedClassName}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value === "" ? undefined : e.target.valueAsNumber);
            }}
          />
        );

      case "multiselect": {
        // Convertir les options pour MultipleSelector
        const multiselectOptions = options.map((option) => ({
          value: serializeValue(option.value),
          label: option.label,
        }));

        // Convertir les valeurs sélectionnées - garantir que c'est toujours un tableau
        const selectedValues = (field.value || []).map((item: any) => ({
          value: serializeValue(item),
          label: getItemLabel(item),
        }));

        return (
          <MultipleSelector
            options={multiselectOptions}
            placeholder={placeholder}
            className={combinedClassName}
            value={selectedValues}
            onChange={(selectedOptions) => {
              const values = selectedOptions.map((option) =>
                deserializeValue(option.value)
              );
              field.onChange(values);
            }}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                Aucune option trouvée.
              </p>
            }
          />
        );
      }

      case "select": {
        const currentValue = field.value ? serializeValue(field.value) : "";

        return (
          <Select
            value={currentValue}
            onValueChange={(value) => {
              if (value === "") {
                field.onChange(undefined);
              } else {
                const parsedValue = deserializeValue(value);
                field.onChange(parsedValue);
              }
            }}
          >
            <SelectTrigger className={combinedClassName}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={index} value={serializeValue(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case "fileupload": {
        return (
          <FileUpload
            value={field.value || []}
            onChange={(files) => field.onChange(files)}
            className={combinedClassName}
          />
        );
      }

      default:
        return (
          <Input
            {...field}
            value={field.value || ""}
            id={name}
            type={type}
            placeholder={placeholder}
            className={combinedClassName}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col ${gapClass}`}>
      <label htmlFor={name} className="text-base font-medium">
        {title || placeholder}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => renderField(field)}
      />
      {error && (
        <p className="text-rose-500 text-sm">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default FormInput;
