// export // fallback to h1 if undefined



export const Tag = ({
  data,
  css,
  text,
}: {
  data?: number | string;
  css?: string;
  text?: string;
}) => {
  const TagName =
    data === "p"
      ? "p"
      : (`h${data || 2}`);

  return (
    <>
    <TagName className="text-xl sm:text-3xl md:text-4xl font-bold ">
      <span className="text-white lg:text-4xl leading-snug" dangerouslySetInnerHTML={{ __html: text?.split(":")[0] || "" }} />
      <span className="text-white text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: text?.split(":")[1] || "" }} />
     </TagName>
    </>
  );
};


export const NewTag = ({
  data,
  css,
  children,
}: {
  data?: number | string;
  css?: string;
  children?: React.ReactNode;
}) => {
  const TagName =
    data === "p"
      ? "p"
      : (`h${data || 2}`);

  return <TagName className={css}>{children}</TagName>;
};


export const Tagging = ({ data, css, text, children }: {
  data?: number | string;
  css?: string;
  text?: string;
  children?: React.ReactNode
}) => {
  const Tag =
    data != "p"
      ? (`h${data}` as keyof JSX.IntrinsicElements)
      : (data || "h2");

  return <Tag className={css}>{children || text}</Tag>;
};