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
import { NavLink } from "react-router-dom";

const navItems = [
  { id: "home", label: "Home", icon: home, path: "/dashboard" },
  { id: "reels", label: "Reels", icon: reels, path: "/reel" },
  { id: "messages", label: "Messages", icon: messages, badge: "2", path: "/messages" },
  { id: "search", label: "Search", icon: search, path: "/search" },
  { id: "explore", label: "Explore", icon: explore, path: "/explore" },
  { id: "notifications", label: "Notifications", icon: notifications, dot: true, path: "/notifications" },
  { id: "create", label: "Create", icon: create, path: "/create" },
  { id: "profile", label: "Profile", icon: profile, avatar: true, path: "/profile" },
];

export default function SideHamBurger() {
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
                {item.badge ? <span className="sidebar-badge">{item.badge}</span> : null}
                {item.dot ? <span className="sidebar-dot" /> : null}
              </span>
              <h3 className="sidebar-label">{item.label}</h3>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
