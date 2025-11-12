import React, { createContext, useContext } from 'react';

interface User {
  id: string;
  user_metadata?: {
    username?: string;
  };
}

interface AuthContextType {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user: User = {
    id: 'local-user',
    user_metadata: {
      username: 'Student'
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Sign in not implemented - using local storage');
  };

  const signUp = async (email: string, password: string, username: string) => {
    console.log('Sign up not implemented - using local storage');
  };

  const signOut = async () => {
    console.log('Sign out not implemented - using local storage');
  };

  const value = {
    user,
    session: null,
    loading: false,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
