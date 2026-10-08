import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, User, Eye, EyeOff, X, Sliders, Settings, ArrowRight } from 'lucide-react';
import { verifyAdminCredentials } from '../../services/auth';
import { soundFx } from '../../services/audioEffects';

export type ProtectedFeature = 'config' | 'simulator' | 'general';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetFeature?: ProtectedFeature;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetFeature = 'general',
}) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  const idInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAdminId('');
      setPassword('');
      setErrorMessage('');
      setIsSubmitting(false);
      setIsSuccessAnim(false);
      setShowPassword(false);
      // Auto focus ID field
      setTimeout(() => {
        idInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccessAnim) return;

    if (!adminId.trim()) {
      setErrorMessage('Please enter your Admin ID');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter the Admin Password');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const isValid = verifyAdminCredentials(adminId, password);

    setTimeout(() => {
      if (isValid) {
        setIsSuccessAnim(true);
        try {
          soundFx.playRankUp();
        } catch {
          // Ignore audio errors
        }
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        setIsSubmitting(false);
        setErrorMessage('ACCESS DENIED: Invalid Admin ID or Password');
        try {
          soundFx.playRankDown();
        } catch {
          // Ignore audio errors
        }
      }
    }, 300);
  };

  const getFeatureDetails = () => {
    switch (targetFeature) {
      case 'simulator':
        return {
          title: 'Live Event Simulator Access',
          icon: <Sliders className="w-4 h-4 text-[#f59e0b]" />,
          description: 'Administrative clearance required to inject live simulation events, triggers & score adjustments.',
        };
      case 'config':
        return {
          title: 'Telemetry Settings Access',
          icon: <Settings className="w-4 h-4 text-[#f59e0b]" />,
          description: 'Administrative clearance required to configure Google Sheet data feeds, polling rates & system telemetry.',
        };
      default:
        return {
          title: 'Restricted Feature Access',
          icon: <Lock className="w-4 h-4 text-[#f59e0b]" />,
          description: 'Please authenticate with your Admin credentials to proceed.',
        };
    }
  };

  const feature = getFeatureDetails();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Times_New_Roman',Times,serif]"
    >
      <div className="relative w-full max-w-md bg-[#090c12]/95 border border-[#f59e0b]/40 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden">
        {/* Top Scanline & Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent shadow-[0_0_12px_#f59e0b]" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1f293d]/80 flex items-center justify-between bg-gradient-to-r from-[#141926] to-[#090c12]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border transition-colors ${
              isSuccessAnim 
                ? 'bg-green-500/20 border-green-500 text-green-400'
                : 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#f59e0b]'
            }`}>
              {isSuccessAnim ? (
                <ShieldCheck className="w-5 h-5 animate-bounce" />
              ) : errorMessage ? (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-sm sm:text-base font-bold tracking-wider text-white uppercase">
                Admin Authentication
              </h2>
              <p className="text-[11px] text-[#9ca3af] tracking-wider uppercase">
                Security Clearance Level 1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9ca3af] hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
            aria-label="Close Authentication Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Feature Banner */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#121622] border border-[#2b3548] text-xs">
            {feature.icon}
            <span className="font-bold text-[#e5e7eb] uppercase tracking-wider">{feature.title}</span>
          </div>
          <p className="text-xs text-[#9ca3af] mt-2 leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span className="font-semibold uppercase tracking-wide">{errorMessage}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccessAnim && (
            <div className="p-3 rounded-lg bg-green-950/60 border border-green-500/50 text-green-300 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-green-400" />
              <span className="font-semibold uppercase tracking-wide">ACCESS GRANTED • UNLOCKING FEATURE...</span>
            </div>
          )}

          {/* Admin ID Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#d1d5db] uppercase tracking-wider">
              Admin User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6b7280]">
                <User className="w-4 h-4" />
              </div>
              <input
                ref={idInputRef}
                type="text"
                value={adminId}
                onChange={(e) => {
                  setAdminId(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. admin"
                disabled={isSubmitting || isSuccessAnim}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0d1017] border border-[#2b3548] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] rounded-lg text-sm text-white placeholder-[#4b5563] outline-none transition-all"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#d1d5db] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6b7280]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter password"
                disabled={isSubmitting || isSuccessAnim}
                className="w-full pl-9 pr-10 py-2.5 bg-[#0d1017] border border-[#2b3548] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] rounded-lg text-sm text-white placeholder-[#4b5563] outline-none transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6b7280] hover:text-[#e5e7eb] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isSuccessAnim}
              className="px-4 py-2 rounded-lg border border-[#374151] bg-[#111827] text-xs font-bold text-[#9ca3af] hover:text-white hover:border-gray-500 transition-colors uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccessAnim}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Verifying...' : isSuccessAnim ? 'Unlocked' : 'Authenticate & Unlock'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
