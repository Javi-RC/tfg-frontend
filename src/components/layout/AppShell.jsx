import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { computeProfileCompletion } from '../../utils/profileCompletion';
import Sidebar from './Sidebar';
import AppTopBar from './AppTopBar';
import '../../styles/dashboard.css';
import './AppShell.css';

/**
 * AppShell Component
 * App-wide layout for authenticated pages: fixed left sidebar + top bar,
 * with the routed page content rendered inside the offset main region.
 */
export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const completion = computeProfileCompletion(user);

  return (
    <div className={`sara-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        completion={completion}
      />
      <div className="sara-shell-main">
        <AppTopBar onOpenSidebar={() => setSidebarOpen(true)} />
        {children}
      </div>
    </div>
  );
}
