export type TransactionType = 'INCOME' | 'EXPENSE'

export interface ProductionLog {
  id: string
  date: string
  machineType: 'Ganuga' | 'Pindi'
  rawMaterialKg: number
  outputKg: number
  cakeKg?: number
  totalDailyRevenue: number
}

export interface ShopInventory {
  id: string
  productName: string
  category: 'Oil' | 'Flour' | 'ByProduct'
  quantity: number
  unit: 'kg' | 'lt'
  pricePerUnit: number
}

export interface Transaction {
  id: string
  date: string
  amount: number
  type: TransactionType
  category: string
  paymentMethod: 'Cash' | 'Online' | 'Credit'
  description?: string
}

export interface Ledger {
  id: string
  personName: string
  totalDebt: number
  lastTransactionDate: string
  status: 'Active' | 'Settled'
}

export interface UtilityLog {
  id: string
  date: string
  type: 'Electricity' | 'Maintenance' | 'Rent'
  cost: number
  reading?: number
}

export interface User {
  username: string
  role: 'SUPER_ADMIN' | 'OPERATOR'
  lastLogin: string
}
