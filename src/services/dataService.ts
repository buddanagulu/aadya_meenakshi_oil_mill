import { ProductionLog, ShopInventory, Transaction, Ledger, UtilityLog } from '../types'

// Mock Data to make the app look alive immediately
const MOCK_PRODUCTION: ProductionLog[] = [
  { id: '1', date: '2025-01-01', machineType: 'Ganuga', rawMaterialKg: 100, outputKg: 40, cakeKg: 60, totalDailyRevenue: 12000 },
  { id: '2', date: '2025-01-02', machineType: 'Pindi', rawMaterialKg: 50, outputKg: 48, totalDailyRevenue: 2000 },
]

const MOCK_INVENTORY: ShopInventory[] = [
  { id: '1', productName: 'Groundnut Oil', category: 'Oil', quantity: 150, unit: 'lt', pricePerUnit: 180 },
  { id: '2', productName: 'Gingelly Oil', category: 'Oil', quantity: 80, unit: 'lt', pricePerUnit: 220 },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2025-01-01', amount: 5000, type: 'INCOME', category: 'Sales', paymentMethod: 'Cash', description: 'Daily Counter Sale' },
  { id: '2', date: '2025-01-02', amount: 200, type: 'EXPENSE', category: 'Transport', paymentMethod: 'Cash' },
]

export const dataService = {
  initialize: async () => Promise.resolve(true),
  getProduction: async (): Promise<ProductionLog[]> => Promise.resolve(MOCK_PRODUCTION),
  getInventory: async (): Promise<ShopInventory[]> => Promise.resolve(MOCK_INVENTORY),
  getTransactions: async (): Promise<Transaction[]> => Promise.resolve(MOCK_TRANSACTIONS),
  getLedgers: async (): Promise<Ledger[]> => Promise.resolve([] as Ledger[]),
  getUtilities: async (): Promise<UtilityLog[]> => Promise.resolve([] as UtilityLog[]),

  // Save functions (simulated)
  saveProduction: async (data: ProductionLog[]) => {
    console.log('Saved Production', data)
    return Promise.resolve(true)
  },
  saveTransactions: async (data: Transaction[]) => {
    console.log('Saved Transaction', data)
    return Promise.resolve(true)
  },
  saveLedgers: async (data: Ledger[]) => {
    console.log('Saved Ledger', data)
    return Promise.resolve(true)
  },
  saveUtilities: async (data: UtilityLog[]) => {
    console.log('Saved Utility', data)
    return Promise.resolve(true)
  },
}
