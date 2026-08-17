import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, UploadCloud, Search, Columns, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { currentUser, loginWithGoogle, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { name: 'Upload Report', href: '/upload', icon: UploadCloud },
    { name: 'Smart Search', href: '/search', icon: Search },
    { name: 'Compare', href: '/compare', icon: Columns },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-2">
            <div className="p-2 bg-brand-500 rounded-lg text-white">
                <ShieldAlert size={20} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">SDK Repo</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="md:hidden text-xl font-bold text-slate-800">
             SDK Repo
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
             {currentUser ? (
               <div className="flex items-center gap-4">
                 <span className="text-sm font-medium text-slate-700">{currentUser.displayName || currentUser.email}</span>
                 <button onClick={logout} className="text-sm shadow-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">Log out</button>
               </div>
             ) : (
               <>
                 <button onClick={loginWithGoogle} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log in</button>
                 <button onClick={loginWithGoogle} className="text-sm shadow-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">Sign up</button>
               </>
             )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto h-full">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
