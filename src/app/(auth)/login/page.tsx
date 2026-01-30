"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UnifiedLoginForm } from "@/components/auth/unified-login-form";
import { useAuth } from "@/context/AuthContext";

export default function StudentLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (credentials: Record<string, string>) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = (await response.json()) as {
        error?: string;
        user?: { name: string; roll: string };
      };

      if (!response.ok) {
        throw new Error(data.error || "লগইন ব্যর্থ হয়েছে");
      }

      if (data.user) {
        setUser({
          name: data.user.name,
          roll: data.user.roll,
        });
      }

      router.push("/exams");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnifiedLoginForm
      userType="student"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
