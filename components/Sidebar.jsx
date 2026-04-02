// import { PlusIcon, ChatBubbleLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
// import { Link } from 'react-router-dom';
// import { useGetUserChatsQuery } from '../features/chat/chatApi';

// export default function Sidebar({ userId, currentChatId, onSelectChat, onNewChat }) {
//   const { data: chats = [], isLoading } = useGetUserChatsQuery(userId);

//   const formatDate = (ts) => {
//     const d = new Date(ts);
//     const now = new Date();
//     const diff = now - d;
//     if (diff < 86400000) return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
//     return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' });
//   };

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-header">
//         <div className="logo">
//           <AcademicCapIcon className="logo-icon" />
//           <div>
//             <div className="logo-title">EduBot AI</div>
//             <div className="logo-sub">Oliy ta'lim vazirligi</div>
//           </div>
//         </div>

//         <button className="new-chat-btn" onClick={onNewChat}>
//           <PlusIcon className="btn-icon" />
//           Yangi chat
//         </button>
//       </div>

//       <div className="chat-list-section">
//         <div className="section-label">Chatlar tarixi</div>
//         {isLoading ? (
//           <div className="loading-chats">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="chat-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
//             ))}
//           </div>
//         ) : chats.length === 0 ? (
//           <div className="empty-chats">
//             <ChatBubbleLeftIcon className="empty-icon" />
//             <p>Hali chatlar yo'q</p>
//           </div>
//         ) : (
//           <ul className="chat-list">
//             {chats.map(chat => (
//               <li
//                 key={chat.chatId}
//                 className={`chat-item ${chat.chatId === currentChatId ? 'active' : ''}`}
//                 onClick={() => onSelectChat(chat.chatId)}
//               >
//                 <ChatBubbleLeftIcon className="chat-item-icon" />
//                 <div className="chat-item-content">
//                   <div className="chat-item-title">{chat.title}</div>
//                   <div className="chat-item-meta">
//                     <span>{chat.messageCount} xabar</span>
//                     <span>{formatDate(chat.lastTimestamp)}</span>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="sidebar-footer">
//         <Link to="/admin" className="admin-link">
//           ⚙️ CEO Panel
//         </Link>
//       </div>
//     </aside>
//   );
// }


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { newChat, selectChat, loadHistory, loadUserChats } from '../features/chat/chatSlice';
import { logout } from '../features/auth/authSlice';
import {
  PlusIcon,
  ChatBubbleLeftIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user }                          = useSelector((s) => s.auth);
  const { userChats, currentChatId }      = useSelector((s) => s.chat);

  // Chatlar ro'yxatini yuklash
  useEffect(() => {
    if (user?.id) dispatch(loadUserChats(user.id));
  }, [user?.id, currentChatId, dispatch]);

  const handleSelectChat = (chatId) => {
    dispatch(selectChat(chatId));
    dispatch(loadHistory(chatId));
  };

  const handleNewChat = () => dispatch(newChat());

  const formatDate = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    if (now - d < 86400000)
      return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' });
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <AcademicCapIcon className="logo-icon" />
          <div>
            <div className="logo-title">EduBot AI</div>
            <div className="logo-sub">Oliy ta'lim vazirligi</div>
          </div>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <PlusIcon className="btn-icon" />
          Yangi chat
        </button>
      </div>

      {/* User info */}
      <div className="sidebar-user">
        <div className="user-avatar-sm">{user?.firstname?.[0]?.toUpperCase()}</div>
        <div className="user-name">{user?.firstname} {user?.lastname}</div>
      </div>

      {/* Chats list */}
      <div className="chat-list-section">
        <div className="section-label">Chatlar tarixi</div>
        {userChats.length === 0 ? (
          <div className="empty-chats">
            <ChatBubbleLeftIcon className="empty-icon" />
            <p>Hali chatlar yo'q</p>
          </div>
        ) : (
          <ul className="chat-list">
            {userChats.map((chat) => (
              <li
                key={chat.chatId}
                className={`chat-item ${chat.chatId === currentChatId ? 'active' : ''}`}
                onClick={() => handleSelectChat(chat.chatId)}
              >
                <ChatBubbleLeftIcon className="chat-item-icon" />
                <div className="chat-item-content">
                  <div className="chat-item-title">{chat.title}</div>
                  <div className="chat-item-meta">
                    <span>{chat.messageCount} xabar</span>
                    <span>{formatDate(chat.lastTimestamp)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link to="/admin" className="admin-link">⚙️ Admin Panel</Link>
        <button className="logout-btn" onClick={() => dispatch(logout())}>
          <ArrowRightOnRectangleIcon className="btn-icon" />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
