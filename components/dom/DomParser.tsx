"use client";
import { useMemo } from "react";

interface InnerContentProps {
  cleanedHtml: string;
}

export function stripHtml(html: string = "") {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const cleanHtmlContent = (html: string = "") => {
  if (!html) return "";

  return html
    // Remove script and style tags completely
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")

    // Remove inline event handlers
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")

    // Remove unwanted attributes
    .replace(/\s+(?:style|class|dir|lang|width|height|align)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")

    // Remove data-* attributes
    .replace(/\s+data-[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")

    // Remove dangerous javascript URLs
    .replace(
      /\s+(?:href|src)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,
      ""
    )

    .trim();
};

const injectCounsellingButton = (html: string) => {
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const element = doc.getElementById("ooshasformshowing");

    if (!element) {
        return html;
    }

    const content = element.innerHTML;

    element.outerHTML = `
        <div
            id="ooshasformshowing"
            class="ooshas-custom-block"
            style="
                position: relative;
                width: 100%;
                margin: 32px 0;
                padding: 0;
                overflow: hidden;
                box-sizing: border-box;
                border: 1px solid #fed7aa;
                border-radius: 18px;
                background: #F46C44;
                box-shadow: 0 12px 35px rgba(244,108,68,0.20);
            "
        >

            <!-- Decorative Circle -->
            <div
                style="
                    position: absolute;
                    top: -64px;
                    right: -64px;
                    width: 208px;
                    height: 208px;
                    border-radius: 9999px;
                    background: rgba(255,255,255,0.10);
                    pointer-events: none;
                "
            ></div>

            <!-- Decorative Circle -->
            <div
                style="
                    position: absolute;
                    left: -48px;
                    bottom: -80px;
                    width: 176px;
                    height: 176px;
                    border-radius: 9999px;
                    background: rgba(255,255,255,0.05);
                    pointer-events: none;
                "
            ></div>

            <!-- Main Content -->
            <div
                style="
                    position: relative;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 40px;
                    width: 100%;
                    box-sizing: border-box;
                    padding: 18px 18px;
                "
            >

                <!-- Left Content -->
                <div
                    style="
                        flex: 1;
                        min-width: 0;
                        box-sizing: border-box;
                    "
                >

                    <!-- Badge -->
                    <div
                        style="
                            display: inline-flex;
                            align-items: center;
                            margin: 0 0 14px 0;
                            padding: 6px 12px;
                            box-sizing: border-box;
                            border: 1px solid rgba(255,255,255,0.35);
                            border-radius: 9999px;
                            background: rgba(255,255,255,0.10);
                        "
                    >
                        <span
                            style="
                                margin: 0;
                                padding: 0;
                                color: #ffffff;
                                font-size: 10px;
                                line-height: 1.3;
                                font-weight: 700;
                                letter-spacing: 1.5px;
                                text-transform: uppercase;
                                font-family: inherit;
                            "
                        >
                            Free Expert Guidance
                        </span>
                    </div>

                    <!-- Heading -->
                    <h3
                        style="
                            margin: 0 0 14px 0;
                            padding: 0;
                            color: #ffffff;
                            font-size: 28px;
                            line-height: 1.25;
                            font-weight: 700;
                            font-family: inherit;
                        "
                    >
                        Start Your Study Abroad Journey Today
                    </h3>

                    <!-- Description -->
                    <div
                        style="
                            max-width: 680px;
                            margin: 0;
                            padding: 0;
                            color: rgba(255,255,255,0.92);
                            font-size: 15px;
                            line-height: 1.75;
                            font-weight: 400;
                            font-family: inherit;
                        "
                    >
                        ${
                            content ||
                            "Get free counselling from our expert counsellors."
                        }
                    </div>

                </div>

                <!-- CTA Area -->
                <div
                    style="
                        flex-shrink: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-width: 190px;
                        box-sizing: border-box;
                    "
                >

                    <!-- Button -->
                    <button
                        type="button"
                        onclick="window.openCounsellingPopup()"
                        style="
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            white-space: nowrap;
                            width: auto;
                            min-width: 190px;
                            margin: 0;
                            padding: 13px 20px;
                            box-sizing: border-box;
                            border: none;
                            border-radius: 12px;
                            background: #ffffff;
                            color: #1f2937;
                            font-family: inherit;
                            font-size: 14px;
                            line-height: 1.4;
                            font-weight: 700;
                            text-align: center;
                            cursor: pointer;
                            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                        "
                    >
                        Book Free Counselling
                    </button>

                    <!-- Small Text -->
                    <p
                        style="
                            margin: 10px 0 0 0;
                            padding: 0;
                            color: rgba(255,255,255,0.82);
                            font-size: 12px;
                            line-height: 1.5;
                            font-weight: 400;
                            text-align: center;
                            font-family: inherit;
                        "
                    >
                        ✓ 100% Free Consultation
                    </p>

                </div>

            </div>
        </div>
    `;

    return doc.body.innerHTML;
};

const injectButton = (html: string) => {
    if (!html) return "";

    return html.replace(
        /<div[^>]*id=["']ooshasformbtn["'][^>]*>[\s\S]*?<\/div>/i,
        () => `
            <div
                id="ooshasformbtn"
                style="
                    width: 100%;
                    margin: 22px 0;
                    padding: 0;
                    box-sizing: border-box;
                    background: transparent;
                    text-align: center;
                "
            >

                <!-- CTA Button -->
                <button
                    type="button"
                    onclick="window.openCounsellingPopup()"
                    style="
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0;
                        padding: 10px 24px;
                        min-height: 40px;
                        border: none;
                        border-radius: 9999px;
                        background: #f36d45;
                        color: #ffffff;
                        font-family: inherit;
                        font-size: 13px;
                        line-height: 1.3;
                        font-weight: 700;
                        white-space: nowrap;
                        text-align: center;
                        cursor: pointer;
                        box-shadow: 0 4px 12px rgba(201, 52, 45, 0.18);
                        box-sizing: border-box;
                    "
                >
                    Book Your FREE Counselling Now!
                </button>

                <!-- Gradient Divider -->
                <div
                    style="
                        width: calc(100% - 32px);
                        height: 4px;
                        margin: 20px auto 0;
                        padding: 0;
                        border-radius: 9999px;
                        background: linear-gradient(
                            90deg,
                            #f3bd38 0%,
                            #ed943b 45%,
                            #d9463f 100%
                        );
                        box-sizing: border-box;
                    "
                ></div>

            </div>
        `
    );
};


const InnerContent = ({ cleanedHtml,text }: any) => {
  const html = useMemo(() => cleanHtmlContent(cleanedHtml), [cleanedHtml]);

  return (
    <>
      <div
        className="blog-html overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style jsx global>{`
.blog-html * {
  font-size: ${text || "16"}px;
  line-height: 1.8;
  // font-weight: 500;
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
  // font-weight: 600;
  transition: .25s;
}

.blog-html * a * {
  color: blue;
  text-decoration: none;
  // font-weight: 600;
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
  // border-radius: 14px;
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
  // border-radius: 10px;
  border-collapse: collapse;
  // border: 1px solid #000000 !important;
}

.blog-html thead {
  background: #F36D45;
  color: #fff;
}
  .blog-html thead * {
  color: #fff;
}

.blog-html th {
  color: #1C2E5A !important;
  padding: 14px;
  text-align: left;
  font-size: 16px;
  border: 1px solid #d1d5db;
  font-weight: 700;
}

.blog-html td {
  padding: 10px;
  border: 1px solid #d1d5db;
  font-size: 16px;
}

.blog-html td * {
  font-size: 16px;
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
  // border-radius: 10px;
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
  // border-radius: 6px;
  font-size: 15px;
  font-family: monospace;
}

/* Code Block */
.blog-html pre {
  background: #111827;
  color: #f9fafb;
  padding: 20px;
  // border-radius: 12px;
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
  // border-radius: 12px;
  margin: 30px 0;
}

/* Video */
.blog-html video {
  width: 100%;
  // border-radius: 12px;
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

/* Mobile */
@media (max-width:768px){

.blog-html * {
  font-size:15px;
}

.blog-html p *{
  font-size:15px;
}

.blog-html h1{
  font-size:34px;
}

.blog-html h2{
  font-size:20px;
}

.blog-html h2 *{
  font-size:20px;
}

.blog-html h3{
  font-size:18px;
}
.blog-html h3 *{
  font-size:18px;
}

.blog-html h4{
  font-size:20px;
}

.blog-html table{
  display:block;
  overflow-x:auto;
  white-space:nowrap;
}
.blog-html table *{
  font-size:12px;
}

.blog-html iframe{
  min-height:250px;
}

}
`}</style>
    </>
  );
};


export const BlogContent = ({ cleanedHtml }: InnerContentProps) => {
  const html = useMemo(() => cleanHtmlContent(cleanedHtml), [cleanedHtml]);

    const finalHtml2 = injectCounsellingButton(html);
  const finalHtml = injectButton(finalHtml2)

  return (
    <>
      <div
        className="blog-html overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: finalHtml }}
      />

      <style jsx global>{`
.blog-html * {
  font-size: 17px;
  line-height: 1.8;
  // font-weight: 500;
  color: #374151;
  word-break: break-word;
  margin: 0;
  padding:0;
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
.blog-html h2 *,
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
  font-size: 26px;
  margin: 15px 0 10px;
  color: #1C2E5A;
}
.blog-html h2 * {
   font-size: 24px;
}

.blog-html h3 {
  font-size: 22px;
  margin: 10px 0 10px;
}

.blog-html h4 {
  font-size: 20px;
  margin: 10px 0 12px;
}

.blog-html h5 {
  font-size: 18px;
  margin: 10px 0 10px;
}

.blog-html h6 {
  font-size: 16px;
  margin: 10px 0 10px;
}

/* Links */
.blog-html * a {
  color:blue; 
  text-decoration: none;
  // font-weight: 600;
  transition: .25s;
}

.blog-html * a * {
  color: blue;
  text-decoration: none;
  // font-weight: 600;
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
  color: #1C2E5A;
}

.blog-html em,
.blog-html i {
  font-style: italic;
}

/* Lists */
.blog-html ul,
.blog-html ol {
  margin: 0;
  padding-left: 28px;
}

.blog-html ul {
  list-style: disc;
}

.blog-html ol {
  list-style: decimal;
}

.blog-html li {
  margin: 6px 0;
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
  // border-radius: 14px;
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
  // border-radius: 10px;
  border-collapse: collapse;
  // border: 1px solid #000000 !important;
}

.blog-html thead {
  background: #F36D45;
  color: #fff;
}
  .blog-html thead * {
  color: #fff;
}

.blog-html th {
  color: #1C2E5A !important;
  padding: 14px;
  text-align: left;
  font-size: 16px;
  border: 1px solid #d1d5db;
  font-weight: 700;
}

.blog-html td {
  padding: 10px;
  border: 1px solid #d1d5db;
  font-size: 16px;
}

.blog-html td * {
  font-size: 16px;
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
  // border-radius: 10px;
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
  // border-radius: 6px;
  font-size: 15px;
  font-family: monospace;
}

/* Code Block */
.blog-html pre {
  background: #111827;
  color: #f9fafb;
  padding: 20px;
  // border-radius: 12px;
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
  // border-radius: 12px;
  margin: 30px 0;
}

/* Video */
.blog-html video {
  width: 100%;
  // border-radius: 12px;
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

.blog-html * {
  font-size:15px;
}

.blog-html p *{
  font-size:15px;
}

.blog-html h1{
  font-size:34px;
}

.blog-html h2{
  font-size:20px;
}

.blog-html h2 *{
  font-size:20px;
}

.blog-html h3{
  font-size:18px;
}
.blog-html h3 *{
  font-size:18px;
}

.blog-html h4{
  font-size:20px;
}

.blog-html table{
  display:block;
  overflow-x:auto;
  white-space:nowrap;
}
.blog-html table *{
  font-size:12px;
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