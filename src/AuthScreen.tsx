import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";

const provider = new GoogleAuthProvider();

const AuthScreen = () => {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary text-center">Sign In</h1>
        <button
          className="w-full bg-primary text-white rounded-xl px-6 py-3 text-lg font-semibold shadow hover:bg-red-600 transition mb-4"
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </button>
        {error && (
          <div className="text-red-500 text-sm text-center mt-2">{error}</div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen; 