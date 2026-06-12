import { useEffect, useRef, useState } from "react";

function ChatWindow({
  loggedUser,
  selectedUser,
  messages = [],
  sendMessage,
  onlineUsers = [],
  typingUser,
  loadingMessages,
  handleTyping,
  handleStopTyping,
}) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  useEffect(() => {
    setText("");
    handleStopTyping?.();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedUser, handleStopTyping]);

  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);

    if (!selectedUser) {
      return;
    }

    handleTyping?.();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping?.();
    }, 1200);
  };

  const handleSend = () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    sendMessage(trimmedText);
    setText("");
    handleStopTyping?.();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  if (!selectedUser) {
    return (
      <div className="chat-window welcome-window">
        <div className="welcome-card">
          <div className="welcome-logo">C</div>
          <h1>Welcome to ChatApp</h1>
          <p>
            Pick a conversation from the sidebar to start messaging in real
            time.
          </p>
        </div>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="header-left">
          <div className="avatar large">
            {selectedUser.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{selectedUser.name}</h3>
            <p>
              {typingUser === selectedUser._id
                ? "Typing..."
                : isOnline
                  ? "Online"
                  : "Offline"}
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button type="button">{loggedUser?.name || "Me"}</button>
        </div>
      </div>

      <div className="messages-area">
        {loadingMessages ? (
          <div className="loader">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation.</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = String(message.sender) === String(loggedUser?.id);

            return (
              <div
                key={message._id || `${message.sender}-${message.createdAt}-${message.text}`}
                className={isOwnMessage ? "message-row my-row" : "message-row"}
              >
                <div className={isOwnMessage ? "message my-message" : "message"}>
                  <p>{message.text}</p>
                  <span>
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "now"}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`Message ${selectedUser.name}`}
          value={text}
          onChange={handleChange}
          onBlur={() => handleStopTyping?.()}
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;