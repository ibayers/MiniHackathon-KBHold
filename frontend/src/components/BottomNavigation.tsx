import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const BottomNavigation: React.FC<{ className?: string }> = ({ 
  className = 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-white/5 bg-background-dark/80 backdrop-blur-xl px-6 pb-8 pt-4 z-100' 
}) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: 'home', path: '/protected' },
    { name: 'Wallet', icon: 'account_balance_wallet', path: '/wallet' },
    { name: 'Profile', icon: 'person', path: '/profile' },
  ];

  return (
    <nav className={className}>
      <div className="flex justify-around items-center relative z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  isActive ? 'fill-current' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
