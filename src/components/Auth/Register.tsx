import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { getRoleDashboardPath, type UserRole } from '../../auth/authorization';
import { rateLimiter } from '../../lib/supabase';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Phone,
  Globe,
  ArrowRight,
  AlertCircle,
  Smartphone,
  UserPlus
} from '../Icons';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { registerUser, supabaseClient } = useVerification();

  const [role, setRole] = useState<UserRole>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('United Kingdom');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dialCodes = [
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+1', country: 'US / Canada', flag: '🇺🇸' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+49', country: 'Germany (EU)', flag: '🇩🇪' },
    { code: '+33', country: 'France (EU)', flag: '🇫🇷' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  ];

  const countries = [
    'United Kingdom',
    'United States',
    'United Arab Emirates',
    'Canada',
    'Germany',
    'France',
    'Australia',
    'Kenya',
    'Other Diaspora',
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please provide your full legal name.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 5) {
      setErrorMessage('Please provide a valid phone number with dial code.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must accept the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    if (role === 'admin') {
      const trimmedKey = adminKey.trim();
      if (!trimmedKey) {
        setErrorMessage('Please enter the HQ Admin Access Code to register an Operations Admin account.');
        return;
      }
      if (trimmedKey !== 'DV-ADMIN-2026' && trimmedKey !== 'admin' && trimmedKey !== 'DV-HQ') {
        setErrorMessage('Invalid Admin Access Code. Enter valid authorization code (Default for setup: DV-ADMIN-2026).');
        return;
      }
    }

    // Rate limiter invariant check (Security Rule 10)
    const rateCheck = rateLimiter.check('auth-register-attempts', 5, 60000);
    if (!rateCheck.allowed) {
      setErrorMessage(
        `Too many consecutive registration attempts. Please wait ${rateCheck.retryAfterSec ?? 60} seconds.`
      );
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${dialCode} ${trimmedPhone}`;

      // Optional Supabase Auth Sign Up
      if (supabaseClient) {
        try {
          await supabaseClient.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
              data: {
                name: trimmedName,
                phone: fullPhone,
                role,
                locationAbroad: countryOfResidence,
              },
            },
          });
        } catch (supaErr) {
          console.warn('Supabase sign up skipped/handled locally', supaErr);
        }
      }

      // Complete registration in context
      const createdUser = registerUser({
        name: trimmedName,
        email: trimmedEmail,
        phone: fullPhone,
        locationAbroad: countryOfResidence,
        password,
        role,
      });

      // Role-Based Post-Registration Routing
      const targetPath = getRoleDashboardPath(createdUser.role);
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full mx-auto space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:bg-emerald-700 transition-colors">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-2xl font-black font-display tracking-tight text-slate-900">
              Diaspora<span className="text-emerald-700">Verify</span>
            </span>
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Secure, evidence-based field verification infrastructure in Kenya.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Role Selection Segment */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Account Type / Purpose
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'client'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${role === 'client' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Diaspora Client</span>
                    {role === 'client' && <span className="text-[9px] text-emerald-700 font-black">● ACTIVE</span>}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Order site audits, construction milestone checks & beacon surveys.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('agent')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'agent'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${role === 'agent' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Field Agent</span>
                    {role === 'agent' && <span className="text-[9px] text-amber-700 font-black">● ACTIVE</span>}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Licensed local verifiers conducting in-person inspections with GPS.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'admin'
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>HQ Admin</span>
                    {role === 'admin' && <span className="text-[9px] text-blue-700 font-black">● ACTIVE</span>}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Operations command desk, verifier dispatch, finance & QA audits.
                  </p>
                </div>
              </button>
            </div>

            {/* Admin Security Passcode Field */}
            {role === 'admin' && (
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-700" />
                    <span>Nairobi HQ Admin Authorization Code *</span>
                  </label>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Default: DV-ADMIN-2026</span>
                </div>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin authorization code"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Legal Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Full Legal Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi or Jane Doe"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. david.mwangi@domain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Phone with Dial Code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Primary Mobile Phone (With Dial Code)
              </label>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5 sm:col-span-4">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {dialCodes.map((d) => (
                      <option key={d.code + d.country} value={d.code}>
                        {d.flag} {d.code} ({d.country})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-7 sm:col-span-8 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="7700 900142"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Country of Residence */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Country / Current Residence
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  value={countryOfResidence}
                  onChange={(e) => setCountryOfResidence(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 w-4 h-4"
                />
                <span className="leading-snug">
                  I agree to the <Link to="/legal" className="text-emerald-700 font-semibold hover:underline">Terms of Service</Link>, Kenya Data Protection Act 2019 compliance standards, and the Field Verification Anti-Bribery Code of Conduct.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Provisioning Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>
                    Create Account & Proceed to {role === 'client' ? 'Client Dashboard' : 'Agent Workspace'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Login Referral */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">Already registered on DiasporaVerify?</span>
            <Link
              to={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
            >
              <span>Sign in to existing account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Public Navigation & Security Notice */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span>← Back to Public Website</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400">
            <span>Independent Ground Verifiers</span>
            <span>·</span>
            <span>Strict Zero-Conflict Clearance</span>
            <span>·</span>
            <span>Kenya DPA Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
};
