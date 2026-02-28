interface TextBlockProps {
  children: React.ReactNode;
  centered?: boolean;
}

/**
 * Text block with horizontal margins
 * Legacy: body.page .text { margin:0 50px; }
 * Legacy: body.page .text.center { text-align:center; margin:0 70px; }
 */
export function TextBlock({ children, centered = false }: TextBlockProps) {
  return (
    <div
      className={
        centered
          ? "text-center mx-[70px] max-[600px]:mx-[50px] max-[460px]:mx-[20px]"
          : "mx-[50px] max-[600px]:mx-[30px] max-[460px]:mx-[20px]"
      }
    >
      {children}
    </div>
  );
}
