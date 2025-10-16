import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3 p-3 bg-brand-light/50 rounded-lg">
        <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-brand-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-brand-navy font-body truncate">
            {user?.user_metadata?.username || 'Student'}
          </p>
          <p className="text-xs text-brand-slate/70 font-body truncate">
            {user?.email}
          </p>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full flex items-center space-x-3 px-4 py-3 text-brand-slate hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-body"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default UserMenu;
