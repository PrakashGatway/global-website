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
        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all"
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
            <div className="space-y-0 max-h-[350px] overflow-y-auto">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 bg-gray-50  py-3 text-xs font-semibold text-gray-600 ">
                    <div className="col-span-2">Details</div>
                    <div className="col-span-4">Comment</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-1 text-center">By</div>
                </div>

                {/* Table Messages */}
                <div className="divide-y ">
                    {messageList?.length > 0 ? (
                        messageList.map((item, index) => (
                            <motion.div
                                key={item._id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index, 10) * 0.05 }}
                                className="grid grid-cols-12 gap-4 py-4 hover:bg-gray-50 transition-colors"
                            >
                                {/* Details Column */}
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-gray-800">
                                        {formatDate(item.createdAt)}
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Subject
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                            {item?.extra_content?.subject || "General"}
                                        </p>
                                    </div>
                                </div>

                                {/* Comment Column */}
                                <div className="col-span-4">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {item.content}
                                    </p>
                                    {item.extra_content?.attachments?.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {item.extra_content.attachments.map((att, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`https://api.ooshasglobal.com${att.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded-md transition-colors"
                                                >
                                                    <Paperclip className="w-3 h-3 flex-shrink-0" />
                                                    <span className="max-w-[120px] truncate">{att.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Status Column */}
                                <div className="col-span-3">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                Primary
                                            </p>
                                            <p className="text-sm text-gray-700 mt-0.5">
                                                {item.primaryStatus || "Application Processed"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                Message
                                            </p>
                                            <span className={`inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${item?.isRead
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {item?.isRead ? "Read" : "Unread"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* User Column */}
                                <div className="col-span-1 flex flex-col items-center justify-center gap-2">
                                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-center w-full">
                                        {item.userType === "student" ? "Me" : item.userType?.charAt(0).toUpperCase()}
                                    </span>
                                    {item.userType !== "student" && !item?.isRead && (
                                        <button
                                            onClick={() => {
                                                setIsCommentModalOpen(true);
                                                setMessageSubject(item?.extra_content?.subject);
                                            }}
                                            className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-1.5 py-1 rounded transition-colors w-full flex items-center justify-center"
                                        >
                                            <SendHorizonal className="w-2.5 h-2.5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-600">No comments yet</p>
                            <p className="text-xs text-gray-400 mt-1">Be the first to add a comment</p>
                        </div>
                    )}
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