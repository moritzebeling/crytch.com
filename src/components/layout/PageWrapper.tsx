interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div className={`w-full max-w-[900px] mx-auto my-12 mb-24 ${className}`}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="text-center mx-12">
      <h1 className="text-3xl font-medium mb-1">
        <a href="/" className="border-b-2 border-gray-400 hover:border-current">
          {title}
        </a>
      </h1>
      {subtitle && <h2 className="text-lg mb-6">{subtitle}</h2>}
      {children}
    </header>
  );
}

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageSection({ children, className = "" }: PageSectionProps) {
  return <section className={`my-8 ${className}`}>{children}</section>;
}

interface PageFooterProps {
  children: React.ReactNode;
}

export function PageFooter({ children }: PageFooterProps) {
  return <footer className="mt-24 text-center mx-12">{children}</footer>;
}

interface TextBlockProps {
  children: React.ReactNode;
  centered?: boolean;
}

export function TextBlock({ children, centered = false }: TextBlockProps) {
  return (
    <div className={`mx-12 ${centered ? "text-center mx-16" : ""}`}>
      {children}
    </div>
  );
}

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
}

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="mx-2.5 my-12 border border-gray-400">
      <img src={src} alt={alt} className="w-full block" />
      {caption && (
        <figcaption className="px-2.5 py-1 border-t border-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
