"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/pro-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout", whatsapp: "0000000000" }),
    });
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={logout} className="fa-chip !cursor-pointer text-[13px]">Sign out</button>
  );
}