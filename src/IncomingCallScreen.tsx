import React, { useEffect, useState } from "react";

type Props = {
  onNavigate: (screen: string) => void;
};

const CALLER_NAME = "Alice";
const PURPOSE = "Quick project sync";
const TIMEOUT = 10; // seconds

const IncomingCallScreen: React.FC<Props> = ({ onNavigate }) => {
  const [countdown, setCountdown] = useState(TIMEOUT);

  useEffect(() => {
    if (countdown <= 0) {
      onNavigate("home");
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onNavigate]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg grid gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 relative overflow-hidden">
          {/* Pulsing ring animation */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-28 w-28 rounded-full bg-primary opacity-20 animate-ping"></span>
              <span className="relative inline-flex h-20 w-20 rounded-full bg-primary opacity-80"></span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight mt-8 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Incoming Call</h1>
          <div className="mb-1 text-lg font-semibold text-gray-900">{CALLER_NAME}</div>
          {PURPOSE && (
            <div className="mb-2 text-gray-500 italic text-center">{PURPOSE}</div>
          )}
          <div className="mb-4 text-xs text-gray-400">Auto-decline in {countdown}s</div>
          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <button
              className="bg-primary text-white rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
              onClick={() => onNavigate("liveSession")}
            >
              Accept
            </button>
            <button
              className="bg-gray-100 text-red-600 rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-red-200"
              onClick={() => onNavigate("home")}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallScreen; 