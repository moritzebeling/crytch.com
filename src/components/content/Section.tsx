interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Content section wrapper
 * Legacy: body.page section { margin:30px 0; }
 */
export function PageSection({ children, className = "" }: PageSectionProps) {
  return <section className={`my-[30px] ${className}`}>{children}</section>;
}
