import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { auth } from "./firebase";
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import 'firebaseui/dist/firebaseui.css';

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

const AuthScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA]">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">Sign In</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  </div>
);

export default AuthScreen; 