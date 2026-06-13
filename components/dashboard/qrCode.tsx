"use client";

import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Share2, Printer } from "lucide-react";
import { toPng } from "html-to-image";
import { useGlobal } from "@/src/statecontext";
import { toast } from "react-hot-toast";

export default function QRCodeGenerator() {
  const { allProfile } = useGlobal();

  const [url, setUrl] = useState("");
  const qrRef = useRef(null);

  useEffect(() => {
    if (allProfile?.data?.referalCode) {
      setUrl(
        `https://www.ooshasglobal.com/login?code=${allProfile?.data?.referalCode}`
      );
    }
  }, [allProfile]);



  // Share QR
  const copyReferralLink = async () => {
  try {
    const referralLink = `https://www.ooshasglobal.com/login?code=${allProfile?.data?.referalCode}`;

    await navigator.clipboard.writeText(referralLink);

    toast.success("Referral link copied successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to copy link");
  }
};

  // Print QR
  const printQR = async () => {
  try {
    if (!qrRef.current) return;

    const dataUrl = await toPng(qrRef.current, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: "#ffffff",
    });

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc =
      iframe.contentWindow?.document ||
      iframe.contentDocument;

    doc.open();

    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Registration QR</title>

          <style>
            *{
              box-sizing:border-box;
            }

            body{
              margin:0;
              padding:0;
              font-family:Arial, sans-serif;
              background:#fff;
              display:flex;
              justify-content:center;
              align-items:center;
              min-height:100vh;
            }

            .card{
              width:700px;
             
              border-radius:20px;
              padding:40px;
              text-align:center;
            }

            .company{
              font-size:30px;
              font-weight:700;
              color:#f26d44;
              margin-bottom:10px;
            }

            .counsellor{
              font-size:18px;
              font-weight:600;
              color:#1f2937;
            }

            .email{
              font-size:14px;
              color:#64748b;
              margin-top:5px;
              margin-bottom:30px;
            }

            .qr{
              width:260px;
              height:auto;
              display:block;
              margin:0 auto;
            }

            .title{
              margin-top:25px;
              font-size:24px;
              font-weight:700;
              color:#111827;
            }

            .subtitle{
              margin-top:8px;
              font-size:15px;
              color:#64748b;
            }

         
          </style>
        </head>

        <body>

          <div class="card">

            <div class="company">
              Ooshas Global
            </div>

            <div class="counsellor">
              ${allProfile?.data?.name || "Counsellor"}
            </div>

            <div class="email">
              ${allProfile?.data?.email || ""}
            </div>

            <img
              src="${dataUrl}"
              class="qr"
              alt="QR Code"
            />

            <div class="title">
              Student Registration
            </div>

            <div class="subtitle">
              Scan this QR Code to Register
            </div>


          </div>

        </body>
      </html>
    `);

    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  } catch (error) {
    console.error("Print Error:", error);
  }
};

  return (
    <div className="w-full">
      <div className="w-full bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* QR Card */}
          <div
            
            className="flex items-center gap-4 bg-white rounded-xl p-3"
          >
            <div className="flex-shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-2" ref={qrRef}>
              <QRCodeCanvas
                value={url}
                size={100}
                includeMargin
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Student Registration
              </h3>

              <p className="text-sm text-slate-500">
                Scan QR Code to Register
              </p>

            
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
          

            <button
              onClick={copyReferralLink}
              className="border border-slate-300 hover:bg-slate-50 px-4 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Share2 size={18} />
              Copy
            </button>

            <button
              onClick={printQR}
              className="border border-slate-300 hover:bg-slate-50 px-4 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}