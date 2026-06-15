"use client"

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/app/axiosInstance";
import { Paperclip, SendHorizonal, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function Comments({ application, profile }) {
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [messageSubject, setMessageSubject] = useState("");
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageAttachments, setMessageAttachments] = useState([]);
    const [isAttachmentUploading, setIsAttachmentUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [isCompact, setIsCompact] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setIsCompact(width < 900);
            }
        };

        checkWidth();
        window.addEventListener('resize', checkWidth);
        
        const resizeObserver = new ResizeObserver(() => {
            checkWidth();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', checkWidth);
            resizeObserver.disconnect();
        };
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axiosInstance.get(
                `/communication/applications/${application._id}/messages`
            );
            setMessageList(response.data?.data?.reverse() || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (application?._id) {
            fetchMessages();
        }
    }, [application]);

    const sendMessage = async () => {
        if (!messageText.trim()) return;
        setIsCommentSubmitting(true);

        try {
            await axiosInstance.post(
                `/communication/applications/${application._id}/messages`,
                {
                    content: messageText.trim(),
                    userId: messageSubject === "Document Uploaded"
                        ? profile.role === "user" ? profile._id : ""
                        : "",
                    extra_content: {
                        subject: messageSubject || "General Update",
                        camsId: application._id,
                        recipient: "Ooshas",
                        attachments: messageAttachments,
                    },
                }
            );

            setMessageText("");
            setMessageSubject("");
            setMessageAttachments([]);
            setIsCommentModalOpen(false);
            await fetchMessages();
            toast.success("Comment added successfully");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    const handleFileChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const filesArray = Array.from(e.target.files);
        setIsAttachmentUploading(true);

        try {
            for (const file of filesArray) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await axiosInstance.post("/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response.data?.success && response.data?.docUrl) {
                    setMessageAttachments((prev) => [
                        ...prev,
                        { name: file.name, url: response.data.docUrl },
                    ]);
                    toast.success(`${file.name} uploaded`);
                }
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsAttachmentUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeUploadedFile = (index) => {
        setMessageAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <>
            {/* Main Container - Auto height based on content */}
          <div className="bg-white border border-gray-200 flex flex-col">
    {/* Header */}
    <div className="p-4 sm:p-5 border-b border-gray-200 bg-white ">
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-gray-800 leading-tight">
                    Communication History
                </h3>
              
            </div>
            <button
                onClick={() => setIsCommentModalOpen(true)}
                className="bg-[#F26D44] hover:bg-orange-600 text-white font-semibold px-3 py-2 rounded-lg transition-colors text-xs whitespace-nowrap flex-shrink-0"
            >
                Send Message
            </button>
        </div>
    </div>

    {/* Content Area - Auto height */}
    <div ref={containerRef} className="p-4">
        {isCompact ? (
            // CARD UI - With scroll
          <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
  {messageList?.length > 0 ? (
    messageList.map((item, index) => (
      <motion.div
        key={item._id || index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white  p-2 shadow-sm "
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-orange-600">
                {item.userType === "student"
                  ? "ME"
                  : item.userType?.charAt(0)?.toUpperCase()}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-800">
                {item.userType === "student"
                  ? "You"
                  : item.userType || "Counselor"}
              </h4>

              <p className="text-xs text-gray-500">
                {formatDate(item.createdAt)}
              </p>
            </div>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              item?.isRead
                ? "bg-green-50 text-green-700"
                : "bg-orange-50 text-orange-700"
            }`}
          >
            {item?.isRead ? "Read" : "Unread"}
          </span>
        </div>

        {/* Subject */}
        {item?.extra_content?.subject && (
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            {item.extra_content.subject}
          </h3>
        )}

        {/* Message */}
        <p className="text-sm text-gray-600 leading-6">
          {item.content}
        </p>

        {/* Attachments */}
        {item?.extra_content?.attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.extra_content.attachments.map((att, idx) => (
              <a
                key={idx}
                href={`https://api.ooshasglobal.com${att.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-100"
              >
                <Paperclip className="w-3 h-3" />
                {att.name}
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center  border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Status:{" "}
            <span className="font-medium text-gray-700">
              {item.primaryStatus || "Processed"}
            </span>
          </span>

          {item.userType !== "student" && !item?.isRead && (
            <button
              onClick={() => {
                setIsCommentModalOpen(true);
                setMessageSubject(item?.extra_content?.subject);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition"
            >
              <SendHorizonal className="w-3 h-3" />
              Reply
            </button>
          )}
        </div>
      </motion.div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center py-12">
      <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
      <h3 className="text-sm font-medium text-gray-700">
        No Messages Yet
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        Messages from counselors will appear here.
      </p>
    </div>
  )}
</div>
        ) : (
            // TABLE UI - No scroll, auto height
           <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
        <div className="min-w-[900px]">
            {/* Table Header with Column Lines */}
            <div className="grid grid-cols-12 gap-0 bg-gray-100 border-b border-gray-300">
                <div className="col-span-2 px-4 py-3 border-r border-gray-300">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date & Subject
                    </span>
                </div>
                <div className="col-span-4 px-4 py-3 border-r border-gray-300">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Message
                    </span>
                </div>
                <div className="col-span-3 px-4 py-3 border-r border-gray-300">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                    </span>
                </div>
                <div className="col-span-2 px-4 py-3 border-r border-gray-300">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        From
                    </span>
                </div>
                <div className="col-span-1 px-4 py-3">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Action
                    </span>
                </div>
            </div>

            {/* Messages List with Column Lines */}
            <div className="divide-y divide-gray-200">
                {messageList?.length > 0 ? (
                    messageList.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index, 10) * 0.03 }}
                            className="grid grid-cols-12 gap-0 hover:bg-gray-50 transition-all duration-150"
                        >
                            {/* Date & Subject Column */}
                            <div className="col-span-2 px-4 py-3 border-r border-gray-200">
                                <div className="flex flex-col">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {formatDate(item.createdAt)}
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-[10px] font-semibold text-gray-400 uppercase">
                                            Subject
                                        </div>
                                        <div className="text-xs font-medium text-gray-700 break-words mt-0.5">
                                            {item?.extra_content?.subject || "—"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Column */}
                            <div className="col-span-4 px-4 py-3 border-r border-gray-200">
                                <div className="text-sm text-gray-700 leading-relaxed break-words">
                                    {item.content || "—"}
                                </div>
                                {item.extra_content?.attachments?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.extra_content.attachments.map((att, idx) => (
                                            <a
                                                key={idx}
                                                href={`https://api.ooshasglobal.com${att.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-500 text-xs bg-blue-50 px-2 py-0.5 rounded"
                                            >
                                                📎 {att.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Column */}
                            <div className="col-span-3 px-4 py-3 border-r border-gray-200">
                                <div className="flex flex-col space-y-2">
                                    <div>
                                        <div className="text-[10px] font-semibold text-gray-400 uppercase">
                                            Primary
                                        </div>
                                        <div className="text-xs text-gray-600 mt-0.5">
                                            {item.primaryStatus || "Application Processed"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-semibold text-gray-400 uppercase">
                                            Message
                                        </div>
                                        <span className={`inline-flex items-center gap-1 mt-0.5 text-xs font-medium ${
                                            item?.isRead ? "text-green-600" : "text-red-600"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                item?.isRead ? "bg-green-500" : "bg-red-500"
                                            }`}></span>
                                            {item?.isRead ? "Read" : "Unread"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* From Column */}
                            <div className="col-span-2 px-4 py-3 border-r border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        item.userType === "student" ? "bg-blue-100" : "bg-orange-100"
                                    }`}>
                                        <span className={`text-xs font-bold ${
                                            item.userType === "student" ? "text-blue-600" : "text-orange-600"
                                        }`}>
                                            {item.userType === "student" ? "ME" : item.userType?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-800">
                                            {item.userType === "student" ? "You" : item.userType || "Counselor"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.userType === "student" ? "Student" : "Counselor"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Column */}
                            <div className="col-span-1 px-4 py-3 flex items-center justify-center">
                                {item.userType !== "student" && !item?.isRead && (
                                    <button
                                        onClick={() => {
                                            setIsCommentModalOpen(true);
                                            setMessageSubject(item?.extra_content?.subject);
                                        }}
                                        className="px-3 py-1.5 bg-[#F26D44] hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        Reply
                                    </button>
                                )}
                                {item.userType === "student" && (
                                    <span className="text-xs text-gray-400">—</span>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-sm text-gray-500">No messages yet</p>
                    </div>
                )}
            </div>
        </div>
    </div>
</div>
        )}
    </div>
</div>

            {/* Modal */}
             {/* Modal */}
                                  <AnimatePresence>

                                    {isCommentModalOpen && (

                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-50 flex items-end justify-end p-6"
                                      >

                                        <motion.div
                                          initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                          animate={{ scale: 1, opacity: 1, y: 0 }}
                                          exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                          transition={{ type: "spring", duration: 0.4 }}
                                          className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                                        >

                                          {/* Header */}
                                          <div className="bg-white border-b border-slate-100 px-5 py-4">

                                            <div className="flex items-center justify-between">

                                              <div>

                                                <h3 className="text-base font-bold text-slate-800">
                                                  New Message
                                                </h3>

                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                  <span>To</span>
                                                  <span className="font-medium text-slate-700">
                                                    Ooshas
                                                  </span>
                                                </div>
                                              </div>
                                              <button
                                                onClick={() => setIsCommentModalOpen(false)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                              >
                                                <svg
                                                  className="w-5 h-5"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                  />
                                                </svg>
                                              </button>
                                            </div>
                                          </div>


                                          {/* Body */}
                                          <div className="p-5 space-y-5">

                                            {/* Subject */}
                                            <div className="space-y-1.5">

                                              <div className="flex items-center gap-2 text-sm">

                                                <label className="font-medium text-slate-600 w-16">
                                                  Subject
                                                </label>

                                                <select
                                                  value={messageSubject}
                                                  onChange={(e) => setMessageSubject(e.target.value)}
                                                  className="flex-1 bg-transparent border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none focus:border-orange-500"
                                                >

                                                  <option value="">
                                                    Select a subject...
                                                  </option>

                                                  <option value="Application Processed">
                                                    Application Processed
                                                  </option>

                                                  <option value="Document Uploaded">
                                                    Document Uploaded
                                                  </option>

                                                  <option value="University Update">
                                                    University Update
                                                  </option>

                                                </select>

                                              </div>

                                            </div>


                                            {/* Message */}
                                            <div className="space-y-1.5">

                                              <textarea
                                                rows={5}
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                placeholder="Type your comment details here..."
                                                className="w-full p-3 outline-none resize-none text-sm text-slate-700 placeholder-slate-400 bg-slate-50 rounded-xl border border-slate-100 focus:border-orange-500 focus:bg-white transition-all"
                                              />

                                            </div>


                                            {/* Attachments */}
                                            {messageAttachments.length > 0 && (

                                              <div className="space-y-2">

                                                <div className="flex flex-wrap gap-2">

                                                  {messageAttachments.map((file, index) => (

                                                    <div
                                                      key={index}
                                                      className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1 text-xs text-slate-600"
                                                    >

                                                      <svg
                                                        className="w-3 h-3 text-slate-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                      >

                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                        />

                                                      </svg>

                                                      <span className="max-w-[120px] truncate">
                                                        {file.name}
                                                      </span>

                                                      <button
                                                        type="button"
                                                        onClick={() => removeUploadedFile(index)}
                                                        className="text-slate-400 hover:text-rose-500 ml-1"
                                                      >
                                                        ×
                                                      </button>

                                                    </div>

                                                  ))}

                                                </div>

                                              </div>

                                            )}


                                            {/* Actions */}
                                            <div className="flex items-center justify-end gap-2 pt-2">

                                              {/* Upload */}
                                              <button
                                                type="button"
                                                disabled={
                                                  messageSubject !== "Document Uploaded" ||
                                                  isAttachmentUploading ||
                                                  isCommentSubmitting
                                                }
                                                onClick={() => fileInputRef.current.click()}
                                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                              >

                                                <svg
                                                  className="w-5 h-5"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >

                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                  />

                                                </svg>

                                              </button>


                                              {/* Send */}
                                              <button
                                                type="button"
                                                onClick={sendMessage}
                                                disabled={
                                                  isCommentSubmitting ||
                                                  isAttachmentUploading ||
                                                  !messageText.trim()
                                                }
                                                className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium px-5 py-2 rounded-full text-sm transition-all"
                                              >

                                                {isCommentSubmitting ? "Sending..." : "Send"}

                                              </button>

                                            </div>

                                          </div>


                                          {/* Hidden File Input */}
                                          <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            multiple
                                            disabled={
                                              isAttachmentUploading ||
                                              isCommentSubmitting
                                            }
                                            className="hidden"
                                          />

                                        </motion.div>

                                      </motion.div>

                                    )}

                                  </AnimatePresence>
        </>
    );
}