import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth } from "./firebase";

type Props = {
  onNavigate: (screen: string, recipient?: string, sessionId?: string) => void;
};

const RINGTONE_URL = "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c3b.mp3"; // Free ringtone

const StartCallScreen: React.FC<Props> = ({ onNavigate }) => {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ringing" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (status === "ringing" && !audioRef.current) {
      audioRef.current = new Audio(RINGTONE_URL);
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.error("Ringtone play failed:", e));
    } else if (status !== "ringing" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [status]);

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setStatus("ringing");
    try {
      // Check if recipient username exists
      const usernameDoc = await getDoc(doc(db, "usernames", recipient));
      if (!usernameDoc.exists()) {
        setError("No user found with that username.");
        setStatus('idle');
        setLoading(false);
        return;
      }
      // Get caller username
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const myUsername = userDoc.data()?.username;
      if (!myUsername) throw new Error("No username found for current user");
      // Generate sessionId
      const sessionId = [myUsername, recipient].sort().join("_");
      // Create call document
      await setDoc(doc(db, "calls", sessionId), {
        caller: myUsername,
        recipient,
        status: "ringing",
        startedAt: serverTimestamp(),
      });

      const unsub = onSnapshot(doc(db, "calls", sessionId), (doc) => {
        const data = doc.data();
        if (data?.status === 'active') {
          unsub();
          setStatus('idle');
          onNavigate("liveSession", recipient, sessionId);
        } else if (data?.status === 'rejected' || data?.status === 'ended' || !data) {
          unsub();
          setStatus('idle');
          setError("Call rejected or ended.");
        }
      });

    } catch (err: any) {
      setError(err.message);
      setStatus('error');
      setLoading(false);
    }
  };

  if (status === "ringing") {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full"></div>
            </div>
             <div className="absolute inset-0 flex items-center justify-center">
               <p className="text-primary font-bold text-lg">{recipient}</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Calling...</h1>
          <p className="text-gray-500 mt-2">Waiting for {recipient} to answer.</p>
          <button
            className="mt-8 bg-red-500 text-white rounded-xl px-6 py-3 font-semibold shadow hover:bg-red-600 transition"
            onClick={async () => {
              setStatus("idle");
              const user = auth.currentUser;
              if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const myUsername = userDoc.data()?.username;
                if (myUsername) {
                  const sessionId = [myUsername, recipient].sort().join("_");
                  await setDoc(doc(db, "calls", sessionId), { status: 'ended' }, { merge: true });
                }
              }
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg grid gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Start a Call</h1>
          <form className="grid gap-4 w-full" onSubmit={handleStartCall}>
            <input
              className="border border-gray-200 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition"
              placeholder="Recipient username"
              value={recipient}
              onChange={e => setRecipient(e.target.value.replace(/\s/g, "").toLowerCase())}
              required
              minLength={3}
              maxLength={20}
              autoFocus
            />
            <button
              className="w-full bg-primary text-white rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-red-600 transition disabled:opacity-50"
              type="submit"
              disabled={loading || !recipient}
            >
              {loading ? "Calling..." : "Call"}
            </button>
          </form>
          <button
            className="w-full text-primary underline text-sm mt-2 hover:text-red-600 transition"
            onClick={() => onNavigate("home")}
          >
            Back to Home
          </button>
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartCallScreen; 