"use client";

import axiosInstance from "@/app/axiosInstance";
import React, { useState, useEffect, useRef, useCallback } from "react";


interface Message {
    _id?: string;
    content: string;
    userType: "admin" | "user";
    createdAt: string;
}

const MessagingTab = ({
    applicationId,
    // token,
}: {
    applicationId: string;
    // token: string;
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // ================= FETCH =================
    const fetchMessages = useCallback(async () => {
        if (!applicationId) return;

        try {
            const res = await axiosInstance.get(
                `/communication/applications/${applicationId}/messages`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            const data = res.data?.data || res.data || [];
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, [applicationId]);

    // ================= SEND =================
    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        const tempMsg: Message = {
            content: newMessage,
            userType: "admin",
            createdAt: new Date().toISOString(),
        };

        // ✅ Optimistic UI
        setMessages((prev) => [...prev, tempMsg]);
        setNewMessage("");
        setSending(true);

        try {
            await axiosInstance.post(
                `/communication/applications/${applicationId}/messages`,
                {
                    type: "message",
                    content: tempMsg.content,
                    user: applicationId,
                    userType: "admin",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            fetchMessages(); // sync with backend
        } catch (err) {
            console.error("Send error:", err);
            alert("Message failed ❌");
        } finally {
            setSending(false);
        }
    };

    // ================= AUTO SCROLL =================
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ================= INITIAL + POLLING =================
    useEffect(() => {
        if (!applicationId) return;

        fetchMessages();

        // clear previous
        if (pollingRef.current) clearInterval(pollingRef.current);

        pollingRef.current = setInterval(fetchMessages, 5000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [applicationId, fetchMessages]);

    // ================= FORMAT =================
    const formatTime = (t: string) =>
        new Date(t).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatDate = (t: string) => {
        const d = new Date(t);
        const today = new Date();
        const y = new Date();
        y.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return "Today";
        if (d.toDateString() === y.toDateString()) return "Yesterday";
        return d.toLocaleDateString();
    };

    // ================= UI =================
    return (
        <div className="flex flex-col h-[500px] bg-white rounded-xl border overflow-hidden">

            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 border-b">
                <h3 className="text-sm font-semibold">Conversation</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <p className="text-center text-sm">Loading...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-xs text-gray-400">
                        No messages yet
                    </p>
                ) : (
                    messages.map((msg, i) => {
                        const isAdmin = msg.userType === "admin";
                        const showDate =
                            i === 0 ||
                            formatDate(msg.createdAt) !==
                            formatDate(messages[i - 1]?.createdAt);

                        return (
                            <div key={msg._id || i}>
                                {showDate && (
                                    <div className="text-center text-[10px] text-gray-400 my-2">
                                        {formatDate(msg.createdAt)}
                                    </div>
                                )}

                                <div
                                    className={`flex ${isAdmin ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${isAdmin
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100"
                                            }`}
                                    >
                                        {msg.content}
                                        <div className="text-[10px] mt-1 opacity-70 text-right">
                                            {formatTime(msg.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    placeholder="Type message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-blue-600 text-white px-4 rounded text-sm disabled:opacity-50"
                >
                    {sending ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default MessagingTab;