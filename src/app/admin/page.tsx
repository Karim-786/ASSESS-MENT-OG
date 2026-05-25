"use client";

import { useEffect, useState }
from "react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/app/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const checkAdmin =
      async () => {

        const {
          data: { session },
        } = await supabase.auth
          .getSession();

        if (!session) {

          router.replace("/login");

          return;
        }

        const { data: profile } =
          await supabase
            .from("profiles")
            .select("role")
            .eq(
              "email",
              session.user.email
            )
            .maybeSingle();

        if (
          profile?.role !== "admin"
        ) {

          router.replace(
            "/dashboard"
          );

          return;
        }

        setLoading(false);
      };

    checkAdmin();

  }, [router]);

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">

        Loading Admin Panel...

      </div>
    );
  }

  return children;
}
