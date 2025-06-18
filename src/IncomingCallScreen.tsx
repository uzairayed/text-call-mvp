import React, { useEffect, useRef } from "react";
import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

const RINGTONE_URL = "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c3b.mp3"; // Free ringtone

type Props = {
  caller: string;
  sessionId: string;
  onNavigate: (screen: string, recipient?: string, sessionId?: string) => void;
};

const IncomingCallScreen: React.FC<Props> = ({ caller, sessionId, onNavigate }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play ringtone on mount
    audioRef.current = new Audio(RINGTONE_URL);
    audioRef.current.loop = true;
    audioRef.current.play();
    return () => {
      // Stop ringtone on unmount
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handleAccept = async () => {
    audioRef.current?.pause();
    await updateDoc(doc(db, "calls", sessionId), { status: "active" });
    onNavigate("liveSession", caller, sessionId);
  };
  const handleReject = async () => {
    audioRef.current?.pause();
    await updateDoc(doc(db, "calls", sessionId), { status: "ended" });
    onNavigate("home");
  };
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
          <div className="mb-1 text-lg font-semibold text-gray-900">{caller}</div>
          <div className="mb-4 text-xs text-gray-400">is calling you…</div>
          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <button
              className="bg-primary text-white rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              className="bg-gray-100 text-red-600 rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-red-200"
              onClick={handleReject}
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