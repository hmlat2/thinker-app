import React, { useState } from 'react';
import { Brain, BookOpen, Clock, Users, ArrowRight, CheckCircle, Mail, Upload, Target, Lightbulb, Award, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-brand-light">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-brand-light sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/thinker-logo.png" 
                alt="Thinker Logo" 
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('landing')}
                className="text-brand-slate hover:text-brand-green transition-colors font-body"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('processor')}
                className="text-brand-slate hover:text-brand-green transition-colors font-body"
              >
                Try Demo
              </button>
              <button className="btn-primary">
                Join Beta
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-brand-sage/20">
        <div className="absolute inset-0 bg-subtle-pattern opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-sage/20 text-brand-slate text-sm font-medium mb-8 font-body">
              <Brain className="w-4 h-4 mr-2 text-brand-green" />
              Science-Backed Learning Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-header font-bold text-brand-navy mb-6 leading-tight">
              Built for brains
              <span className="block text-gradient">
                that want more
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-brand-slate mb-12 max-w-4xl mx-auto leading-relaxed font-body font-light">
              Empower yourself to learn smarter, retain knowledge longer, and unlock your full academic potential 
              using science-backed, easy-to-use study solutions.
            </p>

            {/* Email Capture Form */}
            <div className="max-w-lg mx-auto mb-16 animate-slide-up">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('processor')}
                    className="px-8 py-4 bg-gradient-to-r from-brand-green to-brand-slate text-white rounded-lg hover:from-brand-green/90 hover:to-brand-slate/90 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 mb-4 font-body font-medium"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Try Content Processor Demo</span>
                  </button>
                  
                  <select 
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-brand-sage/50 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200 font-body bg-white"
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
                      className="flex-1 px-4 py-3 rounded-l-lg border border-brand-sage/50 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200 font-body bg-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-brand-green to-brand-slate text-white rounded-r-lg hover:from-brand-green/90 hover:to-brand-slate/90 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
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
                <div className="mt-4 p-3 bg-brand-green/10 border border-brand-green/20 rounded-lg">
                  <p className="text-brand-green text-sm font-medium font-body">
                    ✅ Successfully subscribed! Check your email for next steps.
                  </p>
                </div>
              )}
              
              <p className="text-sm text-brand-slate/70 mt-3 font-body">
                Join 2,847 students already transforming their learning. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-header font-bold text-brand-navy mb-6">
              Does this sound familiar?
            </h2>
            <p className="text-xl text-brand-slate font-body max-w-3xl mx-auto">
              We get it. Traditional studying methods leave you frustrated and forgetting everything after exams.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-4">
                "I cram for exams but forget everything after"
              </h3>
              <p className="text-brand-slate font-body leading-relaxed">
                Hours of studying feel wasted when you can't remember what you learned last month, 
                let alone apply it in your career.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-4">
                "I'm drowning in course material"
              </h3>
              <p className="text-brand-slate font-body leading-relaxed">
                Every semester brings overwhelming amounts of content across multiple subjects, 
                making it impossible to truly master anything.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-4">
                "I don't know how to study effectively"
              </h3>
              <p className="text-brand-slate font-body leading-relaxed">
                Traditional study methods like highlighting and re-reading don't work, 
                but no one teaches you the science of learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-20 bg-brand-light/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-green/10 text-brand-green text-sm font-medium mb-8 font-body">
              <CheckCircle className="w-4 h-4 mr-2" />
              Science-Backed Solution
            </div>
            
            <h2 className="text-4xl md:text-5xl font-header font-bold text-brand-navy mb-8">
              Learn smarter, not harder
            </h2>
            
            <div className="text-xl text-brand-slate leading-relaxed max-w-4xl mx-auto mb-12 font-body">
              <p className="mb-6">
                Our platform uses spaced repetition, active recall, and interleaving techniques 
                to help you build deep, connected understanding of any subject. 
              </p>
              <p>
                Unlike cramming, this approach creates lasting neural pathways that serve you 
                throughout your career, not just until your next exam.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-brand-sage/20">
                <Brain className="w-10 h-10 text-brand-green" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-3">Smart Spacing</h3>
              <p className="text-brand-slate font-body leading-relaxed">Reviews content at optimal intervals based on your memory strength and cognitive load</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-brand-sage/20">
                <Target className="w-10 h-10 text-brand-green" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-3">Active Recall</h3>
              <p className="text-brand-slate font-body leading-relaxed">Tests your knowledge before showing answers to strengthen memory pathways</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-brand-sage/20">
                <Lightbulb className="w-10 h-10 text-brand-green" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-3">Connected Learning</h3>
              <p className="text-brand-slate font-body leading-relaxed">Links concepts across subjects to build comprehensive understanding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-header font-bold text-brand-navy mb-6">
              What drives us
            </h2>
            <p className="text-xl text-brand-slate font-body max-w-3xl mx-auto">
              Every feature we build is grounded in research and designed with your success in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">Science-Driven</h3>
              <p className="text-brand-slate font-body text-sm leading-relaxed">Every feature backed by proven research in memory and cognitive science</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">Growth Mindset</h3>
              <p className="text-brand-slate font-body text-sm leading-relaxed">Belief in every student's ability to improve and succeed with the right tools</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">Student-First</h3>
              <p className="text-brand-slate font-body text-sm leading-relaxed">Designed with empathy for your journey, reducing stress and boosting confidence</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">Innovation</h3>
              <p className="text-brand-slate font-body text-sm leading-relaxed">Continuously evolving with latest research and technology</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-brand-green to-brand-slate">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-header font-bold text-white mb-6">
            Ready to unlock your potential?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
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
                className="flex-1 px-6 py-4 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-green text-lg font-body"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-brand-slate rounded-r-lg hover:bg-brand-light transition-colors duration-200 flex items-center space-x-2 text-lg font-body font-semibold"
              >
                <span>Join Beta</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            
            <p className="text-white/80 text-sm mt-4 font-body">
              🚀 Limited spots available • 📚 Works for any subject • 🔬 Scientifically proven
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/thinker-logo.png" 
                alt="Thinker Logo" 
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            
            <div className="flex items-center space-x-6 text-brand-light/70">
              <button 
                onClick={() => setCurrentView('landing')}
                className="hover:text-white transition-colors font-body"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('processor')}
                className="hover:text-white transition-colors font-body"
              >
                Content Processor
              </button>
              <a href="#" className="hover:text-white transition-colors font-body">Privacy</a>
              <a href="#" className="hover:text-white transition-colors font-body">Terms</a>
              <a href="#" className="hover:text-white transition-colors font-body">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-brand-slate/30 text-center text-brand-light/60">
            <p className="font-body">&copy; 2025 Thinker. Built for brains that want more.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;