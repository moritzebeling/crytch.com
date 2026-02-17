/**
 * Shared layout for content pages (about, blog)
 * Provides consistent wrapper styling for static content pages
 */
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[900px] mx-auto py-[50px] pb-[100px] text-[13px] leading-[1.5] max-[600px]:text-[12px] max-[460px]:text-[11px]">
      {children}
    </div>
  );
}
