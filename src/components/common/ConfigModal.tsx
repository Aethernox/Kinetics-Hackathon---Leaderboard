import React, { useState } from 'react';
import { X, Check, AlertTriangle, RefreshCw, Key, Database, Globe, Lock } from 'lucide-react';
import { GoogleSheetConfig } from '../../types/leaderboard';
import { fetchGoogleSheetData } from '../../services/googleSheets';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetConfig;
  onSaveConfig: (config: GoogleSheetConfig) => void;
  dataSource: 'google-sheets' | 'mock' | 'simulator';
  onSelectDataSource: (source: 'google-sheets' | 'mock' | 'simulator') => void;
  isSplineEnabled: boolean;
  onToggleSpline: (enabled: boolean) => void;
  isSoundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onLockSession?: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  dataSource,
  onSelectDataSource,
  isSplineEnabled,
  onToggleSpline,
  isSoundEnabled,
  onToggleSound,
  onLockSession,
}) => {
  const [sheetId, setSheetId] = useState(config.sheetId || '');
  const [sheetName, setSheetName] = useState(config.sheetName || 'Sheet1');
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [pollIntervalMs, setPollIntervalMs] = useState(config.pollIntervalMs || 3500);
  const [testState, setTestState] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false,
  });

  React.useEffect(() => {
    if (isOpen) {
      setSheetId(config.sheetId || '');
      setSheetName(config.sheetName || 'Sheet1');
      setApiKey(config.apiKey || '');
      setPollIntervalMs(config.pollIntervalMs || 3500);
      setTestState({ loading: false });
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    const rawVal = sheetId.trim();
    const match = rawVal.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const cleanId = match ? match[1] : rawVal;

    if (!cleanId) {
      setTestState({ loading: false, success: false, message: 'Please enter a Google Sheet ID or URL' });
      return;
    }
    setTestState({ loading: true });
    try {
      const teams = await fetchGoogleSheetData({
        sheetId: cleanId,
        sheetName: sheetName.trim(),
        apiKey: apiKey.trim() || undefined,
        pollIntervalMs,
      });
      setTestState({
        loading: false,
        success: true,
        message: `Successfully connected! Found ${teams.length} valid teams.`,
      });
    } catch (err: any) {
      setTestState({
        loading: false,
        success: false,
        message: err.message || 'Failed to fetch from Google Sheet',
      });
    }
  };

  const handleSave = () => {
    const rawVal = sheetId.trim();
    const match = rawVal.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const cleanId = match ? match[1] : rawVal;

    onSaveConfig({
      sheetId: cleanId,
      sheetName: sheetName.trim(),
      apiKey: apiKey.trim() || undefined,
      pollIntervalMs: Number(pollIntervalMs) || 3500,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn font-sans">
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f293d] flex items-center justify-between bg-gradient-to-r from-[#171b26] to-[#0d1017]">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-base font-bold tracking-wider text-white uppercase">
              Dashboard Telemetry Settings
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {onLockSession && (
              <button
                type="button"
                onClick={onLockSession}
                title="Lock Admin Session"
                className="px-2.5 py-1 text-xs text-[#9ca3af] hover:text-[#f59e0b] hover:bg-[#1f2937] border border-[#374151] rounded-lg transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider"
              >
                <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="hidden sm:inline">Lock Session</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-[#9ca3af] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Data Source Switcher */}
          <div>
            <label className="block text-xs font-bold text-[#d1d5db] uppercase tracking-wider mb-2">
              Leaderboard Data Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSelectDataSource('google-sheets')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  dataSource === 'google-sheets'
                    ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-[#374151] bg-[#111827] text-[#9ca3af] hover:border-gray-500'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Google Sheets
              </button>
              <button
                type="button"
                onClick={() => onSelectDataSource('mock')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  dataSource === 'mock'
                    ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-[#374151] bg-[#111827] text-[#9ca3af] hover:border-gray-500'
                }`}
              >
                <Database className="w-3.5 h-3.5" /> Reference Data
              </button>
              <button
                type="button"
                onClick={() => onSelectDataSource('simulator')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  dataSource === 'simulator'
                    ? 'border-[#f59e0b] bg-[#f59e0b]/20 text-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-[#374151] bg-[#111827] text-[#9ca3af] hover:border-gray-500'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Live Simulator
              </button>
            </div>
          </div>

          {/* Google Sheets Config Inputs */}
          {dataSource === 'google-sheets' && (
            <div className="p-4 rounded-lg bg-[#111622] border border-[#1f293d] space-y-4">
              <div>
                <label className="block text-xs text-[#9ca3af] mb-1">
                  Google Sheet ID or URL:
                </label>
                <input
                  type="text"
                  value={sheetId}
                  onChange={e => {
                    const val = e.target.value;
                    const match = val.match(/\/d\/([a-zA-Z0-9-_]+)/);
                    setSheetId(match ? match[1] : val);
                  }}
                  placeholder="e.g. 1BxiMVs0... or paste Google Sheet URL"
                  className="w-full bg-[#0a0d14] border border-[#374151] rounded px-3 py-2 text-sm text-white focus:border-[#f59e0b] focus:outline-none"
                />
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Tip: Ensure sheet is shared as "Anyone with the link can view" (or provide an API key).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#9ca3af] mb-1">Sheet Tab Name:</label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={e => setSheetName(e.target.value)}
                    placeholder="Sheet1"
                    className="w-full bg-[#0a0d14] border border-[#374151] rounded px-3 py-2 text-sm text-white focus:border-[#f59e0b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9ca3af] mb-1">Poll Interval (ms):</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={pollIntervalMs}
                    onChange={e => setPollIntervalMs(Number(e.target.value))}
                    className="w-full bg-[#0a0d14] border border-[#374151] rounded px-3 py-2 text-sm text-white focus:border-[#f59e0b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9ca3af] mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#f59e0b]" /> Google API Key (Optional for private sheets):
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0a0d14] border border-[#374151] rounded px-3 py-2 text-sm text-white focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              {/* Test Connection Button & Status */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testState.loading}
                  className="px-3.5 py-1.5 rounded bg-[#1f2937] hover:bg-[#374151] border border-[#4b5563] text-xs text-white flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testState.loading ? 'animate-spin' : ''}`} />
                  {testState.loading ? 'Testing Live Link...' : 'Test Sheet Connection'}
                </button>

                {testState.message && (
                  <span
                    className={`text-xs flex items-center gap-1.5 ${
                      testState.success ? 'text-[#22c55e]' : 'text-[#ef4444]'
                    }`}
                  >
                    {testState.success ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {testState.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Visual & Audio Preferences */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#d1d5db] uppercase tracking-wider">
              Environment & Telemetry Options
            </label>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#111622] border border-[#1f293d]">
              <div>
                <span className="text-xs font-bold text-white block">Spline 3D Scene Layer</span>
                <span className="text-[11px] text-[#9ca3af]">Loads interactive retrofuturism 3D environment</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleSpline(!isSplineEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isSplineEnabled ? 'bg-[#f59e0b]' : 'bg-[#374151]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    isSplineEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#111622] border border-[#1f293d]">
              <div>
                <span className="text-xs font-bold text-white block">Sci-Fi Web Audio FX</span>
                <span className="text-[11px] text-[#9ca3af]">Plays subtle procedural synths on rank & score shifts</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleSound(!isSoundEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  isSoundEnabled ? 'bg-[#f59e0b]' : 'bg-[#374151]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    isSoundEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#1f293d] bg-[#0a0d14] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#374151] text-xs font-bold text-[#9ca3af] hover:text-white uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-widest transition-colors shadow-[0_0_16px_rgba(245,158,11,0.4)]"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
