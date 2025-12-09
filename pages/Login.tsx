import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, AlertCircle, Loader, ArrowRight, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-neutral-900">
      {/* Animated Circuit Board Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Circuit lines */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* Animated glowing lines */}
            <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="url(#circuit-gradient)" strokeWidth="2">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="20%" y1="0%" x2="20%" y2="100%" stroke="url(#circuit-gradient)" strokeWidth="2">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="80%" y1="0%" x2="80%" y2="100%" stroke="url(#circuit-gradient)" strokeWidth="2">
              <animate attributeName="opacity" values="1;0.3;1" dur="3.5s" repeatCount="indefinite" />
            </line>
            <line x1="10%" y1="80%" x2="90%" y2="80%" stroke="url(#circuit-gradient)" strokeWidth="2">
              <animate attributeName="opacity" values="1;0.3;1" dur="4.5s" repeatCount="indefinite" />
            </line>

            {/* Circuit nodes */}
            <circle cx="20%" cy="20%" r="4" fill="#a855f7">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="80%" cy="20%" r="4" fill="#ec4899">
              <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="20%" cy="80%" r="4" fill="#8b5cf6">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="80%" cy="80%" r="4" fill="#a855f7">
              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="relative">
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 animate-pulse" />

                {/* Logo */}
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                  <Zap size={36} className="text-white" fill="white" />
                </div>
              </div>

              <div className="text-left">
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                  NovEng
                </h1>
                <p className="text-sm text-purple-300 font-medium uppercase tracking-widest">
                  Hands on the Future
                </p>
              </div>
            </div>

            <h2 className="text-5xl font-display font-bold text-white mb-3">
              Welcome
            </h2>
            <p className="text-purple-300 text-lg">Log in to continue your journey</p>
          </div>

          {/* Login Card with Glass Effect */}
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse" />

            {/* Glass card */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Log In</h3>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl backdrop-blur-sm flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-300 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 z-10" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="relative w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 z-10" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="relative w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2 group overflow-hidden"
                  style={{
                    backgroundSize: '200% 100%',
                    backgroundPosition: loading ? '100% 0' : '0 0',
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log In
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Signup Link */}
              <div className="mt-8 text-center">
                <p className="text-purple-200">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-pink-400 font-bold hover:text-pink-300 transition-colors inline-flex items-center gap-1 group"
                  >
                    Sign up
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom sparkle decoration */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
