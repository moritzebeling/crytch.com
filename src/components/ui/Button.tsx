"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "active" | "inactive" | "grey";
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", className = "", children, disabled, ...props }, ref) => {
    const baseClasses =
      "inline-block px-2.5 py-1 border-2 font-normal text-[13px] select-none transition-colors";

    const variantClasses = {
      default: "border-current hover:bg-current hover:text-[var(--bg-color)] cursor-pointer",
      active: "bg-current text-[var(--bg-color)] border-current cursor-pointer",
      inactive: "border-gray-400 text-gray-400 cursor-default",
      grey: "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-[var(--bg-color)] cursor-pointer",
    };

    const disabledClasses = disabled
      ? "border-gray-400 text-gray-400 cursor-default hover:bg-transparent hover:text-gray-400"
      : "";

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "active" | "inactive" | "grey";
  children: React.ReactNode;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const baseClasses =
      "inline-block px-2.5 py-1 border-2 font-normal text-[13px] select-none transition-colors no-underline";

    const variantClasses = {
      default: "border-current hover:bg-current hover:text-[var(--bg-color)] cursor-pointer",
      active: "bg-current text-[var(--bg-color)] border-current cursor-pointer",
      inactive: "border-gray-400 text-gray-400 cursor-default",
      grey: "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-[var(--bg-color)] cursor-pointer",
    };

    return (
      <a
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }
);

LinkButton.displayName = "LinkButton";
