/* eslint-disable @typescript-eslint/no-explicit-any */
type MDXComponents = Record<string, any>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-3xl font-medium mb-1">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-lg mb-6">{children}</h2>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-lg mb-6">{children}</h4>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="text-lg leading-relaxed mb-0 [&:not(:first-child)]:indent-12">{children}</p>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="font-bold not-italic">{children}</em>
    ),
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <a href={href} className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    ...components,
  };
}
