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
    <TagName className={css}>
      <span dangerouslySetInnerHTML={{ __html: text || "" }} />
    </TagName>
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