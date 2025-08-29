import { Field as BaseField } from "@base-ui-components/react";
import React from "react";

interface FieldProps {
  label: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Field({
  label,
  placeholder = "",
  description,
  errorMessage,
  required = false,
  value,
  onChange,
}: FieldProps) {
  return (
    <BaseField.Root>
      <BaseField.Label>{label}</BaseField.Label>
      <BaseField.Control
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {errorMessage && (
        <BaseField.Error match="valueMissing">{errorMessage}</BaseField.Error>
      )}

      {description && (
        <BaseField.Description>{description}</BaseField.Description>
      )}
    </BaseField.Root>
  );
}
