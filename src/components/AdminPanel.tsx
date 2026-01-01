'use client';

import React, { useState } from 'react';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { Production } from './Production';
import { ShopInventoryPage } from './ShopInventory';
import { TransactionsPage } from './Transactions';
import { LedgersPage } from './Ledgers';
import { UtilityLogsPage } from './UtilityLogs';
import LogsTable from './LogsTable';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Placeholder data for dashboard until we refactor it too
  // For now let's pass empty or fetched data. Best is to let Dashboard fetch its own data too.
  // But Dashboard takes props. Let's fix Dashboard next. 
  // For now, removing props from AdminPanel means Dashboard calls in renderContent will break if we don't provide data.
  // Wait, Dashboard also needs refactoring. To prevent breaking build, pass empty arrays temporarily or refactor Dashboard now?
  // User asked for "Admin entries from admin is crud". Production is main one.
  // I will pass empty arrays to Dashboard for now to fix build, and focus on Production as requested.
  // Actually, better to fetch data in Dashboard independently too.
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />; 
      case 'production_logs':
        return <Production />;
      case 'shop_inventory':
        return <ShopInventoryPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'ledgers': // Dues & Ledgers
        return <LedgersPage />;
      case 'utility_logs': // Utilities
        return <UtilityLogsPage />;
      case 'profiles':
        return <LogsTable initialTable="profiles" showTabs={false} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};
