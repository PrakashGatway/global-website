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
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      ""
    )
    .replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      ""
    )

    // Remove inline event handlers
    .replace(
      /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      ""
    )

    // Remove unwanted attributes
    .replace(
      /\s+(?:style|dir|lang|width|height|align)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      ""
    )

    // Remove class attributes EXCEPT:
    // ooshasformbtn
    // ooshasformshowing
    .replace(
      /\s+class\s*=\s*(['"])(.*?)\1/gi,
      (match, quote, classNames) => {
        const allowedClasses = classNames
          .split(/\s+/)
          .filter(
            (className: string) =>
              className === "ooshasformbtn" ||
              className === "ooshasformshowing" || className === "ooshasformbtnhref"
          );

        if (allowedClasses.length === 0) {
          return "";
        }

        return ` class=${quote}${allowedClasses.join(" ")}${quote}`;
      }
    )

    // Remove data-* attributes
    .replace(
      /\s+data-[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      ""
    )

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

  const elements = doc.querySelectorAll(".ooshasformshowing");

  if (!elements.length) {
    return html;
  }

  elements.forEach((element) => {
    const content = element.innerHTML;

    element.outerHTML = `
      <style>
        .ooshas-custom-block {
          position: relative;
          width: 100%;
          margin: 24px 0;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid #E8E8E8;
          border-radius: 16px;
          background: #FFFFFF;
          box-shadow: 0 4px 16px rgba(16, 42, 67, 0.06);
          font-family: inherit;
        }

        .ooshas-custom-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          min-height: 98px;
          padding: 14px;
          box-sizing: border-box;
        }

        .ooshas-custom-image {
          flex: 0 0 120px;
          width: 120px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .ooshas-custom-image img {
          display: block;
          width: 105px;
          height: 100px;
          max-width: 100%;
          object-fit: contain;
          border: 0;
          margin: 0;
          padding: 0;
        }

        .ooshas-custom-content {
          flex: 1;
          min-width: 0;
          padding: 0;

          margin: 0;
          box-sizing: border-box;
        }

        .ooshas-custom-heading {
          margin: 0!important;
          padding: 0;
          color: #102A43;
          font-size: 21px;
          line-height: 1.3;
          font-weight: 700;
          letter-spacing: -0.3px;
          font-family: inherit;
        }

        .ooshas-custom-heading-highlight {
          color: #F46B3F;
          font-weight: 700;
          font-size: inherit;
        }

        .ooshas-custom-description {
          margin: 0 0 0;
          padding: 0;
          color: #494B4F;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 500;
          font-family: inherit;
        }

        .ooshas-custom-description p {
          margin: 0;
          padding: 0;
        }

        .ooshas-custom-description * {
          margin-top: 0;
          margin-bottom: 0;
        }

        .ooshas-custom-cta {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ooshas-custom-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
          min-width: 210px;
          height: 38px;
          margin: 0;
          padding: 0 18px;
          box-sizing: border-box;
          border: none;
          border-radius: 10px;
          background: #F6673A;
          color: #FFFFFF !important;
          font-family: inherit;
          font-size: 13px;
          line-height: 1;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 5px 14px rgba(246, 103, 58, 0.22);
          transition: all 0.2s ease;
        }

        .ooshas-custom-button:hover {
          background: #E95A2F;
          box-shadow: 0 7px 18px rgba(246, 103, 58, 0.28);
          transform: translateY(-1px);
        }

        .ooshas-custom-button:active {
          transform: translateY(0);
        }

        .ooshas-custom-button-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
        }

        /* =========================
           TABLET
        ========================== */

        @media (max-width: 900px) {
          .ooshas-custom-inner {
            gap: 14px;
            padding: 12px 18px;
          }

          .ooshas-custom-image {
            flex: 0 0 95px;
            width: 95px;
            height: 80px;
          }

          .ooshas-custom-image img {
            width: 90px;
            height: 82px;
          }

          .ooshas-custom-heading {
            font-size: 18px;
          }

          .ooshas-custom-description {
            font-size: 12px;
          }

          .ooshas-custom-button {
            min-width: 175px;
            padding: 0 14px;
            font-size: 12px;
          }
        }

        /* =========================
           MOBILE
        ========================== */

        @media (max-width: 640px) {
          .ooshas-custom-block {
            margin: 20px 0;
            border-radius: 14px;
          }

          .ooshas-custom-inner {
            display: grid;
            grid-template-columns: 78px minmax(0, 1fr);
            align-items: center;
            gap: 12px;
            padding: 14px;
            min-height: auto;
          }

          .ooshas-custom-image {
            width: 78px;
            height: 70px;
            flex: none;
          }

          .ooshas-custom-image img {
            width: 75px;
            height: 70px;
          }

          .ooshas-custom-heading {
            font-size: 16px;
            line-height: 1.3;
            letter-spacing: -0.15px;
          }

          .ooshas-custom-description {
            margin-top: 0px;
            font-size: 11px;
            line-height: 1.45;
          }

          .ooshas-custom-cta {
            grid-column: 1 / -1;
            width: 100%;
            margin-top: 0px;
          }

          .ooshas-custom-button {
            width: 100%;
            min-width: 0;
            height: 40px;
            padding: 0 14px;
            border-radius: 9px;
            font-size: 12px;
          }
        }

        /* =========================
           SMALL MOBILE
        ========================== */

        @media (max-width: 380px) {
          .ooshas-custom-inner {
            grid-template-columns: 65px minmax(0, 1fr);
            gap: 9px;
            padding: 12px;
          }

          .ooshas-custom-image {
            width: 65px;
            height: 62px;
          }

          .ooshas-custom-image img {
            width: 65px;
            height: 62px;
          }

          .ooshas-custom-heading {
            font-size: 15px;
          }

          .ooshas-custom-description {
            font-size: 10.5px;
          }

          .ooshas-custom-button {
            height: 38px;
            font-size: 11.5px;
          }
        }
      </style>

      <div class="ooshasformshowing ooshas-custom-block">

        <div class="ooshas-custom-inner">

          <!-- Illustration -->
          <div class="ooshas-custom-image">
            <img
              src="https://png.pngtree.com/png-clipart/20230913/original/pngtree-counseling-clipart-man-and-woman-having-psychological-discussions-cartoon-vector-png-image_11073518.png"
              alt="Study Abroad Counselling"
            />
          </div>

          <!-- Content -->
          <div class="ooshas-custom-content">

            <h3 class="ooshas-custom-heading">
              Ready to Start Your
              <span class="ooshas-custom-heading-highlight">
                Study Abroad
              </span>
              Journey?
            </h3>

            <div class="ooshas-custom-description">
              ${
                content ||
                "Get expert guidance and turn your dream destination into reality."
              }
            </div>

          </div>

          <!-- CTA -->
          <div class="ooshas-custom-cta">

            <button
              type="button"
              onclick="window.openCounsellingPopup()"
              class="ooshas-custom-button"
            >
              <span class="ooshas-custom-button-icon">
                📅
              </span>

              Book a Free Consultation
            </button>

          </div>

        </div>

      </div>
    `;
  });

  return doc.body.innerHTML;
};

const injectButton = (html: string) => {
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const elements = doc.querySelectorAll(".ooshasformbtn");

    elements.forEach((element) => {
        element.outerHTML = `
            <div
                class="ooshasformbtn"
                style="
                    width: 100%;
                    margin: 22px 0;
                    padding: 0;
                    box-sizing: border-box;
                    background: transparent;
                    text-align: center;
                "
            >
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
        `;
    });

    return doc.body.innerHTML;
};

const injectButton2 = (html: string) => {
  if (!html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const elements = doc.querySelectorAll(".ooshasformbtnhref");

  elements.forEach((element) => {
    // Get href from existing <a>
    const link = element.querySelector("a");
    const href = link?.getAttribute("href") || "#";

    // Get button text from existing content
    const buttonText =
      link?.textContent?.trim() ||
      element.textContent?.trim() ||
      "Book Your FREE Counselling Now!";

    // Determine whether it's an external URL
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://");

    element.outerHTML = `
      <div
        class="ooshasformbtnhref"
        style="
          width: 100%;
          margin: 22px 0;
          padding: 0;
          box-sizing: border-box;
          background: transparent;
          text-align: center;
        "
      >

        <a
          href="${href}"
          ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}
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
            text-decoration: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(201, 52, 45, 0.18);
            box-sizing: border-box;
          "
        >
          ${buttonText}
        </a>

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
    `;
  });

  return doc.body.innerHTML;
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
    const finalHtml3 = injectButton2(finalHtml2);

    
  const finalHtml = injectButton(finalHtml3)

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