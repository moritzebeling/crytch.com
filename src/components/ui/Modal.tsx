"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  // Handle escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--bg-color)]/70"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[400px] max-w-[90%] border-2 border-current bg-[var(--bg-color)] z-50">
        {children}
      </div>
    </div>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalContent({ children, className = "" }: ModalContentProps) {
  return <div className={`px-2.5 py-1 ${className}`}>{children}</div>;
}

interface ModalActionsProps {
  children: React.ReactNode;
}

export function ModalActions({ children }: ModalActionsProps) {
  return (
    <div className="border-t-2 border-current flex">
      {children}
    </div>
  );
}

interface ModalActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ModalAction({ children, onClick, className = "" }: ModalActionProps) {
  return (
    <button
      className={`flex-1 px-2.5 py-1 cursor-pointer hover:bg-current hover:text-[var(--bg-color)] transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
