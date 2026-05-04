// export // fallback to h1 if undefined



export const Tag = ({ data, css, text }: { data?: any, css?: any, text?: any }) => {
  const Tag = `h${data || 2}`;
  return (
    <Tag className={css}  >
      <span  dangerouslySetInnerHTML={{ __html: text || "" }}></span>
      {/* {text} */}
    </Tag>
  )
}


export const NewTag = ({ data, css, children }: any) => {
  const TagName = `h${data || 2}` as any;

  return <TagName className={css}>{children}</TagName>;
};


export const Tagging = ({ data, css, text, children }: {
  data?: number | string;
  css?: string;
  text?: string;
  children?: React.ReactNode
}) => {
  const Heading = `h${data || 2}`;
  return <Heading className={css}>{children || text}</Heading>;
};