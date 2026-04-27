import {
  create,
  explore,
  home,
  messages,
  notifications,
  profile,
  reels,
  search,
} from "../assets/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { io } from "socket.io-client";
import { API_BASE_URL, getApiUrl } from "./api";
import { getAuthToken } from "./auth";

const navItems = [
  { id: "home", label: "Home", icon: home, path: "/dashboard" },
  { id: "reels", label: "Reels", icon: reels, path: "/reel" },
  { id: "messages", label: "Messages", icon: messages, path: "/messages" },
  { id: "search", label: "Search", icon: search, path: "/search" },
  { id: "explore", label: "Explore", icon: explore, path: "/explore" },
  { id: "notifications", label: "Notifications", icon: notifications, path: "/notifications" },
  { id: "create", label: "Create", icon: create, path: "/create" },
  { id: "profile", label: "Profile", icon: profile, avatar: true, path: "/profile" },
];



export default function SideHamBurger() {
  const authToken = useMemo(() => getAuthToken(), []);
  const [currentUserId, setCurrentUserId] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);

  const refreshNotificationSummary = useCallback(async () => {
    if (!authToken) {
      setUnreadMessages(0);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/api/notifications/summary"), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUnreadMessages(data.data?.unreadMessages || 0);
      }
    } catch {
      setUnreadMessages(0);
    }
  }, [authToken]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    const loadNotificationState = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${authToken}`,
        };
        const [userResponse, notificationResponse] = await Promise.all([
          fetch(getApiUrl("/api/verify-token"), { headers }),
          fetch(getApiUrl("/api/notifications/summary"), { headers }),
        ]);
        const userData = await userResponse.json();
        const notificationData = await notificationResponse.json();

        if (userResponse.ok) {
          setCurrentUserId(userData.userId);
        }

        if (notificationResponse.ok) {
          setUnreadMessages(notificationData.data?.unreadMessages || 0);
        }
      } catch {
        setCurrentUserId("");
        setUnreadMessages(0);
      }
    };

    loadNotificationState();
  }, [authToken]);

  useEffect(() => {
    if (!authToken || !currentUserId) {
      return;
    }

    const socket = io(API_BASE_URL, {
      auth: { token: authToken },
      transports: ["websocket", "polling"],
    });

    socket.on("chat:message", (incomingMessage) => {
      if (String(incomingMessage.recipient) === String(currentUserId)) {
        setUnreadMessages((previousCount) => previousCount + 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [authToken, currentUserId]);

  useEffect(() => {
    window.addEventListener("messages:read", refreshNotificationSummary);

    return () => {
      window.removeEventListener("messages:read", refreshNotificationSummary);
    };
  }, [refreshNotificationSummary]);

  return (
    <>
      <aside className="sidebar-rail" aria-label="Instagram sidebar">
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.id}
              className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
              aria-label={item.label}
            >
              <span className={`sidebar-icon-wrap${item.avatar ? " is-avatar" : ""}`}>
                <img src={item.icon} alt="" className="sidebar-icon" />
                {item.id === "messages" && unreadMessages > 0 ? (
                  <span className="sidebar-badge">{unreadMessages > 99 ? "99+" : unreadMessages}</span>
                ) : null}
                {item.id === "notifications" && unreadMessages > 0 ? <span className="sidebar-dot" /> : null}
              </span>
              <h3 className="sidebar-label">{item.label}</h3>
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  );
}
