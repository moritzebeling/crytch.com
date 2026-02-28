interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tagline?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Page header with title (logo link), subtitle, and optional tagline
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
