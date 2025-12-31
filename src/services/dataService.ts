import { ProductionLog, ShopInventory, Transaction, Ledger, UtilityLog, TransactionType } from '../types';

// Mock Data to make the app look alive immediately
const MOCK_PRODUCTION: ProductionLog[] = [
  { id: '1', date: '2025-01-01', rawMaterialKg: 100, workingFeeRs: 500, pindiProducedKg: 40, pindiSoldKg: 30, pindiRateRs: 30, totalDailyRevenue: 1400 },
  { id: '2', date: '2025-01-02', rawMaterialKg: 120, workingFeeRs: 600, pindiProducedKg: 48, pindiSoldKg: 40, pindiRateRs: 30, totalDailyRevenue: 1800 },
  { id: '3', date: '2025-01-03', rawMaterialKg: 90, workingFeeRs: 450, pindiProducedKg: 36, pindiSoldKg: 20, pindiRateRs: 30, totalDailyRevenue: 1050 },
  { id: '4', date: '2025-01-04', rawMaterialKg: 110, workingFeeRs: 550, pindiProducedKg: 44, pindiSoldKg: 35, pindiRateRs: 32, totalDailyRevenue: 1670 },
  { id: '5', date: '2025-01-05', rawMaterialKg: 130, workingFeeRs: 650, pindiProducedKg: 52, pindiSoldKg: 50, pindiRateRs: 32, totalDailyRevenue: 2250 },
  { id: '6', date: '2025-01-06', rawMaterialKg: 105, workingFeeRs: 525, pindiProducedKg: 42, pindiSoldKg: 25, pindiRateRs: 32, totalDailyRevenue: 1325 },
  { id: '7', date: '2025-01-07', rawMaterialKg: 115, workingFeeRs: 575, pindiProducedKg: 46, pindiSoldKg: 40, pindiRateRs: 32, totalDailyRevenue: 1855 },
];

const MOCK_INVENTORY: ShopInventory[] = [
  { id: '1', productName: 'Groundnut Oil', category: 'Oil', quantity: 150, unit: 'lt', pricePerUnit: 180, totalInvestment: 27000 },
  { id: '2', productName: 'Gingelly Oil', category: 'Oil', quantity: 80, unit: 'lt', pricePerUnit: 220, totalInvestment: 17600 },
  { id: '3', productName: 'Coconut Oil', category: 'Oil', quantity: 45, unit: 'lt', pricePerUnit: 250, totalInvestment: 11250 },
  { id: '4', productName: 'Deepam Oil', category: 'Oil', quantity: 60, unit: 'lt', pricePerUnit: 160, totalInvestment: 9600 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2025-01-01', amount: 5000, type: 'INCOME' as TransactionType, category: 'Sales', paymentMethod: 'Cash', description: 'Daily Counter Sale' },
  { id: '2', date: '2025-01-02', amount: 200, type: 'EXPENSE' as TransactionType, category: 'Transport', paymentMethod: 'Cash' },
  { id: '3', date: '2025-01-03', amount: 1500, type: 'EXPENSE' as TransactionType, category: 'Power', paymentMethod: 'Online' },
  { id: '4', date: '2025-01-04', amount: 3000, type: 'INCOME' as TransactionType, category: 'Sales', paymentMethod: 'Online', description: 'Bulk Order' },
  { id: '5', date: '2025-01-05', amount: 12000, type: 'INCOME' as TransactionType, category: 'Sales', paymentMethod: 'Cash', description: 'Weekly Settlement' },
  { id: '6', date: '2025-01-05', amount: 500, type: 'EXPENSE' as TransactionType, category: 'Maintenance', paymentMethod: 'Cash' },
];

export const dataService = {
  initialize: async () => Promise.resolve(true),
  
  getProduction: async () => Promise.resolve(MOCK_PRODUCTION),
  getInventory: async () => Promise.resolve(MOCK_INVENTORY),
  getTransactions: async () => Promise.resolve(MOCK_TRANSACTIONS),
  getLedgers: async () => Promise.resolve([] as Ledger[]),
  getUtilities: async () => Promise.resolve([] as UtilityLog[]),

  // Save functions (Simulated)
  saveProduction: async (data: ProductionLog[]) => console.log('Saved Production', data),
  saveTransactions: async (data: Transaction[]) => console.log('Saved Transaction', data),
  saveLedgers: async (data: Ledger[]) => console.log('Saved Ledger', data),
  saveUtilities: async (data: UtilityLog[]) => console.log('Saved Utility', data),
};
