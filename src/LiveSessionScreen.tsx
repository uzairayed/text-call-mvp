import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

type Props = {
  onNavigate: (screen: string) => void;
};

const PARTICIPANT = "Alice";
const SESSION_ID = "test-session-1"; // Replace with real session ID in production

interface Message {
  id: string;
  sender: string;
  text: string;
  createdAt: any;
}

const LiveSessionScreen: React.FC<Props> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to Firestore messages
  useEffect(() => {
    const q = query(
      collection(db, "sessions", SESSION_ID, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data() as Message;
          return { ...data, id: doc.id };
        })
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate other user typing (for demo)
  useEffect(() => {
    if (input) setTyping(true);
    else setTyping(false);
  }, [input]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, "sessions", SESSION_ID, "messages"), {
      sender: "me",
      text: input,
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg grid gap-8">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[80vh] overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-sm">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider">In Session</div>
            <div className="font-bold text-gray-900 text-base">{PARTICIPANT}</div>
            <div className="text-xs text-gray-400 font-mono tabular-nums">{formatTime(seconds)}</div>
            <button
              className="ml-2 bg-red-100 text-red-600 rounded-lg px-3 py-1 text-xs font-semibold hover:bg-red-200 transition focus:outline-none focus:ring-2 focus:ring-red-200"
              onClick={() => onNavigate("summary")}
            >
              End
            </button>
          </div>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[70%] rounded-2xl px-5 py-3 text-base shadow-sm ${msg.sender === "me" ? "ml-auto bg-primary text-white" : "mr-auto bg-gray-200 text-gray-900"}`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="max-w-[70%] mr-auto bg-gray-200 text-gray-500 rounded-2xl px-5 py-3 text-base italic animate-pulse" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {PARTICIPANT} is typing…
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input Bar */}
          <div className="flex items-center gap-2 p-4 border-t bg-white">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition"
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            />
            <button
              className="bg-primary text-white rounded-xl px-5 py-3 font-semibold text-base shadow hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionScreen; 