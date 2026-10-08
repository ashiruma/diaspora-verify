import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { DEMO_USERS, REGISTERED_USERS_KEY } from '../../auth/demoUsers';
import { getRoleDashboardPath, canAccessRoute, normalizeRole, type AuthenticatedUser } from '../../auth/authorization';
import { rateLimiter } from '../../lib/supabase';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  LogIn
} from '../Icons';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { currentUser, isAuthenticated, login, supabaseClient } = useVerification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated and visiting /login directly, redirect to dashboard or allowed redirectParam
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (redirectParam && canAccessRoute(currentUser, redirectParam).allowed) {
        navigate(redirectParam, { replace: true });
      } else {
        navigate(getRoleDashboardPath(currentUser.role), { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, redirectParam, navigate]);

  const handleSuccessfulAuth = (user: AuthenticatedUser) => {
    login(user, rememberMe);

    // Evaluate target redirection
    const defaultRoute = getRoleDashboardPath(user.role);
    if (redirectParam) {
      const accessCheck = canAccessRoute(user, redirectParam);
      if (accessCheck.allowed) {
        navigate(redirectParam, { replace: true });
        return;
      }
    }
    navigate(defaultRoute, { replace: true });
  };


  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please provide a valid email format.');
      return;
    }
    if (!trimmedPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    // Rate limiter invariant check (Security Rule 10)
    const rateCheck = rateLimiter.check('auth-login-attempts', 5, 60000);
    if (!rateCheck.allowed) {
      setErrorMessage(
        `Too many consecutive login attempts. Please wait ${rateCheck.retryAfterSec ?? 60} seconds before retrying.`
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Check Registered Users from localStorage
      try {
        const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
        if (storedUsersRaw) {
          const storedUsers: any[] = JSON.parse(storedUsersRaw);
          const found = storedUsers.find(
            (u) => u.email.toLowerCase() === trimmedEmail
          );
          if (found) {
            if (found.password && found.password !== trimmedPassword) {
              setErrorMessage('Incorrect password. Please check your credentials and try again.');
              setLoading(false);
              return;
            }
            handleSuccessfulAuth(found);
            return;
          }
        }
      } catch (err) {
        console.error('Error reading registered users', err);
      }

      // 2. Official HQ Operations Admin / Staff accounts
      if (
        (trimmedEmail === 'admin@diasporaverify.com' || 
         trimmedEmail === 'sarah.kamau@diasporaverify.co.ke' ||
         trimmedEmail === 'operations@diasporaverify.com') &&
        (trimmedPassword === 'demo123' || trimmedPassword === 'Admin2026!')
      ) {
        const adminUser = DEMO_USERS.admin;
        handleSuccessfulAuth({
          ...adminUser,
          email: trimmedEmail,
        });
        return;
      }

      // 3. Supabase Auth Integration
      if (supabaseClient) {
        const { data: supaData, error: supaError } = await supabaseClient.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (!supaError && supaData.user) {
          const uRole = normalizeRole(
            (supaData.user.user_metadata?.role as string) || 'client'
          );
          const supaUser: AuthenticatedUser = {
            id: supaData.user.id,
            email: supaData.user.email || trimmedEmail,
            name:
              supaData.user.user_metadata?.name ||
              trimmedEmail.split('@')[0],
            role: uRole,
            clientId: uRole === 'client' ? supaData.user.id : undefined,
            agentId: uRole === 'agent' ? supaData.user.id : undefined,
            phone: supaData.user.phone,
            locationAbroad: supaData.user.user_metadata?.locationAbroad || 'Diaspora',
            mfaEnabled: false,
          };
          handleSuccessfulAuth(supaUser);
          return;
        }
      }

      // If user not found in registry:
      setErrorMessage('Account not found with this email. Please register for a new account below.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full mx-auto space-y-8">
        
        {/* Top Return Link */}
        <div className="flex items-center justify-between text-xs">
          <Link to="/" className="font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5">
            <span>← Back to DiasporaVerify Home</span>
          </Link>
          <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
            Create an account →
          </Link>
        </div>

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
            Sign In to Your Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Physical on-ground due diligence, cadastral audits, and construction milestone gating across all 47 Kenyan counties.
          </p>

          {redirectParam && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Authentication required to access: <code className="font-mono text-amber-950 font-bold">{redirectParam}</code></span>
            </div>
          )}
        </div>

        {/* Standard Email & Password Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">


          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="leading-relaxed">{successNotice}</div>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
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
                  placeholder="e.g. david.mwangi.uk@gmail.com or jane.doe@diasporaverify.demo"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>
            </div>

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
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50/50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-slate-600 font-medium">Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Referral */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">Don't have an active account yet?</span>
            <Link
              to={redirectParam ? `/register?redirect=${encodeURIComponent(redirectParam)}` : '/register'}
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
            >
              <span>Register new account</span>
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
            <span>Kenya DPA 2019 Compliant</span>
            <span>·</span>
            <span>ODPC Registered</span>
            <span>·</span>
            <span>SHA-256 Hashed Evidence Audit</span>
          </div>
        </div>

      </div>
    </div>
  );
};
