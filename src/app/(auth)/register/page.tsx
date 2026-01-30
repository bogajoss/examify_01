"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotebookText, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.rollNumber ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("সব ফিল্ড পূরণ করুন");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      return;
    }

    if (formData.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          rollNumber: formData.rollNumber,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        success?: boolean;
      };

      if (!response.ok) {
        throw new Error(data.error || "নিবন্ধন ব্যর্থ হয়েছে");
      }

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "নিবন্ধন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="border border-border shadow-2xl">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
                <NotebookText className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              নিবন্ধন
            </CardTitle>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              শিক্ষার্থী পোর্টাল
            </p>
            <CardDescription className="text-base mt-3 text-muted-foreground">
              আপনার অ্যাকাউন্ট তৈরি করুন এবং শুরু করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    নাম
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="আপনার নাম"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="px-4 py-2.5 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 bg-muted/30 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="rollNumber"
                    className="text-sm font-semibold text-foreground"
                  >
                    রোল নম্বর
                  </Label>
                  <Input
                    id="rollNumber"
                    name="rollNumber"
                    type="text"
                    placeholder="আপনার রোল"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="px-4 py-2.5 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 bg-muted/30 focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  ইমেইল
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="আপনার ইমেইল"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="px-4 py-2.5 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 bg-muted/30 focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-foreground"
                >
                  ফোন নম্বর
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="আপনার ফোন নম্বর"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="px-4 py-2.5 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 bg-muted/30 focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-foreground"
                >
                  পাসওয়ার্ড
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="আপনার পাসওয়ার্ড"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="px-4 py-2.5 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 bg-muted/30 focus:bg-background transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-foreground"
                >
                  পাসওয়ার্ড নিশ্চিত করুন
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="px-4 py-2.5 rounded-lg border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 bg-muted/30 focus:bg-background transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    নিবন্ধন করা হচ্ছে...
                  </div>
                ) : (
                  "নিবন্ধন করুন"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline transition-colors"
                >
                  লগইন করুন
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          নিরাপত্তা এবং গোপনীয়তার সাথে আপনার তথ্য সুরক্ষিত রাখা হয়।
        </p>
      </div>
    </div>
  );
}
