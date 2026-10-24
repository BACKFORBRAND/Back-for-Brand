import React, { useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext.tsx';
import { Bell, X, ArrowRight } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { recentNotification, clearNotification, setCurrentView, currentView } = useBusiness();

  useEffect(() => {
    if (!recentNotification) return;
    const timer = setTimeout(() => {
      clearNotification();
    }, 6000);
    return () => clearTimeout(timer);
  }, [recentNotification, clearNotification]);

  if (!recentNotification) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-[92vw] sm:w-auto bg-[#0b1533] text-white p-4 rounded-2xl shadow-2xl border border-blue-500/40 animate-slideIn flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bell className="w-4 h-4" />
      </div>

      <div className="flex-1 text-xs sm:text-sm">
        <strong className="block font-bold text-blue-200">System Telemetry Alert</strong>
        <p className="mt-0.5 text-white leading-snug">{recentNotification}</p>

        {currentView === 'public' && (
          <button
            onClick={() => {
              setCurrentView('machine');
              clearNotification();
            }}
            className="mt-2 text-xs font-bold text-[#ffd84d] hover:underline flex items-center gap-1"
          >
            <span>Inspect in Business Machine CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        onClick={clearNotification}
        className="text-blue-300 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
