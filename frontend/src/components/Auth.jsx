import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  signupWithEmail,
  loginWithEmail,
  loginWithGoogle,
} from "../firebase/auth";

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(".auth-card", { y: 20, opacity: 0 });
    gsap.set(".auth-item", { y: 20, opacity: 0 });

    tl.to(".auth-card", {
      y: 0,
      opacity: 1,
      duration: 0.4
    })
      .to(".auth-item", {
        y: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.05
      }, "-=0.2");

  }, { scope: containerRef, dependencies: [mode] });

  const isSignup = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      if (isSignup) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1e4]" ref={containerRef}>
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-xl backdrop-blur auth-card opacity-0 translate-y-5">

        <h2 className="text-2xl font-bold text-zinc-800 text-center auth-item opacity-0 translate-y-5">
          {isSignup ? "Create an account" : "Welcome back"}
        </h2>
        <p className="text-zinc-500 text-center text-sm mt-1 auth-item opacity-0 translate-y-5">
          {isSignup ? "Sign up to get started" : "Login to your account"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 auth-item opacity-0 translate-y-5">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white px-4 py-3 text-zinc-800 placeholder-zinc-400 outline-none ring-1 ring-zinc-300 focus:ring-2 focus:ring-[#339966]"
          />

          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white px-4 py-3 text-zinc-800 placeholder-zinc-400 outline-none ring-1 ring-zinc-300 focus:ring-2 focus:ring-[#339966]"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#339966] py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#2b8056] disabled:opacity-60 cursor-pointer"
          >
            {loading
              ? isSignup
                ? "Creating account..."
                : "Logging in..."
              : isSignup
                ? "Sign Up"
                : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 auth-item opacity-0 translate-y-5">
          <div className="h-px flex-1 bg-zinc-300" />
          <span className="text-xs text-zinc-400">OR</span>
          <div className="h-px flex-1 bg-zinc-300" />
        </div>

        <button
          onClick={loginWithGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white py-3 text-zinc-700 transition-colors duration-200 hover:bg-zinc-50 auth-item opacity-0 translate-y-5 cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-zinc-500 auth-item opacity-0 translate-y-5">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <span
            onClick={() => setMode(isSignup ? "login" : "signup")}
            className="cursor-pointer text-[#339966] hover:underline"
          >
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}
