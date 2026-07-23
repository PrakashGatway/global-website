import { useMemo } from "react";

interface InnerContentProps {
    cleanedHtml: string;
}

const cleanHtmlContent = (html: string) => {
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove unwanted attributes from every element
    doc.body.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("style");
        el.removeAttribute("class");
        el.removeAttribute("id");
        el.removeAttribute("dir");
        el.removeAttribute("lang");
        el.removeAttribute("width");
        el.removeAttribute("height");
        el.removeAttribute("align");
        el.removeAttribute("data-*");

        // Remove every data-* attribute
        [...el.attributes].forEach((attr) => {
            if (
                attr.name.startsWith("data-") ||
                attr.name.startsWith("aria-") ||
                attr.name.startsWith("on") // onclick, onmouseover...
            ) {
                el.removeAttribute(attr.name);
            }
        });
    });

    return doc.body.innerHTML;
};

const InnerContent = ({ cleanedHtml }: InnerContentProps) => {
    const html = useMemo(() => cleanHtmlContent(cleanedHtml), [cleanedHtml]);

    return (
        <>
            <div
                className="blog-html overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: html }}
            />

            <style jsx global>{`
.blog-html * {
  font-size: 16px;
  line-height: 1.8;
  font-weight: 500;
  color: #374151;
  word-break: break-word;
}

/* Paragraphs */
// .blog-html p {
//   margin: 0 0 18px;
//   color: #374151;
//   line-height: 1.9;
//   font-size: 17px;
// }

/* Headings */
.blog-html h1,
.blog-html h2,
.blog-html h3,
.blog-html h4,
.blog-html h5,
.blog-html h6 {
  color: #1C2E5A;
  font-weight: 700;
  line-height: 1.3;
}

.blog-html h1 {
  font-size: 42px;
  margin: 48px 0 24px;
}

.blog-html h2 {
  font-size: 32px;
  margin: 40px 0 18px;
}

.blog-html h3 {
  font-size: 26px;
  margin: 30px 0 14px;
}

.blog-html h4 {
  font-size: 22px;
  margin: 26px 0 12px;
}

.blog-html h5 {
  font-size: 20px;
  margin: 22px 0 10px;
}

.blog-html h6 {
  font-size: 18px;
  margin: 20px 0 10px;
}

/* Links */
.blog-html * a {
  color:blue; 
  text-decoration: none;
  font-weight: 600;
  transition: .25s;
}

.blog-html * a * {
  color: blue;
  text-decoration: none;
  font-weight: 600;
  transition: .25s;
}

.blog-html a:hover {
  color: #d85b35;
  text-decoration: underline;
}

/* Bold */
.blog-html strong,
.blog-html b {
  font-weight: 700;
  color: #111827;
}

.blog-html em,
.blog-html i {
  font-style: italic;
}

/* Lists */
.blog-html ul,
.blog-html ol {
  margin: 20px 0;
  padding-left: 28px;
}

.blog-html ul {
  list-style: disc;
}

.blog-html ol {
  list-style: decimal;
}

.blog-html li {
  margin: 10px 0;
  line-height: 1.8;
}

.blog-html li::marker {
  color: #F36D45;
}

/* Images */
.blog-html img {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 14px;
  margin: 28px auto;
  display: block;
  object-fit: cover;
}

/* Figure */
.blog-html figure {
  margin: 30px 0;
  text-align: center;
}

.blog-html figcaption {
  margin-top: 10px;
  color: #6b7280;
  font-size: 14px;
}

/* Tables */
.blog-html table {
  width: 100%;
  margin: 20px 0;
  background: #fff;
  overflow: hidden;
  border-radius: 10px;
  border-collapse: collapse;
  border: 1px solid #000000;
}

.blog-html thead {
  background: #edb4a2;
}

.blog-html th {
  color: #fbfbfb !important;
  padding: 14px;
  text-align: left;
  font-size: 16px;
  font-weight: 700;
}

.blog-html td {
  padding: 13px;
  border-top: 1px solid #e5e7eb;
}

.blog-html tbody tr:nth-child(even) {
  background: #f8fafc;
}

.blog-html tbody tr:hover {
  background: #fff4ef;
}

/* Blockquote */
.blog-html blockquote {
  margin: 28px 0;
  padding: 18px 24px;
  border-left: 5px solid #F36D45;
  background: #fff7f3;
  color: #374151;
  font-size: 18px;
  font-style: italic;
  border-radius: 10px;
}

/* Horizontal Rule */
.blog-html hr {
  margin: 40px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* Inline Code */
.blog-html code {
  background: #f3f4f6;
  color: #e11d48;
  padding: 3px 7px;
  border-radius: 6px;
  font-size: 15px;
  font-family: monospace;
}

/* Code Block */
.blog-html pre {
  background: #111827;
  color: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 28px 0;
}

.blog-html pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}

/* iframe */
.blog-html iframe {
  width: 100%;
  min-height: 420px;
  border: none;
  border-radius: 12px;
  margin: 30px 0;
}

/* Video */
.blog-html video {
  width: 100%;
  border-radius: 12px;
  margin: 30px 0;
}

/* Responsive tables */
.blog-html .table,
.blog-html figure.table {
  overflow-x: auto;
}

/* Selection */
.blog-html ::selection {
  background: #F36D45;
  color: white;
}

/* Mobile */
@media (max-width:768px){

.blog-html{
  font-size:16px;
}

.blog-html p{
  font-size:16px;
}

.blog-html h1{
  font-size:34px;
}

.blog-html h2{
  font-size:28px;
}

.blog-html h3{
  font-size:23px;
}

.blog-html h4{
  font-size:20px;
}

.blog-html table{
  display:block;
  overflow-x:auto;
  white-space:nowrap;
}

.blog-html iframe{
  min-height:250px;
}

}
`}</style>
        </>
    );
};

export default InnerContent;