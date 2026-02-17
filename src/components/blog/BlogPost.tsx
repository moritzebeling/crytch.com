interface BlogPostProps {
  date: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  isLast?: boolean;
}

/**
 * Format date from YYYY-MM-DD to DD-MM-YYYY (German format)
 */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

/**
 * Blog article component
 * Legacy: body.page article { border-bottom:1px solid #bbb; padding:50px; }
 * Legacy: body.page article time { color:#bbb; font-size:13px; }
 */
export function BlogPost({ date, title, children, isLast = false }: BlogPostProps) {
  return (
    <article
      className={`py-[50px] px-[50px] max-[600px]:py-[30px] max-[600px]:px-[30px] max-[460px]:py-[20px] max-[460px]:px-[20px] ${
        !isLast ? "border-b border-gray-400" : ""
      }`}
    >
      <header>
        <time
          dateTime={date}
          className="text-gray-400 text-[13px] max-[600px]:text-[12px] max-[460px]:text-[11px]"
        >
          {formatDate(date)}
        </time>
        <h4 className="text-[18px] max-[600px]:text-[16px] font-normal mt-0">
          {title}
        </h4>
      </header>
      {children}
    </article>
  );
}

interface BlogTextProps {
  children: React.ReactNode;
}

/**
 * Blog text container
 * Legacy: body.page article .text { margin:24px 0; }
 */
export function BlogText({ children }: BlogTextProps) {
  return <div className="my-6 space-y-4">{children}</div>;
}

interface BlogImageProps {
  src: string;
  alt?: string;
  width?: string;
  className?: string;
}

/**
 * Centered blog image
 * Legacy: body.page article img { text-align:center; margin:0 auto; }
 */
export function BlogImage({ src, alt = "", width = "50%", className = "" }: BlogImageProps) {
  return (
    <div className={`text-center mt-5 ${className}`}>
      <img
        src={src}
        alt={alt}
        style={{ width, height: "auto", margin: "0 auto", display: "block" }}
      />
    </div>
  );
}

interface BlogFigureProps {
  images: { src: string; alt: string }[];
  caption?: string;
}

/**
 * Blog figure with images and caption
 * Legacy: body.page article figure { margin:0; }
 */
export function BlogFigure({ images, caption }: BlogFigureProps) {
  return (
    <figure className="mt-6 mx-0 border border-gray-400">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className="w-full block"
        />
      ))}
      {caption && (
        <figcaption className="px-[10px] py-[5px] border-t border-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
