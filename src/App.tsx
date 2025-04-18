// src/App.tsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { WalletConnection } from "./components/WalletConnection";
import { useWallet } from "@solana/wallet-adapter-react";
import * as React from "react";
import Home from "./pages/Home";

// Enhanced AuthenticatedContent component
const AuthenticatedContent = () => {
  const { publicKey, connecting, disconnecting } = useWallet();

  if (connecting) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-200 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">
            Connecting to Wallet...
          </h2>
          <p>Please approve the connection request in your wallet.</p>
        </div>
      </div>
    );
  }

  if (disconnecting) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-200 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Disconnecting...</h2>
          <p>Cleaning up your session.</p>
        </div>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Wallet Required</h2>
          <p className="mb-4">
            Please connect your wallet using the button in the top right corner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Home />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-base-100 text-base-content">
        <nav className="navbar bg-base-200 p-4">
          <div className="container mx-auto">
            <h1 className="text-5xl font-extrabold gradient-text mb-2 pr-10">
              Bandit Miner Administration
            </h1>
            <div className="flex-1 flex items-center gap-4"></div>

            <div className="flex-none flex items-center gap-4">
              <WalletConnection />
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-4">
          <AuthenticatedContent />
        </main>
      </div>
    </Router>
  );
};

export default App;
