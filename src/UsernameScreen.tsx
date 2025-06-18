import { useState } from "react";
import { db, auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const UsernameScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Check if username is already taken
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      if (usernameDoc.exists()) {
        setError("Username is already taken. Please choose another.");
        setLoading(false);
        return;
      }
      // Save username to 'users/{uid}' and 'usernames/{username}'
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");
      await setDoc(doc(db, "users", user.uid), { username });
      await setDoc(doc(db, "usernames", username), { uid: user.uid });
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary text-center">Choose a Username</h1>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input
            className="border border-gray-200 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition"
            type="text"
            placeholder="Enter a unique username"
            value={username}
            onChange={e => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
            required
            minLength={3}
            maxLength={20}
            autoFocus
          />
          <button
            className="w-full bg-primary text-white rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-red-600 transition disabled:opacity-50"
            type="submit"
            disabled={loading || !username}
          >
            {loading ? "Saving..." : "Save Username"}
          </button>
        </form>
        {error && (
          <div className="text-red-500 text-sm text-center mt-2">{error}</div>
        )}
      </div>
    </div>
  );
};

export default UsernameScreen; 