import React, { useState } from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "./sidebar.css";
import TN from "../TN.png"; // Ensure correct image import

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`members-sidebar-wrapper layout has-sidebar ${collapsed ? "collapsed" : ""}`}>
      <aside id="sidebar" className={`sidebar break-point-sm has-bg-image ${collapsed ? "collapsed" : ""}`}>
        <button id="btn-collapse" className="sidebar-collapser" onClick={toggleSidebar}>
          <i className={`ri-arrow-${collapsed ? "right" : "left"}-s-line`}></i>
        </button>
        <div className="image-wrapper">
          <img src={TN} alt="Sidebar background" />
        </div>
        <div className="sidebar-layout">
          <div className="sidebar-content">
            <nav className="menu open">
              <ul className="menu-list">
                <li className="menu-item">
                  <Link to="/welcome">
                    <i className="ri-home-heart-line"></i>
                    {!collapsed && <span>Welcome</span>}
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/members">
                    <i className="ri-user-line"></i>
                    {!collapsed && <span>Members</span>}
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/event">
                    <i className="ri-calendar-event-line"></i>
                    {!collapsed && <span>Event</span>}
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/report">
                    <i className="ri-file-list-line"></i>
                    {!collapsed && <span>Report</span>}
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/prayer-cell">
                    <i className="ri-hand-heart-line"></i>
                    {!collapsed && <span>Prayer Cell</span>}
                  </Link>
                </li>

              </ul>

            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
