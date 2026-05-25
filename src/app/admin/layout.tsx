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

        // IMPORTANT

        const {
          data: { user },
        } = await supabase.auth
          .getUser();

        console.log("USER:", user);

        if (!user) {

          router.replace("/login");

          return;
        }

        console.log(
          "EMAIL:",
          user.email
        );

        const {
          data: profile,
          error,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", user.email)
          .single();

        console.log(
          "PROFILE:",
          profile
        );

        console.log(
          "ERROR:",
          error
        );

        if (
          !profile ||
          profile.role !== "admin"
        ) {

          alert(
            "No admin profile found"
          );

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

        Loading Admin...

      </div>
    );
  }

  return children;
}
