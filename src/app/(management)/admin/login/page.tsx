"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UnifiedLoginForm } from "@/components/auth/unified-login-form";
import { useAdminLogin } from "@/hooks/mutations/use-admin-login";

export default function AdminLoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useAdminLogin();
  const [error, setError] = useState("");

  const handleSubmit = async (credentials: Record<string, string>) => {
    setError("");

    try {
      const result = await login(credentials);

      if (!result.success) {
        setError(result.error || "অ্যাডমিন লগইন ব্যর্থ হয়েছে");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "অ্যাডমিন লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।",
      );
    }
  };

  return (
    <UnifiedLoginForm
      userType="admin"
      onSubmit={handleSubmit}
      loading={isPending}
      error={error}
    />
  );
}