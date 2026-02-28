interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Full-width figure with border and caption, used on content pages
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

interface BlogFigureProps {
  images: { src: string; alt: string }[];
  caption?: string;
}

/**
 * Multi-image figure used in blog posts
 * Legacy: body.page article figure { margin:0; }
 */
export function BlogFigure({ images, caption }: BlogFigureProps) {
  return (
    <figure className="mt-6 mx-0 border border-gray-400">
      {images.map((image, index) => (
        <img key={index} src={image.src} alt={image.alt} className="w-full block" />
      ))}
      {caption && (
        <figcaption className="px-[10px] py-[5px] border-t border-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
