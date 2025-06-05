"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Title } from "../components/title";
import { Cog6ToothIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVault, setLoadingVault] = useState(false);
  const [envContent, setEnvContent] = useState("");
  const [envName, setEnvName] = useState("");
  const [envFiles, setEnvFiles] = useState<any[]>([]);
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }
      
      setUser(data.session.user);
      setLoading(false);
      
      // Load env files
      fetchEnvFiles();
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/login");
        } else if (session) {
          setUser(session.user);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const fetchEnvFiles = async () => {
    try {
      setLoadingVault(true);
      const { data, error } = await supabase
        .from('env_vault')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setEnvFiles(data || []);
    } catch (error: any) {
      console.error("Error fetching env files:", error);
      setErrorMessage(`Error loading env files: ${error.message}`);
    } finally {
      setLoadingVault(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!envContent.trim() || !envName.trim()) {
      setErrorMessage("Please provide both a name and content for your .env file");
      return;
    }
    
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      const { error } = await supabase
        .from('env_vault')
        .insert([
          { 
            name: envName,
            content: envContent,
            created_by: user?.email,
          }
        ]);
      
      if (error) throw error;
      
      setEnvContent("");
      setEnvName("");
      setSuccessMessage("Environment variables added to vault successfully!");
      
      // Refresh the env files list
      fetchEnvFiles();
    } catch (error: any) {
      console.error("Error adding env file:", error);
      setErrorMessage(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setEnvContent(content);
      
      // Extract filename without extension for the env name
      const fileName = file.name.replace(/\.env.*$/, '');
      if (!envName && fileName) {
        setEnvName(fileName);
      }
    };
    reader.readAsText(file);
  };
  
  const handleCopy = (id: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied({ ...copied, [id]: true });
    setTimeout(() => {
      setCopied({ ...copied, [id]: false });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="container px-8 mx-auto mt-16 lg:mt-32 flex justify-center">
        <Cog6ToothIcon className="w-12 h-12 animate-spin text-burnt-orange-500" />
      </div>
    );
  }

  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32">
      <div className="flex justify-between items-center">
        <Title>Blind Env Vault</Title>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium rounded text-white bg-zinc-800 hover:bg-zinc-700"
        >
          Log Out
        </button>
      </div>
      
      <div className="mt-8 text-center text-zinc-300">
        <p>Logged in as <span className="text-burnt-orange-400">{user?.email}</span></p>
      </div>
      
      {successMessage && (
        <div className="p-4 mt-8 text-green-400 border rounded border-green-400/50 bg-green-400/10">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 mt-8 text-red-400 border rounded border-red-400/50 bg-red-400/10">
          {errorMessage}
        </div>
      )}
      
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Add new env file section */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">Add New Environment Variables</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="envName" className="block text-sm font-medium text-zinc-300 mb-2">
                Environment Name
              </label>
              <input
                id="envName"
                type="text"
                value={envName}
                onChange={(e) => setEnvName(e.target.value)}
                className="w-full px-3 py-2 text-zinc-100 bg-transparent border rounded border-burnt-orange-500/40 focus:border-burnt-orange-500/80 focus:ring-0"
                placeholder="production"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Environment Variables
              </label>
              <textarea
                value={envContent}
                onChange={(e) => setEnvContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 text-zinc-100 bg-transparent border rounded border-burnt-orange-500/40 focus:border-burnt-orange-500/80 focus:ring-0 font-mono"
                placeholder="DB_HOST=localhost\nDB_PORT=5432\nAPI_KEY=your-secret-key"
              ></textarea>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <label
                htmlFor="file-upload"
                className="px-4 py-2 text-sm font-medium border rounded cursor-pointer text-zinc-300 border-burnt-orange-500/40 hover:border-burnt-orange-500/60 hover:bg-burnt-orange-500/10"
              >
                Upload .env File
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".env,.env.local,.env.development,.env.production"
                onChange={handleFileUpload}
              />
              
              <button
                type="submit"
                disabled={loading || !envContent || !envName}
                className={`px-4 py-2 text-sm font-medium rounded text-white bg-burnt-orange-500 hover:bg-burnt-orange-600 ${
                  loading || !envContent || !envName ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save to Vault"}
              </button>
            </div>
          </form>
        </div>
        
        {/* Vault contents section */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">Team Environment Vault</h2>
          
          {loadingVault ? (
            <div className="flex justify-center py-8">
              <Cog6ToothIcon className="w-8 h-8 animate-spin text-burnt-orange-500" />
            </div>
          ) : envFiles.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 border border-dashed border-zinc-700 rounded">
              No environment files found in the vault yet
            </div>
          ) : (
            <div className="space-y-4">
              {envFiles.map((env) => (
                <div key={env.id} className="border border-burnt-orange-500/40 rounded overflow-hidden">
                  <div className="p-3 bg-burnt-orange-900/20 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-zinc-200">{env.name}</span>
                      <span className="text-xs text-zinc-400 ml-2">
                        by {env.created_by.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(env.id, env.content)}
                      className="text-zinc-300 hover:text-burnt-orange-400"
                    >
                      {copied[env.id] ? (
                        <ClipboardDocumentCheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardDocumentIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <pre className="p-3 font-mono text-xs text-zinc-300 overflow-x-auto max-h-40">
                    {env.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}