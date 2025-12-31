import React from 'react';
import { 
  LayoutDashboard, 
  Factory, 
  Store, 
  Receipt, 
  Users, 
  Zap, 
  TrendingUp 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'production', label: 'Production (Mill)', icon: <Factory size={20} /> },
  { id: 'inventory', label: 'Shop Inventory', icon: <Store size={20} /> },
  { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
  { id: 'ledgers', label: 'Dues & Ledgers', icon: <Users size={20} /> },
  { id: 'utilities', label: 'Utilities (Power)', icon: <Zap size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
];

export const TRANSACTION_CATEGORIES = [
  'Power', 'Rent', 'Helper', 'Ganuga Repair', 'Pindi Machine', 'House', 'Lic', 'Shop Furniture', 'General'
];

export const PAYMENT_METHODS = ['PhonePe', 'Cash', 'Paytm', 'Bank Transfer', 'BHIM'];
