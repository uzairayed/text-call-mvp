import React, { useState } from "react";

type Props = {
  onNavigate: (screen: string) => void;
};

const StartCallScreen: React.FC<Props> = ({ onNavigate }) => {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg grid gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Start a Call</h1>
          <div className="grid gap-4">
            <input
              className="border border-gray-200 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition"
              placeholder="Recipient username"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
            <input
              className="border border-gray-200 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition"
              placeholder="Purpose of call (optional)"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-primary text-white rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
            onClick={() => onNavigate("calling")}
            disabled={!recipient.trim()}
          >
            Call
          </button>
          <button
            className="w-full text-primary underline text-sm mt-2 hover:text-red-600 transition"
            onClick={() => onNavigate("home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartCallScreen; 