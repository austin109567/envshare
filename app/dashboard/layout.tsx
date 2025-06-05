"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { supabase } from "../../lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Cog6ToothIcon className="w-12 h-12 animate-spin text-burnt-orange-500" />
      </div>
    );
  }

  return <>{children}</>;
}