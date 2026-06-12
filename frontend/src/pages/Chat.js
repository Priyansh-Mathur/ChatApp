import { useEffect, useRef, useState } from "react";
import API from "../api";
import socket from "../socket";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  const [loggedUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const selectedUserRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!loggedUser?.id) return;

    socket.connect();
    socket.emit("addUser", loggedUser.id);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", (message) => {
      const currentChat = selectedUserRef.current;

      if (
        currentChat &&
        String(message.sender) === String(currentChat._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("messageSent", (message) => {
      const currentChat = selectedUserRef.current;

      if (
        currentChat &&
        String(message.receiver) === String(currentChat._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("typing", ({ sender }) => {
      setTypingUser(sender);
    });

    socket.on("stopTyping", () => {
      setTypingUser(null);
    });

    socket.on("messageError", (error) => {
      alert(error);
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
      socket.off("messageSent");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageError");
      socket.disconnect();
    };
  }, [loggedUser?.id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const openChat = async (user) => {
    setSelectedUser(user);
    selectedUserRef.current = user;
    setLoadingMessages(true);

    try {
      const res = await API.get(`/messages/${user._id}`);
      setMessages(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = (text) => {
    if (!text.trim() || !selectedUser || !loggedUser?.id) return;

    socket.emit("sendMessage", {
      sender: loggedUser.id,
      receiver: selectedUser._id,
      text,
    });
  };

  const handleTyping = () => {
    if (!selectedUser || !loggedUser?.id) return;

    socket.emit("typing", {
      sender: loggedUser.id,
      receiver: selectedUser._id,
    });
  };

  const handleStopTyping = () => {
    if (!selectedUser || !loggedUser?.id) return;

    socket.emit("stopTyping", {
      sender: loggedUser.id,
      receiver: selectedUser._id,
    });
  };

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="chat-app">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        openChat={openChat}
        onlineUsers={onlineUsers}
        loggedUser={loggedUser}
        logout={logout}
      />

      <ChatWindow
        loggedUser={loggedUser}
        selectedUser={selectedUser}
        messages={messages}
        sendMessage={sendMessage}
        onlineUsers={onlineUsers}
        typingUser={typingUser}
        loadingMessages={loadingMessages}
        handleTyping={handleTyping}
        handleStopTyping={handleStopTyping}
      />
    </div>
  );
}

export default Chat;