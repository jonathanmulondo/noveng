import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Mail, Lock, User, AlertCircle, Loader, CheckCircle, Phone, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate age (must be at least 13 years old)
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        setError('You must be at least 13 years old to register');
        return;
      }
    }

    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(email, password, fullName, {
        firstName,
        lastName,
        phone,
        dateOfBirth
      });
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-neutral-900 flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="50%" cy="50%" r="300" fill="none" stroke="url(#success-gradient)" strokeWidth="2" opacity="0.5">
              <animate attributeName="r" values="0;300" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-75 animate-pulse" />
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-2xl">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Account Created!</h2>
              <p className="text-purple-200 text-lg">
                Your account has been created successfully. Redirecting to login...
              </p>
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-neutral-900">
      {/* Animated Circuit Board Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuit-gradient-signup" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="url(#circuit-gradient-signup)" strokeWidth="2">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="20%" y1="0%" x2="20%" y2="100%" stroke="url(#circuit-gradient-signup)" strokeWidth="2">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="80%" y1="0%" x2="80%" y2="100%" stroke="url(#circuit-gradient-signup)" strokeWidth="2">
            <animate attributeName="opacity" values="1;0.3;1" dur="3.5s" repeatCount="indefinite" />
          </line>

          <circle cx="20%" cy="20%" r="4" fill="#a855f7">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="80%" cy="80%" r="4" fill="#ec4899">
            <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 animate-pulse" />
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
              Join Us
            </h2>
            <p className="text-purple-300 text-lg">Create your account and start your learning journey</p>
          </div>

          {/* Signup Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse" />

            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Sign Up</h3>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl backdrop-blur-sm flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-300 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      First Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                      <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 z-10" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="relative w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Last Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                      <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 z-10" />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="relative w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
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
                      className="relative w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Phone & Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Phone Number <span className="text-purple-400 text-xs">(optional)</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                      <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 z-10" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="relative w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Date of Birth <span className="text-purple-400 text-xs">(13+)</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                      <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 z-10" />
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="relative w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="relative w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                      <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 z-10" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="relative w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2 group overflow-hidden"
                  style={{
                    backgroundSize: '200% 100%',
                    backgroundPosition: loading ? '100% 0' : '0 0',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-purple-200">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-pink-400 font-bold hover:text-pink-300 transition-colors inline-flex items-center gap-1 group"
                  >
                    Log in
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom decoration */}
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
