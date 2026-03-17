"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@/lib/spline/react-spline.js"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent"
        style={{
          borderColor: "rgba(224,48,71,0.3)",
          borderTopColor: "transparent",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  ),
});

export default function PortfolioChatbot({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message;
    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setIsLoading(true);

    // Retain focus on the input immediately after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChat((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      // Ensure focus remains after loading finishes
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [message, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "chatbot-fade-in 0.3s ease forwards" }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8"
        style={{ animation: "chatbot-scale-in 0.35s ease forwards" }}
      >
        <div
          className="relative w-full flex flex-col lg:flex-row overflow-hidden"
          style={{
            maxWidth: "1100px",
            height: "min(650px, 85vh)",
            background: "rgba(10, 10, 15, 0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            boxShadow:
              "0 0 60px rgba(224,48,71, 0.15), 0 25px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 hover:rotate-90"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "20px",
            }}
            aria-label="Close chatbot"
          >
            ✕
          </button>

          {/* LEFT — Spline 3D Bot */}
          <div
            className="relative w-full lg:w-[45%] flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              minHeight: "220px",
              background:
                "radial-gradient(ellipse at center, rgba(224,48,71,0.08) 0%, transparent 70%)",
            }}
          >
            {/* Subtle glow behind the bot */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(224,48,71,0.12) 0%, transparent 60%)",
              }}
            />
            <Spline
              scene="https://prod.spline.design/xuoDVyEL5L-olWyU/scene.splinecode"
              style={{ width: "100%", height: "100%" }}
            />
            {/* Bottom fade for mobile */}
            <div
              className="absolute bottom-0 left-0 right-0 h-12 lg:hidden pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,15,0.95), transparent)",
              }}
            />
          </div>

          {/* Divider */}
          <div
            className="hidden lg:block w-px flex-shrink-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(224,48,71,0.3), rgba(255,255,255,0.06), transparent)",
            }}
          />

          {/* RIGHT — Chat Panel */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Chat header */}
            <div
              className="flex-shrink-0 px-6 py-4 flex items-center gap-3"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: "#e03047",
                  boxShadow: "0 0 8px rgba(224,48,71,0.6)",
                  animation: "chatbot-pulse 2s ease-in-out infinite",
                }}
              />
              <div>
                <p
                  className="text-white leading-none"
                  style={{
                    paddingTop: "10px",
                    fontFamily: "Thedus-wl",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  PIXELATED AI
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.35)",
                    marginTop: "2px",
                    letterSpacing: "0.05em",
                  }}
                >
                  Ask anything about our services
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.1) transparent",
              }}
            >
              {chat.length === 0 && !isLoading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p
                      style={{
                        paddingTop:"5px",
                        fontFamily: "Thedus-wl",
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.2)",
                        marginBottom: "8px",
                      }}
                    >
                      Start a conversation
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.15)",
                        maxWidth: "240px",
                      }}
                    >
                      Ask about our web design, motion graphics, UI/UX or any
                      of our services.
                    </p>
                  </div>
                </div>
              )}

              {chat.map((c, i) => (
                <div
                  key={i}
                  className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      padding: "10px 12px",
                      borderRadius:
                        c.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      background:
                        c.role === "user"
                          ? "linear-gradient(135deg, #e03047, #a00000)"
                          : "rgba(255,255,255,0.06)",
                      color:
                        c.role === "user"
                          ? "#fff"
                          : "rgba(255,255,255,0.85)",
                      animation: "chatbot-msg-in 0.25s ease forwards",
                    }}
                  >
                    {c.text}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="flex gap-1.5 items-center px-4 py-3"
                    style={{
                      borderRadius: "16px 16px 16px 4px",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="chatbot-typing-dot"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="chatbot-typing-dot"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="chatbot-typing-dot"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div
              className="flex-shrink-0 px-4 py-3"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "4px 4px 4px 16px",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/25"
                  disabled={isLoading}
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || isLoading}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300"
                  style={{
                    background:
                      message.trim() && !isLoading
                        ? "#e03047"
                        : "rgba(255,255,255,0.05)",
                    color:
                      message.trim() && !isLoading
                        ? "#fff"
                        : "rgba(255,255,255,0.2)",
                    cursor:
                      message.trim() && !isLoading
                        ? "pointer"
                        : "not-allowed",
                  }}
                  aria-label="Send message"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
