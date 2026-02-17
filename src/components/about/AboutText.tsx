interface AboutTextProps {
  children: React.ReactNode;
}

/**
 * About page text block
 * Legacy: body.page .text { margin:0 50px; }
 */
export function AboutText({ children }: AboutTextProps) {
  return (
    <div className="mx-[50px] max-[600px]:mx-[30px] max-[460px]:mx-[20px]">
      {children}
    </div>
  );
}

interface AboutParagraphProps {
  children: React.ReactNode;
  first?: boolean;
}

/**
 * About page paragraph with proper indentation
 * Legacy: body.page section p { font-size:18px; text-indent:50px; word-spacing:-3px; }
 * Legacy: body.page section p:first-child { text-indent:0; }
 */
export function AboutParagraph({ children, first = false }: AboutParagraphProps) {
  return (
    <p
      className={`text-[18px] max-[600px]:text-[16px] max-[460px]:text-[14px] 
        ${first ? "" : "indent-[50px] max-[600px]:indent-[30px] max-[460px]:indent-[20px]"}
        [-webkit-hyphens:auto] [word-spacing:-3px]`}
    >
      {children}
    </p>
  );
}

interface AboutFooterProps {
  children: React.ReactNode;
}

/**
 * About page footer
 * Legacy: body.page footer { margin-top:100px; }
 */
export function AboutFooter({ children }: AboutFooterProps) {
  return (
    <footer className="mt-[100px] text-center mx-[70px] max-[600px]:mx-[50px] max-[460px]:mx-[20px]">
      {children}
    </footer>
  );
}

interface AboutFooterParagraphProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * About page footer paragraph with break spans
 */
export function AboutFooterParagraph({ children, className = "" }: AboutFooterParagraphProps) {
  return <p className={`mb-0 ${className}`}>{children}</p>;
}

/**
 * Break span that displays as block on desktop, inline on mobile
 * Legacy: span.break { display:block; }
 * Legacy @600px: span.break { display:inline; }
 */
export function Break({ children }: { children: React.ReactNode }) {
  return <span className="block max-[600px]:inline">{children}</span>;
}
