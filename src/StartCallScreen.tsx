import React, { useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "./firebase";

type Props = {
  onNavigate: (screen: string, recipient?: string, sessionId?: string) => void;
};

const StartCallScreen: React.FC<Props> = ({ onNavigate }) => {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Check if recipient username exists
      const usernameDoc = await getDoc(doc(db, "usernames", recipient));
      if (!usernameDoc.exists()) {
        setError("No user found with that username.");
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
      onNavigate("liveSession", recipient, sessionId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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