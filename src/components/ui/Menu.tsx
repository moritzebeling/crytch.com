"use client";

import { useState, useRef, useEffect } from "react";

interface MenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "tl" | "tr" | "bl" | "br";
  defaultOpen?: boolean;
}

export function Menu({ trigger, children, position = "tl", defaultOpen = false }: MenuProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const panelPositionClasses = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-10 left-0",
    br: "bottom-10 right-0",
  };

  const showPanel = isOpen || (isHovered && position === "tl");

  return (
    <div
      ref={menuRef}
      className="inline-block mx-2.5 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {showPanel && (
        <div
          className={`absolute w-96 max-w-[90vw] z-10 ${panelPositionClasses[position]}`}
        >
          <div className="bg-[var(--bg-color)] border-2 border-current">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1 right-3 text-lg cursor-pointer z-20 p-1"
            >
              ×
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  noBorder?: boolean;
}

export function MenuItem({ children, onClick, className = "", noBorder = false }: MenuItemProps) {
  const borderClass = noBorder ? "border-b-0" : "border-b-2";

  return (
    <div
      className={`px-2.5 py-2.5 border-current ${borderClass} first:border-t-0 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface MenuLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function MenuLink({ children, href, onClick, className = "" }: MenuLinkProps) {
  const baseClasses =
    "block px-2.5 py-1 border-b-2 border-current cursor-pointer hover:bg-current hover:text-[var(--bg-color)] transition-colors";

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
