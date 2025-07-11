"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

const APP_NAME = "InventoryPro";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // TODO: Replace with real API call
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Please try again.");
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{APP_NAME}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Create your account</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1" placeholder="Your Name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1" placeholder="you@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1" placeholder="••••••••" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1" placeholder="••••••••" />
          </div>
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          {success && <div className="text-green-600 text-sm" role="status">{success}</div>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Already have an account?</span>
          <Link href="/login" className="text-primary font-medium hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
} 