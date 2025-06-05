"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Title } from "../components/title";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /@blindvibe\.com$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!validateEmail(email)) {
      setError("Only @blindvibe.com email addresses are allowed");
      return;
    }

    if (companyPassword !== process.env.COMPANY_PASSWORD && companyPassword !== "Clintwoodsucks#1") {
      setError("Invalid company password");
      return;
    }

    try {
      setLoading(true);
      
      // Send magic link for one-time password login
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      setMessage("Check your email for the login link!");
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32">
      <div className="max-w-md mx-auto">
        <Title>Login to Blind Env</Title>
        
        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 border border-red-500/50 rounded bg-red-500/10">
            {error}
          </div>
        )}
        
        {message && (
          <div className="p-3 mb-4 text-sm text-green-500 border border-green-500/50 rounded bg-green-500/10">
            {message}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email Address (@blindvibe.com)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@blindvibe.com"
              className="block w-full mt-2 text-zinc-100 bg-transparent border border-burnt-orange-500/40 rounded px-3 py-2 focus:border-burnt-orange-500/80 focus:ring-0"
            />
          </div>
          
          <div>
            <label htmlFor="companyPassword" className="block text-sm font-medium text-zinc-300">
              Company Password
            </label>
            <input
              id="companyPassword"
              name="companyPassword"
              type="password"
              required
              value={companyPassword}
              onChange={(e) => setCompanyPassword(e.target.value)}
              className="block w-full mt-2 text-zinc-100 bg-transparent border border-burnt-orange-500/40 rounded px-3 py-2 focus:border-burnt-orange-500/80 focus:ring-0"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !email || !companyPassword}
            className={`w-full h-12 inline-flex justify-center items-center transition-all rounded px-4 py-2 text-base font-semibold bg-burnt-orange-500 text-white ring-1 ring-burnt-orange-500 duration-150 ${
              loading || !email || !companyPassword
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-burnt-orange-600 hover:ring-burnt-orange-600"
            }`}
          >
            {loading ? "Sending Link..." : "Send Login Link"}
          </button>
        </form>
      </div>
    </div>
  );
}