import { Field as BaseField } from "@base-ui-components/react";
import styles from "./Field.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface FieldProps {
  label: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
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
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(value.length > 0);

  useEffect(() => {
    setIsFilled(value.length > 0);
  }, [value]);

  return (
    <BaseField.Root className={styles.FieldContainer}>
      <BaseField.Label
        className={clsx(styles.Label, {
          [styles.LabelFocused]: isFocused || isFilled,
        })}
        data-label={label}
      >
        {label}
      </BaseField.Label>
      <BaseField.Control
        className={clsx(styles.Input, {
          [styles.InputFilled]: isFilled,
        })}
        required={required}
        placeholder={placeholder}
        value={value}
        onValueChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {errorMessage && (
        <BaseField.Error
          match="valueMissing"
          className={clsx(styles.Description, styles.Error)}
        >
          {errorMessage}
        </BaseField.Error>
      )}

      {description && (
        <BaseField.Description className={styles.Description}>
          {description}
        </BaseField.Description>
      )}
    </BaseField.Root>
  );
}
