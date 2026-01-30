"use client";

import { useRouter } from "next/navigation";
import { UnifiedLoginForm } from "@/components/auth/unified-login-form";
import { useLoginUser } from "@/hooks/mutations/use-login-user";
import { useState } from "react";

export default function StudentLoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLoginUser();
  const [error, setError] = useState("");

  const handleSubmit = async (credentials: Record<string, string>) => {
    setError("");

    try {
      const result = await login(credentials);

      if (!result.success) {
        setError(result.error || "লগইন ব্যর্থ হয়েছে");
        return;
      }

      router.push("/exams");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।",
      );
    }
  };

  return (
    <UnifiedLoginForm
      userType="student"
      onSubmit={handleSubmit}
      loading={isPending}
      error={error}
    />
  );
}