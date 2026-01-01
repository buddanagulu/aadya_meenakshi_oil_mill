import React from 'react';
import { 
  LayoutDashboard, 
  Factory, 
  Store, 
  Receipt, 
  Users, 
  Zap 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Analytics', icon: <LayoutDashboard size={20} /> },
  { id: 'production_logs', label: 'Production Mill', icon: <Factory size={20} /> },
  { id: 'shop_inventory', label: 'Shop Inventory', icon: <Store size={20} /> },
  { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
  { id: 'ledgers', label: 'Dues & Ledgers', icon: <Users size={20} /> },
  { id: 'utility_logs', label: 'Utilities', icon: <Zap size={20} /> },
  { id: 'profiles', label: 'Profiles', icon: <Users size={20} /> },
];

export const TRANSACTION_CATEGORIES = [
  'Power', 'Rent', 'Helper', 'Ganuga Repair', 'Pindi Machine', 'House', 'Lic', 'Shop Furniture', 'General'
];

export const PAYMENT_METHODS = ['PhonePe', 'Cash', 'Paytm', 'Bank Transfer', 'BHIM'];
