import React from 'react';
import { AdminPanel } from '../../components/AdminPanel';
import { dataService } from '../../services/dataService';

export default async function AdminPage() {
  const production = await dataService.getProduction();
  const inventory = await dataService.getInventory();
  const transactions = await dataService.getTransactions();

  return (
    <AdminPanel 
      initialProduction={production} 
      initialInventory={inventory} 
      initialTransactions={transactions} 
    />
  );
}
