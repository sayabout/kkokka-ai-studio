"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
  return (
    <button onClick={signOut}
      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/[0.11] px-6 text-[14px] font-semibold text-offwhite hover:border-[rgba(143,183,255,0.34)]">
      로그아웃
    </button>
  );
}
