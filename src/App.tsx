import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-sage/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <img 
              src="/thinker-logo.png" 
              alt="Thinker Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-brand-slate font-body">Loading your study environment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;