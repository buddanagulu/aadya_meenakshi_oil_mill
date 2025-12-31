'use client';

import React, { useState } from 'react';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { Production } from './Production';
import { ProductionLog, ShopInventory, Transaction } from '../types';

interface AdminPanelProps {
  initialProduction: ProductionLog[];
  initialInventory: ShopInventory[];
  initialTransactions: Transaction[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  initialProduction, 
  initialInventory, 
  initialTransactions 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productionLogs, setProductionLogs] = useState(initialProduction);

  const handleAddLog = (newLog: Omit<ProductionLog, 'id'>) => {
    const log: ProductionLog = {
      ...newLog,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProductionLogs([...productionLogs, log]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard production={productionLogs} inventory={initialInventory} transactions={initialTransactions} />;
      case 'production':
        return <Production logs={productionLogs} onAddLog={handleAddLog} />;
      default:
        return (
          <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-gray-100 border-dashed">
            <div className="text-center">
              <p className="text-gray-400 font-medium">Coming Soon</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1 capitalize">{activeTab} Module</h3>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};
