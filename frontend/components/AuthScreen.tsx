import React, { useState } from "react";
import { Loader2, Mail, Lock, User, Chrome } from "lucide-react";

export interface AuthScreenProps {
  onSuccess: (user: any) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // We mock the generic Google Auth payload that would map from next-auth
      const res = await fetch("/api/auth/oauth_mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Safar Traveler",
          email: "demo@safar.ai",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OAuth failed");
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-[family-name:var(--font-inter)] selection:bg-[#E86B3D]/30 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">safar.ai</h1>
          <p className="text-stone-500 font-medium mt-1">Unlock intelligent travel planning</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <div className="mb-6 flex space-x-2 bg-stone-100 p-1 rounded-xl">
             <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition ${isLogin ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
             >Sign In</button>
             <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition ${!isLogin ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
             >Register</button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-900 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E86B3D]/50 focus:border-[#E86B3D] transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E86B3D]/50 focus:border-[#E86B3D] transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E86B3D]/50 focus:border-[#E86B3D] transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#E86B3D] hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-stone-500">Or continue with</span></div>
          </div>

          <button
             onClick={handleMockGoogle}
             disabled={loading}
             className="w-full py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-xl transition flex items-center justify-center gap-2"
          >
             <Chrome className="w-5 h-5 text-stone-700" />
             Google (Mocked Demo)
          </button>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6 max-w-xs mx-auto">
          By continuing, you agree to Safarnama&apos;s minimalist Data Privacy policy. We respect your intent.
        </p>
      </div>
    </div>
  );
}
