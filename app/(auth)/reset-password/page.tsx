"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // TODO: Replace with real API call
      setSuccess("If your email exists, a reset link has been sent.");
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            <span className="text-white text-2xl font-bold">IP</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Reset Password</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Enter your email to receive a reset link</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleReset}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1" placeholder="you@email.com" />
          </div>
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          {success && <div className="text-green-600 text-sm" role="status">{success}</div>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
} 