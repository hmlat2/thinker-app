import React, { useState } from 'react';
import { Eye, EyeOff, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signIn, signUp, loading } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isSignUp) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.username);
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (error: any) {
      setErrors({ submit: error.message });
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-sage/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img 
              src="/thinker-logo.png" 
              alt="Thinker Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-header font-bold text-brand-navy mb-2">
            Built for brains
            <span className="block text-gradient">that want more</span>
          </h1>
          <p className="text-brand-slate font-body">
            {isSignUp 
              ? 'Join thousands of students mastering long-term retention'
              : 'Welcome back to your personalized study environment'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="card p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-header font-bold text-brand-navy mb-2">
              {isSignUp ? 'Create Your Account' : 'Sign In'}
            </h2>
            <p className="text-brand-slate font-body">
              {isSignUp 
                ? 'Start your journey to smarter studying'
                : 'Access your study materials and progress'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body transition-colors ${
                    errors.username ? 'border-red-300 bg-red-50' : 'border-brand-sage/50'
                  }`}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 font-body flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.username}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-brand-sage/50'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 font-body flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body transition-colors ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-brand-sage/50'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-slate hover:text-brand-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 font-body flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body transition-colors ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-brand-sage/50'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 font-body flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-body flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Brain className="w-5 h-5 mr-2" />
                  {isSignUp ? 'Start Learning Smarter' : 'Access My Studies'}
                </div>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-brand-slate font-body">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-brand-green hover:text-brand-slate font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-header font-semibold text-brand-navy mb-4 text-center">
            What you'll get access to:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-brand-slate font-body">AI-powered note summarization</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-brand-slate font-body">Spaced repetition flashcards</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-brand-slate font-body">Class organization system</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-brand-slate font-body">Study scheduling & goals</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-brand-slate font-body">Progress tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-brand-slate font-body">Science-backed methods</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-brand-slate/70 text-sm font-body">
          <p>&copy; 2025 Thinker. Built for brains that want more.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;