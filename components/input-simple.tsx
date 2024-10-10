import React, { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "./ui/input";
import { cn } from "@/app/_utils/utils";

interface InputSimpleProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export function InputSimple({
  name,
  label,
  placeholder,
  required = false,
  ...rest
}: InputSimpleProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <label className="flex w-full items-center justify-between">
      <span className="text-accent-foreground">{label}</span>
      <div className="flex w-[80%] flex-col gap-1 md:w-[85%]">
        <Input
          {...register(name, { required: required })}
          placeholder={placeholder}
          className={cn("w-full", errors?.[name] && "border-red-400")}
          {...rest}
        />
        {errors[name] && (
          <span className="text-center text-xs text-red-500">
            {errors[name].message ? String(errors[name].message) : ""}
          </span>
        )}
      </div>
    </label>
  );
}

// Definindo displayName para evitar o erro ESLint
InputSimple.displayName = "InputSimple";
