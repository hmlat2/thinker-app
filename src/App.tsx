import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-sage/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-slate font-body">Loading...</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

export default App;
