import React, { useEffect, useState } from "react";
import { useSessions } from "./SessionContext";
import type { Session } from "./SessionContext";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  onNavigate: (screen: string, recipient?: string, sessionId?: string) => void;
  sessionId: string;
};

const PARTICIPANT = "Alice";
const SUMMARY = `
This session covered a quick project sync. Alice and you discussed the next steps, clarified a few questions, and agreed to follow up tomorrow. The conversation was efficient and focused.`;
const DURATION = "5 min";

const SummaryScreen: React.FC<Props> = ({ onNavigate, sessionId }) => {
  const { addSession } = useSessions();
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a new session when this screen mounts
    const session: Session = {
      id: Date.now().toString(),
      participant: PARTICIPANT,
      time: new Date().toLocaleString(),
      summary: SUMMARY,
      duration: DURATION,
      purpose: "Quick project sync",
    };
    addSession(session);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const callDoc = await getDoc(doc(db, "calls", sessionId));
      setSummary(callDoc.data()?.summary || "No summary available.");
      setLoading(false);
    };
    fetchSummary();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg grid gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Session Summary</h1>
          <div className="bg-gray-50 rounded-xl p-5 mb-2 w-full text-gray-700 text-base shadow-inner" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {loading ? "Generating summary..." : summary}
          </div>
          <div className="flex flex-col items-start w-full mb-2 text-sm text-gray-500 gap-1">
            <div><span className="font-semibold text-gray-700">Participants:</span> You, {PARTICIPANT}</div>
            <div><span className="font-semibold text-gray-700">Date:</span> {new Date().toLocaleDateString()}</div>
            <div><span className="font-semibold text-gray-700">Duration:</span> {DURATION}</div>
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