"use client";

interface CornerProps {
  position: "tl" | "tr" | "bl" | "br";
  children: React.ReactNode;
  className?: string;
}

export function Corner({ position, children, className = "" }: CornerProps) {
  const positionClasses = {
    tl: "top-2 left-2 z-20",
    tr: "top-2 right-2 z-10",
    bl: "bottom-2 left-2 z-10",
    br: "bottom-2 right-2 z-10",
  };

  return (
    <div
      className={`absolute p-2.5 flex items-start ${positionClasses[position]} ${className}`}
    >
      {children}
    </div>
  );
}
