// export // fallback to h1 if undefined



export const Tag = ({ data,css,text }: {data?: any, css?: any, text?: any}) => {
     const Tag = `h${data || 2}`;
  return (
      <Tag className={css}>
        {text}
      </Tag>
  )
}
