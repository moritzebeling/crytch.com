interface ContentParagraphProps {
  children: React.ReactNode;
  first?: boolean;
}

/**
 * Content paragraph with text indentation (except for the first paragraph)
 * Legacy: body.page section p { font-size:18px; text-indent:50px; word-spacing:-3px; }
 * Legacy: body.page section p:first-child { text-indent:0; }
 */
export function ContentParagraph({ children, first = false }: ContentParagraphProps) {
  return (
    <p
      className={`text-[18px] max-[600px]:text-[16px] max-[460px]:text-[14px] [-webkit-hyphens:auto] [word-spacing:-3px] ${
        first ? "" : "indent-[50px] max-[600px]:indent-[30px] max-[460px]:indent-[20px]"
      }`}
    >
      {children}
    </p>
  );
}
