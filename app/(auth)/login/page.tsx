"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import api from "@/lib/api";

const APP_NAME = "InventoryPro";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post(
        "/login",
        { email, password, remember },
        { withCredentials: true }
      );
      // Optionally, set a cookie or use response data for session
      // Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}>
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            {/* Placeholder logo */}
            <span className="text-white text-2xl font-bold">IP</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{APP_NAME}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Sign in to your account</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={v => setRemember(!!v)} />
              <span className="text-sm">Remember me</span>
            </label>
            <Link href="/reset-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Don&apos;t have an account?</span>
          <Link href="/register" className="text-primary font-medium hover:underline">Register</Link>
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            aria-label="Toggle dark mode"
            className="rounded-full p-2 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="button"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
          </button>
        </div>
      </div>
    </div>
  );
} 