export type TransactionType = 'INCOME' | 'EXPENSE';

export interface ProductionLog {
  id: string; // or number, keeping string for now based on user mock
  date: string;
  rawMaterialKg: number; // seeds/grains
  workingFeeRs: number; // revenue from processing
  pindiProducedKg: number; // output
  pindiSoldKg: number;
  pindiRateRs: number;
  totalDailyRevenue: number;
}

export interface ShopInventory {
  id: string;
  productName: string;
  category: 'Oil' | 'Flour' | 'ByProduct';
  quantity: number; // mapped from quantity/stock_kg_litres
  unit: 'kg' | 'lt';
  pricePerUnit: number;
  totalInvestment: number; // derived
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: string;
  description?: string;
}

export interface Ledger {
  id: string;
  personName: string;
  totalDebt: number;
  lastTransactionDate: string;
  status: 'Active' | 'Settled';
}

export interface UtilityLog {
  id: string;
  date: string;
  type: 'Electricity' | 'Maintenance' | 'Rent';
  cost: number;
  reading?: number;
}

export interface User {
  username: string;
  role: 'SUPER_ADMIN' | 'OPERATOR';
  lastLogin: string;
}
