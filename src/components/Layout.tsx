import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-indigo-700 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold">Ganuga Mill Manager</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition-transform duration-200 ease-in-out
        w-60 bg-indigo-900 text-white flex flex-col z-[60]
      `}>
        <div className="p-4 hidden md:block">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500 rounded-lg">🛢️</span>
            Mill Manager
          </h1>
          <p className="text-indigo-300 text-[10px] mt-1 font-medium">Data Control Tower</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${activeTab === item.id 
                  ? 'bg-indigo-700 text-white shadow-lg' 
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 bg-indigo-950 mt-auto space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
              AM
            </div>
            <div>
              <p className="text-xs font-semibold">Admin Mode</p>
              <p className="text-[10px] text-indigo-400">Mill Owner</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 bg-indigo-900 hover:bg-red-600 text-indigo-200 hover:text-white rounded-lg transition-colors text-xs font-medium border border-indigo-800 hover:border-red-500"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-3 md:p-5">
          {children}
        </div>
      </main>
    </div>
  );
};
