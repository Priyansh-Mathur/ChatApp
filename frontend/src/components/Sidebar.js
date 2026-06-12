import { useState } from "react";

function Sidebar({
  users = [],
  selectedUser,
  openChat,
  onlineUsers = [],
  loggedUser,
  logout,
}) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="my-profile">
          <div className="avatar large">
            {loggedUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h3>{loggedUser?.name || "User"}</h3>
            <p>Available</p>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="app-title">
        <h2>Chats</h2>
        <span>{users.length} contacts</span>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <p className="empty-text">No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={
                selectedUser?._id === user._id
                  ? "user-card active-user"
                  : "user-card"
              }
              onClick={() => openChat(user)}
            >
              <div className="avatar-wrapper">
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {onlineUsers.includes(user._id) && (
                  <span className="online-dot"></span>
                )}
              </div>

              <div className="user-info">
                <div className="user-row">
                  <h4>{user.name}</h4>
                  <span className="time-text">now</span>
                </div>

                <p>
                  {onlineUsers.includes(user._id)
                    ? "Online"
                    : "Tap to start chatting"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;