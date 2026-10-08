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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn font-sans"
    >
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Top Hairline Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border transition-colors ${
              isSuccessAnim 
                ? 'bg-white text-black border-white'
                : 'bg-white/5 border-white/15 text-white'
            }`}>
              {isSuccessAnim ? (
                <ShieldCheck className="w-5 h-5 animate-bounce" />
              ) : errorMessage ? (
                <ShieldAlert className="w-5 h-5 text-neutral-400" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-sm sm:text-base font-semibold tracking-normal text-[#fafafa]">
                Security Clearance
              </h2>
              <p className="text-[11px] text-[#a7a6a6] tracking-wider uppercase font-mono">
                Level 1 Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#a7a6a6] hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
            aria-label="Close Authentication Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Feature Banner */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs">
            {feature.icon}
            <span className="font-medium text-[#fafafa] uppercase tracking-wider">{feature.title}</span>
          </div>
          <p className="text-xs text-[#a7a6a6] mt-2 leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-neutral-900 border border-white/20 text-neutral-200 text-xs flex items-center gap-2 shadow-sm">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-neutral-300" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccessAnim && (
            <div className="p-3 rounded-lg bg-white/10 border border-white/30 text-white text-xs flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-white" />
              <span className="font-medium">Access Granted • Unlocking...</span>
            </div>
          )}

          {/* Admin ID Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#d4d4d8] uppercase tracking-wider">
              Admin User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717a]">
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
                className="w-full pl-9 pr-3 py-2.5 bg-[#121212] border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-sm text-white placeholder-[#52525b] outline-none transition-all"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#d4d4d8] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717a]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter admin password"
                disabled={isSubmitting || isSuccessAnim}
                className="w-full pl-9 pr-10 py-2.5 bg-[#121212] border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-sm text-white placeholder-[#52525b] outline-none transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#71717a] hover:text-white transition-colors"
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
              className="px-4 py-2 rounded-full border border-white/15 bg-transparent text-xs font-medium text-[#a7a6a6] hover:text-white hover:border-white/30 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccessAnim}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#e5e5e5] text-black font-semibold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Verifying...' : isSuccessAnim ? 'Unlocked' : 'Authenticate'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
