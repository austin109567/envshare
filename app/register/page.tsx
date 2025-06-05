"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Title } from "../components/title";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /@blindvibe\.com$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
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
      
      const { error } = await supabase.auth.signUp({
        email,
        password: `${companyPassword}-${Math.random().toString(36).substring(2, 15)}`, // Generate a random password suffix
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      setMessage("Registration successful! Check your email for verification link.");
    } catch (error: any) {
      setError(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32">
      <div className="max-w-md mx-auto">
        <Title>Register for Blind Env</Title>
        
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
        
        <form onSubmit={handleRegister} className="mt-8 space-y-6">
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
            {loading ? "Registering..." : "Register"}
          </button>
          
          <div className="text-center">
            <Link href="/login" className="text-sm text-burnt-orange-400 hover:text-burnt-orange-300">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}