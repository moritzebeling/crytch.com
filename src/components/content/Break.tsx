/**
 * Inline text segment that becomes block-level on wider screens.
 * Used to control line breaks in footer text responsively.
 * Legacy: span.break { display:block; }
 * Legacy @600px: span.break { display:inline; }
 */
export function Break({ children }: { children: React.ReactNode }) {
  return <span className="block max-[600px]:inline">{children}</span>;
}
