import React, { useState } from "react";
import { useSessions } from "./SessionContext";

type Props = {
  onNavigate: (screen: string) => void;
};

const HomeScreen: React.FC<Props> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'online' | 'busy'>('online');
  const { sessions, clearSessions } = useSessions();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-[#FAFAFA] border-b border-gray-100 flex items-center justify-between px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight" style={{ color: '#E74C3C', fontFamily: 'Inter, system-ui, sans-serif' }}>TextCall</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium text-sm">Status:</span>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow transition border focus:outline-none focus:ring-2 focus:ring-primary/40 ${status === 'online' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}
            onClick={() => setStatus(status === 'online' ? 'busy' : 'online')}
          >
            <span className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg grid gap-8">
          {/* Start Call Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
            <button
              className="w-full bg-primary text-white rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
              onClick={() => onNavigate("startCall")}
            >
              Start a Call
            </button>
          </div>

          {/* Recent Sessions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Recent Sessions</h2>
              {sessions.length > 0 && (
                <button className="text-xs text-gray-400 hover:text-red-500 transition underline" onClick={clearSessions}>Clear All</button>
              )}
            </div>
            <div className="grid gap-3">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-base">{session.participant}</span>
                    <span className="text-xs text-gray-500">{session.time}</span>
                  </div>
                  <button className="ml-4 text-primary text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition">View</button>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-gray-400 text-center py-6">No recent sessions</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen; 