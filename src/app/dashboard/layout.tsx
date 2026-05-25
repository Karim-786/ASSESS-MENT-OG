"use client";

import { useEffect, useState }
from "react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/app/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const checkUser =
      async () => {

        const {
          data: { session },
        } = await supabase.auth
          .getSession();

        if (!session) {

          router.replace("/login");

          return;
        }

        setLoading(false);
      };

    checkUser();

  }, [router]);

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">

        Loading...

      </div>
    );
  }

  return children;
}
