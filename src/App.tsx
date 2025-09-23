import React, { useState } from 'react';
import { Brain, BookOpen, Clock, Users, ArrowRight, CheckCircle, Mail, Upload } from 'lucide-react';
import ContentProcessor from './components/ContentProcessor';

function App() {
  const [email, setEmail] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('waitlist');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'processor'>('landing');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };

  if (currentView === 'processor') {
    return <ContentProcessor />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8 animate-pulse">
              <Brain className="w-4 h-4 mr-2" />
              Early Access Now Available
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform How You Learn
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                For Life, Not Just Exams
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master any subject with scientifically-proven techniques that build lasting understanding, 
              not temporary memorization.
            </p>

            {/* Email Capture Form */}
            <div className="max-w-md mx-auto mb-16">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('processor')}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 mb-4"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Try Content Processor Demo</span>
                  </button>
                  
                  <select 
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="waitlist">Join Beta Waitlist</option>
                    <option value="substack">Subscribe via Substack</option>
                    <option value="beehiiv">Subscribe via Beehiiv</option>
                    <option value="mailchimp">Subscribe via Mailchimp</option>
                  </select>
                  
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-r-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
                    >
                      {isSubmitted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              {isSubmitted && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    ✅ Successfully subscribed! Check your email for next steps.
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-3">
                Join 2,847 students already on the waitlist. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Sound Familiar?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="text-red-500 mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                "I cram for exams but forget everything after"
              </h3>
              <p className="text-gray-600">
                Hours of studying feel wasted when you can't remember what you learned last month, 
                let alone apply it in your career.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="text-orange-500 mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                "I'm drowning in course material"
              </h3>
              <p className="text-gray-600">
                Every semester brings overwhelming amounts of content across multiple subjects, 
                making it impossible to truly master anything.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="text-purple-500 mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                "I don't know how to study effectively"
              </h3>
              <p className="text-gray-600">
                Traditional study methods like highlighting and re-reading don't work, 
                but no one teaches you the science of learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4 mr-2" />
            Science-Backed Solution
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Build Knowledge That Lasts a Lifetime
          </h2>
          
          <div className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
            <p className="mb-6">
              Our platform uses spaced repetition, active recall, and interleaving techniques 
              to help you build deep, connected understanding of any subject. 
            </p>
            <p>
              Unlike cramming, this approach creates lasting neural pathways that serve you 
              throughout your career, not just until your next exam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Spacing</h3>
              <p className="text-gray-600">Reviews content at optimal intervals based on your memory strength</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Recall</h3>
              <p className="text-gray-600">Tests your knowledge before showing answers to strengthen memory</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connected Learning</h3>
              <p className="text-gray-600">Links concepts across subjects to build comprehensive understanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Learn Smarter, Not Harder?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already building knowledge that lasts. 
            Get early access to our beta and start transforming your learning today.
          </p>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for beta access"
                className="flex-1 px-6 py-4 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-lg"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-blue-600 rounded-r-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 text-lg font-semibold"
              >
                <span>Join Beta</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            
            <p className="text-blue-100 text-sm mt-4">
              🚀 Limited spots available • 📚 Works for any subject • 🔬 Scientifically proven
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">LearnForLife</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <button 
                onClick={() => setCurrentView('landing')}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('processor')}
                className="hover:text-white transition-colors"
              >
                Content Processor
              </button>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 LearnForLife. Built for students who want to learn smarter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;