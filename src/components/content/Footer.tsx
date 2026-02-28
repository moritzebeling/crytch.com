interface PageFooterProps {
  children: React.ReactNode;
}

/**
 * Centered page footer with top margin
 * Legacy: body.page footer { margin-top:100px; }
 */
export function PageFooter({ children }: PageFooterProps) {
  return (
    <footer className="mt-[100px] text-center mx-[70px] max-[600px]:mx-[50px] max-[460px]:mx-[20px]">
      {children}
    </footer>
  );
}
