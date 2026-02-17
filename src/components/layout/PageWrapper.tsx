interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tagline?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Page header with title, subtitle, and optional tagline
 * Legacy: h1 { font-size:30px }, h2/h4 { font-size:18px }
 */
export function PageHeader({ title, subtitle, tagline, children }: PageHeaderProps) {
  return (
    <header className="text-center mx-[50px] max-[600px]:mx-[30px] max-[460px]:mx-[20px]">
      <h1 className="text-[30px] max-[600px]:text-[26px] font-medium mb-1">
        <a
          href="/"
          className="border-b-2 border-gray-400 hover:border-current hover:no-underline"
        >
          {title}
        </a>
      </h1>
      {subtitle && (
        <h2 className="text-[18px] max-[600px]:text-[16px] mb-6">{subtitle}</h2>
      )}
      {tagline && (
        <h4 className="text-[18px] max-[600px]:text-[16px] mb-6">{tagline}</h4>
      )}
      {children}
    </header>
  );
}

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Content section
 * Legacy: body.page section { margin:30px 0; }
 */
export function PageSection({ children, className = "" }: PageSectionProps) {
  return <section className={`my-[30px] ${className}`}>{children}</section>;
}

interface PageFooterProps {
  children: React.ReactNode;
}

/**
 * Page footer
 * Legacy: body.page footer { margin-top:100px; }
 */
export function PageFooter({ children }: PageFooterProps) {
  return (
    <footer className="mt-[100px] text-center mx-[70px] max-[600px]:mx-[50px] max-[460px]:mx-[20px]">
      {children}
    </footer>
  );
}

interface TextBlockProps {
  children: React.ReactNode;
  centered?: boolean;
}

/**
 * Text block with proper margins
 * Legacy: body.page .text { margin:0 50px; }
 * Legacy: body.page .text.center { text-align:center; margin:0 70px; }
 */
export function TextBlock({ children, centered = false }: TextBlockProps) {
  return (
    <div
      className={`
        ${centered ? "text-center mx-[70px] max-[600px]:mx-[50px] max-[460px]:mx-[20px]" : "mx-[50px] max-[600px]:mx-[30px] max-[460px]:mx-[20px]"}
      `}
    >
      {children}
    </div>
  );
}

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Figure component with image and caption
 * Legacy: body.page figure { margin:50px 10px; border:1px solid #bbb; }
 */
export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="mx-[10px] my-[50px] border border-gray-400 max-[600px]:mx-0 max-[600px]:my-7 max-[600px]:border-x-0">
      <img src={src} alt={alt} className="w-full block" />
      {caption && (
        <figcaption className="px-[10px] py-[5px] border-t border-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
