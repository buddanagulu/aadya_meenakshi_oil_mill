export type TransactionType = 'INCOME' | 'EXPENSE';

export interface ProductionLog {
  id: string; 
  date: string;
  raw_material_kg: number; 
  working_fee_rs: number; 
  pindi_produced_kg: number; 
  pindi_sold_kg: number;
  pindi_rate_rs: number;
  total_daily_revenue: number;
}

export interface ShopInventory {
  id: string;
  product_name: string;
  category: 'Oil' | 'Flour' | 'ByProduct';
  quantity: number; 
  unit: 'kg' | 'lt';
  price_per_unit: number;
  total_investment: number; // derived or stored? stored usually.
  last_updated?: string;
}
  
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  payment_method: string;
  description?: string;
}

export interface Ledger {
  id: string;
  person_name: string;
  total_debt: number;
  last_transaction_date: string;
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
