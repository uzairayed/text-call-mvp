import React, { useEffect, useState } from "react";
import { useSessions } from "./SessionContext";
import type { Session } from "./SessionContext";
import { db, auth } from "./firebase";
import { doc, getDoc, Timestamp, onSnapshot } from "firebase/firestore";

type Props = {
  onNavigate: (screen: string, recipient?: string, sessionId?: string) => void;
  sessionId: string;
};

const SummaryScreen: React.FC<Props> = ({ onNavigate, sessionId }) => {
  const { addSession } = useSessions();
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "calls", sessionId), async (callDoc) => {
      const data = callDoc.data();
      if (data) {
        const user = auth.currentUser;
        if (!user) { setLoading(false); return; }
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const myUsername = userDoc.data()?.username;
        
        const otherParticipant = data.caller === myUsername ? data.recipient : data.caller;
        setSummary(data.summary || "No summary available.");
        setParticipants(`You and ${otherParticipant}`);
        
        let calculatedDuration = "-";
        if (data.startedAt && data.endedAt) {
          const start = (data.startedAt instanceof Timestamp) ? data.startedAt.toDate() : new Date(data.startedAt);
          const end = (data.endedAt instanceof Timestamp) ? data.endedAt.toDate() : new Date(data.endedAt);
          const diff = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
          const min = Math.floor(diff / 60);
          const sec = diff % 60;
          calculatedDuration = `${min}m ${sec}s`;
          setDuration(calculatedDuration);
        } else {
          setDuration(calculatedDuration);
        }
        
        setDate(data.startedAt ? (data.startedAt instanceof Timestamp ? data.startedAt.toDate().toLocaleDateString() : new Date(data.startedAt).toLocaleDateString()) : "-");
        
        const session: Session = {
          id: sessionId,
          participant: otherParticipant,
          time: data.startedAt ? (data.startedAt instanceof Timestamp ? data.startedAt.toDate().toLocaleString() : new Date(data.startedAt).toLocaleString()) : "-",
          summary: data.summary,
          duration: calculatedDuration,
          purpose: data.purpose || "Call session",
        };
        addSession(session);
        
        // Stop loading if summary is present or if call has ended (even if summary failed)
        if (data.summary || data.status === 'ended') {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
    // eslint-disable-next-line
  }, [sessionId, addSession]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg grid gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Session Summary</h1>
          <div className="bg-gray-50 rounded-xl p-5 mb-2 w-full text-gray-700 text-base shadow-inner h-48 flex items-center justify-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {loading ? (
              <span className="italic text-gray-500">Generating summary...</span>
            ) : (
              <p className="w-full h-full overflow-y-auto">{summary}</p>
            )}
          </div>
          <div className="flex flex-col items-start w-full mb-2 text-sm text-gray-500 gap-1">
            <div><span className="font-semibold text-gray-700">Participants:</span> {participants}</div>
            <div><span className="font-semibold text-gray-700">Date:</span> {date}</div>
            <div><span className="font-semibold text-gray-700">Duration:</span> {duration}</div>
          </div>
          <div className="flex gap-3 mb-2 w-full justify-center">
            <button className="bg-primary text-white rounded-xl px-5 py-2 text-sm font-semibold shadow hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-primary/40">Export</button>
            <button className="bg-gray-100 text-gray-700 rounded-xl px-5 py-2 text-sm font-semibold shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-200">Save</button>
            <button className="bg-gray-100 text-gray-700 rounded-xl px-5 py-2 text-sm font-semibold shadow hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-200">Share</button>
          </div>
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

export default SummaryScreen; 