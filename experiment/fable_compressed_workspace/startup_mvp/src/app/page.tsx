"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      login(email, name);
      router.push("/dashboard");
    }
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-indigo-600">
          <ShieldCheck className="h-8 w-8" />
          <span className="font-bold text-xl tracking-tight text-gray-900">TrustSync</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Stop wasting hours on Security Questionnaires.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your SOC2 and past answers. Our AI instantly completes new questionnaires with 100% accuracy based on your data.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Work Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center whitespace-nowrap"
            >
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">No credit card required for the 14-day trial.</p>
        </div>
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 transform rotate-2 hover:rotate-0 transition duration-500">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="font-semibold text-gray-700">Questionnaire.xlsx</div>
              <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full">100% Complete</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">Q</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Do you encrypt data at rest?</p>
                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-200">Yes, we use AES-256 encryption for all data at rest via AWS RDS.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">Q</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Is MFA required for all employees?</p>
                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-200">Yes, enforced via Okta SSO across all internal systems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
