"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UnifiedLoginForm } from "@/components/auth/unified-login-form";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (credentials: Record<string, string>) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = (await response.json()) as {
        error?: string;
        admin?: { name: string; username: string };
      };

      if (!response.ok) {
        throw new Error(data.error || "অ্যাডমিন লগইন ব্যর্থ হয়েছে");
      }

      if (data.admin) {
        setUser({
          name: data.admin.name,
          roll: data.admin.username,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "অ্যাডমিন লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnifiedLoginForm
      userType="admin"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
