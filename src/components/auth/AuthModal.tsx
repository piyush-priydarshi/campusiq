"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Form inputs checks
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Provide a valid institutional email format.");
      return;
    }
    if (password.length < 6) {
      setError("Security constraint: Password must be at least 6 characters.");
      return;
    }
    if (!isLoginView && !name.trim()) {
      setError("Name parameter is mandatory for enrollment.");
      return;
    }

    // Authenticated! Close and log
    login(email, isLoginView ? "" : name);
    
    // Clear forms
    setEmail("");
    setName("");
    setPassword("");
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={isLoginView ? "ACCESS PORTAL" : "REGISTER PROFILE"}
      className="max-w-[340px]"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1.5">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[9px] font-mono px-3 py-2 rounded-[2px] leading-relaxed">
            {error}
          </div>
        )}

        {!isLoginView && (
          <div className="space-y-1">
            <label className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Anand Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
            Institutional Email
          </label>
          <Input
            type="email"
            placeholder="scholar@campusiq.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
            Passphrase
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

       <Button type="submit" variant="primary" style={{color: '#0A0A0A'}} className="w-full mt-2.5 py-3 font-semibold">
          {isLoginView ? "Sign In" : "Register"}
        </Button>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError("");
            }}
            className="font-mono text-[9px] tracking-wider text-text-secondary hover:text-primary uppercase transition-colors"
          >
            {isLoginView
              ? "New applicant? Register profile"
              : "Already enrolled? Sign in"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
