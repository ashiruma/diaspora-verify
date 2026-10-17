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
  UserPlus
} from '../Icons';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { registerUser, supabaseClient } = useVerification();

  const role: UserRole = 'client';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('United Kingdom');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dialCodes = [
    { code: '+44', country: 'UK', flag: 'UK' },
    { code: '+1', country: 'US / Canada', flag: 'US' },
    { code: '+971', country: 'UAE', flag: 'UAE' },
    { code: '+49', country: 'Germany (EU)', flag: 'DE' },
    { code: '+33', country: 'France (EU)', flag: 'FR' },
    { code: '+61', country: 'Australia', flag: 'AU' },
    { code: '+254', country: 'Kenya', flag: 'KE' },
    { code: '+27', country: 'South Africa', flag: 'ZA' },
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

      // Complete registration in context (elevates founder automatically if ashirumaabala@gmail.com)
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

  const handleSocialSimulate = (provider: string) => {
    setErrorMessage(`Social sign-in with ${provider} is disabled in security sandbox. Please use verified email and password.`);
  };

  return (
    <div className="min-h-screen bg-[#0e1311] text-[#f7f1e8] font-sans flex flex-col lg:grid lg:grid-cols-12 selection:bg-[#e0a24e] selection:text-[#141816]">
      
      {/* LEFT COLUMN: Cinematic Dusk Clouds Imagery (Nova Style) */}
      <div 
        className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-10 xl:p-14 bg-cover bg-center overflow-hidden border-r border-white/5"
        style={{
          backgroundImage: "url('https://kombai-assets.b-cdn.net/examples/thumbnails/assets/site-designs/signup/assets/bg.png')",
          backgroundColor: '#121816'
        }}
      >
        {/* Soft atmospheric gradient overlays blending photograph smoothly */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-[#121715]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1311] via-transparent to-black/50 pointer-events-none" />

        {/* Top Brand & Wordmark */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:border-[#e0a24e]/50 transition-all">
              <ShieldCheck className="w-5 h-5 text-[#e0a24e]" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-[#f7f1e8] flex items-center gap-1.5 font-display">
                <span>Diaspora<span className="text-[#e0a24e]">Verify</span></span>
                <span className="w-2 h-2 rounded-full bg-[#e0a24e] inline-block shadow-[0_0_8px_#e0a24e]" />
              </div>
              <span className="text-[10px] tracking-wider uppercase font-mono text-white/50 block">
                Independent Kenya Field Audits
              </span>
            </div>
          </Link>

          <span className="text-[11px] font-mono uppercase tracking-widest text-[#e0a24e] px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            Nova Studio Ref
          </span>
        </div>

        {/* Bottom Hero Quote & Evidence Credentials */}
        <div className="relative z-10 max-w-xl space-y-5">
          <div className="space-y-3">
            <p className="font-serif italic text-2xl xl:text-3xl text-[#f7f1e8] font-normal leading-snug tracking-tight">
              &ldquo;Verifiable reality on the ground in Kenya, audited directly for the diaspora.&rdquo;
            </p>
            <p className="text-xs xl:text-sm text-white/70 font-sans leading-relaxed">
              Every milestone inspection, beacon boundary verification, and material inventory is photographed with GPS coordinates and cryptographically hashed with SHA-256 before escrow release.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-white/80">
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>47 Counties Capability</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e0a24e]" />
              <span>SHA-256 Tamper-Proof</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Kenya DPA 2019 Compliant</span>
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Deep Forest Form Panel (Nova Style) */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-[#121715]/95 backdrop-blur-2xl border-l border-white/10 overflow-y-auto">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between text-xs pb-6">
          <Link 
            to="/" 
            className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <span>← Back to Home</span>
          </Link>
          <Link 
            to={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
            className="font-bold text-[#e0a24e] hover:text-[#f0bc7d] transition-colors flex items-center gap-1"
          >
            <span>Log in →</span>
          </Link>
        </div>

        {/* Main Sign Up Card */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6 py-4">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#e0a24e] bg-[#e0a24e]/10 px-2.5 py-1 rounded-full border border-[#e0a24e]/20 inline-block">
              DIASPORA PRINCIPAL ONBOARDING
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#f7f1e8] font-normal tracking-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
              Commission independent ground audits, verify construction progress, and inspect land boundaries with zero conflict of interest.
            </p>
          </div>

          {/* Social Auth Option (Nova Style) */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialSimulate('Google')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.14] text-xs font-semibold text-[#f7f1e8] flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" />
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-white/35 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
              <span>or sign up with email</span>
            </div>
          </div>

          {/* Account Type Indicator (Client-Only Public Registration) */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-white/15 text-[#e0a24e] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f7f1e8] flex items-center gap-2">
                    <span>Diaspora Client Account</span>
                    <span className="text-[9px] font-mono font-bold text-[#e0a24e] bg-[#e0a24e]/15 px-1.5 py-0.5 rounded border border-[#e0a24e]/30">
                      Standard Client
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-snug">
                    Order site audits, construction milestone checks, and cadastral beacon surveys.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] text-[11px] text-white/60 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#e0a24e] mt-0.5 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-white/80">Staff & Verifier Onboarding:</strong> Field Agent and HQ Operations accounts are invite-only and provisioned directly by the Nairobi Operations Desk.
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Legal Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                Full Legal Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi or Jane Doe"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.14] text-xs font-medium text-[#f7f1e8] placeholder-white/30 focus:outline-none focus:border-[#e0a24e] focus:ring-1 focus:ring-[#e0a24e] transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. david.mwangi@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.14] text-xs font-medium text-[#f7f1e8] placeholder-white/30 focus:outline-none focus:border-[#e0a24e] focus:ring-1 focus:ring-[#e0a24e] transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone with Dial Code */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                Primary Mobile Phone
              </label>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5 sm:col-span-4">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[#1c221f] border border-white/[0.14] text-xs font-medium text-[#f7f1e8] focus:outline-none focus:border-[#e0a24e] focus:ring-1 focus:ring-[#e0a24e]"
                  >
                    {dialCodes.map((d) => (
                      <option key={d.code + d.country} value={d.code} className="bg-[#1c221f] text-white">
                        {d.flag} {d.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-7 sm:col-span-8 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="7700 900142"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.14] text-xs font-medium text-[#f7f1e8] placeholder-white/30 focus:outline-none focus:border-[#e0a24e] focus:ring-1 focus:ring-[#e0a24e] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Country of Residence */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                Country / Current Residence Abroad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  value={countryOfResidence}
                  onChange={(e) => setCountryOfResidence(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#1c221f] border border-white/[0.14] text-xs font-medium text-[#f7f1e8] focus:outline-none focus:border-[#e0a24e] focus:ring-1 focus:ring-[#e0a24e]"
                >
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-[#1c221f] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.14] text-xs font-medium text-[#f7f1e8] placeholder-white/30 focus:outline-none focus:border-[#e0a24e] focus:ring-1 focus:ring-[#e0a24e] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.14] text-xs font-medium text-[#f7f1e8] placeholder-white/30 focus:outline-none focus:border-[#e0a24e] focus:ring-1 focus:ring-[#e0a24e] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-white/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-white/20 text-[#e0a24e] focus:ring-[#e0a24e] mt-0.5 w-4 h-4 bg-white/10"
                />
                <span className="leading-snug text-[11px]">
                  I agree to the <Link to="/legal" className="text-[#e0a24e] font-semibold hover:underline">Terms of Service</Link>, Kenya Data Protection Act 2019 compliance standards, and the Field Verification Anti-Bribery Code of Conduct.
                </span>
              </label>
            </div>

            {/* Amber CTA Button (Nova Style) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-b from-[#eab167] to-[#e0a24e] hover:from-[#f0bc7d] hover:to-[#e8ab57] text-[#2b1c08] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 transition-all cursor-pointer transform active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Provisioning Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Client Account & Proceed</span>
                </>
              )}
            </button>
          </form>

          {/* Login Referral */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-white/60">Already registered on DiasporaVerify?</span>
            <Link
              to={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
              className="font-bold text-[#e0a24e] hover:text-[#f0bc7d] flex items-center gap-1 transition-colors"
            >
              <span>Sign in to existing account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Footer Notice */}
        <div className="pt-6 border-t border-white/5 text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-white/40">
            <span>Independent Ground Verifiers</span>
            <span>·</span>
            <span>Zero-Conflict Clearance</span>
            <span>·</span>
            <span>Kenya DPA Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
};
